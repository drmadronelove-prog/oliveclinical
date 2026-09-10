import { ClipboardList, AlertTriangle, CalendarClock, CheckCircle2 } from 'lucide-react'
import {
  bucketTaskDate,
  formatRelativeTime,
  type ActivityLogEntry,
  type Profile,
  type Section,
  type Task,
} from '@/lib/team/types'
import { describeActivity } from '@/lib/team/activity-copy'

function StatTile({ icon: Icon, label, value }: { icon: typeof ClipboardList; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-1.5 font-display text-2xl font-semibold">{value}</p>
    </div>
  )
}

/**
 * A read-only snapshot of a project — not a fourth place to do work
 * (List and Board already cover that), just the "how's this going"
 * question answered at a glance: how much is done, what's overdue, and
 * what changed recently, across every task and every section at once.
 * Never persisted as anyone's default view — it's a page you check, not
 * one you live in day to day.
 */
export function ProjectOverview({
  project,
  sections,
  tasks,
  members,
  activity,
}: {
  project: { description: string | null }
  sections: Section[]
  tasks: Task[]
  members: Profile[]
  activity: Record<string, ActivityLogEntry[]>
}) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.completed).length
  const overdue = tasks.filter((t) => !t.completed && bucketTaskDate(t.due_date) === 'overdue').length
  const dueThisWeek = tasks.filter((t) => !t.completed && bucketTaskDate(t.due_date) === 'this_week').length
  const percentComplete = total === 0 ? 0 : Math.round((completed / total) * 100)

  const membersById = new Map(members.map((m) => [m.id, m]))
  const sectionsById = new Map(sections.map((s) => [s.id, s]))
  const taskTitleById = new Map(tasks.map((t) => [t.id, t.title]))

  const recentActivity = Object.values(activity)
    .flat()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 12)

  return (
    <div className="max-w-3xl space-y-8">
      {project.description && (
        <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={ClipboardList} label="Total tasks" value={total} />
        <StatTile icon={CheckCircle2} label="Completed" value={completed} />
        <StatTile icon={AlertTriangle} label="Overdue" value={overdue} />
        <StatTile icon={CalendarClock} label="Due this week" value={dueThisWeek} />
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Overall progress</span>
          <span>{percentComplete}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {sections.length > 0 && (
        <div>
          <h2 className="font-display text-sm font-semibold">By section</h2>
          <ul className="mt-3 space-y-2.5">
            {sections.map((section) => {
              const sectionTasks = tasks.filter((t) => t.section_id === section.id)
              const sectionCompleted = sectionTasks.filter((t) => t.completed).length
              const pct = sectionTasks.length === 0 ? 0 : Math.round((sectionCompleted / sectionTasks.length) * 100)
              return (
                <li key={section.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{section.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {sectionCompleted}/{sectionTasks.length}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary/70 transition-[width]" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div>
        <h2 className="font-display text-sm font-semibold">Recent activity</h2>
        {recentActivity.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Nothing yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {recentActivity.map((entry) => (
              <li key={entry.id} className="text-sm text-muted-foreground">
                {describeActivity(entry, { membersById, sectionsById, taskTitle: taskTitleById.get(entry.task_id) })}
                <span className="ml-1.5 text-xs text-muted-foreground/60">{formatRelativeTime(entry.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
