'use client'

import { useEffect } from 'react'

/**
 * Supabase has two ways of handing someone a signed-in session after they
 * click an email link:
 *
 *   - a `?code=...` in the address, which our /team/auth/callback page
 *     reads on the server, or
 *   - an older style that puts the session directly in the address after
 *     a `#`, e.g. oliveclinical.com/#access_token=...&type=invite
 *
 * The second kind lands on the plain homepage — Supabase's own invitation
 * button in its dashboard sends this kind, and it always lands at the
 * site's root address, never at a page of our choosing. Browsers also
 * never send the part after `#` to a server, so no server-side code can
 * ever see it; only a script running in the browser can. This component
 * is that script. On every homepage visit it does one cheap, invisible
 * check — is there a session hiding in the address bar? — and on the
 * rare visit where the answer is yes, it signs the person in and sends
 * them to set a password, instead of leaving them stranded here.
 */
export function AuthHashCatcher() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash || !hash.includes('access_token')) return

    const params = new URLSearchParams(hash.slice(1))
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')
    const type = params.get('type')

    if (!access_token || !refresh_token) return

    let cancelled = false
    ;(async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { error } = await supabase.auth.setSession({ access_token, refresh_token })
        if (cancelled) return

        if (error) {
          window.location.replace('/team/login?error=link')
          return
        }

        const destination = type === 'invite' || type === 'recovery' ? '/team/update-password' : '/team'
        window.location.replace(destination)
      } catch {
        // Supabase isn't configured, or something else went wrong. Leave
        // the visitor on the homepage exactly as they found it rather
        // than risk breaking the public site over an edge case.
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return null
}
