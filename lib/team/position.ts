/**
 * Ordering for sections and tasks.
 *
 * Rather than store a 1, 2, 3, ... rank that has to be rewritten on every
 * neighbor whenever something moves, each row stores a plain number and
 * sorts by it. Moving one item means picking a new number that falls
 * between its new neighbors — the other rows never need to change.
 */

const GAP = 1024

/** The position for a new row appended to the end of a list. */
export function positionAtEnd(existingPositions: number[]): number {
  if (existingPositions.length === 0) return GAP
  return Math.max(...existingPositions) + GAP
}

/**
 * The position for a row moved between two neighbors. Either side may be
 * absent — moving to the very top or very bottom of the list.
 */
export function positionBetween(before: number | null, after: number | null): number {
  if (before === null && after === null) return GAP
  if (before === null) return after! - GAP
  if (after === null) return before + GAP
  return before + (after - before) / 2
}
