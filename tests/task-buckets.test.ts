import { describe, it, expect } from 'vitest'
import { bucketTaskDate } from '@/lib/team/types'

// A fixed Wednesday, so "this week" has days on both sides of it.
const WEDNESDAY = new Date(2026, 5, 17) // June 17, 2026 is a Wednesday

describe('bucketTaskDate', () => {
  it('no due date goes to Later', () => {
    expect(bucketTaskDate(null, WEDNESDAY)).toBe('later')
  })

  it('a past date is Overdue', () => {
    expect(bucketTaskDate('2026-06-16', WEDNESDAY)).toBe('overdue')
    expect(bucketTaskDate('2026-06-01', WEDNESDAY)).toBe('overdue')
  })

  it('the reference date itself is Today', () => {
    expect(bucketTaskDate('2026-06-17', WEDNESDAY)).toBe('today')
  })

  it('later this same week is This week', () => {
    expect(bucketTaskDate('2026-06-18', WEDNESDAY)).toBe('this_week') // Thursday
    expect(bucketTaskDate('2026-06-21', WEDNESDAY)).toBe('this_week') // Sunday
  })

  it('next week is Later', () => {
    expect(bucketTaskDate('2026-06-22', WEDNESDAY)).toBe('later') // Monday
    expect(bucketTaskDate('2026-07-01', WEDNESDAY)).toBe('later')
  })

  it('on a Sunday, "this week" has nothing left but today', () => {
    const sunday = new Date(2026, 5, 21)
    expect(bucketTaskDate('2026-06-21', sunday)).toBe('today')
    expect(bucketTaskDate('2026-06-22', sunday)).toBe('later')
  })

  it('on a Monday, the whole week through Sunday counts', () => {
    const monday = new Date(2026, 5, 22)
    expect(bucketTaskDate('2026-06-28', monday)).toBe('this_week') // Sunday
    expect(bucketTaskDate('2026-06-29', monday)).toBe('later') // next Monday
  })
})
