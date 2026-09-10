import Link from 'next/link'
import { ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import { requireProfile } from '@/lib/team/auth'
import { displayName } from '@/lib/team/types'
import { PageHeader } from '@/components/team/page-header'

const ROADMAP = [
  { phase: 1, label: 'Sign-in, members, and permissions', done: true },
  { phase: 2, label: 'Projects and tasks, with fast keyboard entry', done: true },
  { phase: 3, label: 'Onboarding templates for new clinical hires', done: true },
  { phase: 4, label: 'Board and calendar views, My Tasks', done: true },
  { phase: 5, label: 'Comments, attachments, recurring tasks, and an inbox', done: true },
  { phase: 6, label: 'Search, command palette, exports, project overview', done: true },
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
          <h2 className="font-display text-base font-semibold">Search everything with ⌘K</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Press <span className="font-mono">⌘K</span> (or Ctrl+K) anywhere in the workspace, or
            click Search in the sidebar, to jump to any page or jump straight to a project or
            task by name. Every project also has an Export CSV button next to its List/Board
            toggle, and a third Overview tab — progress, overdue count, and recent activity at a
            glance, for the whole project at once.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            That completes the original build plan. Comments, attachments, recurring tasks, and
            email notifications from Phase 5 are still there too — see PHASE-5.md to turn on
            email if you haven't.
          </p>
          <Link
            href="/team/projects"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Go to Projects
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/team/inbox"
            className="ml-2 mt-4 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Go to Inbox
          </Link>
          {profile.role === 'admin' && (
            <Link
              href="/team/members"
              className="ml-2 mt-4 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Invite a team member
            </Link>
          )}
        </section>

        <section className="mt-8">
          <h2 className="font-display text-base font-semibold">What's been built</h2>
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
