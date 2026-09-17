import Link from 'next/link'
import { FolderKanban, Archive } from 'lucide-react'
import { requireProfile } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/team/page-header'
import { type Project } from '@/lib/team/types'
import { ProjectGrid } from '@/components/team/project-grid'
import { NewProjectDialog } from './new-project-dialog'
import { ArchivedProjectCard } from './archived-project-card'

export const metadata = { title: 'Projects — Olive Team', robots: { index: false } }

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  await requireProfile()
  const { view } = await searchParams
  const showingArchived = view === 'archived'
  const supabase = await createClient()

  const query = supabase.from('projects').select('*').order(
    showingArchived ? 'archived_at' : 'created_at',
    { ascending: false },
  )
  const { data } = showingArchived
    ? await query.not('archived_at', 'is', null)
    : await query.is('archived_at', null)

  const projects = (data ?? []) as Project[]

  return (
    <>
      <PageHeader
        title="Projects"
        description={
          showingArchived
            ? 'Archived projects — restore one, or delete it for good.'
            : 'Marketing work and clinical onboarding, each in its own place.'
        }
        actions={
          showingArchived ? (
            <Link
              href="/team/projects"
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Back to active projects
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/team/projects?view=archived"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Archive className="size-3.5" aria-hidden="true" />
                Archived
              </Link>
              <NewProjectDialog />
            </div>
          )
        }
      />

      <div className="px-6 py-8">
        {projects.length === 0 ? (
          showingArchived ? (
            <p className="px-1 text-sm text-muted-foreground">No archived projects.</p>
          ) : (
            <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
              <FolderKanban className="mx-auto size-8 text-muted-foreground/50" aria-hidden="true" />
              <h2 className="mt-4 font-display text-base font-semibold">No projects yet</h2>
              <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
                Start one for a marketing campaign, a new hire's onboarding, or anything else
                your team is tracking.
              </p>
              <div className="mt-5 flex justify-center">
                <NewProjectDialog />
              </div>
            </div>
          )
        ) : showingArchived ? (
          <div className="space-y-2">
            {projects.map((project) => (
              <ArchivedProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </div>
    </>
  )
}
