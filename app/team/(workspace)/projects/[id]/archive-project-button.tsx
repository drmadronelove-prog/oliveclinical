'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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
import { archiveProject } from '../actions'

export function ArchiveProjectButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function confirmArchive() {
    const formData = new FormData()
    formData.set('id', projectId)
    formData.set('archived', 'true')
    startTransition(async () => {
      const result = await archiveProject(formData)
      if (!result.ok) {
        toast.error(`Couldn't archive that project: ${result.error}`)
        return
      }
      setOpen(false)
      router.push('/team/projects')
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
          <AlertDialogTitle>Archive "{projectName}"?</AlertDialogTitle>
          <AlertDialogDescription>
            It disappears from the projects list, but nothing is deleted — every task and its
            history stays intact. Restore it any time from Projects → Archived, or delete it there
            for good once you're sure.
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
            {pending ? 'Archiving…' : 'Archive project'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
