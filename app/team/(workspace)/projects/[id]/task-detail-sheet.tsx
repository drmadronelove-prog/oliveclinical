'use client'

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/team/date-picker'
import { PriorityPicker } from '@/components/team/priority-picker'
import { AssigneePicker } from '@/components/team/assignee-picker'
import { RichTextEditor } from '@/components/team/rich-text-editor'
import { TagPicker } from '@/components/team/tag-picker'
import { RecurrencePicker } from '@/components/team/recurrence-picker'
import { CommentThread } from '@/components/team/comment-thread'
import { AttachmentList } from '@/components/team/attachment-list'
import { ActivityFeed } from '@/components/team/activity-feed'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type {
  Task,
  Profile,
  Section,
  Tag,
  Comment,
  Attachment,
  ActivityLogEntry,
} from '@/lib/team/types'
import type { Priority } from '@/lib/team/priority'

/** Tiptap's "nothing typed" state is `<p></p>`, not an empty string. */
function isEmptyHtml(html: string): boolean {
  return html.replace(/<p>\s*<\/p>/g, '').trim() === ''
}

export function TaskDetailSheet({
  task,
  members,
  sections,
  currentProfile,
  allTags,
  selectedTags,
  comments,
  attachments,
  activity,
  onClose,
  onPatch,
  onToggleComplete,
  onDelete,
  onMoveSection,
  onTagsChange,
  onCreateTag,
  onCreateComment,
  onDeleteComment,
  onAttachmentUploaded,
  onDeleteAttachment,
}: {
  task: Task | null
  members: Profile[]
  sections: Section[]
  currentProfile: Profile
  allTags: Tag[]
  selectedTags: Tag[]
  comments: Comment[]
  attachments: Attachment[]
  activity: ActivityLogEntry[]
  onClose: () => void
  onPatch: (id: string, patch: Partial<Task>) => void
  onToggleComplete: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onMoveSection: (id: string, sectionId: string) => void
  onTagsChange: (id: string, tagIds: string[]) => void
  onCreateTag: (name: string) => Promise<Tag | null>
  onCreateComment: (taskId: string, body: string) => void
  onDeleteComment: (comment: Comment) => void
  onAttachmentUploaded: (taskId: string, file: File, storagePath: string) => Promise<void>
  onDeleteAttachment: (attachment: Attachment) => void
}) {
  const [title, setTitle] = useState('')
  const membersById = new Map(members.map((m) => [m.id, m]))

  // Local editable copy of the title, resynced whenever a different task
  // is opened — typing in one task must never leak into the next one you
  // click. The rich text editor handles this itself, via the `key` prop
  // below forcing a fresh instance per task.
  useEffect(() => {
    setTitle(task?.title ?? '')
  }, [task?.id])

  if (!task) return null

  function commitTitle() {
    const trimmed = title.trim()
    if (!trimmed || trimmed === task!.title) {
      setTitle(task!.title)
      return
    }
    onPatch(task!.id, { title: trimmed })
  }

  function commitDescription(html: string) {
    const next = isEmptyHtml(html) ? null : html
    if (next === (task!.description ?? null)) return
    onPatch(task!.id, { description: next })
  }

  return (
    <Sheet open={Boolean(task)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="sr-only">Task details</SheetTitle>
          <SheetDescription className="sr-only">
            Edit this task's title, description, assignee, dates, priority, tags, and
            recurrence. Comment, attach files, and review its activity below.
          </SheetDescription>
          <div className="flex items-start gap-2.5">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => onToggleComplete(task.id, checked === true)}
              className="mt-1.5 size-4"
              aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
            />
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  e.currentTarget.blur()
                }
              }}
              rows={1}
              aria-label="Task title"
              className="w-full resize-none bg-transparent font-display text-base font-semibold leading-snug outline-none placeholder:text-muted-foreground"
            />
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <div className="flex flex-wrap gap-2">
            <AssigneePicker
              value={task.assignee_id}
              onChange={(v) => onPatch(task.id, { assignee_id: v })}
              members={members}
            />
            <DatePicker
              value={task.due_date}
              onChange={(v) => onPatch(task.id, { due_date: v })}
              label="Due date"
            />
            <PriorityPicker
              value={task.priority as Priority}
              onChange={(v) => onPatch(task.id, { priority: v })}
            />
            {/* The keyboard-accessible way to move a task to a different
                section — dragging works too, but this needs no drag
                gesture at all. */}
            <Select value={task.section_id} onValueChange={(v) => onMoveSection(task.id, v)}>
              <SelectTrigger size="sm" className="h-7 w-auto gap-1.5 border-dashed px-2 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id} className="text-xs">
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <RecurrencePicker
            value={task.recurrence_rule}
            dueDate={task.due_date}
            onChange={(rule) => onPatch(task.id, { recurrence_rule: rule })}
          />

          <TagPicker
            selected={selectedTags}
            allTags={allTags}
            onChange={(tagIds) => onTagsChange(task.id, tagIds)}
            onCreateTag={onCreateTag}
          />

          <div className="space-y-1.5">
            <span className="block text-xs font-medium text-muted-foreground">Description</span>
            <RichTextEditor
              key={task.id}
              content={task.description ?? ''}
              onChange={commitDescription}
            />
          </div>

          <div className="space-y-1.5">
            <span className="block text-xs font-medium text-muted-foreground">Attachments</span>
            <AttachmentList
              taskId={task.id}
              attachments={attachments}
              membersById={membersById}
              onUploaded={(file, storagePath) => onAttachmentUploaded(task.id, file, storagePath)}
              onDelete={onDeleteAttachment}
            />
          </div>

          <ActivityFeed entries={activity} members={members} sections={sections} />

          <div className="space-y-1.5 border-t border-border pt-4">
            <span className="block text-xs font-medium text-muted-foreground">Comments</span>
            <CommentThread
              comments={comments}
              members={members}
              currentProfile={currentProfile}
              onSubmit={(body) => onCreateComment(task.id, body)}
              onDelete={onDeleteComment}
            />
          </div>
        </div>

        <div className="border-t border-border px-5 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
            onClick={() => {
              onDelete(task.id)
              onClose()
            }}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Delete task
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
