import { notFound } from 'next/navigation'
import { requireProfile } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/team/page-header'
import type {
  Project,
  Section,
  Task,
  Profile,
  Tag,
  Comment,
  Attachment,
  ActivityLogEntry,
} from '@/lib/team/types'
import { PROJECT_STATUS_LABEL } from '@/lib/team/types'
import { ProjectStatusPicker } from './project-status-picker'
import { ArchiveProjectButton } from './archive-project-button'
import { ProjectBoard } from './project-board'

function groupByTaskId<T extends { task_id: string }>(rows: T[]): Record<string, T[]> {
  const map: Record<string, T[]> = {}
  for (const row of rows) (map[row.task_id] ??= []).push(row)
  return map
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ task?: string }>
}) {
  const { id } = await params
  const { task: deepLinkedTaskId } = await searchParams
  const currentProfile = await requireProfile()
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

  const taskIds = (tasks ?? []).map((t) => t.id)

  // Everything below is keyed by task id — tags, comments, attachments,
  // and activity are all one-to-many from a task, never a column on it.
  // Same eager, all-at-once fetch as tags used in Phase 4: the right
  // tradeoff for a project's worth of data on a team this size, even
  // though it would need to become on-demand per task if this app ever
  // grew to projects with a very large amount of history.
  const [{ data: taskTagRows }, { data: comments }, { data: attachments }, { data: activity }] =
    taskIds.length > 0
      ? await Promise.all([
          supabase.from('task_tags').select('task_id, tags(*)').in('task_id', taskIds),
          supabase
            .from('comments')
            .select('*')
            .in('task_id', taskIds)
            .is('archived_at', null)
            .order('created_at', { ascending: true }),
          supabase.from('attachments').select('*').in('task_id', taskIds).order('created_at', { ascending: true }),
          supabase
            .from('activity_log')
            .select('*')
            .in('task_id', taskIds)
            .order('created_at', { ascending: false }),
        ])
      : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }]

  const initialTaskTags: Record<string, Tag[]> = {}
  for (const row of (taskTagRows ?? []) as unknown as { task_id: string; tags: Tag }[]) {
    const tag = row.tags
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
        currentProfile={currentProfile}
        allTags={(allTags ?? []) as Tag[]}
        initialTaskTags={initialTaskTags}
        initialComments={groupByTaskId((comments ?? []) as Comment[])}
        initialAttachments={groupByTaskId((attachments ?? []) as Attachment[])}
        initialActivity={groupByTaskId((activity ?? []) as ActivityLogEntry[])}
        initialSelectedTaskId={deepLinkedTaskId ?? null}
      />
    </>
  )
}
