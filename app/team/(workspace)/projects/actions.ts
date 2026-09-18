'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/team/auth'
import { isNextRedirectError } from '@/lib/team/next-redirect'
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

/**
 * Puts a project archived under the old archive model back into the
 * active list, untouched. There is no archive step in the app anymore
 * (a project is deleted outright — see app/api/team/projects/[id]/
 * route.ts), but anything archived before that change still sits in the
 * Archived list, and this is how it comes back.
 *
 * .select().maybeSingle() after the update, not just the error, because
 * Supabase's update() reports no error at all when the WHERE clause (or
 * row-level security) simply matches nothing — it looks exactly like
 * success unless something checks that a row actually came back.
 */
export async function restoreProject(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireProfile()
    const id = String(formData.get('id') ?? '')
    if (!id) return { ok: false, error: 'Missing project.' }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('projects')
      .update({ archived_at: null })
      .eq('id', id)
      .select('id')
      .maybeSingle()

    if (error) {
      console.error('[team] restoreProject failed:', error)
      return { ok: false, error: error.message }
    }
    if (!data) {
      return {
        ok: false,
        error: "That project couldn't be found, or you don't have permission to change it.",
      }
    }

    revalidatePath('/team/projects')
    return { ok: true }
  } catch (err) {
    if (isNextRedirectError(err)) throw err
    console.error('[team] restoreProject threw:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unexpected error restoring that project.',
    }
  }
}
