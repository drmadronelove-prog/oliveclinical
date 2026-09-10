import { describe, it, expect } from 'vitest'
import { describeNotification, notificationSubject } from '@/lib/team/notification-copy'
import type { NotificationCopySource } from '@/lib/team/notification-copy'

const jordan = { name: 'Jordan Rivera', email: 'jordan@example.com' }
const task = { title: 'Renew the fall newsletter' }

function source(overrides: Partial<NotificationCopySource>): NotificationCopySource {
  return { type: 'assignment', task, actor: jordan, ...overrides }
}

describe('describeNotification', () => {
  it('describes an assignment', () => {
    expect(describeNotification(source({ type: 'assignment' }))).toBe(
      'Jordan Rivera assigned you Renew the fall newsletter',
    )
  })

  it('describes a mention', () => {
    expect(describeNotification(source({ type: 'mention' }))).toBe(
      'Jordan Rivera mentioned you in Renew the fall newsletter',
    )
  })

  it('describes a comment', () => {
    expect(describeNotification(source({ type: 'comment' }))).toBe(
      'Jordan Rivera commented on Renew the fall newsletter',
    )
  })

  it('gives a due-soon reminder its own shape, with no actor', () => {
    expect(describeNotification(source({ type: 'due_soon', actor: null }))).toBe(
      '"Renew the fall newsletter" is due tomorrow',
    )
  })

  it('falls back to "Someone" when the actor is missing', () => {
    expect(describeNotification(source({ type: 'assignment', actor: null }))).toBe(
      'Someone assigned you Renew the fall newsletter',
    )
  })

  it('falls back to "a task" when the task is missing', () => {
    expect(describeNotification(source({ type: 'comment', task: null }))).toBe(
      'Jordan Rivera commented on a task',
    )
  })
})

describe('notificationSubject', () => {
  it('leads with a type-specific prefix and the task title', () => {
    expect(notificationSubject(source({ type: 'assignment' }))).toBe(
      'New assignment: Renew the fall newsletter',
    )
    expect(notificationSubject(source({ type: 'due_soon' }))).toBe(
      'Due tomorrow: Renew the fall newsletter',
    )
  })

  it('falls back to "a task" when the task is missing', () => {
    expect(notificationSubject(source({ type: 'mention', task: null }))).toBe(
      'You were mentioned: a task',
    )
  })
})
