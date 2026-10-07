'use client'

import { toast } from 'sonner'
import { isNextRedirectError } from './next-redirect'

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string }

/**
 * Runs an optimistic update's server call and rolls back on *any*
 * failure — not just an `{ ok: false }` result, but the call throwing
 * outright. Every optimistic update in the workspace calls its server
 * action directly from an event handler, never through a `<form>`, so
 * nothing else was catching a rejected promise: a server action that
 * threw instead of returning (an expired session's redirect(), a
 * network blip, a cold start timing out) left the optimistic change
 * sitting in local state with no error shown and no row actually
 * written. It looked saved — right up until the next full page load
 * fetched the real row and quietly reverted it, with nothing in
 * between to explain why.
 *
 * `redirect()` is deliberately let through rather than caught: a
 * server action that calls it (requireProfile(), when the session is
 * genuinely gone) needs that throw to keep going so Next's own
 * handling can act on it, not be turned into an error toast.
 */
export async function runMutation<T>(
  action: () => Promise<ActionResult<T>>,
  rollback: () => void,
  onSuccess?: (data: T) => void,
): Promise<void> {
  try {
    const result = await action()
    if (!result.ok) {
      rollback()
      toast.error(result.error)
      return
    }
    onSuccess?.(result.data)
  } catch (err) {
    if (isNextRedirectError(err)) throw err
    rollback()
    toast.error(err instanceof Error ? err.message : "Couldn't save that change. Try again.")
  }
}
