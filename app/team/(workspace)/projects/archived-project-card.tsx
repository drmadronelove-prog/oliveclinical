'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Undo2, Trash2 } from 'lucide-react'
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
import { PROJECT_TYPE_LABEL, type Project } from '@/lib/team/types'
import { restoreProject, deleteProjectPermanently } from './actions'

export function ArchivedProjectCard({ project }: { project: Project }) {
  const [gone, setGone] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [pending, startTransition] = useTransition()

  if (gone) return null

  function handleRestore() {
    const formData = new FormData()
    formData.set('id', project.id)
    startTransition(() => restoreProject(formData))
    setGone(true) // optimistic — this list only ever holds archived projects, so a restored one always leaves it
  }

  function handleDeletePermanently() {
    const formData = new FormData()
    formData.set('id', project.id)
    startTransition(async () => {
      const result = await deleteProjectPermanently(formData)
      if (!result.ok) {
        toast.error(`Couldn't delete "${project.name}": ${result.error}`)
        return
      }
      setGone(true)
    })
  }

  const nameMatches = confirmText.trim() === project.name

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <span
        aria-hidden="true"
        className="size-2.5 shrink-0 rounded-full opacity-50"
        style={{ backgroundColor: project.color }}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{project.name}</span>
        <span className="block text-xs text-muted-foreground">{PROJECT_TYPE_LABEL[project.type]}</span>
      </span>

      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        disabled={pending}
        onClick={handleRestore}
      >
        <Undo2 className="size-3.5" aria-hidden="true" />
        Restore
      </Button>

      <AlertDialog onOpenChange={(open) => !open && setConfirmText('')}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-destructive"
            disabled={pending}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Delete permanently
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{project.name}" permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This is different from Archive — every section and task in this project is
              deleted along with it, for good. Nobody, including an admin, can get it back.
              Type the project's name to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={project.name}
            aria-label="Type the project name to confirm"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!nameMatches || pending}
              onClick={(e) => {
                e.preventDefault()
                handleDeletePermanently()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
