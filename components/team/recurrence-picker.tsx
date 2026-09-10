'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RECURRENCE_LABEL, nextRecurrenceDate, formatShortDate, type RecurrenceRule } from '@/lib/team/types'
import { cn } from '@/lib/utils'

const NONE = '__none__'

export function RecurrencePicker({
  value,
  dueDate,
  onChange,
}: {
  value: RecurrenceRule | null
  dueDate: string | null
  onChange: (rule: RecurrenceRule | null) => void
}) {
  const preview = value && dueDate ? formatShortDate(nextRecurrenceDate(dueDate, value)) : null

  return (
    <div className="flex items-center gap-1.5">
      <Select value={value ?? NONE} onValueChange={(v) => onChange(v === NONE ? null : (v as RecurrenceRule))}>
        <SelectTrigger
          size="sm"
          className={cn('h-7 w-auto gap-1.5 border-dashed px-2 text-xs', !value && 'text-muted-foreground')}
        >
          <SelectValue placeholder="Repeat" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE} className="text-xs text-muted-foreground">
            Doesn't repeat
          </SelectItem>
          {(Object.keys(RECURRENCE_LABEL) as RecurrenceRule[]).map((rule) => (
            <SelectItem key={rule} value={rule} className="text-xs">
              {RECURRENCE_LABEL[rule]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {preview && <span className="text-xs text-muted-foreground">next: {preview}</span>}
      {value && !dueDate && (
        <span className="text-xs text-muted-foreground">set a due date to repeat</span>
      )}
    </div>
  )
}
