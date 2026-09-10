'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/team/auth'

type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string }

// A small, fixed rotation — new tags get the next color in line rather
// than needing anyone to pick one. Reuses the same palette as project
// colors, so a tag chip and a project dot always feel like the same
// design system.
const TAG_COLORS = ['#7a4f6e', '#c4877e', '#b88894', '#5b6e88', '#9fb3b0', '#c5a572']

export async function createTag(name: string): Promise<ActionResult<{ id: string; color: string }>> {
  await requireProfile()
  const trimmed = name.trim()
  if (!trimmed) return { ok: false, error: 'Give the tag a name.' }

  const supabase = await createClient()

  // Reuse an existing tag with the same name (case-insensitive) instead
  // of creating a near-duplicate — "Podcast" and "podcast" should be one
  // tag, not two people's slightly different spelling.
  const { data: existing } = await supabase
    .from('tags')
    .select('id, color')
    .ilike('name', trimmed)
    .is('archived_at', null)
    .maybeSingle()

  if (existing) return { ok: true, data: existing }

  const { count } = await supabase.from('tags').select('id', { count: 'exact', head: true })
  const color = TAG_COLORS[(count ?? 0) % TAG_COLORS.length]

  const { data, error } = await supabase.from('tags').insert({ name: trimmed, color }).select('id').single()
  if (error || !data) {
    console.error('[team] createTag failed:', error)
    return { ok: false, error: `Couldn't create that tag: ${error?.message ?? 'unknown error'}` }
  }
  return { ok: true, data: { id: data.id, color } }
}

/** Replaces a task's full set of tags with exactly the ids given. */
export async function setTaskTags(input: {
  taskId: string
  projectId: string
  tagIds: string[]
}): Promise<ActionResult> {
  await requireProfile()
  const supabase = await createClient()

  const { error: deleteError } = await supabase.from('task_tags').delete().eq('task_id', input.taskId)
  if (deleteError) {
    console.error('[team] setTaskTags delete failed:', deleteError)
    return { ok: false, error: `Couldn't update tags: ${deleteError.message}` }
  }

  if (input.tagIds.length > 0) {
    const { error: insertError } = await supabase
      .from('task_tags')
      .insert(input.tagIds.map((tagId) => ({ task_id: input.taskId, tag_id: tagId })))
    if (insertError) {
      console.error('[team] setTaskTags insert failed:', insertError)
      return { ok: false, error: `Couldn't update tags: ${insertError.message}` }
    }
  }

  revalidatePath(`/team/projects/${input.projectId}`)
  revalidatePath('/team/calendar')
  revalidatePath('/team/my-tasks')
  return { ok: true, data: undefined }
}
