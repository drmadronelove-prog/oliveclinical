'use client'

import { useEffect, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'

/**
 * Shared between the project board and the template editor — both group
 * their items (tasks, or template tasks) into named, reorderable-by-name
 * sections with the same rename/delete interaction. Only `name` is used
 * here, so either a real Section or a TemplateSection satisfies this.
 */
export function SectionHeader({
  section,
  taskCount,
  onRename,
  onDelete,
}: {
  section: { name: string }
  taskCount: number
  onRename: (name: string) => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(section.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  function commit() {
    setEditing(false)
    const trimmed = name.trim()
    if (!trimmed) {
      setName(section.name)
      return
    }
    if (trimmed !== section.name) onRename(trimmed)
  }

  return (
    <div className="group mb-1 flex items-center gap-1.5 px-1">
      {editing ? (
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              commit()
            }
            if (e.key === 'Escape') {
              setName(section.name)
              setEditing(false)
            }
          }}
          aria-label="Section name"
          className="rounded bg-secondary px-1 font-display text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded px-1 font-display text-sm font-semibold text-muted-foreground hover:bg-secondary/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {section.name}
          <span className="ml-1.5 font-sans font-normal text-muted-foreground/60">{taskCount}</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          if (taskCount > 0) {
            onDelete() // server still refuses and explains why — this just skips an unnecessary confirm for the common "can't" case
            return
          }
          if (window.confirm(`Delete the "${section.name}" section?`)) onDelete()
        }}
        aria-label={`Delete section "${section.name}"`}
        className="rounded p-1 text-muted-foreground/40 opacity-0 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring group-hover:opacity-100"
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
