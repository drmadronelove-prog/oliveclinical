'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
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
import { deleteProjectRequest } from '@/lib/team/delete-project'

/**
 * Deletes the project outright — no archive step. Type the project's
 * name to confirm, the same friction the Archived list's own delete
 * uses, appropriate since this is the only way to remove a project and
 * there is no undo.
 *
 * Calls a plain route handler over fetch rather than a server action —
 * see app/api/team/projects/[id]/route.ts for why. That also means
 * nothing re-renders this page out from under the button: it stays
 * mounted until the navigation below actually happens.
 */
export function DeleteProjectButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const nameMatches = confirmText.trim() === projectName

  function confirmDelete() {
    startTransition(async () => {
      const result = await deleteProjectRequest(projectId)
      if (!result.ok) {
        toast.error(`Couldn't delete "${projectName}": ${result.error}`)
        return
      }
      setOpen(false)
      router.push('/team/projects')
      router.refresh()
    })
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setConfirmText('')
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground hover:text-destructive">
          <Trash2 className="size-3.5" aria-hidden="true" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{projectName}" permanently?</AlertDialogTitle>
          <AlertDialogDescription>
            Every section and task in this project is deleted along with it, for good. Nobody,
            including an admin, can get it back. Type the project's name to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={projectName}
          aria-label="Type the project name to confirm"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!nameMatches || pending}
            onClick={(e) => {
              e.preventDefault()
              confirmDelete()
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {pending ? 'Deleting…' : 'Delete permanently'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
