'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/team/auth'

export async function markNotificationRead(id: string) {
  const profile = await requireProfile()
  const supabase = await createClient()
  // RLS already refuses this for anyone but the recipient — the .eq here
  // just avoids a pointless round trip for a request that would be denied.
  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
    .eq('recipient_id', profile.id)

  revalidatePath('/team/inbox')
  revalidatePath('/team', 'layout')
}

export async function markAllNotificationsRead() {
  const profile = await requireProfile()
  const supabase = await createClient()
  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('recipient_id', profile.id)
    .is('read_at', null)

  revalidatePath('/team/inbox')
  revalidatePath('/team', 'layout')
}
