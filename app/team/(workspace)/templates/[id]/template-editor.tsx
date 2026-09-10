'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import type { ProjectTemplate, TemplateSection, TemplateTask } from '@/lib/team/types'
import { positionAtEnd, positionBetween } from '@/lib/team/position'
import {
  createTemplateTask,
  updateTemplateTask,
  archiveTemplateTask,
  reorderTemplateTask,
  createTemplateSection,
  renameTemplateSection,
  archiveTemplateSection,
} from './actions'
import { FastEntryRow } from '@/components/team/fast-entry-row'
import { SectionHeader } from '@/components/team/section-header'
import { TemplateTaskRow } from './template-task-row'

export function TemplateEditor({
  template,
  initialSections,
  initialTasks,
}: {
  template: ProjectTemplate
  initialSections: TemplateSection[]
  initialTasks: TemplateTask[]
}) {
  const [sections, setSections] = useState(initialSections)
  const [tasks, setTasks] = useState(initialTasks)
  const [addingSection, setAddingSection] = useState(false)
  const [sectionName, setSectionName] = useState('')

  const tasksBySection = useMemo(() => {
    const map = new Map<string, TemplateTask[]>()
    for (const section of sections) map.set(section.id, [])
    for (const task of [...tasks].sort((a, b) => a.position - b.position)) {
      map.get(task.template_section_id)?.push(task)
    }
    return map
  }, [sections, tasks])

  function handleAddTask(sectionId: string, title: string) {
    const siblingPositions = (tasksBySection.get(sectionId) ?? []).map((t) => t.position)
    const position = positionAtEnd(siblingPositions)
    const tempId = `temp-${crypto.randomUUID()}`

    const optimisticTask: TemplateTask = {
      id: tempId,
      template_id: template.id,
      template_section_id: sectionId,
      title,
      offset_days: 0,
      default_assignee_role: null,
      position,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      archived_at: null,
    }
    setTasks((prev) => [...prev, optimisticTask])

    createTemplateTask({ templateId: template.id, templateSectionId: sectionId, title, position }).then(
      (result) => {
        if (!result.ok) {
          setTasks((prev) => prev.filter((t) => t.id !== tempId))
          toast.error(result.error)
          return
        }
        setTasks((prev) => prev.map((t) => (t.id === tempId ? { ...t, id: result.data.id } : t)))
      },
    )
  }

  function handlePatchTask(
    id: string,
    patch: { title?: string; offset_days?: number; default_assignee_role?: string | null },
  ) {
    const previous = tasks
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    updateTemplateTask({ id, templateId: template.id, ...patch }).then((result) => {
      if (!result.ok) {
        setTasks(previous)
        toast.error(result.error)
      }
    })
  }

  function handleMoveTask(sectionId: string, taskId: string, direction: 'up' | 'down') {
    const siblings = tasksBySection.get(sectionId) ?? []
    const index = siblings.findIndex((t) => t.id === taskId)
    const swapWith = direction === 'up' ? index - 1 : index + 1
    if (index === -1 || swapWith < 0 || swapWith >= siblings.length) return

    // Moving up: the new position sits between the task two spots up and
    // the one it's trading places with. Moving down is the mirror image.
    const neighborBefore = direction === 'up' ? siblings[swapWith - 1] : siblings[index]
    const neighborAfter = direction === 'up' ? siblings[swapWith] : siblings[swapWith + 1]
    const newPosition = positionBetween(neighborBefore?.position ?? null, neighborAfter?.position ?? null)

    const previous = tasks
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, position: newPosition } : t)))
    reorderTemplateTask({ id: taskId, templateId: template.id, position: newPosition }).then((result) => {
      if (!result.ok) {
        setTasks(previous)
        toast.error(result.error)
      }
    })
  }

  function handleDeleteTask(id: string) {
    const previous = tasks
    setTasks((prev) => prev.filter((t) => t.id !== id))
    archiveTemplateTask({ id, templateId: template.id }).then((result) => {
      if (!result.ok) {
        setTasks(previous)
        toast.error(result.error)
      }
    })
  }

  function handleRenameSection(id: string, name: string) {
    const previous = sections
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)))
    renameTemplateSection({ id, templateId: template.id, name }).then((result) => {
      if (!result.ok) {
        setSections(previous)
        toast.error(result.error)
      }
    })
  }

  function handleDeleteSection(id: string) {
    const previous = sections
    setSections((prev) => prev.filter((s) => s.id !== id))
    archiveTemplateSection({ id, templateId: template.id }).then((result) => {
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
    const optimisticSection: TemplateSection = {
      id: tempId,
      template_id: template.id,
      name,
      position,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      archived_at: null,
    }
    setSections((prev) => [...prev, optimisticSection])
    setSectionName('')
    setAddingSection(false)

    createTemplateSection({ templateId: template.id, name, position }).then((result) => {
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
      <div className="space-y-6">
        {sections.map((section) => {
          const sectionTasks = tasksBySection.get(section.id) ?? []
          return (
            <div key={section.id}>
              <SectionHeader
                section={section}
                taskCount={sectionTasks.length}
                onRename={(name) => handleRenameSection(section.id, name)}
                onDelete={() => handleDeleteSection(section.id)}
              />

              <div className="space-y-0.5">
                {sectionTasks.length === 0 && (
                  <p className="px-2 py-1.5 text-sm text-muted-foreground/50">No tasks yet</p>
                )}
                {sectionTasks.map((task, index) => (
                  <TemplateTaskRow
                    key={task.id}
                    task={task}
                    canMoveUp={index > 0}
                    canMoveDown={index < sectionTasks.length - 1}
                    onPatch={(patch) => handlePatchTask(task.id, patch)}
                    onMoveUp={() => handleMoveTask(section.id, task.id, 'up')}
                    onMoveDown={() => handleMoveTask(section.id, task.id, 'down')}
                    onDelete={() => handleDeleteTask(task.id)}
                  />
                ))}
              </div>

              <FastEntryRow onSubmit={(title) => handleAddTask(section.id, title)} />
            </div>
          )
        })}
      </div>

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
  )
}
