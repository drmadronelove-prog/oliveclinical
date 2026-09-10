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

  if (error || !project) {
    // Unlike the sign-in forms, this page is only ever reached by a
    // signed-in team member — there is no stranger to avoid tipping off
    // by being specific, so show the real reason instead of guessing.
    console.error('[team] createProject failed:', error)
    if (error?.code === '42P01' || error?.code === 'PGRST205') {
      return {
        error:
          "The projects table doesn't exist yet — run supabase/migrations/0002_projects_tasks.sql in the Supabase SQL Editor, then try again.",
      }
    }
    return { error: `Could not create that project: ${error?.message ?? 'unknown error'}` }
  }

  // A brand-new project is useless without anywhere to put a task, so it
  // starts with one section instead of an empty page. Not fatal to the
  // whole create if this one insert fails — the project still exists and
  // "Add section" still works — but it should never fail silently.
  const { error: sectionError } = await supabase
    .from('sections')
    .insert({ project_id: project.id, name: 'To do', position: 1024 })
  if (sectionError) console.error('[team] default section insert failed:', sectionError)

  revalidatePath('/team/projects')
  redirect(`/team/projects/${project.id}`)
}

export async function updateProjectStatus(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireProfile()
  const id = String(formData.get('id') ?? '')
  const status = formData.get('status') as ProjectStatus
  if (!id || !status) return { ok: false, error: 'Missing project or status.' }

  const supabase = await createClient()
  const { error } = await supabase.from('projects').update({ status }).eq('id', id)

  if (error) {
    console.error('[team] updateProjectStatus failed:', error)
    return { ok: false, error: error.message }
  }

  revalidatePath(`/team/projects/${id}`)
  revalidatePath('/team/projects')
  return { ok: true }
}

/**
 * Whichever view (List or Board) was last chosen for this project. It's
 * one value on the project itself, not per-person — the next person to
 * open it sees it the way it was last left, same as reopening any shared
 * document. Fire-and-forget from the caller; nothing here is worth
 * blocking the view switch on.
 */
export async function updateProjectDefaultView(formData: FormData) {
  await requireProfile()
  const id = String(formData.get('id') ?? '')
  const view = String(formData.get('view') ?? '')
  if (!id || (view !== 'list' && view !== 'board')) return

  const supabase = await createClient()
  await supabase.from('projects').update({ default_view: view }).eq('id', id)
}

export async function archiveProject(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireProfile()
  const id = String(formData.get('id') ?? '')
  const archived = formData.get('archived') === 'true'
  if (!id) return { ok: false, error: 'Missing project.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq('id', id)

  if (error) {
    console.error('[team] archiveProject failed:', error)
    return { ok: false, error: error.message }
  }

  revalidatePath('/team/projects')
  // Deliberately no redirect() here even for the archived case — this is
  // called as a bare function from a client event handler (inside
  // startTransition), not through a <form action> or useActionState. In
  // that shape, redirect()'s special throw isn't reliably caught by
  // Next's action machinery and can surface as a visible runtime error
  // instead of a navigation. The caller does the navigating itself once
  // it sees { ok: true }.
  return { ok: true }
}

/** The un-archive half of the trash-can model: back into the active list, untouched. */
export async function restoreProject(formData: FormData) {
  await requireProfile()
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('projects').update({ archived_at: null }).eq('id', id)

  revalidatePath('/team/projects')
}

/**
 * The other half: gone for good, sections and tasks with it (the
 * database cascades that automatically). Only reachable on a project
 * that is already archived — never a one-click way to destroy something
 * still in active use.
 */
export async function deleteProjectPermanently(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireProfile()
  const id = String(formData.get('id') ?? '')
  if (!id) return { ok: false, error: 'Missing project.' }

  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('archived_at')
    .eq('id', id)
    .maybeSingle()

  if (!project) return { ok: false, error: 'That project is already gone.' }
  if (!project.archived_at) {
    return { ok: false, error: 'Archive the project first — permanent delete only works from there.' }
  }

  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) {
    console.error('[team] deleteProjectPermanently failed:', error)
    return { ok: false, error: error.message }
  }

  revalidatePath('/team/projects')
  return { ok: true }
}
