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
  // TEMPORARY — every page under /team renders inside this layout, so a
  // throw here is invisible to a try/catch inside any individual page's
  // own component; two rounds of page- and action-level diagnostics on
  // /team/projects/[id] specifically both came back clean (still the
  // generic crash screen, not either diagnostic's own output), which
  // means whatever's throwing is in code neither of those wrap — this
  // layout, which reruns on every page including the one an action's
  // own automatic same-route refresh re-renders, is the one remaining
  // piece of this exact request path that's never been instrumented.
  // Revert once diagnosed.
  try {
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
  } catch (err) {
    const e = err as { message?: string; digest?: string; stack?: string }
    return (
      <div style={{ maxWidth: 640, margin: '48px auto', padding: '0 24px', fontFamily: 'monospace' }}>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: '#b91c1c' }}>
          Diagnostic: caught an error in the team layout
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
          Copy everything below back to Claude — this is temporary instrumentation.
        </p>
        <pre
          style={{
            marginTop: 16,
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            padding: 16,
            fontSize: 12,
          }}
        >
          {`name: ${err instanceof Error ? err.constructor.name : typeof err}\nmessage: ${e?.message ?? String(err)}\ndigest: ${e?.digest ?? 'none'}\nstack:\n${e?.stack ?? 'none'}`}
        </pre>
      </div>
    )
  }
}
