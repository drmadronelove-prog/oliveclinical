'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PRIORITY_ORDER, PRIORITY_LABEL, type Priority } from '@/lib/team/priority'
import { cn } from '@/lib/utils'

export function PriorityPicker({
  value,
  onChange,
  className,
}: {
  value: Priority
  onChange: (value: Priority) => void
  className?: string
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Priority)}>
      <SelectTrigger
        size="sm"
        className={cn(
          'h-7 w-auto gap-1.5 border-dashed px-2 text-xs',
          value === 'none' && 'text-muted-foreground',
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PRIORITY_ORDER.map((priority) => (
          <SelectItem key={priority} value={priority} className="text-xs">
            {PRIORITY_LABEL[priority]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
