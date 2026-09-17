import Link from 'next/link'
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_DOT_CLASS, PROJECT_TYPE_LABEL, type Project } from '@/lib/team/types'

/** The active-projects grid — one card per project, linking into it. Shared by the Projects page and the home dashboard so the two always look identical. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
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
  )
}
