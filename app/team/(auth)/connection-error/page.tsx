import { AuthCard } from '@/components/team/auth-card'

export const metadata = { title: 'Connection problem — Olive Team', robots: { index: false } }

export default function ConnectionErrorPage() {
  return (
    <AuthCard
      title="Can't reach the database"
      description="The workspace has Supabase keys, but couldn't connect with them just now."
    >
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>This usually means one of the three values in Vercel is off — a stray space,
        a quote mark carried over from copying, or a key pasted into the wrong field.</p>
        <p>
          Double-check <strong className="font-medium text-foreground">Settings → Environment
          Variables</strong> in Vercel against <strong className="font-medium text-foreground">Settings
          → Data API</strong> and <strong className="font-medium text-foreground">Settings → API
          Keys</strong> in Supabase, then Redeploy. See <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">PHASE-1.md</code>.
        </p>
        <p>The rest of oliveclinical.com is unaffected and working normally.</p>
      </div>
    </AuthCard>
  )
}
