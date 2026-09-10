'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/team/auth'
import { addOffsetDays } from '@/lib/team/types'

export type InstantiateFormState = { error?: string }

/**
 * Turns a template into a real project: copies its sections verbatim,
 * and turns every template task's offset_days into a real due_date
 * against the anchor date, and its default_assignee_role into a real
 * assignee_id via the role → person mapping chosen on this page.
 *
 * A role with no mapping (left "Unassigned") just leaves that task
 * unassigned — never blocks the whole thing from being created.
 */
export async function instantiateTemplate(
  _prev: InstantiateFormState,
  formData: FormData,
): Promise<InstantiateFormState> {
  const profile = await requireProfile()

  const templateId = String(formData.get('templateId') ?? '')
  const projectName = String(formData.get('projectName') ?? '').trim()
  const anchorDate = String(formData.get('anchorDate') ?? '').trim()
  const roleMapping = JSON.parse(String(formData.get('roleMapping') ?? '{}')) as Record<
    string,
    string
  >

  if (!projectName) return { error: 'Name the new project.' }
  if (!anchorDate) return { error: 'Pick a start date.' }

  const supabase = await createClient()

  const [{ data: sections }, { data: tasks }] = await Promise.all([
    supabase
      .from('template_sections')
      .select('*')
      .eq('template_id', templateId)
      .is('archived_at', null)
      .order('position'),
    supabase
      .from('template_tasks')
      .select('*')
      .eq('template_id', templateId)
      .is('archived_at', null)
      .order('position'),
  ])

  if (!sections || sections.length === 0) {
    return { error: "This template has no sections yet — add some before using it." }
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({ name: projectName, type: 'onboarding', due_date: anchorDate, owner_id: profile.id })
    .select('id')
    .single()

  if (projectError || !project) {
    console.error('[team] instantiateTemplate project insert failed:', projectError)
    return { error: `Could not create the project: ${projectError?.message ?? 'unknown error'}` }
  }

  // Map each template section to its new real section, in the same order.
  const sectionIdMap = new Map<string, string>()
  for (const section of sections) {
    const { data: newSection, error: sectionError } = await supabase
      .from('sections')
      .insert({ project_id: project.id, name: section.name, position: section.position })
      .select('id')
      .single()
    if (sectionError || !newSection) {
      console.error('[team] instantiateTemplate section insert failed:', sectionError)
      continue
    }
    sectionIdMap.set(section.id, newSection.id)
  }

  const taskRows = (tasks ?? [])
    .map((task) => {
      const sectionId = sectionIdMap.get(task.template_section_id)
      if (!sectionId) return null
      const role = task.default_assignee_role
      return {
        project_id: project.id,
        section_id: sectionId,
        title: task.title,
        due_date: addOffsetDays(anchorDate, task.offset_days),
        assignee_id: role ? (roleMapping[role] ?? null) : null,
        position: task.position,
      }
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)

  if (taskRows.length > 0) {
    const { error: taskError } = await supabase.from('tasks').insert(taskRows)
    if (taskError) {
      console.error('[team] instantiateTemplate task insert failed:', taskError)
      return {
        error: `The project was created, but its tasks failed to copy over: ${taskError.message}. Check the project — you may need to add them by hand.`,
      }
    }
  }

  revalidatePath('/team/projects')
  redirect(`/team/projects/${project.id}`)
}
