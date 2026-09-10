import { describe, it, expect } from 'vitest'
import { formatOffsetDays, addOffsetDays } from '@/lib/team/types'

describe('formatOffsetDays', () => {
  it('labels zero as the start day itself', () => {
    expect(formatOffsetDays(0)).toBe('Start day')
  })

  it('labels a negative offset as before start', () => {
    expect(formatOffsetDays(-14)).toBe('14 days before start')
    expect(formatOffsetDays(-1)).toBe('1 day before start')
  })

  it('labels a positive offset as after start', () => {
    expect(formatOffsetDays(30)).toBe('30 days after start')
    expect(formatOffsetDays(1)).toBe('1 day after start')
  })
})

describe('addOffsetDays', () => {
  it('adds a positive offset', () => {
    expect(addOffsetDays('2026-06-01', 30)).toBe('2026-07-01')
  })

  it('subtracts a negative offset', () => {
    expect(addOffsetDays('2026-06-15', -14)).toBe('2026-06-01')
  })

  it('a zero offset returns the anchor date unchanged', () => {
    expect(addOffsetDays('2026-06-15', 0)).toBe('2026-06-15')
  })

  it('crosses a month boundary correctly', () => {
    expect(addOffsetDays('2026-01-20', 14)).toBe('2026-02-03')
  })

  it('crosses a year boundary correctly', () => {
    expect(addOffsetDays('2026-12-20', 14)).toBe('2027-01-03')
  })

  it('a negative offset crossing back into the previous month', () => {
    expect(addOffsetDays('2026-03-05', -10)).toBe('2026-02-23')
  })

  it('handles the February leap-year boundary', () => {
    // 2028 is a leap year — Feb 29 exists.
    expect(addOffsetDays('2028-02-20', 10)).toBe('2028-03-01')
  })
})
