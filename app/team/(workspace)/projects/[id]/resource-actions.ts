'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/team/auth'
import { normalizeUrl } from '@/lib/team/url'

type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string }

export async function addProjectLink(input: {
  projectId: string
  title: string
  url: string
}): Promise<ActionResult<{ id: string; url: string; created_at: string }>> {
  const profile = await requireProfile()
  const title = input.title.trim()
  if (!title) return { ok: false, error: 'Give the link a title.' }

  const url = normalizeUrl(input.url)
  if (!url) return { ok: false, error: "That doesn't look like a valid URL." }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('project_resources')
    .insert({ project_id: input.projectId, kind: 'link', title, url, created_by: profile.id })
    .select('id, url, created_at')
    .single()

  if (error || !data) {
    console.error('[team] addProjectLink failed:', error)
    return { ok: false, error: `Couldn't add that link: ${error?.message ?? 'unknown error'}` }
  }

  revalidatePath(`/team/projects/${input.projectId}`)
  return { ok: true, data }
}

/**
 * The file itself is uploaded straight from the browser to Supabase
 * Storage (see the client component) — this just records what got
 * uploaded, once the browser confirms it landed. Same reasoning as
 * task-level attachments.
 */
export async function recordProjectFile(input: {
  projectId: string
  storagePath: string
  fileName: string
  fileSize: number
  contentType: string
}): Promise<ActionResult<{ id: string; created_at: string }>> {
  const profile = await requireProfile()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('project_resources')
    .insert({
      project_id: input.projectId,
      kind: 'file',
      title: input.fileName,
      storage_path: input.storagePath,
      file_size: input.fileSize,
      content_type: input.contentType,
      created_by: profile.id,
    })
    .select('id, created_at')
    .single()

  if (error || !data) {
    console.error('[team] recordProjectFile failed:', error)
    return { ok: false, error: `The file uploaded, but couldn't be saved: ${error?.message ?? 'unknown error'}` }
  }

  revalidatePath(`/team/projects/${input.projectId}`)
  return { ok: true, data }
}

export async function deleteProjectResource(input: {
  id: string
  projectId: string
  storagePath: string | null
}): Promise<ActionResult> {
  await requireProfile()
  const supabase = await createClient()

  if (input.storagePath) {
    const { error: storageError } = await supabase.storage.from('task-attachments').remove([input.storagePath])
    if (storageError) {
      console.error('[team] project resource storage delete failed:', storageError)
      // Fall through and remove the row anyway — a dangling file in
      // Storage costs a little space; a dangling row that still links to
      // a "file" nobody can open is a worse, confusing dead end.
    }
  }

  const { error } = await supabase.from('project_resources').delete().eq('id', input.id)
  if (error) {
    console.error('[team] deleteProjectResource failed:', error)
    return { ok: false, error: `Couldn't remove that: ${error.message}` }
  }

  revalidatePath(`/team/projects/${input.projectId}`)
  return { ok: true, data: undefined }
}
