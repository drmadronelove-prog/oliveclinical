'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
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
import { Plus, List, LayoutGrid, LayoutDashboard, Download } from 'lucide-react'
import type {
  Project,
  Section,
  Task,
  Profile,
  Tag,
  Comment,
  Attachment,
  ActivityLogEntry,
} from '@/lib/team/types'
import { positionAtEnd, positionBetween } from '@/lib/team/position'
import {
  createTask,
  toggleTaskComplete,
  updateTask,
  reorderTask,
  archiveTask,
  createSection,
  renameSection,
  archiveSection,
} from './actions'
import { createTag, setTaskTags } from './tag-actions'
import { createComment, deleteComment } from './comment-actions'
import { recordAttachment, deleteAttachment } from './attachment-actions'
import { updateProjectDefaultView } from '../actions'
import { TaskRow } from './task-row'
import { TaskCard } from './task-card'
import { FastEntryRow } from '@/components/team/fast-entry-row'
import { TaskDetailSheet } from './task-detail-sheet'
import { SectionHeader } from '@/components/team/section-header'
import { ProjectOverview } from '@/components/team/project-overview'
import { projectTasksToCsv } from '@/lib/team/csv'
import { cn } from '@/lib/utils'

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
  currentProfile,
  allTags,
  initialTaskTags,
  initialComments,
  initialAttachments,
  initialActivity,
  initialSelectedTaskId,
}: {
  project: Project
  initialSections: Section[]
  initialTasks: Task[]
  members: Profile[]
  currentProfile: Profile
  allTags: Tag[]
  initialTaskTags: Record<string, Tag[]>
  initialComments: Record<string, Comment[]>
  initialAttachments: Record<string, Attachment[]>
  initialActivity: Record<string, ActivityLogEntry[]>
  initialSelectedTaskId: string | null
}) {
  const pathname = usePathname()
  const [sections, setSections] = useState(initialSections)
  const [tasks, setTasks] = useState(initialTasks)
  const [tags, setTags] = useState(allTags)
  const [taskTags, setTaskTagsState] = useState(initialTaskTags)
  const [comments, setComments] = useState(initialComments)
  const [attachments, setAttachments] = useState(initialAttachments)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(initialSelectedTaskId)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [addingSection, setAddingSection] = useState(false)
  const [sectionName, setSectionName] = useState('')
  // "calendar" was Phase 2's placeholder third option on this column,
  // before Calendar became the separate, cross-project page it is now —
  // treat it as List here rather than as a view this toggle can select.
  // Overview is a snapshot to check, not a place to work — unlike
  // list/board it's never saved as the project's default_view, just
  // local state that resets to whichever of those was chosen last.
  const [showOverview, setShowOverview] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'board'>(
    project.default_view === 'board' ? 'board' : 'list',
  )
  const snapshotRef = useRef<Task[]>(initialTasks)

  // Keeps the address bar in sync with whichever task is open, so a
  // notification in the Inbox (or any other link) can point straight at
  // one task instead of just the project it lives in. Uses the raw
  // History API rather than router.replace — selectedTaskId is already
  // real React state, so all this needs to do is update the URL text;
  // going through Next's router would re-run this page's Server
  // Component (and every query in its Promise.all) on every task
  // opened or closed, turning an instant local panel into a server
  // round trip.
  useEffect(() => {
    const url = selectedTaskId ? `${pathname}?task=${selectedTaskId}` : pathname
    window.history.replaceState(null, '', url)
  }, [selectedTaskId, pathname])

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
      recurrence_rule: null,
      recurrence_parent_id: null,
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

  function handleTagsChange(taskId: string, tagIds: string[]) {
    const previous = taskTags
    setTaskTagsState((prev) => ({ ...prev, [taskId]: tags.filter((t) => tagIds.includes(t.id)) }))
    setTaskTags({ taskId, projectId: project.id, tagIds }).then((result) => {
      if (!result.ok) {
        setTaskTagsState(previous)
        toast.error(result.error)
      }
    })
  }

  async function handleCreateTag(name: string) {
    const result = await createTag(name)
    if (!result.ok) {
      toast.error(result.error)
      return null
    }
    const newTag: Tag = { id: result.data.id, name, color: result.data.color, created_at: '', archived_at: null }
    setTags((prev) => (prev.some((t) => t.id === newTag.id) ? prev : [...prev, newTag]))
    return newTag
  }

  async function handleCreateComment(taskId: string, body: string) {
    const tempId = `temp-${crypto.randomUUID()}`
    const optimisticComment: Comment = {
      id: tempId,
      task_id: taskId,
      author_id: currentProfile.id,
      body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      archived_at: null,
    }
    setComments((prev) => ({ ...prev, [taskId]: [...(prev[taskId] ?? []), optimisticComment] }))

    const result = await createComment({ taskId, projectId: project.id, body, members })
    if (!result.ok) {
      setComments((prev) => ({ ...prev, [taskId]: (prev[taskId] ?? []).filter((c) => c.id !== tempId) }))
      toast.error(result.error)
      return
    }
    setComments((prev) => ({
      ...prev,
      [taskId]: (prev[taskId] ?? []).map((c) => (c.id === tempId ? { ...c, id: result.data.id } : c)),
    }))
  }

  function handleDeleteComment(comment: Comment) {
    const previous = comments
    setComments((prev) => ({
      ...prev,
      [comment.task_id]: (prev[comment.task_id] ?? []).filter((c) => c.id !== comment.id),
    }))
    deleteComment({ id: comment.id, projectId: project.id }).then((result) => {
      if (!result.ok) {
        setComments(previous)
        toast.error(result.error)
      }
    })
  }

  async function handleAttachmentUploaded(taskId: string, file: File, storagePath: string) {
    const result = await recordAttachment({
      taskId,
      projectId: project.id,
      storagePath,
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type || 'application/octet-stream',
    })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    const newAttachment: Attachment = {
      id: result.data.id,
      task_id: taskId,
      storage_path: storagePath,
      file_name: file.name,
      file_size: file.size,
      content_type: file.type || null,
      uploaded_by: currentProfile.id,
      created_at: result.data.created_at,
    }
    setAttachments((prev) => ({ ...prev, [taskId]: [...(prev[taskId] ?? []), newAttachment] }))
  }

  function handleDeleteAttachment(attachment: Attachment) {
    const previous = attachments
    setAttachments((prev) => ({
      ...prev,
      [attachment.task_id]: (prev[attachment.task_id] ?? []).filter((a) => a.id !== attachment.id),
    }))
    deleteAttachment({ id: attachment.id, projectId: project.id, storagePath: attachment.storage_path }).then(
      (result) => {
        if (!result.ok) {
          setAttachments(previous)
          toast.error(result.error)
        }
      },
    )
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

  function handleRenameSection(id: string, name: string) {
    const previous = sections
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)))
    renameSection({ id, projectId: project.id, name }).then((result) => {
      if (!result.ok) {
        setSections(previous)
        toast.error(result.error)
      }
    })
  }

  function handleDeleteSection(id: string) {
    const previous = sections
    setSections((prev) => prev.filter((s) => s.id !== id))
    archiveSection({ id, projectId: project.id }).then((result) => {
      if (!result.ok) {
        setSections(previous)
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

  function handleViewChange(next: 'list' | 'board') {
    setShowOverview(false)
    setViewMode(next)
    const formData = new FormData()
    formData.set('id', project.id)
    formData.set('view', next)
    updateProjectDefaultView(formData) // fire-and-forget — worst case, it just doesn't stick for next time
  }

  function handleExportCsv() {
    const csv = projectTasksToCsv(tasks, sections, members, taskTags)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${project.name.replace(/[^\w\-]+/g, '-').toLowerCase()}-tasks.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Download className="size-3.5" aria-hidden="true" />
          Export CSV
        </button>
        <div className="inline-flex rounded-md border border-border p-0.5" role="group" aria-label="View">
          <button
            type="button"
            onClick={() => handleViewChange('list')}
            aria-pressed={!showOverview && viewMode === 'list'}
            className={cn(
              'flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              !showOverview && viewMode === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <List className="size-3.5" aria-hidden="true" />
            List
          </button>
          <button
            type="button"
            onClick={() => handleViewChange('board')}
            aria-pressed={!showOverview && viewMode === 'board'}
            className={cn(
              'flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              !showOverview && viewMode === 'board' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <LayoutGrid className="size-3.5" aria-hidden="true" />
            Board
          </button>
          <button
            type="button"
            onClick={() => setShowOverview(true)}
            aria-pressed={showOverview}
            className={cn(
              'flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              showOverview ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <LayoutDashboard className="size-3.5" aria-hidden="true" />
            Overview
          </button>
        </div>
      </div>

      {showOverview && (
        <ProjectOverview project={project} sections={sections} tasks={tasks} members={members} activity={initialActivity} />
      )}

      <div className={showOverview ? 'hidden' : undefined}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        <div className={viewMode === 'board' ? 'flex items-start gap-4 overflow-x-auto pb-2' : 'space-y-6'}>
          {sections.map((section) => {
            const sectionTasks = tasksBySection.get(section.id) ?? []
            return (
              <div key={section.id} className={viewMode === 'board' ? 'w-72 shrink-0' : undefined}>
                <SectionHeader
                  section={section}
                  taskCount={sectionTasks.length}
                  onRename={(name) => handleRenameSection(section.id, name)}
                  onDelete={() => handleDeleteSection(section.id)}
                />

                <SectionDropZone id={section.id}>
                  <SortableContext
                    items={sectionTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className={viewMode === 'board' ? 'space-y-2' : 'space-y-0.5'}>
                      {sectionTasks.length === 0 && (
                        <p className="px-2 py-1.5 text-sm text-muted-foreground/50">No tasks yet</p>
                      )}
                      {sectionTasks.map((task) =>
                        viewMode === 'board' ? (
                          <TaskCard
                            key={task.id}
                            task={task}
                            assignee={task.assignee_id ? membersById.get(task.assignee_id) : undefined}
                            onOpen={() => setSelectedTaskId(task.id)}
                            onToggleComplete={(completed) => handleToggleComplete(task.id, completed)}
                          />
                        ) : (
                          <TaskRow
                            key={task.id}
                            task={task}
                            assignee={task.assignee_id ? membersById.get(task.assignee_id) : undefined}
                            onOpen={() => setSelectedTaskId(task.id)}
                            onToggleComplete={(completed) => handleToggleComplete(task.id, completed)}
                          />
                        ),
                      )}
                    </div>
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
      </div>

      <TaskDetailSheet
        task={selectedTask}
        members={members}
        sections={sections}
        currentProfile={currentProfile}
        allTags={tags}
        selectedTags={selectedTask ? (taskTags[selectedTask.id] ?? []) : []}
        comments={selectedTask ? (comments[selectedTask.id] ?? []) : []}
        attachments={selectedTask ? (attachments[selectedTask.id] ?? []) : []}
        activity={selectedTask ? (initialActivity[selectedTask.id] ?? []) : []}
        onClose={() => setSelectedTaskId(null)}
        onPatch={handlePatch}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDelete}
        onMoveSection={handleMoveSection}
        onTagsChange={handleTagsChange}
        onCreateTag={handleCreateTag}
        onCreateComment={handleCreateComment}
        onDeleteComment={handleDeleteComment}
        onAttachmentUploaded={handleAttachmentUploaded}
        onDeleteAttachment={handleDeleteAttachment}
      />
    </div>
  )
}
