import Link from 'next/link'
import { ListChecks, Copy, Zap } from 'lucide-react'
import { requireProfile } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/team/page-header'
import type { ProjectTemplate } from '@/lib/team/types'
import { NewTemplateDialog } from './new-template-dialog'
import { duplicateTemplate } from './actions'

export const metadata = { title: 'Templates — Olive Team', robots: { index: false } }

export default async function TemplatesPage() {
  await requireProfile()
  const supabase = await createClient()

  const { data } = await supabase
    .from('project_templates')
    .select('*')
    .is('archived_at', null)
    .order('created_at', { ascending: true })

  const templates = (data ?? []) as ProjectTemplate[]

  return (
    <>
      <PageHeader
        title="Templates"
        description="Reusable recipes for a project. Onboarding a new hire is the big one — instantiate it once per person."
        actions={<NewTemplateDialog />}
      />

      <div className="px-6 py-8">
        {templates.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
            <ListChecks className="mx-auto size-8 text-muted-foreground/50" aria-hidden="true" />
            <h2 className="mt-4 font-display text-base font-semibold">No templates yet</h2>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
              A template is a project you can generate more than once — a new hire's onboarding,
              a recurring campaign kickoff, anything with the same shape every time.
            </p>
            <div className="mt-5 flex justify-center">
              <NewTemplateDialog />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <div key={template.id} className="rounded-lg border border-border bg-card p-4">
                <Link
                  href={`/team/templates/${template.id}`}
                  className="block font-display text-sm font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {template.name}
                </Link>
                {template.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {template.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/team/templates/${template.id}/instantiate`}
                    className="flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <Zap className="size-3.5" aria-hidden="true" />
                    Use template
                  </Link>
                  <form action={duplicateTemplate}>
                    <input type="hidden" name="id" value={template.id} />
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <Copy className="size-3.5" aria-hidden="true" />
                      Duplicate
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
