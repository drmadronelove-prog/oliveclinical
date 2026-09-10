'use client'

import { UserCircle2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { displayName, initialsOf, type Profile } from '@/lib/team/types'
import { cn } from '@/lib/utils'

const UNASSIGNED = '__unassigned__'

export function AssigneePicker({
  value,
  onChange,
  members,
  className,
}: {
  value: string | null
  onChange: (value: string | null) => void
  members: Profile[]
  className?: string
}) {
  const assignee = members.find((m) => m.id === value)

  return (
    <Select
      value={value ?? UNASSIGNED}
      onValueChange={(v) => onChange(v === UNASSIGNED ? null : v)}
    >
      <SelectTrigger
        size="sm"
        className={cn(
          'h-7 w-auto gap-1.5 border-dashed px-2 text-xs',
          !assignee && 'text-muted-foreground',
          className,
        )}
      >
        {assignee ? (
          <span className="flex items-center gap-1.5">
            <Avatar className="size-4">
              <AvatarFallback className="text-[9px]">{initialsOf(assignee)}</AvatarFallback>
            </Avatar>
            <span className="max-w-24 truncate">{displayName(assignee).split(' ')[0]}</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <UserCircle2 className="size-3.5" aria-hidden="true" />
            <SelectValue placeholder="Assignee" />
          </span>
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={UNASSIGNED} className="text-xs text-muted-foreground">
          Unassigned
        </SelectItem>
        {members.map((member) => (
          <SelectItem key={member.id} value={member.id} className="text-xs">
            {displayName(member)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
