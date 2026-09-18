/**
 * Client-side call to the project delete route. Plain fetch + JSON, used
 * from both places a project can be deleted (its own page, and the
 * Archived list) so they can never drift apart. See the route handler
 * for why this is not a server action.
 */
export async function deleteProjectRequest(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  let response: Response
  try {
    response = await fetch(`/api/team/projects/${encodeURIComponent(id)}`, { method: 'DELETE' })
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error.' }
  }

  // A non-JSON body here means something upstream of the route replied
  // (a platform error page, a redirect to login) — surface the status
  // rather than a JSON parse error that hides it.
  let body: { ok?: boolean; error?: string } | null = null
  try {
    body = (await response.json()) as { ok?: boolean; error?: string }
  } catch {
    body = null
  }

  if (body?.ok) return { ok: true }
  return { ok: false, error: body?.error ?? `${response.status} ${response.statusText}`.trim() }
}
