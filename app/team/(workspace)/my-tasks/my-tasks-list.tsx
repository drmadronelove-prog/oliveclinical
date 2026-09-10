'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  formatShortDate,
  bucketTaskDate,
  TASK_BUCKET_ORDER,
  TASK_BUCKET_LABEL,
  type Project,
  type Task,
} from '@/lib/team/types'
import { PRIORITY_LABEL, PRIORITY_BADGE_CLASS, type Priority } from '@/lib/team/priority'
import { toggleTaskComplete } from '../projects/[id]/actions'
import { cn } from '@/lib/utils'

export function MyTasksList({ initialTasks, projects }: { initialTasks: Task[]; projects: Project[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const projectsById = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects])

  const grouped = useMemo(() => {
    const map = new Map<string, Task[]>(TASK_BUCKET_ORDER.map((bucket) => [bucket, []]))
    for (const task of tasks) {
      map.get(bucketTaskDate(task.due_date))!.push(task)
    }
    for (const bucket of TASK_BUCKET_ORDER) {
      map.get(bucket)!.sort((a, b) => (a.due_date ?? '').localeCompare(b.due_date ?? ''))
    }
    return map
  }, [tasks])

  function handleComplete(task: Task) {
    // Completing a task here means it's done — it should disappear from
    // My Tasks, not just show a strikethrough in a list you're about to
    // leave anyway.
    const previous = tasks
    setTasks((prev) => prev.filter((t) => t.id !== task.id))
    toggleTaskComplete({ id: task.id, projectId: task.project_id, completed: true }).then((result) => {
      if (!result.ok) {
        setTasks(previous)
        toast.error(result.error)
      }
    })
  }

  if (tasks.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <CheckCircle2 className="mx-auto size-8 text-muted-foreground/50" aria-hidden="true" />
        <h2 className="mt-4 font-display text-base font-semibold">Nothing assigned to you right now</h2>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
          Tasks assigned to you across every project show up here, grouped by when they're due.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8 px-6 py-6">
      {TASK_BUCKET_ORDER.map((bucket) => {
        const bucketTasks = grouped.get(bucket) ?? []
        if (bucketTasks.length === 0) return null
        return (
          <section key={bucket}>
            <h2
              className={cn(
                'mb-2 flex items-center gap-2 font-display text-sm font-semibold',
                bucket === 'overdue' && 'text-destructive',
              )}
            >
              {TASK_BUCKET_LABEL[bucket]}
              <span className="font-sans text-xs font-normal text-muted-foreground">{bucketTasks.length}</span>
            </h2>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {bucketTasks.map((task) => {
                const project = projectsById.get(task.project_id)
                return (
                  <li key={task.id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
                    <Checkbox
                      checked={false}
                      onCheckedChange={() => handleComplete(task)}
                      className="size-4 shrink-0"
                      aria-label={`Mark "${task.title}" complete`}
                    />
                    <span className="min-w-0 flex-1 truncate">{task.title}</span>
                    {task.priority !== 'none' && (
                      <Badge className={cn('shrink-0 px-1.5 py-0 text-[10px]', PRIORITY_BADGE_CLASS[task.priority as Priority])}>
                        {PRIORITY_LABEL[task.priority as Priority]}
                      </Badge>
                    )}
                    {task.due_date && (
                      <span
                        className={cn(
                          'shrink-0 text-xs',
                          bucket === 'overdue' ? 'font-medium text-destructive' : 'text-muted-foreground',
                        )}
                      >
                        {formatShortDate(task.due_date)}
                      </span>
                    )}
                    {project && (
                      <Link
                        href={`/team/projects/${project.id}`}
                        className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <span
                          aria-hidden="true"
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="max-w-24 truncate">{project.name}</span>
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
