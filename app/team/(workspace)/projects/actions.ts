'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/team/auth'
import type { ProjectStatus, ProjectType } from '@/lib/team/types'

export type ProjectFormState = { error?: string }

function cleanText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? '').trim()
  return text || null
}

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const profile = await requireProfile()
  const name = cleanText(formData.get('name'))
  if (!name) return { error: 'Give the project a name.' }

  const type = (formData.get('type') as ProjectType) || 'general'
  const color = String(formData.get('color') || '#7a4f6e')
  const dueDate = cleanText(formData.get('due_date'))

  const supabase = await createClient()
  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      name,
      type,
      color,
      due_date: dueDate,
      owner_id: profile.id,
    })
    .select('id')
    .single()

  if (error || !project) return { error: 'Could not create that project. Try again.' }

  // A brand-new project is useless without anywhere to put a task, so it
  // starts with one section instead of an empty page.
  await supabase.from('sections').insert({ project_id: project.id, name: 'To do', position: 1024 })

  revalidatePath('/team/projects')
  redirect(`/team/projects/${project.id}`)
}

export async function updateProjectStatus(formData: FormData) {
  await requireProfile()
  const id = String(formData.get('id') ?? '')
  const status = formData.get('status') as ProjectStatus
  if (!id || !status) return

  const supabase = await createClient()
  await supabase.from('projects').update({ status }).eq('id', id)

  revalidatePath(`/team/projects/${id}`)
  revalidatePath('/team/projects')
}

export async function archiveProject(formData: FormData) {
  await requireProfile()
  const id = String(formData.get('id') ?? '')
  const archived = formData.get('archived') === 'true'
  if (!id) return

  const supabase = await createClient()
  await supabase
    .from('projects')
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq('id', id)

  revalidatePath('/team/projects')
  if (archived) redirect('/team/projects')
}
