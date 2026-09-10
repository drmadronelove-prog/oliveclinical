import Link from 'next/link'
import { FolderKanban } from 'lucide-react'
import { requireProfile } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/team/page-header'
import {
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_DOT_CLASS,
  PROJECT_TYPE_LABEL,
  type Project,
} from '@/lib/team/types'
import { NewProjectDialog } from './new-project-dialog'

export const metadata = { title: 'Projects — Olive Team', robots: { index: false } }

export default async function ProjectsPage() {
  await requireProfile()
  const supabase = await createClient()

  const { data } = await supabase
    .from('projects')
    .select('*')
    .is('archived_at', null)
    .order('created_at', { ascending: false })

  const projects = (data ?? []) as Project[]

  return (
    <>
      <PageHeader
        title="Projects"
        description="Marketing work and clinical onboarding, each in its own place."
        actions={<NewProjectDialog />}
      />

      <div className="px-6 py-8">
        {projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
            <FolderKanban className="mx-auto size-8 text-muted-foreground/50" aria-hidden="true" />
            <h2 className="mt-4 font-display text-base font-semibold">No projects yet</h2>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
              Start one for a marketing campaign, a new hire's onboarding, or anything else your
              team is tracking.
            </p>
            <div className="mt-5 flex justify-center">
              <NewProjectDialog />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/team/projects/${project.id}`}
                className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-ring/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="flex-1 truncate font-display text-sm font-semibold group-hover:underline">
                    {project.name}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${PROJECT_STATUS_DOT_CLASS[project.status]}`}
                    />
                    {PROJECT_STATUS_LABEL[project.status]}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{PROJECT_TYPE_LABEL[project.type]}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
