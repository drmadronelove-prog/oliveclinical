/**
 * True for the special error Next.js throws internally from redirect().
 * Its exact class lives at an internal import path that has moved
 * between Next.js versions, but the `digest` string prefix is a stable,
 * documented contract — checking that instead of importing from
 * `next/dist/...` won't silently break on a Next.js upgrade.
 *
 * Needed anywhere a server action is wrapped in try/catch: requireProfile()
 * can call redirect() internally (session expired mid-action), and a
 * generic catch must let that specific throw continue up to Next's own
 * handling rather than swallowing it into a normal error result — that
 * would turn "please log back in" into a confusing error toast instead.
 */
export function isNextRedirectError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'digest' in err &&
    typeof (err as { digest?: unknown }).digest === 'string' &&
    (err as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  )
}
