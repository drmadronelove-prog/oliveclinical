'use client'

import { useState } from 'react'
import { History, ChevronDown } from 'lucide-react'
import { formatRelativeTime, type ActivityLogEntry, type Profile, type Section } from '@/lib/team/types'
import { describeActivity } from '@/lib/team/activity-copy'
import { cn } from '@/lib/utils'

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
              {describeActivity(entry, { membersById, sectionsById })}
              <span className="ml-1.5 text-muted-foreground/60">{formatRelativeTime(entry.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
