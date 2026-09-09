import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from './types'

/**
 * The signed-in person's profile, or null.
 *
 * Middleware has already turned away anyone without a session, but this
 * re-checks rather than trusting that, and additionally refuses anyone
 * whose profile has been archived — a retired member whose session cookie
 * is still valid.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (!data || data.archived_at) return null
  return data as Profile
}

/** Use in any /team page. Redirects to login instead of returning null. */
export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/team/login')
  return profile
}

/**
 * Use before any admin-only action (inviting, changing roles). Server-side
 * only — hiding a button in the UI is not a permission check.
 */
export async function requireAdmin(): Promise<Profile> {
  const profile = await requireProfile()
  if (profile.role !== 'admin') redirect('/team')
  return profile
}
