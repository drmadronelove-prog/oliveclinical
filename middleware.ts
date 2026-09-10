import { NextResponse, type NextRequest } from 'next/server'
import { updateTeamSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // A sign-in link should always arrive at /team/auth/callback. When
  // Supabase declines the exact address this app asked for, it falls
  // back to the homepage instead, carrying only the one-time code —
  // everything else about where to go next is lost along the way.
  // Catching that here, before the page ever renders, means the
  // homepage itself stays a plain static page for every ordinary
  // visitor; only this rare, code-bearing visit pays for a server hop.
  if (pathname === '/') {
    const code = searchParams.get('code')
    if (code) {
      const url = request.nextUrl.clone()
      url.pathname = '/team/auth/callback'
      url.search = `?code=${encodeURIComponent(code)}&next=/team/update-password`
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  return updateTeamSession(request)
}

export const config = {
  // /team for the workspace itself, plus the bare homepage — only to
  // catch the stray-code case above. Everything else on the public site
  // is untouched and keeps serving as static content.
  matcher: ['/team/:path*', '/'],
}
