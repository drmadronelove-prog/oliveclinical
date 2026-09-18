import Link from 'next/link'
import {
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_DOT_CLASS,
  PROJECT_TYPE_LABEL,
  formatRelativeTime,
  initialsOf,
  displayName,
  type Project,
} from '@/lib/team/types'

/** Just enough of a person to render an avatar — the cards never need more. */
export type ProjectMember = { id: string; name: string | null; email: string }

/**
 * Avatar tints, drawn from the practice palette. Picked by a checksum of the
 * person's id so someone keeps the same color everywhere they appear, and two
 * people stacked side by side don't read as one wide blob.
 */
const AVATAR_COLORS = ['var(--plum)', 'var(--slate)', 'var(--dusk)', 'var(--ink)', 'var(--rose)']

function avatarColor(id: string): string {
  let sum = 0
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

/** An olive in a project's own color — the mark the marketing site uses, at card scale. */
function ProjectOlive({ color, size }: { color: string; size: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className="block shrink-0"
    >
      <circle cx="50" cy="50" r="50" fill={color} />
      <ellipse cx="62" cy="39" rx="14" ry="22" fill="#ffffff" opacity="0.3" />
    </svg>
  )
}

/**
 * The active-projects grid — one card per project, linking into it. Shared by
 * the Projects page and the home dashboard so the two always look identical.
 *
 * Cards carry the marketing site's furniture: the project's olive, a serif
 * title, a hairline gold rule over the meta line, and a watermark of the same
 * olive bled off the top-right corner. `members` is optional — pass it and the
 * card grows an avatar stack, leave it out and the footer is just the status.
 * `trailing` fills the cell after the last project, which is where the home
 * page puts its "New project" tile.
 */
export function ProjectGrid({
  projects,
  members,
  trailing,
}: {
  projects: Project[]
  members?: Record<string, ProjectMember[]>
  trailing?: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project, i) => {
        const assigned = members?.[project.id] ?? []
        return (
          <Link
            key={project.id}
            href={`/team/projects/${project.id}`}
            style={{
              // Drives the hover border and the watermark, so each card picks
              // up its own project color without a second inline style.
              ['--project-color' as string]: project.color,
              animationDelay: `${0.05 + i * 0.08}s`,
            }}
            className="team-rise-in group relative flex flex-col gap-5 overflow-hidden rounded-[10px] border border-border bg-card p-6 pb-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--project-color)] hover:shadow-[0_18px_34px_-22px_rgba(11,37,69,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <svg
              viewBox="0 0 100 100"
              aria-hidden="true"
              className="pointer-events-none absolute -top-13 -right-11 size-38 opacity-[0.16]"
            >
              <circle cx="50" cy="50" r="50" fill="var(--project-color)" />
              <ellipse cx="62" cy="39" rx="15" ry="23" fill="#ffffff" opacity="0.55" />
            </svg>

            <div className="relative flex items-start justify-between gap-4">
              <ProjectOlive color={project.color} size={46} />
              <span className="pt-1.5 text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                {PROJECT_TYPE_LABEL[project.type]}
              </span>
            </div>

            <div>
              <h3 className="font-display text-2xl leading-snug font-normal tracking-tight text-balance group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                {project.name}
              </h3>
              {project.description && (
                <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              )}
              <p className="mt-4 flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                <span aria-hidden="true" className="h-px w-4.5 shrink-0 bg-gold" />
                Updated {formatRelativeTime(project.updated_at)}
              </p>
            </div>

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
              <span className="flex items-center gap-2 text-sm font-medium">
                <span
                  aria-hidden="true"
                  className={`size-1.5 shrink-0 rounded-full ${PROJECT_STATUS_DOT_CLASS[project.status]}`}
                />
                {PROJECT_STATUS_LABEL[project.status]}
              </span>
              {assigned.length > 0 && (
                <span className="flex">
                  {assigned.map((person) => (
                    <span
                      key={person.id}
                      title={displayName(person)}
                      style={{ backgroundColor: avatarColor(person.id) }}
                      className="-ml-2 grid size-7 place-items-center rounded-full border-2 border-card text-[10px] font-bold text-paper first:ml-0"
                    >
                      {initialsOf(person)}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </Link>
        )
      })}
      {trailing}
    </div>
  )
}
