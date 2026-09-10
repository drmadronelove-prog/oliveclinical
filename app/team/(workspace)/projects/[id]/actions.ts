'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/team/auth'
import type { Priority } from '@/lib/team/priority'

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

  if (error || !data) return { ok: false, error: "Couldn't create that task." }

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

  if (error) return { ok: false, error: "Couldn't update that task." }
  revalidatePath(`/team/projects/${input.projectId}`)
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
}): Promise<ActionResult> {
  await requireProfile()
  const patch: Record<string, unknown> = {}

  if (input.title !== undefined) {
    const trimmed = input.title.trim()
    if (!trimmed) return { ok: false, error: 'A task needs a title.' }
    patch.title = trimmed
  }
  if (input.description !== undefined) patch.description = input.description
  if (input.assignee_id !== undefined) patch.assignee_id = input.assignee_id
  if (input.due_date !== undefined) patch.due_date = input.due_date
  if (input.start_date !== undefined) patch.start_date = input.start_date
  if (input.priority !== undefined) patch.priority = input.priority

  if (Object.keys(patch).length === 0) return { ok: true, data: undefined }

  const supabase = await createClient()
  const { error } = await supabase.from('tasks').update(patch).eq('id', input.id)
  if (error) return { ok: false, error: "Couldn't save that change." }

  revalidatePath(`/team/projects/${input.projectId}`)
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

  if (error) return { ok: false, error: "Couldn't move that task." }
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

  if (error) return { ok: false, error: "Couldn't delete that task." }
  revalidatePath(`/team/projects/${input.projectId}`)
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

  if (error || !data) return { ok: false, error: "Couldn't create that section." }
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
  if (error) return { ok: false, error: "Couldn't rename that section." }

  revalidatePath(`/team/projects/${input.projectId}`)
  return { ok: true, data: undefined }
}
