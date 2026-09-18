import Link from 'next/link'
import { ArrowRight, FolderKanban, Plus } from 'lucide-react'
import { requireProfile } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { displayName, type Project } from '@/lib/team/types'
import { ProjectGrid, type ProjectMember } from '@/components/team/project-grid'
import { OliveBlobs } from '@/components/team/olive-blobs'

/**
 * The practice works out of the Bay Area, so the greeting's date is stamped
 * in Pacific time rather than the server's UTC — otherwise anyone opening
 * this after late afternoon would be welcomed into tomorrow.
 */
const PRACTICE_TIME_ZONE = 'America/Los_Angeles'

export default async function TeamHomePage() {
  const profile = await requireProfile()
  const supabase = await createClient()
  const isAdmin = profile.role === 'admin'

  // Admins see the practice's whole project list, same as the Projects
  // page. Everyone else sees only projects they actually have a task
  // in — found via tasks.assignee_id, since there's no separate
  // "project membership" concept, just work assigned to you.
  let projects: Project[] = []
  if (isAdmin) {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .is('archived_at', null)
      .order('created_at', { ascending: false })
    projects = (data ?? []) as Project[]
  } else {
    const { data: assignedTasks } = await supabase
      .from('tasks')
      .select('project_id')
      .eq('assignee_id', profile.id)
      .is('archived_at', null)
    const projectIds = [...new Set((assignedTasks ?? []).map((t) => t.project_id))]

    if (projectIds.length > 0) {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .in('id', projectIds)
        .is('archived_at', null)
        .order('created_at', { ascending: false })
      projects = (data ?? []) as Project[]
    }
  }

  // Who's actually working in each project, for the avatar stack on the
  // cards. There's no membership table, so the same rule as above applies:
  // you're on a project if a live task there is assigned to you.
  const members: Record<string, ProjectMember[]> = {}
  if (projects.length > 0) {
    const { data: assignments } = await supabase
      .from('tasks')
      .select('project_id, assignee:profiles!assignee_id(id, name, email)')
      .in(
        'project_id',
        projects.map((p) => p.id),
      )
      .not('assignee_id', 'is', null)
      .is('archived_at', null)

    for (const row of assignments ?? []) {
      const person = row.assignee as unknown as ProjectMember | null
      if (!person) continue
      const list = (members[row.project_id] ??= [])
      if (!list.some((p) => p.id === person.id)) list.push(person)
    }
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: PRACTICE_TIME_ZONE,
  })
  const firstName = displayName(profile).split(' ')[0]

  return (
    <>
      <header className="relative max-w-[1320px] px-6 pt-10 sm:px-14 sm:pt-14 xl:min-h-[30rem]">
        <OliveBlobs />
        <div className="relative flex flex-wrap items-start justify-between gap-10">
          <div className="team-rise-in min-w-0 flex-1 basis-90">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {today}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,5.4vw,4.375rem)] leading-[1.04] font-normal tracking-tight text-pretty">
              Welcome back,
              <br />
              <em className="text-plum italic">{firstName}.</em>
            </h1>
          </div>

          <Link
            href="/team/projects"
            className="inline-flex shrink-0 items-center gap-2.5 rounded-md bg-gold px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-gold/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:mt-1.5"
          >
            {isAdmin ? 'Manage all projects' : 'Browse all projects'}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <section className="max-w-[1320px] px-6 pt-8 pb-16 sm:px-14 sm:pt-12">
        <div className="mb-7 flex items-baseline gap-3.5 border-b border-border pb-4">
          <h2 className="font-display text-xl font-medium">
            {isAdmin ? 'Active projects' : 'Your projects'}
          </h2>
          <span className="text-[13px] tracking-[0.08em] text-muted-foreground tabular-nums">
            {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-border px-6 py-16 text-center">
            <FolderKanban className="mx-auto size-8 text-muted-foreground/50" aria-hidden="true" />
            <h3 className="mt-4 font-display text-xl font-normal">
              {isAdmin ? 'No projects yet' : 'Nothing assigned to you yet'}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {isAdmin
                ? "Start one for a marketing campaign, a new hire's onboarding, or anything else your team is tracking."
                : "Once you're assigned a task in a project, it shows up here. In the meantime, you can browse everything the team is working on."}
            </p>
            <div className="mt-5 flex justify-center">
              <Link
                href="/team/projects"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Go to Projects
              </Link>
            </div>
          </div>
        ) : (
          <ProjectGrid
            projects={projects}
            members={members}
            trailing={
              isAdmin ? (
                <Link
                  href="/team/projects"
                  style={{ animationDelay: `${0.05 + projects.length * 0.08}s` }}
                  className="team-rise-in group flex min-h-55 flex-col items-start gap-3.5 rounded-[10px] border border-dashed border-border p-6 text-muted-foreground transition-colors hover:border-gold hover:bg-gold/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span className="grid size-10 place-items-center rounded-full border border-current">
                    <Plus className="size-4" aria-hidden="true" />
                  </span>
                  <span className="font-display text-xl font-normal">New project</span>
                  <span className="text-sm leading-relaxed">
                    Start from scratch or pick a template.
                  </span>
                </Link>
              ) : null
            }
          />
        )}
      </section>
    </>
  )
}
