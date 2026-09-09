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

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/team/auth/callback?next=/team/update-password`,
  })

  // Supabase already declines to error when the address has no account —
  // that is its own protection against a stranger using this form to
  // find out who has one, and it means every error we do get here is a
  // real operational problem (the email quota is spent, Supabase itself
  // is unreachable), never a leak about account existence. Showing it is
  // what makes this form debuggable instead of a silent dead end.
  if (error) {
    console.error('[team] resetPasswordForEmail failed:', error)
    if (error.status === 429 || /rate limit/i.test(error.message)) {
      return {
        error:
          "Supabase's free email sender has hit its hourly limit from all the setup attempts. Wait about an hour, then try once more — this isn't a problem with the account, just a temporary quota.",
      }
    }
    return { error: `Could not send that email: ${error.message}. Try again shortly.` }
  }

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
