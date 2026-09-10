'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from '@dnd-kit/core'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { getMonthGridDays, toDateOnly } from '@/lib/team/calendar-grid'
import { displayName, isOverdue, type Project, type Task, type Profile, type Tag } from '@/lib/team/types'
import { updateTask } from '../projects/[id]/actions'
import { cn } from '@/lib/utils'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const UNFILTERED = '__all__'

function TaskChip({ task, project }: { task: Task; project: Project | undefined }) {
  const router = useRouter()
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id })
  const overdue = isOverdue(task.due_date, task.completed)

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      // A real drag moves past the sensor's 4px threshold before this
      // ever fires, so a plain click (no movement) still opens the
      // project — dnd-kit doesn't swallow the click for those.
      onClick={() => router.push(`/team/projects/${task.project_id}`)}
      title={`${task.title} — ${project?.name ?? 'Unknown project'}`}
      className={cn(
        'flex w-full touch-none items-center gap-1 truncate rounded px-1 py-0.5 text-left text-[11px] outline-none hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
        isDragging && 'opacity-40',
        task.completed && 'opacity-50',
      )}
      style={{ backgroundColor: `${project?.color ?? '#5b6e88'}26` }}
    >
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: project?.color ?? '#5b6e88' }}
      />
      <span className={cn('truncate', task.completed && 'line-through', overdue && 'font-medium text-destructive')}>
        {task.title}
      </span>
    </button>
  )
}

function DayCell({
  date,
  inCurrentMonth,
  isToday,
  tasks,
  projectsById,
}: {
  date: Date
  inCurrentMonth: boolean
  isToday: boolean
  tasks: Task[]
  projectsById: Map<string, Project>
}) {
  const { setNodeRef, isOver } = useDroppable({ id: toDateOnly(date) })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-h-24 flex-col gap-0.5 border-b border-r border-border p-1',
        !inCurrentMonth && 'bg-secondary/20',
        isOver && 'bg-primary/10',
      )}
    >
      <span
        className={cn(
          'self-start rounded-full px-1.5 text-xs',
          isToday && 'bg-primary font-medium text-primary-foreground',
          !inCurrentMonth && 'text-muted-foreground/50',
        )}
      >
        {date.getDate()}
      </span>
      {tasks.map((task) => (
        <TaskChip key={task.id} task={task} project={projectsById.get(task.project_id)} />
      ))}
    </div>
  )
}

export function CalendarView({
  projects,
  initialTasks,
  members,
  tags,
  taskTagIds,
}: {
  projects: Project[]
  initialTasks: Task[]
  members: Profile[]
  tags: Tag[]
  taskTagIds: Record<string, string[]>
}) {
  const today = useMemo(() => new Date(), [])
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [tasks, setTasks] = useState(initialTasks)
  const [assigneeFilter, setAssigneeFilter] = useState(UNFILTERED)
  const [tagFilter, setTagFilter] = useState(UNFILTERED)
  const [draggingTask, setDraggingTask] = useState<Task | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))
  const projectsById = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (assigneeFilter !== UNFILTERED && task.assignee_id !== assigneeFilter) return false
      if (tagFilter !== UNFILTERED && !(taskTagIds[task.id] ?? []).includes(tagFilter)) return false
      return true
    })
  }, [tasks, assigneeFilter, tagFilter, taskTagIds])

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>()
    for (const task of filteredTasks) {
      if (!task.due_date) continue
      if (!map.has(task.due_date)) map.set(task.due_date, [])
      map.get(task.due_date)!.push(task)
    }
    return map
  }, [filteredTasks])

  const days = useMemo(() => getMonthGridDays(cursor.getFullYear(), cursor.getMonth()), [cursor])
  const todayIso = toDateOnly(today)

  function handleDragEnd(event: DragEndEvent) {
    setDraggingTask(null)
    const { active, over } = event
    if (!over) return

    const taskId = String(active.id)
    const newDate = String(over.id)
    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.due_date === newDate) return

    const previous = tasks
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, due_date: newDate } : t)))

    updateTask({ id: taskId, projectId: task.project_id, due_date: newDate }).then((result) => {
      if (!result.ok) {
        setTasks(previous)
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="px-6 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <h2 className="w-40 text-center font-display text-sm font-semibold">
            {cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            aria-label="Next month"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
          >
            Today
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger size="sm" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNFILTERED}>Everyone</SelectItem>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {displayName(member)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger size="sm" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNFILTERED}>All tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={(e) => setDraggingTask(tasks.find((t) => t.id === e.active.id) ?? null)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setDraggingTask(null)}
      >
        <div className="overflow-x-auto">
          <div className="grid min-w-[42rem] grid-cols-7 border-l border-t border-border">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="border-b border-r border-border bg-secondary/30 px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
              >
                {label}
              </div>
            ))}
            {days.map((date) => {
              const iso = toDateOnly(date)
              return (
                <DayCell
                  key={iso}
                  date={date}
                  inCurrentMonth={date.getMonth() === cursor.getMonth()}
                  isToday={iso === todayIso}
                  tasks={(tasksByDate.get(iso) ?? []).sort((a, b) => a.title.localeCompare(b.title))}
                  projectsById={projectsById}
                />
              )
            })}
          </div>
        </div>

        <DragOverlay>
          {draggingTask && (
            <div className="rounded border border-border bg-card px-2 py-1 text-xs shadow-md">
              {draggingTask.title}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <p className="mt-4 text-xs text-muted-foreground">
        Click a task to go to its project — editing it here isn't built yet. Drag it to a
        different day to reschedule.
      </p>
    </div>
  )
}
