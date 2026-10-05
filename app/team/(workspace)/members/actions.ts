'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentProfile } from '@/lib/team/auth'
import type { MemberRole } from '@/lib/team/types'

export type MembersFormState = { error?: string; success?: string }

function isRole(value: unknown): value is MemberRole {
  return value === 'admin' || value === 'member'
}

/**
 * Every action here re-checks that the caller is an admin. The Members
 * link is hidden from non-admins in the sidebar, but hiding a link is a
 * courtesy, not a permission — a form can be posted directly.
 */
async function assertAdmin() {
  const profile = await getCurrentProfile()
  if (!profile || profile.role !== 'admin') {
    throw new Error('Only an admin can manage members.')
  }
  return profile
}

export async function inviteMember(
  _prev: MembersFormState,
  formData: FormData,
): Promise<MembersFormState> {
  try {
    await assertAdmin()
  } catch {
    return { error: 'Only an admin can invite people.' }
  }

  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()
  const name = String(formData.get('name') ?? '').trim()
  const roleValue = formData.get('role')
  const role: MemberRole = isRole(roleValue) ? roleValue : 'member'

  if (!email || !email.includes('@')) {
    return { error: 'Enter a valid email address.' }
  }

  const origin = (await headers()).get('origin') ?? 'https://oliveclinical.com'

  let admin
  try {
    admin = createAdminClient()
  } catch {
    return {
      error:
        'Invitations need the SUPABASE_SERVICE_ROLE_KEY setting, which is missing. See PHASE-1.md.',
    }
  }

  // The name and role ride along in the invite. The database trigger
  // reads them when it creates the person's profile, so their account is
  // correct the moment they accept.
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { name: name || null, role },
    redirectTo: `${origin}/team/auth/callback?next=/team/update-password`,
  })

  if (error) {
    if (/already been registered|already exists/i.test(error.message)) {
      return { error: `${email} is already a member of this workspace.` }
    }
    return { error: error.message }
  }

  revalidatePath('/team/members')
  return { success: `Invitation sent to ${email}.` }
}

export async function setMemberRole(formData: FormData) {
  const me = await assertAdmin()

  const id = String(formData.get('id') ?? '')
  const roleValue = formData.get('role')
  if (!id || !isRole(roleValue)) return

  // Refuse to let the last admin demote themselves and lock everyone out.
  if (id === me.id && roleValue !== 'admin') return

  const supabase = await createClient()
  await supabase.from('profiles').update({ role: roleValue }).eq('id', id)

  revalidatePath('/team/members')
}

export async function setMemberArchived(formData: FormData) {
  const me = await assertAdmin()

  const id = String(formData.get('id') ?? '')
  const archived = formData.get('archived') === 'true'
  if (!id || id === me.id) return

  const supabase = await createClient()
  await supabase
    .from('profiles')
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq('id', id)

  revalidatePath('/team/members')
}

export type MemberActionResult = { ok: true } | { ok: false; error: string }

/**
 * Sends a fresh invitation email to someone who was already invited.
 * Supabase's invite endpoint happily resends a new link to anyone who
 * hasn't yet confirmed (set a password) — it only refuses once they
 * have, which we turn into a plain "nothing to resend" message rather
 * than an error to chase.
 */
export async function resendInvite(formData: FormData): Promise<MemberActionResult> {
  try {
    await assertAdmin()
  } catch {
    return { ok: false, error: 'Only an admin can resend invitations.' }
  }

  const id = String(formData.get('id') ?? '')
  if (!id) return { ok: false, error: 'Missing member.' }

  const supabase = await createClient()
  const { data: member } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()
  if (!member) return { ok: false, error: "That person couldn't be found." }

  const origin = (await headers()).get('origin') ?? 'https://oliveclinical.com'

  let admin
  try {
    admin = createAdminClient()
  } catch {
    return {
      ok: false,
      error:
        'Resending invitations needs the SUPABASE_SERVICE_ROLE_KEY setting, which is missing. See PHASE-1.md.',
    }
  }

  const { error } = await admin.auth.admin.inviteUserByEmail(member.email, {
    data: { name: member.name, role: member.role },
    redirectTo: `${origin}/team/auth/callback?next=/team/update-password`,
  })

  if (error) {
    if (/already been registered|already exists/i.test(error.message)) {
      return {
        ok: false,
        error: `${member.email} has already signed in and set a password — there's nothing to resend.`,
      }
    }
    return { ok: false, error: error.message }
  }

  revalidatePath('/team/members')
  return { ok: true }
}

/**
 * Sends a password reset link on someone's behalf — the same email the
 * "Forgot your password?" link on the sign-in page sends them, just
 * triggered by an admin instead of waiting for the person to find that
 * link themselves. Uses the ordinary (non-admin) client deliberately:
 * resetPasswordForEmail is the same public-safe call the sign-in page
 * already uses, and it needs no elevated privilege.
 */
export async function sendPasswordReset(formData: FormData): Promise<MemberActionResult> {
  try {
    await assertAdmin()
  } catch {
    return { ok: false, error: 'Only an admin can send a password reset link.' }
  }

  const id = String(formData.get('id') ?? '')
  if (!id) return { ok: false, error: 'Missing member.' }

  const supabase = await createClient()
  const { data: member } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()
  if (!member) return { ok: false, error: "That person couldn't be found." }

  const origin = (await headers()).get('origin') ?? 'https://oliveclinical.com'

  const { error } = await supabase.auth.resetPasswordForEmail(member.email, {
    redirectTo: `${origin}/team/auth/callback?next=/team/update-password`,
  })

  if (error) {
    console.error('[team] sendPasswordReset failed:', error)
    if (error.status === 429 || /rate limit/i.test(error.message)) {
      return {
        ok: false,
        error:
          "Supabase's free email sender has hit its hourly limit. Wait about an hour and try again.",
      }
    }
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

/**
 * Erases someone's account entirely — not just their access. Deletes the
 * auth.users row through the admin API, which cascades to their profile
 * (profiles.id references auth.users with ON DELETE CASCADE) and frees
 * their email so they could be invited again from scratch.
 *
 * Nothing else about them has that cascade, on purpose: a project they
 * own, a task assigned to them, a comment they wrote all reference their
 * profile without ON DELETE CASCADE, so Postgres refuses the whole
 * deletion rather than silently orphaning that history. In practice this
 * only succeeds for someone who was invited and never did anything —
 * exactly the case this exists for (a mistyped email, a no-show hire).
 * Anyone with real history should have their access removed instead
 * (setMemberArchived), which keeps the history intact.
 */
export async function deleteMember(formData: FormData): Promise<MemberActionResult> {
  let me
  try {
    me = await assertAdmin()
  } catch {
    return { ok: false, error: 'Only an admin can delete members.' }
  }

  const id = String(formData.get('id') ?? '')
  if (!id) return { ok: false, error: 'Missing member.' }
  if (id === me.id) return { ok: false, error: "You can't delete your own account." }

  let admin
  try {
    admin = createAdminClient()
  } catch {
    return {
      ok: false,
      error: 'Deleting members needs the SUPABASE_SERVICE_ROLE_KEY setting, which is missing. See PHASE-1.md.',
    }
  }

  const { error } = await admin.auth.admin.deleteUser(id)

  if (error) {
    return {
      ok: false,
      error:
        `Couldn't delete this person — they likely have history in the workspace ` +
        `(tasks, comments, or projects). Use "Remove access" instead to keep that ` +
        `history intact. (${error.message})`,
    }
  }

  revalidatePath('/team/members')
  return { ok: true }
}
