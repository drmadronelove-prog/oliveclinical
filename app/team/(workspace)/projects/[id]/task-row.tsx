'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { displayName, initialsOf, formatShortDate, isOverdue, type Task, type Profile } from '@/lib/team/types'
import { PRIORITY_LABEL, PRIORITY_BADGE_CLASS, type Priority } from '@/lib/team/priority'
import { cn } from '@/lib/utils'

export function TaskRow({
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
      className={cn(
        'group flex items-center gap-1.5 rounded-md px-1 py-1.5 text-sm hover:bg-secondary/40',
        isDragging && 'z-10 opacity-50',
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Reorder "${task.title}". Space to pick up, arrow keys to move, space to drop.`}
        className="shrink-0 touch-none rounded p-0.5 text-muted-foreground/40 opacity-0 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring group-hover:opacity-100"
      >
        <GripVertical className="size-4" aria-hidden="true" />
      </button>

      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => onToggleComplete(checked === true)}
        onClick={(e) => e.stopPropagation()}
        className="size-4 shrink-0"
        aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
      />

      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 truncate text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span className={cn(task.completed && 'text-muted-foreground line-through')}>
          {task.title}
        </span>
      </button>

      <span className="flex shrink-0 items-center gap-1.5">
        {task.priority !== 'none' && (
          <Badge className={cn('px-1.5 py-0 text-[10px]', PRIORITY_BADGE_CLASS[task.priority as Priority])}>
            {PRIORITY_LABEL[task.priority as Priority]}
          </Badge>
        )}
        {task.due_date && (
          <span
            className={cn(
              'text-xs',
              overdue ? 'font-medium text-destructive' : 'text-muted-foreground',
            )}
          >
            {overdue && <span className="sr-only">Overdue: </span>}
            {formatShortDate(task.due_date)}
          </span>
        )}
        {assignee ? (
          <Avatar className="size-5" title={displayName(assignee)}>
            <AvatarFallback className="text-[9px]">{initialsOf(assignee)}</AvatarFallback>
          </Avatar>
        ) : (
          <span className="size-5" aria-hidden="true" />
        )}
      </span>
    </div>
  )
}
