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
import { createTemplate, type TemplateFormState } from './actions'

export function NewTemplateDialog() {
  const [open, setOpen] = useState(false)
  const [state, action] = useActionState<TemplateFormState, FormData>(createTemplate, {})

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-4" aria-hidden="true" />
          New template
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New template</DialogTitle>
          <DialogDescription>
            Starts with one section, "Pre-start," ready for tasks.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <Field label="Name" name="name" autoComplete="off" placeholder="Clinical hire onboarding" />
          <FormMessage error={state.error} />
          <SubmitButton pendingLabel="Creating…">Create template</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}
