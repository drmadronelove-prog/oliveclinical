'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import { formatOffsetDays, type TemplateTask } from '@/lib/team/types'
import { cn } from '@/lib/utils'

export function TemplateTaskRow({
  task,
  canMoveUp,
  canMoveDown,
  onPatch,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  task: TemplateTask
  canMoveUp: boolean
  canMoveDown: boolean
  onPatch: (patch: { title?: string; offset_days?: number; default_assignee_role?: string | null }) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}) {
  const [title, setTitle] = useState(task.title)
  const [offset, setOffset] = useState(String(task.offset_days))
  const [role, setRole] = useState(task.default_assignee_role ?? '')

  function commitTitle() {
    const trimmed = title.trim()
    if (!trimmed) {
      setTitle(task.title)
      return
    }
    if (trimmed !== task.title) onPatch({ title: trimmed })
  }

  function commitOffset() {
    const parsed = Number.parseInt(offset, 10)
    if (Number.isNaN(parsed)) {
      setOffset(String(task.offset_days))
      return
    }
    if (parsed !== task.offset_days) onPatch({ offset_days: parsed })
    setOffset(String(parsed))
  }

  function commitRole() {
    const trimmed = role.trim()
    if (trimmed !== (task.default_assignee_role ?? '')) onPatch({ default_assignee_role: trimmed || null })
  }

  return (
    <div className="group flex flex-wrap items-center gap-2 rounded-md px-1 py-1.5 text-sm hover:bg-secondary/40 sm:flex-nowrap">
      <div className="flex shrink-0 flex-col">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          aria-label={`Move "${task.title}" up`}
          className="rounded text-muted-foreground/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-20"
        >
          <ChevronUp className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          aria-label={`Move "${task.title}" down`}
          className="rounded text-muted-foreground/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-20"
        >
          <ChevronDown className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={commitTitle}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        aria-label="Task title"
        className="min-w-0 flex-1 basis-48 bg-transparent outline-none placeholder:text-muted-foreground"
      />

      <div className="flex shrink-0 items-center gap-1">
        <input
          type="number"
          value={offset}
          onChange={(e) => setOffset(e.target.value)}
          onBlur={commitOffset}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          aria-label="Days from start (negative for before start)"
          className="w-14 rounded border border-transparent bg-secondary/60 px-1.5 py-0.5 text-right text-xs outline-none focus-visible:border-ring"
        />
        <span
          className={cn(
            'w-32 shrink-0 text-xs',
            Number.parseInt(offset, 10) < 0 ? 'text-muted-foreground' : 'text-muted-foreground',
          )}
        >
          {formatOffsetDays(Number.parseInt(offset, 10) || 0)}
        </span>
      </div>

      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        onBlur={commitRole}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        placeholder="Role (e.g. Supervisor)"
        aria-label="Default assignee role"
        className="w-36 shrink-0 rounded border border-transparent bg-secondary/60 px-1.5 py-0.5 text-xs outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring"
      />

      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete "${task.title}"`}
        className="shrink-0 rounded p-1 text-muted-foreground/40 opacity-0 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring group-hover:opacity-100"
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
