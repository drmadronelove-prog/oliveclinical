'use client'

import { useRef, useState } from 'react'
import { AtSign, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { displayName, initialsOf, formatRelativeTime, type Comment, type Profile } from '@/lib/team/types'
import { cn } from '@/lib/utils'

export function CommentThread({
  comments,
  members,
  currentProfile,
  onSubmit,
  onDelete,
}: {
  comments: Comment[]
  members: Profile[]
  currentProfile: Profile
  onSubmit: (body: string) => void
  onDelete: (comment: Comment) => void
}) {
  const [body, setBody] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const membersById = new Map(members.map((m) => [m.id, m]))

  function insertMention(member: Profile) {
    const mention = `@${displayName(member)} `
    const el = textareaRef.current
    if (!el) {
      setBody((prev) => `${prev}${mention}`)
      return
    }
    const start = el.selectionStart ?? body.length
    const end = el.selectionEnd ?? body.length
    const next = body.slice(0, start) + mention + body.slice(end)
    setBody(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + mention.length, start + mention.length)
    })
  }

  function submit() {
    const trimmed = body.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setBody('')
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-3">
        {comments.map((comment) => {
          const author = membersById.get(comment.author_id)
          const canDelete = comment.author_id === currentProfile.id || currentProfile.role === 'admin'
          return (
            <li key={comment.id} className="group flex gap-2.5">
              <Avatar className="mt-0.5 size-6 shrink-0">
                <AvatarFallback className="text-[10px]">
                  {author ? initialsOf(author) : '?'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-medium">{author ? displayName(author) : 'Former member'}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {formatRelativeTime(comment.created_at)}
                  </span>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(comment)}
                      aria-label="Delete comment"
                      className="ml-auto rounded p-0.5 text-muted-foreground/40 opacity-0 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring group-hover:opacity-100"
                    >
                      <Trash2 className="size-3" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{comment.body}</p>
              </div>
            </li>
          )
        })}
        {comments.length === 0 && <p className="text-sm text-muted-foreground/60">No comments yet</p>}
      </ul>

      <div className="rounded-md border border-border bg-background">
        {members.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5">
            <AtSign className="size-3 text-muted-foreground/60" aria-hidden="true" />
            {members.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => insertMention(member)}
                className="rounded px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {displayName(member).split(' ')[0]}
              </button>
            ))}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="Add a comment…"
          rows={2}
          className="w-full resize-none bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className={cn('flex justify-end px-2 pb-2', !body.trim() && 'hidden')}>
          <Button size="sm" className="h-7 px-2.5 text-xs" onClick={submit}>
            Comment
          </Button>
        </div>
      </div>
    </div>
  )
}
