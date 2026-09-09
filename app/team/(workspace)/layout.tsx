import type { Metadata } from 'next'
import { requireProfile } from '@/lib/team/auth'
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
  return <TeamShell profile={profile}>{children}</TeamShell>
}
