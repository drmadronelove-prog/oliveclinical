import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { requireProfile } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/team/page-header'
import type { ProjectTemplate, TemplateSection, TemplateTask } from '@/lib/team/types'
import { TemplateEditor } from './template-editor'
import { ArchiveTemplateButton } from './archive-template-button'

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireProfile()
  const supabase = await createClient()

  const [{ data: template }, { data: sections }, { data: tasks }] = await Promise.all([
    supabase.from('project_templates').select('*').eq('id', id).is('archived_at', null).maybeSingle(),
    supabase
      .from('template_sections')
      .select('*')
      .eq('template_id', id)
      .is('archived_at', null)
      .order('position', { ascending: true }),
    supabase
      .from('template_tasks')
      .select('*')
      .eq('template_id', id)
      .is('archived_at', null)
      .order('position', { ascending: true }),
  ])

  if (!template) notFound()

  return (
    <>
      <PageHeader
        title={(template as ProjectTemplate).name}
        description="Editing this template never changes a project already made from it."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href={`/team/templates/${id}/instantiate`}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Zap className="size-3.5" aria-hidden="true" />
              Use template
            </Link>
            <ArchiveTemplateButton templateId={id} templateName={(template as ProjectTemplate).name} />
          </div>
        }
      />
      <TemplateEditor
        template={template as ProjectTemplate}
        initialSections={(sections ?? []) as TemplateSection[]}
        initialTasks={(tasks ?? []) as TemplateTask[]}
      />
    </>
  )
}
