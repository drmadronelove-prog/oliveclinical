import { describe, it, expect } from 'vitest'
import { comparePriority, PRIORITY_LABEL, PRIORITY_BADGE_CLASS, type Priority } from '@/lib/team/priority'

describe('comparePriority', () => {
  it('orders high before medium before low before none', () => {
    const priorities: Priority[] = ['none', 'low', 'high', 'medium']
    const sorted = [...priorities].sort(comparePriority)
    expect(sorted).toEqual(['high', 'medium', 'low', 'none'])
  })

  it('treats equal priorities as equal', () => {
    expect(comparePriority('medium', 'medium')).toBe(0)
  })
})

describe('every priority has a label and a badge style', () => {
  const priorities: Priority[] = ['none', 'low', 'medium', 'high']
  it.each(priorities)('%s', (priority) => {
    expect(PRIORITY_LABEL[priority]).toBeTruthy()
    expect(PRIORITY_BADGE_CLASS[priority]).toBeTruthy()
  })
})
