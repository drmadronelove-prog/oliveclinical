import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { readPublicEnv } from './env'
import { isPublicTeamRoute } from '@/lib/team/routes'

/**
 * Runs before every /team request. Two jobs:
 *
 *   1. Refresh the session cookie, so a long-open tab does not silently
 *      expire mid-task.
 *   2. Bounce anyone who is not signed in to the login page.
 *
 * This is the outer gate. It is not the only one: row-level security in
 * Postgres refuses the same request independently, so a mistake here
 * cannot expose data.
 */
export async function updateTeamSession(request: NextRequest) {
  const { pathname } = request.nextUrl
  const env = readPublicEnv()

  // Supabase not set up yet. Send people to an explanatory page rather
  // than crashing — the rest of oliveclinical.com must stay up.
  if (!env) {
    if (pathname === '/team/not-configured') return NextResponse.next({ request })
    const url = request.nextUrl.clone()
    url.pathname = '/team/not-configured'
    url.search = ''
    return NextResponse.redirect(url)
  }

  let response = NextResponse.next({ request })

  // Values that are present and well-formed can still fail here — a
  // wrong project ref, a key copied from the wrong project, Supabase
  // itself being briefly unreachable. Any of those must send the person
  // to an explanatory page, never crash the whole /team section with a
  // 500. That is the only job of this try/catch.
  let user: { id: string } | null = null
  try {
    const supabase = createServerClient(env.url, env.anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          response = NextResponse.next({ request })
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options)
          }
        },
      },
    })

    // getUser() revalidates the token with Supabase. getSession() only
    // reads the cookie, which a browser can forge, so it must not be
    // trusted here.
    const {
      data: { user: revalidatedUser },
    } = await supabase.auth.getUser()
    user = revalidatedUser
  } catch (error) {
    console.error('[team] Supabase middleware call failed:', error)
    if (pathname === '/team/connection-error') return NextResponse.next({ request })
    const url = request.nextUrl.clone()
    url.pathname = '/team/connection-error'
    url.search = ''
    return NextResponse.redirect(url)
  }

  if (!user && !isPublicTeamRoute(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/team/login'
    // Remember where they were headed so login can return them there.
    url.search = pathname === '/team' ? '' : `?next=${encodeURIComponent(pathname)}`
    return NextResponse.redirect(url)
  }

  // Already signed in and looking at the login page — send them inward.
  if (user && pathname === '/team/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/team'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}
