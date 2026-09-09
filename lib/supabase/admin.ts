import 'server-only'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { requirePublicEnv } from './env'

/**
 * Supabase with the service-role key, which bypasses row-level security
 * entirely. It exists for exactly one job: sending invitations, which
 * requires creating an auth user before that person can authenticate.
 *
 * `server-only` above makes the build fail if this file is ever imported
 * into a client component, so the key cannot reach a browser by accident.
 * Every caller must check the caller is an admin first.
 */
export function createAdminClient() {
  const { url } = requirePublicEnv()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is missing. Inviting members needs it — ' +
        'see PHASE-1.md.',
    )
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
