'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/team/auth'
import { sanitizeTaskDescription } from '@/lib/team/sanitize-html'
import type { Priority } from '@/lib/team/priority'
import type { RecurrenceRule } from '@/lib/team/types'

/**
 * Every mutation on this page is called directly from client-side event
 * handlers (drag end, checkbox click, inline edit) rather than from a
 * <form>, so each returns a plain result instead of throwing — the
 * caller decides what the optimistic UI does with a failure, rather
 * than an uncaught error taking down the whole page.
 */
type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string }

export async function createTask(input: {
  projectId: string
  sectionId: string
  title: string
  position: number
}): Promise<ActionResult<{ id: string }>> {
  await requireProfile()
  const title = input.title.trim()
  if (!title) return { ok: false, error: 'A task needs a title.' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      project_id: input.projectId,
      section_id: input.sectionId,
      title,
      position: input.position,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[team] createTask failed:', error)
    return { ok: false, error: `Couldn't create that task: ${error?.message ?? 'unknown error'}` }
  }

  revalidatePath(`/team/projects/${input.projectId}`)
  return { ok: true, data: { id: data.id } }
}

export async function toggleTaskComplete(input: {
  id: string
  projectId: string
  completed: boolean
}): Promise<ActionResult> {
  await requireProfile()
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .update({ completed: input.completed })
    .eq('id', input.id)

  if (error) {
    console.error('[team] toggleTaskComplete failed:', error)
    return { ok: false, error: `Couldn't update that task: ${error.message}` }
  }
  revalidatePath(`/team/projects/${input.projectId}`)
  revalidatePath('/team/calendar')
  revalidatePath('/team/my-tasks')
  return { ok: true, data: undefined }
}

export async function updateTask(input: {
  id: string
  projectId: string
  title?: string
  description?: string | null
  assignee_id?: string | null
  due_date?: string | null
  start_date?: string | null
  priority?: Priority
  recurrence_rule?: RecurrenceRule | null
}): Promise<ActionResult> {
  await requireProfile()
  const patch: Record<string, unknown> = {}

  if (input.title !== undefined) {
    const trimmed = input.title.trim()
    if (!trimmed) return { ok: false, error: 'A task needs a title.' }
    patch.title = trimmed
  }
  // The one field on this table that is ever HTML rather than a plain
  // value. This is the real security boundary — the client-side editor
  // already produces clean markup, but nothing else stored HTML ever
  // reaches the database without passing through the same allowlist a
  // hand-edited row in Supabase would also need to pass through to be
  // rendered safely.
  if (input.description !== undefined) {
    patch.description = input.description ? sanitizeTaskDescription(input.description) : null
  }
  if (input.assignee_id !== undefined) patch.assignee_id = input.assignee_id
  if (input.due_date !== undefined) patch.due_date = input.due_date
  if (input.start_date !== undefined) patch.start_date = input.start_date
  if (input.priority !== undefined) patch.priority = input.priority
  if (input.recurrence_rule !== undefined) patch.recurrence_rule = input.recurrence_rule

  if (Object.keys(patch).length === 0) return { ok: true, data: undefined }

  const supabase = await createClient()
  const { error } = await supabase.from('tasks').update(patch).eq('id', input.id)
  if (error) {
    console.error('[team] updateTask failed:', error)
    return { ok: false, error: `Couldn't save that change: ${error.message}` }
  }

  revalidatePath(`/team/projects/${input.projectId}`)
  revalidatePath('/team/calendar')
  revalidatePath('/team/my-tasks')
  return { ok: true, data: undefined }
}

/** Drag end: a task landing in a (possibly different) section, at a new position. */
export async function reorderTask(input: {
  id: string
  projectId: string
  sectionId: string
  position: number
}): Promise<ActionResult> {
  await requireProfile()
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .update({ section_id: input.sectionId, position: input.position })
    .eq('id', input.id)

  if (error) {
    console.error('[team] reorderTask failed:', error)
    return { ok: false, error: `Couldn't move that task: ${error.message}` }
  }
  revalidatePath(`/team/projects/${input.projectId}`)
  return { ok: true, data: undefined }
}

export async function archiveTask(input: { id: string; projectId: string }): Promise<ActionResult> {
  await requireProfile()
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', input.id)

  if (error) {
    console.error('[team] archiveTask failed:', error)
    return { ok: false, error: `Couldn't delete that task: ${error.message}` }
  }
  revalidatePath(`/team/projects/${input.projectId}`)
  revalidatePath('/team/calendar')
  revalidatePath('/team/my-tasks')
  return { ok: true, data: undefined }
}

export async function createSection(input: {
  projectId: string
  name: string
  position: number
}): Promise<ActionResult<{ id: string }>> {
  await requireProfile()
  const name = input.name.trim()
  if (!name) return { ok: false, error: 'Give the section a name.' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sections')
    .insert({ project_id: input.projectId, name, position: input.position })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[team] createSection failed:', error)
    return { ok: false, error: `Couldn't create that section: ${error?.message ?? 'unknown error'}` }
  }
  revalidatePath(`/team/projects/${input.projectId}`)
  return { ok: true, data: { id: data.id } }
}

export async function renameSection(input: {
  id: string
  projectId: string
  name: string
}): Promise<ActionResult> {
  await requireProfile()
  const name = input.name.trim()
  if (!name) return { ok: false, error: 'Give the section a name.' }

  const supabase = await createClient()
  const { error } = await supabase.from('sections').update({ name }).eq('id', input.id)
  if (error) {
    console.error('[team] renameSection failed:', error)
    return { ok: false, error: `Couldn't rename that section: ${error.message}` }
  }

  revalidatePath(`/team/projects/${input.projectId}`)
  return { ok: true, data: undefined }
}

export async function archiveSection(input: {
  id: string
  projectId: string
}): Promise<ActionResult> {
  await requireProfile()
  const supabase = await createClient()

  // A section is only ever a container. Deleting one out from under
  // tasks that still live in it would leave them pointing at a section
  // that no longer shows up anywhere — quietly orphaned, not archived.
  // Requiring it to be empty first keeps "delete" from ever losing track
  // of real work.
  const { count, error: countError } = await supabase
    .from('tasks')
    .select('id', { count: 'exact', head: true })
    .eq('section_id', input.id)
    .is('archived_at', null)

  if (countError) {
    console.error('[team] archiveSection count check failed:', countError)
    return { ok: false, error: `Couldn't check that section: ${countError.message}` }
  }
  if (count && count > 0) {
    return {
      ok: false,
      error: `Move or delete the ${count} task${count === 1 ? '' : 's'} in this section first.`,
    }
  }

  const { error } = await supabase
    .from('sections')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', input.id)

  if (error) {
    console.error('[team] archiveSection failed:', error)
    return { ok: false, error: `Couldn't delete that section: ${error.message}` }
  }

  revalidatePath(`/team/projects/${input.projectId}`)
  return { ok: true, data: undefined }
}
