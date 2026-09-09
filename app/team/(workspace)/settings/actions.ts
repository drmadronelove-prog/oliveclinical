'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile } from '@/lib/team/auth'

export type SettingsFormState = { error?: string; success?: string }

export async function updateProfile(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const profile = await getCurrentProfile()
  if (!profile) return { error: 'You are signed out. Sign in again to make changes.' }

  const name = String(formData.get('name') ?? '').trim()
  if (name.length > 80) return { error: 'That name is too long.' }

  const supabase = await createClient()

  // Note there is no role field here on purpose. The row-level security
  // policy would allow this update to touch it, so the safety is that we
  // never send it — role changes go through the admin-only Members page.
  const { error } = await supabase
    .from('profiles')
    .update({ name: name || null })
    .eq('id', profile.id)

  if (error) return { error: 'Could not save that. Please try again.' }

  revalidatePath('/team', 'layout')
  return { success: 'Saved.' }
}
