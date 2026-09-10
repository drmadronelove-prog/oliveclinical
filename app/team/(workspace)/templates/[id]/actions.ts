'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/team/auth'

type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string }

export async function createTemplateTask(input: {
  templateId: string
  templateSectionId: string
  title: string
  position: number
}): Promise<ActionResult<{ id: string }>> {
  await requireProfile()
  const title = input.title.trim()
  if (!title) return { ok: false, error: 'A task needs a title.' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('template_tasks')
    .insert({
      template_id: input.templateId,
      template_section_id: input.templateSectionId,
      title,
      position: input.position,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[team] createTemplateTask failed:', error)
    return { ok: false, error: `Couldn't create that task: ${error?.message ?? 'unknown error'}` }
  }
  revalidatePath(`/team/templates/${input.templateId}`)
  return { ok: true, data: { id: data.id } }
}

export async function updateTemplateTask(input: {
  id: string
  templateId: string
  title?: string
  offset_days?: number
  default_assignee_role?: string | null
}): Promise<ActionResult> {
  await requireProfile()
  const patch: Record<string, unknown> = {}

  if (input.title !== undefined) {
    const trimmed = input.title.trim()
    if (!trimmed) return { ok: false, error: 'A task needs a title.' }
    patch.title = trimmed
  }
  if (input.offset_days !== undefined) patch.offset_days = input.offset_days
  if (input.default_assignee_role !== undefined) {
    patch.default_assignee_role = input.default_assignee_role?.trim() || null
  }

  if (Object.keys(patch).length === 0) return { ok: true, data: undefined }

  const supabase = await createClient()
  const { error } = await supabase.from('template_tasks').update(patch).eq('id', input.id)
  if (error) {
    console.error('[team] updateTemplateTask failed:', error)
    return { ok: false, error: `Couldn't save that change: ${error.message}` }
  }
  revalidatePath(`/team/templates/${input.templateId}`)
  return { ok: true, data: undefined }
}

export async function archiveTemplateTask(input: {
  id: string
  templateId: string
}): Promise<ActionResult> {
  await requireProfile()
  const supabase = await createClient()
  const { error } = await supabase
    .from('template_tasks')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', input.id)

  if (error) {
    console.error('[team] archiveTemplateTask failed:', error)
    return { ok: false, error: `Couldn't delete that task: ${error.message}` }
  }
  revalidatePath(`/team/templates/${input.templateId}`)
  return { ok: true, data: undefined }
}

export async function createTemplateSection(input: {
  templateId: string
  name: string
  position: number
}): Promise<ActionResult<{ id: string }>> {
  await requireProfile()
  const name = input.name.trim()
  if (!name) return { ok: false, error: 'Give the section a name.' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('template_sections')
    .insert({ template_id: input.templateId, name, position: input.position })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[team] createTemplateSection failed:', error)
    return { ok: false, error: `Couldn't create that section: ${error?.message ?? 'unknown error'}` }
  }
  revalidatePath(`/team/templates/${input.templateId}`)
  return { ok: true, data: { id: data.id } }
}

export async function renameTemplateSection(input: {
  id: string
  templateId: string
  name: string
}): Promise<ActionResult> {
  await requireProfile()
  const name = input.name.trim()
  if (!name) return { ok: false, error: 'Give the section a name.' }

  const supabase = await createClient()
  const { error } = await supabase.from('template_sections').update({ name }).eq('id', input.id)
  if (error) {
    console.error('[team] renameTemplateSection failed:', error)
    return { ok: false, error: `Couldn't rename that section: ${error.message}` }
  }
  revalidatePath(`/team/templates/${input.templateId}`)
  return { ok: true, data: undefined }
}

export async function archiveTemplateSection(input: {
  id: string
  templateId: string
}): Promise<ActionResult> {
  await requireProfile()
  const supabase = await createClient()

  const { count, error: countError } = await supabase
    .from('template_tasks')
    .select('id', { count: 'exact', head: true })
    .eq('template_section_id', input.id)
    .is('archived_at', null)

  if (countError) {
    console.error('[team] archiveTemplateSection count check failed:', countError)
    return { ok: false, error: `Couldn't check that section: ${countError.message}` }
  }
  if (count && count > 0) {
    return {
      ok: false,
      error: `Move or delete the ${count} task${count === 1 ? '' : 's'} in this section first.`,
    }
  }

  const { error } = await supabase
    .from('template_sections')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', input.id)

  if (error) {
    console.error('[team] archiveTemplateSection failed:', error)
    return { ok: false, error: `Couldn't delete that section: ${error.message}` }
  }
  revalidatePath(`/team/templates/${input.templateId}`)
  return { ok: true, data: undefined }
}

/** Used by the up/down move buttons — no drag-and-drop for templates, see PHASE-3.md. */
export async function reorderTemplateTask(input: {
  id: string
  templateId: string
  position: number
}): Promise<ActionResult> {
  await requireProfile()
  const supabase = await createClient()
  const { error } = await supabase
    .from('template_tasks')
    .update({ position: input.position })
    .eq('id', input.id)

  if (error) {
    console.error('[team] reorderTemplateTask failed:', error)
    return { ok: false, error: `Couldn't move that task: ${error.message}` }
  }
  revalidatePath(`/team/templates/${input.templateId}`)
  return { ok: true, data: undefined }
}
