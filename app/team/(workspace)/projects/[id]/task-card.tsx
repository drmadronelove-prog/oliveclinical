'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { displayName, initialsOf, formatShortDate, isOverdue, type Task, type Profile } from '@/lib/team/types'
import { PRIORITY_LABEL, PRIORITY_BADGE_CLASS, type Priority } from '@/lib/team/priority'
import { cn } from '@/lib/utils'

export function TaskCard({
  task,
  assignee,
  onOpen,
  onToggleComplete,
}: {
  task: Task
  assignee: Profile | undefined
  onOpen: () => void
  onToggleComplete: (completed: boolean) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const overdue = isOverdue(task.due_date, task.completed)

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpen()
      }}
      className={cn(
        'w-full cursor-pointer touch-none rounded-md border border-border bg-card p-2.5 text-left text-sm shadow-xs hover:border-ring/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        isDragging && 'z-10 opacity-50',
      )}
    >
      <div className="flex items-start gap-2">
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => onToggleComplete(checked === true)}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="mt-0.5 size-4 shrink-0"
          aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
        />
        <span className={cn('min-w-0 flex-1', task.completed && 'text-muted-foreground line-through')}>
          {task.title}
        </span>
      </div>

      {(task.priority !== 'none' || task.due_date || assignee) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-6">
          {task.priority !== 'none' && (
            <Badge className={cn('px-1.5 py-0 text-[10px]', PRIORITY_BADGE_CLASS[task.priority as Priority])}>
              {PRIORITY_LABEL[task.priority as Priority]}
            </Badge>
          )}
          {task.due_date && (
            <span className={cn('text-xs', overdue ? 'font-medium text-destructive' : 'text-muted-foreground')}>
              {overdue && <span className="sr-only">Overdue: </span>}
              {formatShortDate(task.due_date)}
            </span>
          )}
          {assignee && (
            <Avatar className="ml-auto size-5" title={displayName(assignee)}>
              <AvatarFallback className="text-[9px]">{initialsOf(assignee)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      )}
    </div>
  )
}
