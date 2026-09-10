import { describe, it, expect } from 'vitest'
import { nextRecurrenceDate } from '@/lib/team/types'

describe('nextRecurrenceDate', () => {
  it('adds 7 days for weekly', () => {
    expect(nextRecurrenceDate('2026-06-10', 'weekly')).toBe('2026-06-17')
  })

  it('adds 14 days for biweekly', () => {
    expect(nextRecurrenceDate('2026-06-10', 'biweekly')).toBe('2026-06-24')
  })

  it('adds a calendar month, not a fixed day count', () => {
    expect(nextRecurrenceDate('2026-01-15', 'monthly')).toBe('2026-02-15')
  })

  it('a month-end date overflows into the next month, matching Postgres interval arithmetic', () => {
    // Jan 31 + 1 month: February has no 31st, so this rolls forward —
    // the same behavior `date + interval '1 month'` has in Postgres,
    // which is what the database trigger actually runs.
    expect(nextRecurrenceDate('2026-01-31', 'monthly')).toBe('2026-03-03')
  })

  it('adds 3 calendar months for quarterly', () => {
    expect(nextRecurrenceDate('2026-01-15', 'quarterly')).toBe('2026-04-15')
  })

  it('crosses a year boundary correctly', () => {
    expect(nextRecurrenceDate('2026-12-01', 'monthly')).toBe('2027-01-01')
    expect(nextRecurrenceDate('2026-11-01', 'quarterly')).toBe('2027-02-01')
  })
})
