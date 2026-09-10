'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_DOT_CLASS, type ProjectStatus } from '@/lib/team/types'
import { updateProjectStatus } from '../actions'

export function ProjectStatusPicker({
  projectId,
  status,
}: {
  projectId: string
  status: ProjectStatus
}) {
  const [pending, startTransition] = useTransition()

  return (
    <Select
      value={status}
      disabled={pending}
      onValueChange={(value) => {
        const formData = new FormData()
        formData.set('id', projectId)
        formData.set('status', value)
        startTransition(async () => {
          await updateProjectStatus(formData)
        })
        toast.success(`Status set to ${PROJECT_STATUS_LABEL[value as ProjectStatus]}.`)
      }}
    >
      <SelectTrigger size="sm" className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(PROJECT_STATUS_LABEL) as ProjectStatus[]).map((s) => (
          <SelectItem key={s} value={s}>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className={`size-1.5 rounded-full ${PROJECT_STATUS_DOT_CLASS[s]}`} />
              {PROJECT_STATUS_LABEL[s]}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
