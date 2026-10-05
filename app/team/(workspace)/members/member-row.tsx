'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
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
import { displayName, initialsOf, type Profile } from '@/lib/team/types'
import { setMemberRole, setMemberArchived, resendInvite, deleteMember } from './actions'

/**
 * One row in the Members list. A client component so Delete can ask for
 * a typed confirmation and the row can disappear the moment it succeeds
 * — the same pattern the Archived Projects list uses for its own
 * permanent delete. Role and Remove/Restore access stay plain
 * server-action forms; only Resend and Delete need local state.
 */
export function MemberRow({ member, isMe }: { member: Profile; isMe: boolean }) {
  const [gone, setGone] = useState(false)
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [resendPending, startResend] = useTransition()
  const [deletePending, startDelete] = useTransition()

  if (gone) return null

  const archived = Boolean(member.archived_at)
  const name = displayName(member)
  const nameMatches = confirmText.trim() === name

  function handleResend() {
    const formData = new FormData()
    formData.set('id', member.id)
    startResend(async () => {
      const result = await resendInvite(formData)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success(`Invitation resent to ${member.email}.`)
    })
  }

  function handleDelete() {
    const formData = new FormData()
    formData.set('id', member.id)
    startDelete(async () => {
      const result = await deleteMember(formData)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      setOpen(false)
      setGone(true) // optimistic — the row is gone from the database now too
      toast.success(`${name} was deleted.`)
    })
  }

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground"
      >
        {initialsOf(member)}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-medium">{name}</span>
          {isMe && (
            <span className="rounded bg-secondary px-1.5 py-0.5 text-[11px] text-muted-foreground">
              you
            </span>
          )}
          {archived && (
            <span className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
              Access removed
            </span>
          )}
        </span>
        <span className="block truncate text-xs text-muted-foreground">{member.email}</span>
      </span>

      <form action={setMemberRole} className="shrink-0">
        <input type="hidden" name="id" value={member.id} />
        <label htmlFor={`role-${member.id}`} className="sr-only">
          Role for {name}
        </label>
        <select
          id={`role-${member.id}`}
          name="role"
          defaultValue={member.role}
          disabled={isMe || archived}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs capitalize outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={isMe || archived}
          className="ml-1.5 rounded-md border border-border px-2 py-1 text-xs hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
        >
          Save
        </button>
      </form>

      {!isMe && !archived && (
        <Button
          variant="outline"
          size="sm"
          disabled={resendPending}
          onClick={handleResend}
          className="shrink-0 text-xs"
        >
          {resendPending ? 'Sending…' : 'Resend invitation'}
        </Button>
      )}

      {!isMe && (
        <form action={setMemberArchived} className="shrink-0">
          <input type="hidden" name="id" value={member.id} />
          <input type="hidden" name="archived" value={archived ? 'false' : 'true'} />
          <button
            type="submit"
            className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {archived ? 'Restore access' : 'Remove access'}
          </button>
        </form>
      )}

      {!isMe && (
        <AlertDialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) setConfirmText('')
          }}
        >
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 text-xs text-muted-foreground hover:text-destructive"
            >
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {name} permanently?</AlertDialogTitle>
              <AlertDialogDescription>
                This erases their account entirely — not just their access. It only works if
                they have no history in the workspace yet (no tasks, comments, or projects); if
                they do, this will fail and you should use &quot;Remove access&quot; instead,
                which keeps their history intact. Type their name to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={name}
              aria-label="Type their name to confirm"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            />
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deletePending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={!nameMatches || deletePending}
                onClick={(e) => {
                  e.preventDefault()
                  handleDelete()
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deletePending ? 'Deleting…' : 'Delete permanently'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </li>
  )
}
