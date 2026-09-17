'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { deleteProjectPermanently, type DeleteProjectState } from '../actions'

const initialState: DeleteProjectState = {}

/**
 * Deletes the project outright — no archive step first. Type the
 * project's name to confirm, the same friction the Archived list's own
 * "Delete permanently" already uses, appropriate here since this is the
 * only way to remove a project now and there's no undo.
 *
 * Uses useActionState + a real form, the same proven pattern
 * createProject already uses successfully (including calling
 * redirect()) — this page navigates away after deleting itself, which
 * is exactly the shape that broke badly for Archive under a hand-rolled
 * startTransition instead.
 */
export function DeleteProjectButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [state, formAction, pending] = useActionState(deleteProjectPermanently, initialState)
  const router = useRouter()
  const handledStateRef = useRef(state)

  useEffect(() => {
    if (state === handledStateRef.current) return
    handledStateRef.current = state
    if (state.ok) {
      router.push('/team/projects')
    } else if (state.error) {
      toast.error(`Couldn't delete "${projectName}": ${state.error}`)
    }
  }, [state, projectName, router])

  const nameMatches = confirmText.trim() === projectName

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
        <form action={formAction}>
          <input type="hidden" name="id" value={projectId} />
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            {/* A plain native submit button, not AlertDialogAction — that
                Radix component is only ever used elsewhere in this app
                via onClick handlers, never type="submit" inside a real
                <form>, and that exact untested combination is the prime
                suspect for delete silently doing nothing: this native
                button is the same mechanism SubmitButton (form-controls.tsx)
                already proves works, for createProject. */}
            <button
              type="submit"
              disabled={!nameMatches || pending}
              className={cn(buttonVariants(), 'bg-destructive text-destructive-foreground hover:bg-destructive/90')}
            >
              {pending ? 'Deleting…' : 'Delete permanently'}
            </button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
