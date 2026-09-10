'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/team/auth'
import { parseMentions } from '@/lib/team/mentions'
import type { Profile } from '@/lib/team/types'

type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string }

export async function createComment(input: {
  taskId: string
  projectId: string
  body: string
  members: Profile[]
}): Promise<ActionResult<{ id: string; created_at: string }>> {
  const profile = await requireProfile()
  const body = input.body.trim()
  if (!body) return { ok: false, error: 'Write something first.' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .insert({ task_id: input.taskId, author_id: profile.id, body })
    .select('id, created_at')
    .single()

  if (error || !data) {
    console.error('[team] createComment failed:', error)
    return { ok: false, error: `Couldn't post that comment: ${error?.message ?? 'unknown error'}` }
  }

  // The assignee is notified by a database trigger the moment the insert
  // above lands — no code path can forget it, same reasoning as the
  // activity log. @mentions are the one kind of notification that
  // genuinely needs the comment's text to decide who to notify, which a
  // trigger can't reach into easily, so that part happens here instead.
  const mentionedIds = parseMentions(body, input.members).filter((id) => id !== profile.id)
  if (mentionedIds.length > 0) {
    const { error: mentionError } = await supabase.from('notifications').insert(
      mentionedIds.map((recipientId) => ({
        recipient_id: recipientId,
        type: 'mention' as const,
        task_id: input.taskId,
        actor_id: profile.id,
        comment_id: data.id,
      })),
    )
    if (mentionError) console.error('[team] mention notification insert failed:', mentionError)
  }

  revalidatePath(`/team/projects/${input.projectId}`)
  return { ok: true, data }
}

export async function deleteComment(input: {
  id: string
  projectId: string
  authorId: string
}): Promise<ActionResult> {
  const profile = await requireProfile()
  if (input.authorId !== profile.id && profile.role !== 'admin') {
    return { ok: false, error: 'Only the author or an admin can delete a comment.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('comments')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', input.id)

  if (error) {
    console.error('[team] deleteComment failed:', error)
    return { ok: false, error: `Couldn't delete that comment: ${error.message}` }
  }

  revalidatePath(`/team/projects/${input.projectId}`)
  return { ok: true, data: undefined }
}
