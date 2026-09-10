import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatShortDate, isOverdue } from '@/lib/team/types'

describe('formatShortDate', () => {
  it('formats a date-only string without shifting a day', () => {
    // A classic bug: new Date("2026-03-14") is parsed as UTC midnight,
    // which prints as Mar 13 in any timezone behind UTC. This must not
    // happen regardless of where the server or browser runs.
    expect(formatShortDate('2026-03-14')).toBe('Mar 14')
    expect(formatShortDate('2026-01-01')).toBe('Jan 1')
    expect(formatShortDate('2026-12-31')).toBe('Dec 31')
  })

  it('returns null for no date', () => {
    expect(formatShortDate(null)).toBeNull()
  })
})

describe('isOverdue', () => {
  afterEach(() => vi.useRealTimers())

  it('a past due date on an open task is overdue', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15))
    expect(isOverdue('2026-06-14', false)).toBe(true)
  })

  it('a completed task is never overdue', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15))
    expect(isOverdue('2026-06-14', true)).toBe(false)
  })

  it('today is not yet overdue', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15))
    expect(isOverdue('2026-06-15', false)).toBe(false)
  })

  it('no due date is never overdue', () => {
    expect(isOverdue(null, false)).toBe(false)
  })
})
