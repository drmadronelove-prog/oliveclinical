import type { Metadata } from 'next'
import { requireProfile } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { TeamShell } from '@/components/team/team-shell'

// The workspace is per-person and always behind a session. Nothing here
// is ever prerendered.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Olive Team',
  // The workspace is internal. Keep it out of search results entirely.
  robots: { index: false, follow: false, nocache: true },
}

export default async function TeamLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile()
  const supabase = await createClient()

  const { count } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('recipient_id', profile.id)
    .is('read_at', null)

  return (
    <TeamShell profile={profile} unreadCount={count ?? 0}>
      {children}
    </TeamShell>
  )
}
