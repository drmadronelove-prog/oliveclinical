/**
 * Reads the three Supabase values out of the environment.
 *
 * The public marketing site and the /team workspace share one deployment,
 * so a missing key must never break the build — oliveclinical.com has to
 * keep serving whether or not the team app is configured. Everything here
 * reports absence instead of throwing at import time.
 */

export type SupabasePublicEnv = {
  url: string
  anonKey: string
}

function looksLikeAValidUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function readPublicEnv(): SupabasePublicEnv | null {
  // Next.js inlines NEXT_PUBLIC_* at build time only for full, literal
  // property reads, so these cannot be looked up dynamically.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !anonKey) return null

  // A pasting mistake (missing "https://", a stray quote, a trailing
  // space carried over from copy-paste) must show the same friendly
  // "not configured yet" page as a genuinely missing key — never a
  // crash. Treating it as "absent" here is what makes that automatic.
  if (!looksLikeAValidUrl(url)) return null

  return { url, anonKey }
}

export function requirePublicEnv(): SupabasePublicEnv {
  const env = readPublicEnv()
  if (!env) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and ' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local — see PHASE-1.md.',
    )
  }
  return env
}

export function isSupabaseConfigured(): boolean {
  return readPublicEnv() !== null
}
