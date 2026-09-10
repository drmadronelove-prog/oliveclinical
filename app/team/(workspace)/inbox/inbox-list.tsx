'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AtSign, MessageSquare, UserPlus, Clock, Inbox as InboxIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { displayName } from '@/lib/team/types'
import { formatRelativeTime } from '@/lib/team/types'
import { markNotificationRead, markAllNotificationsRead } from './actions'
import type { NotificationRow } from './page'
import { cn } from '@/lib/utils'

const TYPE_ICON = { assignment: UserPlus, mention: AtSign, comment: MessageSquare, due_soon: Clock } as const

const TYPE_VERB = {
  assignment: 'assigned you',
  mention: 'mentioned you in',
  comment: 'commented on',
} as const

/**
 * A due-soon reminder has no person behind it — it's a scheduled check,
 * not something someone did — so it gets its own sentence shape instead
 * of being forced into "{actor} {verb} {task}".
 */
function describeNotification(notification: NotificationRow): string {
  const taskTitle = notification.task?.title ?? 'a task'
  if (notification.type === 'due_soon') return `"${taskTitle}" is due tomorrow`
  const who = notification.actor ? displayName(notification.actor) : 'Someone'
  return `${who} ${TYPE_VERB[notification.type]} ${taskTitle}`
}

export function InboxList({ initialNotifications }: { initialNotifications: NotificationRow[] }) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const router = useRouter()

  const unreadCount = notifications.filter((n) => !n.read_at).length

  function open(notification: NotificationRow) {
    if (!notification.read_at) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n)),
      )
      markNotificationRead(notification.id)
    }
    if (notification.task) {
      router.push(`/team/projects/${notification.task.project_id}?task=${notification.task.id}`)
    }
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => (n.read_at ? n : { ...n, read_at: new Date().toISOString() })))
    markAllNotificationsRead()
  }

  if (notifications.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <InboxIcon className="mx-auto size-8 text-muted-foreground/50" aria-hidden="true" />
        <h2 className="mt-4 font-display text-base font-semibold">Nothing here yet</h2>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
          Assignments, @mentions, comments on your tasks, and due-tomorrow reminders show up
          here as they happen.
        </p>
      </div>
    )
  }

  return (
    <div className="px-6 py-6">
      {unreadCount > 0 && (
        <div className="mb-3 flex justify-end">
          <Button variant="outline" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        </div>
      )}
      <ul className="divide-y divide-border rounded-lg border border-border">
        {notifications.map((notification) => {
          const Icon = TYPE_ICON[notification.type]
          const unread = !notification.read_at
          return (
            <li key={notification.id}>
              <button
                type="button"
                onClick={() => open(notification)}
                className={cn(
                  'flex w-full items-start gap-3 px-4 py-3 text-left text-sm hover:bg-secondary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  unread && 'bg-primary/5',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-1.5 size-1.5 shrink-0 rounded-full',
                    unread ? 'bg-primary' : 'bg-transparent',
                  )}
                />
                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className={cn(unread && 'font-medium')}>{describeNotification(notification)}</span>
                  <span className="block text-xs text-muted-foreground">
                    {formatRelativeTime(notification.created_at)}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
