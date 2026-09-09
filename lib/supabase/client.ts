'use client'

import { createBrowserClient } from '@supabase/ssr'
import { requirePublicEnv } from './env'

/**
 * Supabase as seen from the browser. Uses the anon key, which is safe to
 * ship publicly: every table has row-level security, so this key can only
 * read what the signed-in person is allowed to read.
 *
 * Used for realtime subscriptions and for auth actions that need to run
 * client-side (sign in, password update).
 */
export function createClient() {
  const { url, anonKey } = requirePublicEnv()
  return createBrowserClient(url, anonKey)
}
