import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { requirePublicEnv } from './env'

/**
 * Supabase as seen from a Server Component, Server Action, or Route
 * Handler. Reads the session out of the request cookies so queries run as
 * the signed-in person and row-level security applies to them.
 */
export async function createClient() {
  // Read cookies first. That marks the route as dynamic, so Next.js stops
  // trying to prerender it at build time — otherwise a missing key below
  // would fail the build of the whole marketing site.
  const cookieStore = await cookies()
  const { url, anonKey } = requirePublicEnv()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Server Components are not allowed to write cookies. That is
          // fine: middleware refreshes the session on every request, so
          // the write here is only ever a duplicate.
        }
      },
    },
  })
}
