import { describe, it, expect } from 'vitest'
import { getMonthGridDays, toDateOnly } from '@/lib/team/calendar-grid'

describe('getMonthGridDays', () => {
  it('always starts on a Sunday and ends on a Saturday', () => {
    // Try every month of a year — cheap insurance against a boundary bug
    // in any one of them.
    for (let month = 0; month < 12; month++) {
      const days = getMonthGridDays(2026, month)
      expect(days[0].getDay()).toBe(0)
      expect(days[days.length - 1].getDay()).toBe(6)
      expect(days.length % 7).toBe(0)
    }
  })

  it('contains every real day of the target month', () => {
    const days = getMonthGridDays(2026, 5) // June 2026
    const juneDays = days.filter((d) => d.getMonth() === 5)
    expect(juneDays).toHaveLength(30)
    expect(toDateOnly(juneDays[0])).toBe('2026-06-01')
    expect(toDateOnly(juneDays[29])).toBe('2026-06-30')
  })

  it('handles a month that starts on a Sunday with no leading days', () => {
    // February 2026 starts on a Sunday.
    const days = getMonthGridDays(2026, 1)
    expect(toDateOnly(days[0])).toBe('2026-02-01')
  })

  it('handles the December-to-January year boundary', () => {
    const days = getMonthGridDays(2026, 11) // December 2026
    const last = days[days.length - 1]
    expect(last.getFullYear()).toBe(2027)
    expect(last.getMonth()).toBe(0)
  })

  it('handles the February leap-year length', () => {
    const days = getMonthGridDays(2028, 1) // Feb 2028 — leap year, 29 days
    const febDays = days.filter((d) => d.getMonth() === 1)
    expect(febDays).toHaveLength(29)
  })
})

describe('toDateOnly', () => {
  it('formats without any timezone shift', () => {
    expect(toDateOnly(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(toDateOnly(new Date(2026, 11, 31))).toBe('2026-12-31')
  })
})
