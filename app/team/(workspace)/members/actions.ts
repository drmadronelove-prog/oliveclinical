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
