'use client'

import { useActionState, useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Field, SubmitButton, FormMessage } from '@/components/team/form-controls'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PROJECT_TYPE_LABEL, type ProjectType } from '@/lib/team/types'
import { createProject, type ProjectFormState } from './actions'
import { cn } from '@/lib/utils'

const COLORS = [
  { value: '#7a4f6e', name: 'Plum' },
  { value: '#c4877e', name: 'Rose' },
  { value: '#b88894', name: 'Dusk' },
  { value: '#5b6e88', name: 'Slate' },
  { value: '#9fb3b0', name: 'Glass' },
  { value: '#c5a572', name: 'Gold' },
]

export function NewProjectDialog() {
  const [open, setOpen] = useState(false)
  const [color, setColor] = useState(COLORS[0].value)
  const [state, action] = useActionState<ProjectFormState, FormData>(createProject, {})

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-4" aria-hidden="true" />
          New project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Starts with one section, "To do", ready for tasks.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <input type="hidden" name="color" value={color} />

          <Field label="Name" name="name" autoComplete="off" placeholder="Spring newsletter" />

          <div className="space-y-1.5">
            <label htmlFor="type" className="block text-sm font-medium">
              Type
            </label>
            <Select name="type" defaultValue="general">
              <SelectTrigger id="type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(PROJECT_TYPE_LABEL) as ProjectType[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {PROJECT_TYPE_LABEL[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <span className="block text-sm font-medium">Color</span>
            <div className="flex gap-2" role="radiogroup" aria-label="Project color">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  role="radio"
                  aria-checked={color === c.value}
                  aria-label={c.name}
                  onClick={() => setColor(c.value)}
                  className={cn(
                    'size-7 rounded-full ring-offset-2 ring-offset-background transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    color === c.value && 'ring-2 ring-ring',
                  )}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>

          <Field
            label="Due date"
            name="due_date"
            type="date"
            required={false}
            hint="Optional."
          />

          <FormMessage error={state.error} />
          <SubmitButton pendingLabel="Creating…">Create project</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}
