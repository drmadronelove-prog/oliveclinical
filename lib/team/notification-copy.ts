import type { NotificationType } from './types'
import { displayName } from './types'

const TYPE_VERB: Record<Exclude<NotificationType, 'due_soon'>, string> = {
  assignment: 'assigned you',
  mention: 'mentioned you in',
  comment: 'commented on',
}

export type NotificationCopySource = {
  type: NotificationType
  task: { title: string } | null
  actor: { name: string | null; email: string } | null
}

/**
 * The one sentence describing a notification — "Jordan assigned you
 * Renew the fall newsletter," ""Renew the fall newsletter" is due
 * tomorrow." Shared between the Inbox list and the email sent for the
 * same notification, so the two never say something different about the
 * same event.
 *
 * A due-soon reminder has no person behind it — it's a scheduled check,
 * not something someone did — so it gets its own sentence shape instead
 * of being forced into "{actor} {verb} {task}".
 */
export function describeNotification(notification: NotificationCopySource): string {
  const taskTitle = notification.task?.title ?? 'a task'
  if (notification.type === 'due_soon') return `"${taskTitle}" is due tomorrow`
  const who = notification.actor ? displayName(notification.actor) : 'Someone'
  return `${who} ${TYPE_VERB[notification.type]} ${taskTitle}`
}

const TYPE_SUBJECT_PREFIX: Record<NotificationType, string> = {
  assignment: 'New assignment:',
  mention: 'You were mentioned:',
  comment: 'New comment:',
  due_soon: 'Due tomorrow:',
}

/** The email subject line for a notification — shorter than the sentence, task-first. */
export function notificationSubject(notification: NotificationCopySource): string {
  const taskTitle = notification.task?.title ?? 'a task'
  return `${TYPE_SUBJECT_PREFIX[notification.type]} ${taskTitle}`
}
