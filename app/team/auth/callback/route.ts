import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { safeNext } from '@/lib/team/routes'

/**
 * Where invite links and password-reset links land.
 *
 * Supabase sends the person here with a one-time code. We trade that code
 * for a real session cookie, then forward them on — usually to
 * /team/update-password so they can choose a password.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  // Never bounce to another site on someone else's say-so.
  const destination = safeNext(next)

  if (!code) {
    return NextResponse.redirect(`${origin}/team/login?error=link`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/team/login?error=expired`)
  }

  return NextResponse.redirect(`${origin}${destination}`)
}
