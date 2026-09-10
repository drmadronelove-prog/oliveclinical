import { requireProfile } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/team/page-header'
import type { Project, Task } from '@/lib/team/types'
import { MyTasksList } from './my-tasks-list'

export const metadata = { title: 'My Tasks — Olive Team', robots: { index: false } }

export default async function MyTasksPage() {
  const profile = await requireProfile()
  const supabase = await createClient()

  const [{ data: tasks }, { data: projects }] = await Promise.all([
    supabase
      .from('tasks')
      .select('*')
      .eq('assignee_id', profile.id)
      .eq('completed', false)
      .is('archived_at', null)
      .is('parent_task_id', null),
    supabase.from('projects').select('*').is('archived_at', null),
  ])

  return (
    <>
      <PageHeader title="My Tasks" description="Everything assigned to you, across every project." />
      <MyTasksList initialTasks={(tasks ?? []) as Task[]} projects={(projects ?? []) as Project[]} />
    </>
  )
}
