'use client'

import { CalendarIcon, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatShortDate } from '@/lib/team/types'

/** Local YYYY-MM-DD — never `toISOString()`, which can shift a day across timezones. */
function toDateOnly(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function DatePicker({
  value,
  onChange,
  label,
  className,
}: {
  value: string | null
  onChange: (value: string | null) => void
  label?: string
  className?: string
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-7 justify-start gap-1.5 border-dashed px-2 text-xs font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="size-3.5" aria-hidden="true" />
          {value ? formatShortDate(value) : (label ?? 'Date')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? parseDateOnly(value) : undefined}
          onSelect={(date) => onChange(date ? toDateOnly(date) : null)}
          autoFocus
        />
        {value && (
          <div className="border-t border-border p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-1.5 text-xs text-muted-foreground"
              onClick={() => onChange(null)}
            >
              <X className="size-3.5" aria-hidden="true" />
              Clear date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
