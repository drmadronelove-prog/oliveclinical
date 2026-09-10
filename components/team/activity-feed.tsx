'use client'

import { useState } from 'react'
import { History, ChevronDown } from 'lucide-react'
import {
  displayName,
  formatShortDate,
  formatRelativeTime,
  type ActivityLogEntry,
  type Profile,
  type Section,
} from '@/lib/team/types'
import { PRIORITY_LABEL, type Priority } from '@/lib/team/priority'
import { cn } from '@/lib/utils'

function describe(entry: ActivityLogEntry, membersById: Map<string, Profile>, sectionsById: Map<string, Section>): string {
  const who = entry.actor_id ? displayName(membersById.get(entry.actor_id) ?? { name: null, email: 'Someone' }) : 'Someone'

  switch (entry.field) {
    case 'completed':
      return entry.new_value === 'true' ? `${who} marked this complete` : `${who} reopened this task`
    case 'assignee': {
      const from = entry.old_value ? displayName(membersById.get(entry.old_value) ?? { name: null, email: 'someone' }) : 'Unassigned'
      const to = entry.new_value ? displayName(membersById.get(entry.new_value) ?? { name: null, email: 'someone' }) : 'Unassigned'
      return `${who} reassigned this from ${from} to ${to}`
    }
    case 'due_date': {
      const to = entry.new_value ? formatShortDate(entry.new_value) : 'no date'
      return `${who} set the due date to ${to}`
    }
    case 'priority': {
      const to = PRIORITY_LABEL[(entry.new_value as Priority) ?? 'none']
      return `${who} set priority to ${to}`
    }
    case 'section': {
      const to = entry.new_value ? (sectionsById.get(entry.new_value)?.name ?? 'another section') : 'another section'
      return `${who} moved this to ${to}`
    }
    case 'title':
      return `${who} renamed this task`
    default:
      return `${who} made a change`
  }
}

export function ActivityFeed({
  entries,
  members,
  sections,
}: {
  entries: ActivityLogEntry[]
  members: Profile[]
  sections: Section[]
}) {
  const [open, setOpen] = useState(false)
  if (entries.length === 0) return null

  const membersById = new Map(members.map((m) => [m.id, m]))
  const sectionsById = new Map(sections.map((s) => [s.id, s]))

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <History className="size-3.5" aria-hidden="true" />
        Activity ({entries.length})
        <ChevronDown className={cn('size-3 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <ul className="mt-2 space-y-1.5 border-l border-border pl-3">
          {entries.map((entry) => (
            <li key={entry.id} className="text-xs text-muted-foreground">
              {describe(entry, membersById, sectionsById)}
              <span className="ml-1.5 text-muted-foreground/60">{formatRelativeTime(entry.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
