import { describe, it, expect } from 'vitest'
import { positionAtEnd, positionBetween } from '@/lib/team/position'

describe('positionAtEnd', () => {
  it('starts a fresh list at the base gap', () => {
    expect(positionAtEnd([])).toBe(1024)
  })

  it('always lands after every existing position', () => {
    const existing = [1024, 2048, 512]
    const next = positionAtEnd(existing)
    expect(next).toBeGreaterThan(Math.max(...existing))
  })
})

describe('positionBetween', () => {
  it('picks the midpoint between two neighbors', () => {
    expect(positionBetween(1024, 2048)).toBe(1536)
  })

  it('moving to the very top has no "before"', () => {
    const top = positionBetween(null, 1024)
    expect(top).toBeLessThan(1024)
  })

  it('moving to the very bottom has no "after"', () => {
    const bottom = positionBetween(1024, null)
    expect(bottom).toBeGreaterThan(1024)
  })

  it('an empty list has neither neighbor', () => {
    expect(positionBetween(null, null)).toBe(1024)
  })

  it('repeated inserts between the same two neighbors keep narrowing without colliding', () => {
    let before = 0
    let after = 1024
    const seen = new Set<number>()
    for (let i = 0; i < 10; i++) {
      const mid = positionBetween(before, after)
      expect(seen.has(mid)).toBe(false)
      seen.add(mid)
      after = mid // keep squeezing into the same narrowing gap
    }
  })
})
