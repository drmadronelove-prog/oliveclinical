import Link from 'next/link'
import { ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import { requireProfile } from '@/lib/team/auth'
import { displayName } from '@/lib/team/types'
import { PageHeader } from '@/components/team/page-header'

const ROADMAP = [
  { phase: 1, label: 'Sign-in, members, and permissions', done: true },
  { phase: 2, label: 'Projects and tasks, with fast keyboard entry', done: false },
  { phase: 3, label: 'Onboarding templates for new clinical hires', done: false },
  { phase: 4, label: 'Board and calendar views, My Tasks', done: false },
  { phase: 5, label: 'Comments, attachments, recurring tasks, email alerts', done: false },
  { phase: 6, label: 'Search, command palette, exports, project overview', done: false },
]

export default async function TeamHomePage() {
  const profile = await requireProfile()

  return (
    <>
      <PageHeader
        title={`Welcome, ${displayName(profile).split(' ')[0]}`}
        description="Your internal workspace for marketing work and clinical onboarding."
      />

      <div className="mx-auto max-w-3xl px-6 py-8">
        <section className="rounded-lg border border-border bg-secondary/30 p-5">
          <h2 className="font-display text-base font-semibold">Phase 1 is live</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Sign-in works, and it is invite-only — there is no public sign-up form
            anywhere. Anyone who is not signed in gets nothing, both at the app door and
            at the database itself.
          </p>
          {profile.role === 'admin' && (
            <Link
              href="/team/members"
              className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Invite your first team member
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
        </section>

        <section className="mt-8">
          <h2 className="font-display text-base font-semibold">What is coming</h2>
          <ol className="mt-3 space-y-2">
            {ROADMAP.map(({ phase, label, done }) => (
              <li key={phase} className="flex items-start gap-3 text-sm">
                {done ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                ) : (
                  <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" aria-hidden="true" />
                )}
                <span className={done ? 'text-foreground' : 'text-muted-foreground'}>
                  <span className="sr-only">{done ? 'Done: ' : 'Not started: '}</span>
                  <span className="font-mono text-xs text-muted-foreground">Phase {phase}</span>
                  {'  '}
                  {label}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-8 rounded-md border border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <strong className="font-medium text-foreground">Data boundary.</strong> This
          workspace holds internal operations only — campaigns, tasks, and hiring steps.
          Never enter client names, clinical notes, or any protected health information.
        </p>
      </div>
    </>
  )
}
