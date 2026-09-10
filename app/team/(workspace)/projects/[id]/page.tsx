import { notFound } from 'next/navigation'
import { requireProfile } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/team/page-header'
import type { Project, Section, Task, Profile } from '@/lib/team/types'
import { PROJECT_STATUS_LABEL } from '@/lib/team/types'
import { ProjectStatusPicker } from './project-status-picker'
import { ArchiveProjectButton } from './archive-project-button'
import { ProjectBoard } from './project-board'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireProfile()
  const supabase = await createClient()

  const [{ data: project }, { data: sections }, { data: tasks }, { data: members }] =
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
    ])

  if (!project) notFound()

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
      />
    </>
  )
}
