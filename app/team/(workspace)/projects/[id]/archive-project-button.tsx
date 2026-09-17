'use client'

import { useEffect, useState, useTransition } from 'react'
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
  const [archived, setArchived] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  // Navigating away lives in its own effect, outside the transition that
  // runs the action — this is the one place in the app that both mutates
  // through a server action AND leaves the page it was called from.
  // Calling router.push() inside the same startTransition as the action
  // raced against Next's own automatic refresh of this now-archived
  // project's page and surfaced as a crash instead of a clean redirect;
  // letting the transition finish first and navigating in a separate
  // effect avoids that entirely.
  useEffect(() => {
    if (archived) router.push('/team/projects')
  }, [archived, router])

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
      setArchived(true)
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
