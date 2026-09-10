'use client'

import { useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import type { Project, Section, Task, Profile } from '@/lib/team/types'
import { positionAtEnd, positionBetween } from '@/lib/team/position'
import { createTask, toggleTaskComplete, updateTask, reorderTask, archiveTask, createSection } from './actions'
import { TaskRow } from './task-row'
import { FastEntryRow } from './fast-entry-row'
import { TaskDetailSheet } from './task-detail-sheet'

function SectionDropZone({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id })
  return (
    <div ref={setNodeRef} className="min-h-8 space-y-0.5">
      {children}
    </div>
  )
}

export function ProjectBoard({
  project,
  initialSections,
  initialTasks,
  members,
}: {
  project: Project
  initialSections: Section[]
  initialTasks: Task[]
  members: Profile[]
}) {
  const [sections, setSections] = useState(initialSections)
  const [tasks, setTasks] = useState(initialTasks)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [addingSection, setAddingSection] = useState(false)
  const [sectionName, setSectionName] = useState('')
  const snapshotRef = useRef<Task[]>(initialTasks)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const membersById = useMemo(() => new Map(members.map((m) => [m.id, m])), [members])

  const tasksBySection = useMemo(() => {
    const map = new Map<string, Task[]>()
    for (const section of sections) map.set(section.id, [])
    for (const task of [...tasks].sort((a, b) => a.position - b.position)) {
      map.get(task.section_id)?.push(task)
    }
    return map
  }, [sections, tasks])

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null

  function handleDragStart(event: DragStartEvent) {
    snapshotRef.current = tasks
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)
    const activeTaskRow = tasks.find((t) => t.id === activeId)
    if (!activeTaskRow) return

    const overTask = tasks.find((t) => t.id === overId)
    const targetSectionId = overTask ? overTask.section_id : overId
    if (!sections.some((s) => s.id === targetSectionId)) return
    if (activeId === overId) return

    const destination = tasks
      .filter((t) => t.section_id === targetSectionId && t.id !== activeId)
      .sort((a, b) => a.position - b.position)

    let insertAt = destination.length
    if (overTask && overTask.id !== activeId) {
      const index = destination.findIndex((t) => t.id === overTask.id)
      if (index !== -1) insertAt = index
    }

    const before = destination[insertAt - 1]?.position ?? null
    const after = destination[insertAt]?.position ?? null
    const newPosition = positionBetween(before, after)
    const before_snapshot = snapshotRef.current

    setTasks((prev) =>
      prev.map((t) =>
        t.id === activeId ? { ...t, section_id: targetSectionId, position: newPosition } : t,
      ),
    )

    reorderTask({ id: activeId, projectId: project.id, sectionId: targetSectionId, position: newPosition }).then(
      (result) => {
        if (!result.ok) {
          setTasks(before_snapshot)
          toast.error(result.error)
        }
      },
    )
  }

  function handleAddTask(sectionId: string, title: string) {
    const siblingPositions = (tasksBySection.get(sectionId) ?? []).map((t) => t.position)
    const position = positionAtEnd(siblingPositions)
    const tempId = `temp-${crypto.randomUUID()}`

    const optimisticTask: Task = {
      id: tempId,
      project_id: project.id,
      section_id: sectionId,
      parent_task_id: null,
      title,
      description: null,
      assignee_id: null,
      due_date: null,
      start_date: null,
      priority: 'none',
      completed: false,
      completed_at: null,
      position,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      archived_at: null,
    }
    setTasks((prev) => [...prev, optimisticTask])

    createTask({ projectId: project.id, sectionId, title, position }).then((result) => {
      if (!result.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== tempId))
        toast.error(result.error)
        return
      }
      setTasks((prev) => prev.map((t) => (t.id === tempId ? { ...t, id: result.data.id } : t)))
    })
  }

  function handleToggleComplete(id: string, completed: boolean) {
    const previous = tasks
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)))
    toggleTaskComplete({ id, projectId: project.id, completed }).then((result) => {
      if (!result.ok) {
        setTasks(previous)
        toast.error(result.error)
      }
    })
  }

  function handlePatch(id: string, patch: Partial<Task>) {
    const previous = tasks
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    updateTask({ id, projectId: project.id, ...patch }).then((result) => {
      if (!result.ok) {
        setTasks(previous)
        toast.error(result.error)
      }
    })
  }

  function handleMoveSection(id: string, sectionId: string) {
    const siblingPositions = (tasksBySection.get(sectionId) ?? []).map((t) => t.position)
    const position = positionAtEnd(siblingPositions)
    const previous = tasks
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, section_id: sectionId, position } : t)))
    reorderTask({ id, projectId: project.id, sectionId, position }).then((result) => {
      if (!result.ok) {
        setTasks(previous)
        toast.error(result.error)
      }
    })
  }

  function handleDelete(id: string) {
    const previous = tasks
    setTasks((prev) => prev.filter((t) => t.id !== id))
    archiveTask({ id, projectId: project.id }).then((result) => {
      if (!result.ok) {
        setTasks(previous)
        toast.error(result.error)
      }
    })
  }

  function handleCreateSection() {
    const name = sectionName.trim()
    if (!name) {
      setAddingSection(false)
      return
    }
    const position = positionAtEnd(sections.map((s) => s.position))
    const tempId = `temp-${crypto.randomUUID()}`
    const optimisticSection: Section = {
      id: tempId,
      project_id: project.id,
      name,
      position,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      archived_at: null,
    }
    setSections((prev) => [...prev, optimisticSection])
    setSectionName('')
    setAddingSection(false)

    createSection({ projectId: project.id, name, position }).then((result) => {
      if (!result.ok) {
        setSections((prev) => prev.filter((s) => s.id !== tempId))
        toast.error(result.error)
        return
      }
      setSections((prev) => prev.map((s) => (s.id === tempId ? { ...s, id: result.data.id } : s)))
    })
  }

  return (
    <div className="px-6 py-6">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        <div className="space-y-6">
          {sections.map((section) => {
            const sectionTasks = tasksBySection.get(section.id) ?? []
            return (
              <div key={section.id}>
                <h2 className="mb-1 px-1 font-display text-sm font-semibold text-muted-foreground">
                  {section.name}
                  <span className="ml-1.5 font-sans font-normal text-muted-foreground/60">
                    {sectionTasks.length}
                  </span>
                </h2>

                <SectionDropZone id={section.id}>
                  <SortableContext
                    items={sectionTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {sectionTasks.length === 0 && (
                      <p className="px-2 py-1.5 text-sm text-muted-foreground/50">No tasks yet</p>
                    )}
                    {sectionTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        assignee={task.assignee_id ? membersById.get(task.assignee_id) : undefined}
                        onOpen={() => setSelectedTaskId(task.id)}
                        onToggleComplete={(completed) => handleToggleComplete(task.id, completed)}
                      />
                    ))}
                  </SortableContext>
                </SectionDropZone>

                <FastEntryRow onSubmit={(title) => handleAddTask(section.id, title)} />
              </div>
            )
          })}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rounded-md border border-border bg-card px-2 py-1.5 text-sm shadow-md">
              {activeTask.title}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <div className="mt-6">
        {addingSection ? (
          <input
            autoFocus
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            onBlur={handleCreateSection}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleCreateSection()
              }
              if (e.key === 'Escape') {
                setSectionName('')
                setAddingSection(false)
              }
            }}
            placeholder="Section name"
            aria-label="Section name"
            className="rounded-md border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAddingSection(true)}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-secondary/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add section
          </button>
        )}
      </div>

      <TaskDetailSheet
        task={selectedTask}
        members={members}
        sections={sections}
        onClose={() => setSelectedTaskId(null)}
        onPatch={handlePatch}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDelete}
        onMoveSection={handleMoveSection}
      />
    </div>
  )
}
