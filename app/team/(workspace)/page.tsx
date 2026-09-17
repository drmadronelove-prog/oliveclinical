import Link from 'next/link'
import { FolderKanban } from 'lucide-react'
import { requireProfile } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { displayName, type Project } from '@/lib/team/types'
import { PageHeader } from '@/components/team/page-header'
import { ProjectGrid } from '@/components/team/project-grid'

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

  return (
    <>
      <PageHeader
        title={`Welcome, ${displayName(profile).split(' ')[0]}`}
        description={isAdmin ? 'Every active project.' : "Projects you've been assigned work in."}
        actions={
          <Link
            href="/team/projects"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {isAdmin ? 'Manage all projects' : 'Browse all projects'}
          </Link>
        }
      />

      <div className="px-6 py-8">
        {projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
            <FolderKanban className="mx-auto size-8 text-muted-foreground/50" aria-hidden="true" />
            <h2 className="mt-4 font-display text-base font-semibold">
              {isAdmin ? 'No projects yet' : "Nothing assigned to you yet"}
            </h2>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
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
          <ProjectGrid projects={projects} />
        )}
      </div>
    </>
  )
}
