/**
 * The full grid of days a month view needs to render — always starting
 * on a Sunday and ending on a Saturday, so the calendar is a clean
 * rectangle of weeks even when the 1st doesn't fall on a Sunday. Days
 * outside the target month are included on purpose — the caller renders
 * them dimmed, the same as any calendar app.
 */
export function getMonthGridDays(year: number, month: number /* 0-indexed */): Date[] {
  const firstOfMonth = new Date(year, month, 1)
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay())

  const lastOfMonth = new Date(year, month + 1, 0)
  const gridEnd = new Date(year, month, lastOfMonth.getDate() + (6 - lastOfMonth.getDay()))

  const days: Date[] = []
  const cursor = new Date(gridStart)
  while (cursor <= gridEnd) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

/** Local YYYY-MM-DD — never `toISOString()`, which can shift a day across timezones. */
export function toDateOnly(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
