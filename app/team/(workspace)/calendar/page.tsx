import { requireProfile } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/team/page-header'
import type { Project, Task, Profile, Tag } from '@/lib/team/types'
import { CalendarView } from './calendar-view'

export const metadata = { title: 'Calendar — Olive Team', robots: { index: false } }

export default async function CalendarPage() {
  await requireProfile()
  const supabase = await createClient()

  const [{ data: projects }, { data: tasks }, { data: members }, { data: tags }] = await Promise.all([
    supabase.from('projects').select('*').is('archived_at', null),
    supabase
      .from('tasks')
      .select('*')
      .is('archived_at', null)
      .not('due_date', 'is', null)
      .is('parent_task_id', null),
    supabase.from('profiles').select('*').is('archived_at', null).order('name'),
    supabase.from('tags').select('*').is('archived_at', null).order('name'),
  ])

  const taskIds = (tasks ?? []).map((t) => t.id)
  const { data: taskTagRows } =
    taskIds.length > 0
      ? await supabase.from('task_tags').select('task_id, tag_id').in('task_id', taskIds)
      : { data: [] as { task_id: string; tag_id: string }[] }

  const taskTagIds: Record<string, string[]> = {}
  for (const row of taskTagRows ?? []) {
    ;(taskTagIds[row.task_id] ??= []).push(row.tag_id)
  }

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Everything with a due date, across every project — the marketing planning surface."
      />
      <CalendarView
        projects={(projects ?? []) as Project[]}
        initialTasks={(tasks ?? []) as Task[]}
        members={(members ?? []) as Profile[]}
        tags={(tags ?? []) as Tag[]}
        taskTagIds={taskTagIds}
      />
    </>
  )
}
