'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Paperclip, Download, Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Attachment, Profile } from '@/lib/team/types'
import { displayName } from '@/lib/team/types'

function formatFileSize(bytes: number | null): string {
  if (bytes === null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// A shared internal tool's own files — no reason to accept anything
// that could be an executable rather than a document.
const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.sh', '.msi', '.app']
const MAX_FILE_BYTES = 25 * 1024 * 1024 // 25 MB

export function AttachmentList({
  taskId,
  attachments,
  membersById,
  onUploaded,
  onDelete,
}: {
  taskId: string
  attachments: Attachment[]
  membersById: Map<string, Profile>
  onUploaded: (file: File, storagePath: string) => Promise<void>
  onDelete: (attachment: Attachment) => void
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(file: File | undefined) {
    if (!file) return
    const lower = file.name.toLowerCase()
    if (BLOCKED_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
      toast.error("That file type isn't allowed here.")
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error('That file is larger than 25 MB.')
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const storagePath = `${taskId}/${crypto.randomUUID()}-${file.name}`
      const { error } = await supabase.storage.from('task-attachments').upload(storagePath, file)
      if (error) {
        toast.error(`Couldn't upload that file: ${error.message}`)
        return
      }
      await onUploaded(file, storagePath)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleDownload(attachment: Attachment) {
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from('task-attachments')
      .createSignedUrl(attachment.storage_path, 60)
    if (error || !data) {
      toast.error("Couldn't open that file.")
      return
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-1.5">
      {attachments.map((attachment) => {
        const uploader = attachment.uploaded_by ? membersById.get(attachment.uploaded_by) : undefined
        return (
          <div key={attachment.id} className="group flex items-center gap-2 rounded-md px-1.5 py-1 text-sm hover:bg-secondary/40">
            <Paperclip className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <button
              type="button"
              onClick={() => handleDownload(attachment)}
              className="min-w-0 flex-1 truncate text-left hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {attachment.file_name}
            </button>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatFileSize(attachment.file_size)}
              {uploader && ` · ${displayName(uploader).split(' ')[0]}`}
            </span>
            <button
              type="button"
              onClick={() => handleDownload(attachment)}
              aria-label={`Download ${attachment.file_name}`}
              className="shrink-0 rounded p-1 text-muted-foreground/50 opacity-0 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring group-hover:opacity-100"
            >
              <Download className="size-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(attachment)}
              aria-label={`Delete ${attachment.file_name}`}
              className="shrink-0 rounded p-1 text-muted-foreground/50 opacity-0 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring group-hover:opacity-100"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        )
      })}

      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        id={`attachment-input-${taskId}`}
        onChange={(e) => handleFileSelect(e.target.files?.[0])}
      />
      <label
        htmlFor={`attachment-input-${taskId}`}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed border-border px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        {uploading ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Paperclip className="size-3.5" aria-hidden="true" />
        )}
        {uploading ? 'Uploading…' : 'Attach a file'}
      </label>
    </div>
  )
}
