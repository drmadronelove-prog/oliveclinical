'use client'

import { useState, useTransition } from 'react'
import { Archive } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { archiveTemplate } from '../actions'

export function ArchiveTemplateButton({
  templateId,
  templateName,
}: {
  templateId: string
  templateName: string
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function confirmArchive() {
    const formData = new FormData()
    formData.set('id', templateId)
    startTransition(async () => {
      await archiveTemplate(formData)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
          <Archive className="size-3.5" aria-hidden="true" />
          Archive
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive "{templateName}"?</AlertDialogTitle>
          <AlertDialogDescription>
            It disappears from Templates, but every project already made from it is
            untouched — instantiating copies a template's shape once, it doesn't stay linked.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              confirmArchive()
            }}
            disabled={pending}
          >
            {pending ? 'Archiving…' : 'Archive template'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
