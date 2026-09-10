'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireProfile } from '@/lib/team/auth'

type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string }

/**
 * The file itself is uploaded straight from the browser to Supabase
 * Storage (see the client component) — routing the actual bytes through
 * this server action would mean uploading twice for no benefit. This
 * just records what got uploaded, once the browser confirms it landed.
 */
export async function recordAttachment(input: {
  taskId: string
  projectId: string
  storagePath: string
  fileName: string
  fileSize: number
  contentType: string
}): Promise<ActionResult<{ id: string; created_at: string }>> {
  const profile = await requireProfile()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('attachments')
    .insert({
      task_id: input.taskId,
      storage_path: input.storagePath,
      file_name: input.fileName,
      file_size: input.fileSize,
      content_type: input.contentType,
      uploaded_by: profile.id,
    })
    .select('id, created_at')
    .single()

  if (error || !data) {
    console.error('[team] recordAttachment failed:', error)
    return { ok: false, error: `The file uploaded, but couldn't be attached: ${error?.message ?? 'unknown error'}` }
  }

  revalidatePath(`/team/projects/${input.projectId}`)
  return { ok: true, data }
}

export async function deleteAttachment(input: {
  id: string
  projectId: string
  storagePath: string
}): Promise<ActionResult> {
  await requireProfile()
  const supabase = await createClient()

  const { error: storageError } = await supabase.storage.from('task-attachments').remove([input.storagePath])
  if (storageError) {
    console.error('[team] attachment storage delete failed:', storageError)
    // Fall through and remove the row anyway — a dangling file in
    // Storage costs a little space; a dangling row that still links to
    // a "file" nobody can open is a worse, confusing dead end.
  }

  const { error } = await supabase.from('attachments').delete().eq('id', input.id)
  if (error) {
    console.error('[team] deleteAttachment failed:', error)
    return { ok: false, error: `Couldn't remove that attachment: ${error.message}` }
  }

  revalidatePath(`/team/projects/${input.projectId}`)
  return { ok: true, data: undefined }
}
