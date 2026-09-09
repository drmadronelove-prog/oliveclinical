/**
 * Route rules for the /team workspace, kept separate from the middleware
 * and the server actions so they can be tested directly.
 */

/** Pages under /team a signed-out person is allowed to reach. */
export const PUBLIC_TEAM_ROUTES = [
  '/team/login',
  '/team/reset-password',
  '/team/update-password',
  '/team/auth/callback',
  '/team/not-configured',
  '/team/connection-error',
] as const

export function isPublicTeamRoute(pathname: string): boolean {
  return PUBLIC_TEAM_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}

/**
 * Sanitises a `?next=` redirect target.
 *
 * Without this, a link like /team/login?next=https://evil.example could
 * carry someone straight off our site after they sign in, with our domain
 * in the address bar the whole way. Only in-workspace paths are allowed,
 * and `//host` is rejected because browsers read it as a full URL.
 */
export function safeNext(value: unknown, fallback = '/team'): string {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/team')) return fallback
  if (value.startsWith('//')) return fallback
  if (value.includes('\\')) return fallback
  return value
}
