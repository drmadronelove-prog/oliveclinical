'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/team/auth'

export type TemplateFormState = { error?: string }

export async function createTemplate(
  _prev: TemplateFormState,
  formData: FormData,
): Promise<TemplateFormState> {
  await requireProfile()
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return { error: 'Give the template a name.' }

  const supabase = await createClient()
  const { data: template, error } = await supabase
    .from('project_templates')
    .insert({ name })
    .select('id')
    .single()

  if (error || !template) {
    console.error('[team] createTemplate failed:', error)
    return { error: `Could not create that template: ${error?.message ?? 'unknown error'}` }
  }

  // Same reasoning as a new project: a template with nowhere to put a
  // task is a dead end, so it starts with one section.
  const { error: sectionError } = await supabase
    .from('template_sections')
    .insert({ template_id: template.id, name: 'Pre-start', position: 1024 })
  if (sectionError) console.error('[team] default template section insert failed:', sectionError)

  revalidatePath('/team/templates')
  redirect(`/team/templates/${template.id}`)
}

/**
 * A full, independent copy — new template, new sections, new tasks, all
 * with fresh ids. Editing the copy afterward can never touch the
 * original, and neither can ever affect a project already instantiated
 * from either one.
 */
export async function duplicateTemplate(formData: FormData) {
  await requireProfile()
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()

  const [{ data: original }, { data: sections }, { data: tasks }] = await Promise.all([
    supabase.from('project_templates').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('template_sections')
      .select('*')
      .eq('template_id', id)
      .is('archived_at', null)
      .order('position'),
    supabase
      .from('template_tasks')
      .select('*')
      .eq('template_id', id)
      .is('archived_at', null)
      .order('position'),
  ])

  if (!original) return

  const { data: copy, error: copyError } = await supabase
    .from('project_templates')
    .insert({ name: `${original.name} (copy)`, description: original.description })
    .select('id')
    .single()

  if (copyError || !copy) {
    console.error('[team] duplicateTemplate failed:', copyError)
    return
  }

  // Map each old section id to its new one, so tasks can be re-pointed
  // at the right copy without any of the original ids leaking through.
  const sectionIdMap = new Map<string, string>()

  for (const section of sections ?? []) {
    const { data: newSection } = await supabase
      .from('template_sections')
      .insert({ template_id: copy.id, name: section.name, position: section.position })
      .select('id')
      .single()
    if (newSection) sectionIdMap.set(section.id, newSection.id)
  }

  const taskRows = (tasks ?? [])
    .map((task) => {
      const newSectionId = sectionIdMap.get(task.template_section_id)
      if (!newSectionId) return null
      return {
        template_id: copy.id,
        template_section_id: newSectionId,
        title: task.title,
        offset_days: task.offset_days,
        default_assignee_role: task.default_assignee_role,
        position: task.position,
      }
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)

  if (taskRows.length > 0) {
    const { error: taskError } = await supabase.from('template_tasks').insert(taskRows)
    if (taskError) console.error('[team] duplicateTemplate task copy failed:', taskError)
  }

  revalidatePath('/team/templates')
  redirect(`/team/templates/${copy.id}`)
}

export async function archiveTemplate(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireProfile()
  const id = String(formData.get('id') ?? '')
  if (!id) return { ok: false, error: 'Missing template.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('project_templates')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('[team] archiveTemplate failed:', error)
    return { ok: false, error: error.message }
  }

  revalidatePath('/team/templates')
  // No redirect() here — see the matching note on archiveProject. This is
  // called as a bare function from a client event handler, not through a
  // <form action> or useActionState, and redirect()'s throw isn't
  // reliably caught in that shape. The caller navigates itself.
  return { ok: true }
}
