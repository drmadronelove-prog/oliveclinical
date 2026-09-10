import { requireProfile } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/team/page-header'
import { InboxList } from './inbox-list'

export const metadata = { title: 'Inbox — Olive Team', robots: { index: false } }

export type NotificationRow = {
  id: string
  type: 'assignment' | 'mention' | 'comment' | 'due_soon'
  read_at: string | null
  created_at: string
  task: { id: string; title: string; project_id: string } | null
  actor: { id: string; name: string | null; email: string } | null
}

export default async function InboxPage() {
  const profile = await requireProfile()
  const supabase = await createClient()

  const { data } = await supabase
    .from('notifications')
    .select('id, type, read_at, created_at, task:tasks(id, title, project_id), actor:profiles!actor_id(id, name, email)')
    .eq('recipient_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <>
      <PageHeader title="Inbox" description="Assignments, mentions, comments, and due-soon reminders." />
      <InboxList initialNotifications={(data ?? []) as unknown as NotificationRow[]} />
    </>
  )
}
