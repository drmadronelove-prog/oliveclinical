import { notFound } from 'next/navigation'
import { requireProfile } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/team/page-header'
import type { ProjectTemplate, TemplateSection, TemplateTask, Profile } from '@/lib/team/types'
import { InstantiateForm } from './instantiate-form'

export default async function InstantiatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireProfile()
  const supabase = await createClient()

  const [{ data: template }, { data: sections }, { data: tasks }, { data: members }] =
    await Promise.all([
      supabase.from('project_templates').select('*').eq('id', id).is('archived_at', null).maybeSingle(),
      supabase
        .from('template_sections')
        .select('*')
        .eq('template_id', id)
        .is('archived_at', null)
        .order('position'),
      supabase
        .from('template_tasks')
        .select('*')
        .eq('template_id', id)
        .is('archived_at', null)
        .order('position'),
      supabase.from('profiles').select('*').is('archived_at', null).order('name'),
    ])

  if (!template) notFound()

  return (
    <>
      <PageHeader
        title={`Use "${(template as ProjectTemplate).name}"`}
        description="Pick a start date and who fills each role — see the real dates before you create anything."
      />
      <InstantiateForm
        template={template as ProjectTemplate}
        sections={(sections ?? []) as TemplateSection[]}
        tasks={(tasks ?? []) as TemplateTask[]}
        members={(members ?? []) as Profile[]}
      />
    </>
  )
}
