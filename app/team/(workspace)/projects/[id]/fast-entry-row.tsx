'use client'

import { useRef, useState } from 'react'
import { Plus } from 'lucide-react'

/**
 * The one interaction the whole app is built around: type a title, press
 * Enter, a new empty row appears already focused. No click, no "add
 * task" button in the loop — entering ten tasks in a row should take
 * exactly ten Enters.
 *
 * `onSubmit` is expected to be optimistic and fire-and-forget from the
 * caller's side (add the task to local state immediately); this
 * component's only job is to keep capturing keystrokes without missing a
 * beat between one task and the next.
 */
export function FastEntryRow({ onSubmit }: { onSubmit: (title: string) => void }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function commit() {
    const title = value.trim()
    if (!title) return
    onSubmit(title)
    setValue('')
    // Stay in the input — this is what makes rapid entry possible.
    inputRef.current?.focus()
  }

  return (
    <div
      className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground focus-within:bg-secondary/40 hover:bg-secondary/30"
      onClick={() => inputRef.current?.focus()}
    >
      <Plus
        className={`size-4 shrink-0 transition-colors ${focused ? 'text-foreground' : 'text-muted-foreground/50'}`}
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
          }
          if (e.key === 'Escape') {
            setValue('')
            inputRef.current?.blur()
          }
        }}
        placeholder="Add task"
        aria-label="Add task"
        className="w-full min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}
