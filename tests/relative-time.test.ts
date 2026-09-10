import { describe, it, expect } from 'vitest'
import { formatRelativeTime } from '@/lib/team/types'

const now = new Date('2026-06-15T12:00:00')

describe('formatRelativeTime', () => {
  it('anything under a minute is "just now"', () => {
    expect(formatRelativeTime('2026-06-15T11:59:45', now)).toBe('just now')
  })

  it('minutes', () => {
    expect(formatRelativeTime('2026-06-15T11:55:00', now)).toBe('5m ago')
  })

  it('hours', () => {
    expect(formatRelativeTime('2026-06-15T09:00:00', now)).toBe('3h ago')
  })

  it('days, once past 24 hours', () => {
    expect(formatRelativeTime('2026-06-13T12:00:00', now)).toBe('2d ago')
  })

  it('falls back to a plain date after a week', () => {
    expect(formatRelativeTime('2026-06-01T12:00:00', now)).toBe('Jun 1')
  })
})
