'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { safeNext } from '@/lib/team/routes'

export type AuthFormState = { error?: string; success?: string }

export async function signIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Enter your email address and password.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // Deliberately vague: a precise message would tell a stranger which
    // email addresses have accounts here.
    return { error: 'That email and password did not match. Please try again.' }
  }

  revalidatePath('/team', 'layout')
  redirect(safeNext(formData.get('next')))
}

export async function requestPasswordReset(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim()
  if (!email) return { error: 'Enter your email address.' }

  const origin = (await headers()).get('origin') ?? 'https://oliveclinical.com'
  const supabase = await createClient()

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/team/auth/callback?next=/team/update-password`,
  })

  // Always the same answer, whether or not the address exists here.
  return {
    success:
      'If that address belongs to a team member, a reset link is on its way. Check your inbox.',
  }
}

export async function updatePassword(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  if (password.length < 10) {
    return { error: 'Use at least 10 characters.' }
  }
  if (password !== confirm) {
    return { error: 'The two passwords do not match.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'That reset link has expired. Request a new one.' }
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }

  revalidatePath('/team', 'layout')
  redirect('/team')
}
