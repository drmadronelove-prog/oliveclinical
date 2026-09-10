import { notFound } from 'next/navigation'
import { requireProfile } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/team/page-header'
import type { Project, Section, Task, Profile, Tag } from '@/lib/team/types'
import { PROJECT_STATUS_LABEL } from '@/lib/team/types'
import { ProjectStatusPicker } from './project-status-picker'
import { ArchiveProjectButton } from './archive-project-button'
import { ProjectBoard } from './project-board'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireProfile()
  const supabase = await createClient()

  const [{ data: project }, { data: sections }, { data: tasks }, { data: members }, { data: allTags }] =
    await Promise.all([
      supabase.from('projects').select('*').eq('id', id).is('archived_at', null).maybeSingle(),
      supabase
        .from('sections')
        .select('*')
        .eq('project_id', id)
        .is('archived_at', null)
        .order('position', { ascending: true }),
      supabase
        .from('tasks')
        .select('*')
        .eq('project_id', id)
        .is('archived_at', null)
        .is('parent_task_id', null)
        .order('position', { ascending: true }),
      supabase.from('profiles').select('*').is('archived_at', null).order('name'),
      supabase.from('tags').select('*').is('archived_at', null).order('name'),
    ])

  if (!project) notFound()

  // A task's tags aren't a column on the task itself, so they need a
  // second query once the task ids are known — grouped here into a
  // { taskId: Tag[] } map so the board never has to think about the join
  // table underneath it.
  const taskIds = (tasks ?? []).map((t) => t.id)
  const { data: taskTagRows } =
    taskIds.length > 0
      ? await supabase.from('task_tags').select('task_id, tags(*)').in('task_id', taskIds)
      : { data: [] as { task_id: string; tags: Tag }[] }

  const initialTaskTags: Record<string, Tag[]> = {}
  for (const row of taskTagRows ?? []) {
    const tag = row.tags as unknown as Tag
    if (!tag) continue
    ;(initialTaskTags[row.task_id] ??= []).push(tag)
  }

  return (
    <>
      <PageHeader
        title={(project as Project).name}
        description={PROJECT_STATUS_LABEL[(project as Project).status]}
        actions={
          <div className="flex items-center gap-2">
            <ProjectStatusPicker projectId={project.id} status={(project as Project).status} />
            <ArchiveProjectButton projectId={project.id} projectName={(project as Project).name} />
          </div>
        }
      />
      <ProjectBoard
        project={project as Project}
        initialSections={(sections ?? []) as Section[]}
        initialTasks={(tasks ?? []) as Task[]}
        members={(members ?? []) as Profile[]}
        allTags={(allTags ?? []) as Tag[]}
        initialTaskTags={initialTaskTags}
      />
    </>
  )
}
