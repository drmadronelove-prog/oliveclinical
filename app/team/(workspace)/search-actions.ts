'use server'

import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/team/auth'

export type SearchResults = {
  projects: { id: string; name: string; color: string }[]
  tasks: { id: string; title: string; project_id: string; project_name: string }[]
}

const EMPTY: SearchResults = { projects: [], tasks: [] }

/**
 * Backs the command palette's search. Row-level security does the real
 * work here — this runs on the caller's own session, the same as every
 * other read in the app, so results are already scoped to what that
 * person can see (which today is "any active member sees everything,"
 * but this never has to change if that ever stops being true).
 */
export async function searchWorkspace(query: string): Promise<SearchResults> {
  await requireProfile()
  const trimmed = query.trim()
  if (trimmed.length < 2) return EMPTY

  const supabase = await createClient()

  const [{ data: projects }, { data: tasks }] = await Promise.all([
    supabase.from('projects').select('id, name, color').is('archived_at', null).ilike('name', `%${trimmed}%`).limit(6),
    supabase
      .from('tasks')
      .select('id, title, project_id, projects(name)')
      .is('archived_at', null)
      .ilike('title', `%${trimmed}%`)
      .limit(8),
  ])

  return {
    projects: (projects ?? []) as SearchResults['projects'],
    tasks: ((tasks ?? []) as unknown as { id: string; title: string; project_id: string; projects: { name: string } | null }[]).map(
      (t) => ({ id: t.id, title: t.title, project_id: t.project_id, project_name: t.projects?.name ?? '' }),
    ),
  }
}
