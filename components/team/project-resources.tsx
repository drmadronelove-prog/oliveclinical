'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Link2, Paperclip, Download, Trash2, Loader2, Plus, FolderOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { displayName, formatRelativeTime, type Profile, type ProjectResource } from '@/lib/team/types'

function formatFileSize(bytes: number | null): string {
  if (bytes === null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// Same rule as task attachments — a shared internal tool's own files
// have no reason to accept anything that could be an executable.
const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.sh', '.msi', '.app']
const MAX_FILE_BYTES = 25 * 1024 * 1024 // 25 MB

/**
 * The project-wide counterpart to a task's Attachments section — links
 * and files that belong to the whole project (a brand brief, a shared
 * drive folder, a signed contract), not one task's worth of work.
 */
export function ProjectResources({
  projectId,
  resources,
  membersById,
  onAddLink,
  onFileUploaded,
  onDelete,
}: {
  projectId: string
  resources: ProjectResource[]
  membersById: Map<string, Profile>
  onAddLink: (title: string, url: string) => void
  onFileUploaded: (file: File, storagePath: string) => Promise<void>
  onDelete: (resource: ProjectResource) => void
}) {
  const [addingLink, setAddingLink] = useState(false)
  const [linkTitle, setLinkTitle] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function submitLink() {
    const title = linkTitle.trim()
    const url = linkUrl.trim()
    if (!title || !url) {
      toast.error('Give the link a title and a URL.')
      return
    }
    onAddLink(title, url)
    setLinkTitle('')
    setLinkUrl('')
    setAddingLink(false)
  }

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
      const storagePath = `project/${projectId}/${crypto.randomUUID()}-${file.name}`
      const { error } = await supabase.storage.from('task-attachments').upload(storagePath, file)
      if (error) {
        toast.error(`Couldn't upload that file: ${error.message}`)
        return
      }
      await onFileUploaded(file, storagePath)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleDownload(resource: ProjectResource) {
    if (!resource.storage_path) return
    const supabase = createClient()
    const { data, error } = await supabase.storage.from('task-attachments').createSignedUrl(resource.storage_path, 60)
    if (error || !data) {
      toast.error("Couldn't open that file.")
      return
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="max-w-2xl">
      {resources.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
          <FolderOpen className="mx-auto size-8 text-muted-foreground/50" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted-foreground">
            Nothing here yet. Add a link, or upload a file this whole project needs.
          </p>
        </div>
      ) : (
        <ul className="space-y-1">
          {resources.map((resource) => {
            const addedBy = resource.created_by ? membersById.get(resource.created_by) : undefined
            const isLink = resource.kind === 'link'
            return (
              <li
                key={resource.id}
                className="group flex items-center gap-2.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary/40"
              >
                {isLink ? (
                  <Link2 className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <Paperclip className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                )}
                {isLink ? (
                  <a
                    href={resource.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex-1 truncate hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {resource.title}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDownload(resource)}
                    className="min-w-0 flex-1 truncate text-left hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {resource.title}
                  </button>
                )}
                <span className="shrink-0 text-xs text-muted-foreground">
                  {isLink ? hostnameOf(resource.url!) : formatFileSize(resource.file_size)}
                  {addedBy && ` · ${displayName(addedBy).split(' ')[0]}`}
                  {' · '}
                  {formatRelativeTime(resource.created_at)}
                </span>
                {!isLink && (
                  <button
                    type="button"
                    onClick={() => handleDownload(resource)}
                    aria-label={`Download ${resource.title}`}
                    className="shrink-0 rounded p-1 text-muted-foreground/50 opacity-0 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring group-hover:opacity-100"
                  >
                    <Download className="size-3.5" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDelete(resource)}
                  aria-label={`Delete ${resource.title}`}
                  className="shrink-0 rounded p-1 text-muted-foreground/50 opacity-0 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {addingLink ? (
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            <input
              autoFocus
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="Title"
              aria-label="Link title"
              className="w-36 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            />
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  submitLink()
                }
                if (e.key === 'Escape') setAddingLink(false)
              }}
              placeholder="https://…"
              aria-label="Link URL"
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            />
            <button
              type="button"
              onClick={submitLink}
              className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setAddingLink(false)}
              className="rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingLink(true)}
            className="flex items-center gap-1.5 rounded-md border border-dashed border-border px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Add a link
          </button>
        )}

        <input ref={inputRef} type="file" className="sr-only" id={`resource-input-${projectId}`} onChange={(e) => handleFileSelect(e.target.files?.[0])} />
        <label
          htmlFor={`resource-input-${projectId}`}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed border-border px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          {uploading ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <Paperclip className="size-3.5" aria-hidden="true" />}
          {uploading ? 'Uploading…' : 'Upload a file'}
        </label>
      </div>
    </div>
  )
}
