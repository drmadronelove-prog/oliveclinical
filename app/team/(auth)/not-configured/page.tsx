import { AuthCard } from '@/components/team/auth-card'

export const metadata = { title: 'Setup needed — Olive Team', robots: { index: false } }

export default function NotConfiguredPage() {
  return (
    <AuthCard
      title="Almost there"
      description="The team workspace is deployed, but it has not been connected to its database yet."
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Either the Supabase keys have not been added to the environment yet, or the
        project URL is not formatted like a web address (missing{' '}
        <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">https://</code>,
        an extra space or quote mark from copy-paste). The steps are written out in{' '}
        <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">PHASE-1.md</code> at
        the root of this project.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        The rest of oliveclinical.com is unaffected and working normally.
      </p>
    </AuthCard>
  )
}
