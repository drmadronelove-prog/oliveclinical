import { AuthCard } from '@/components/team/auth-card'

export const metadata = { title: 'Setup needed — Olive Team', robots: { index: false } }

export default function NotConfiguredPage() {
  return (
    <AuthCard
      title="Almost there"
      description="The team workspace is deployed, but it has not been connected to its database yet."
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Someone needs to add the Supabase keys to the environment. The steps are written
        out in <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">PHASE-1.md</code> at
        the root of this project.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        The rest of oliveclinical.com is unaffected and working normally.
      </p>
    </AuthCard>
  )
}
