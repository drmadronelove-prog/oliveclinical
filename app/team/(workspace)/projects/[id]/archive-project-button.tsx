'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
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
import { archiveProject, type ArchiveProjectState } from '../actions'

const initialState: ArchiveProjectState = {}

export function ArchiveProjectButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(archiveProject, initialState)
  const router = useRouter()
  // useActionState re-delivers the same state object on every render, not
  // just when it actually changes — this is how the effect below tells
  // "the action just resolved" from "this component merely re-rendered."
  const handledStateRef = useRef(state)

  useEffect(() => {
    if (state === handledStateRef.current) return
    handledStateRef.current = state
    if (state.ok) {
      router.push('/team/projects')
    } else if (state.error) {
      toast.error(`Couldn't archive that project: ${state.error}`)
    }
  }, [state, router])

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
        {/* A real form + useActionState, not a manually-built FormData
            passed to a bare async function — the same pattern
            NewProjectDialog already uses successfully (including calling
            redirect() from the action), so Next's own action lifecycle
            handles submission and pending state instead of this
            component reimplementing pieces of it by hand. */}
        <form action={formAction}>
          <input type="hidden" name="id" value={projectId} />
          <input type="hidden" name="archived" value="true" />
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={pending}>
              {pending ? 'Archiving…' : 'Archive project'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
