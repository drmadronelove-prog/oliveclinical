'use client'

import { useActionState, useMemo, useState } from 'react'
import { Field, SubmitButton, FormMessage } from '@/components/team/form-controls'
import { DatePicker } from '@/components/team/date-picker'
import { AssigneePicker } from '@/components/team/assignee-picker'
import {
  formatOffsetDays,
  formatShortDate,
  addOffsetDays,
  type ProjectTemplate,
  type TemplateSection,
  type TemplateTask,
  type Profile,
} from '@/lib/team/types'
import { instantiateTemplate, type InstantiateFormState } from './actions'

export function InstantiateForm({
  template,
  sections,
  tasks,
  members,
}: {
  template: ProjectTemplate
  sections: TemplateSection[]
  tasks: TemplateTask[]
  members: Profile[]
}) {
  const [anchorDate, setAnchorDate] = useState<string | null>(null)
  const [roleMapping, setRoleMapping] = useState<Record<string, string | null>>({})
  const [state, action] = useActionState<InstantiateFormState, FormData>(instantiateTemplate, {})

  const roles = useMemo(() => {
    const set = new Set<string>()
    for (const task of tasks) if (task.default_assignee_role) set.add(task.default_assignee_role)
    return [...set].sort()
  }, [tasks])

  const tasksBySection = useMemo(() => {
    const map = new Map<string, TemplateTask[]>()
    for (const section of sections) map.set(section.id, [])
    for (const task of [...tasks].sort((a, b) => a.position - b.position)) {
      map.get(task.template_section_id)?.push(task)
    }
    return map
  }, [sections, tasks])

  const membersById = useMemo(() => new Map(members.map((m) => [m.id, m])), [members])

  return (
    <form action={action} className="grid grid-cols-1 gap-8 px-6 py-6 lg:grid-cols-[22rem_1fr]">
      <input type="hidden" name="templateId" value={template.id} />
      <input type="hidden" name="anchorDate" value={anchorDate ?? ''} />
      <input type="hidden" name="roleMapping" value={JSON.stringify(roleMapping)} />

      {/* Setup — left column, sticky so it stays visible while scrolling a long preview */}
      <section className="space-y-5 lg:sticky lg:top-6 lg:self-start">
        <Field
          label="Project name"
          name="projectName"
          autoComplete="off"
          placeholder="Onboarding — J. Rivera"
          hint="What this shows up as in Projects."
        />

        <div className="space-y-1.5">
          <span className="block text-sm font-medium">Start date</span>
          <DatePicker value={anchorDate} onChange={setAnchorDate} label="Pick a date" />
        </div>

        {roles.length > 0 && (
          <div className="space-y-2">
            <span className="block text-sm font-medium">Who fills each role</span>
            <div className="space-y-2 rounded-md border border-border p-3">
              {roles.map((role) => (
                <div key={role} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">{role}</span>
                  <AssigneePicker
                    value={roleMapping[role] ?? null}
                    onChange={(v) => setRoleMapping((prev) => ({ ...prev, [role]: v }))}
                    members={members}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Left as Unassigned is fine — you can assign it later from the project.
            </p>
          </div>
        )}

        <FormMessage error={state.error} />
        <SubmitButton pendingLabel="Creating project…">Create project</SubmitButton>
      </section>

      {/* Live preview — right column */}
      <section className="min-w-0 space-y-6">
        <h2 className="font-display text-sm font-semibold text-muted-foreground">Preview</h2>
        {sections.map((section) => {
          const sectionTasks = tasksBySection.get(section.id) ?? []
          return (
            <div key={section.id}>
              <h3 className="mb-1.5 px-1 text-sm font-semibold">{section.name}</h3>
              <ul className="divide-y divide-border rounded-md border border-border">
                {sectionTasks.map((task) => {
                  const assignee = task.default_assignee_role
                    ? membersById.get(roleMapping[task.default_assignee_role] ?? '')
                    : undefined
                  return (
                    <li
                      key={task.id}
                      className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 text-sm"
                    >
                      <span className="min-w-0 flex-1 truncate">{task.title}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {anchorDate
                          ? formatShortDate(addOffsetDays(anchorDate, task.offset_days))
                          : formatOffsetDays(task.offset_days)}
                      </span>
                      <span className="w-28 shrink-0 truncate text-xs text-muted-foreground">
                        {task.default_assignee_role
                          ? (assignee?.name ?? assignee?.email ?? task.default_assignee_role)
                          : '—'}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </section>
    </form>
  )
}
