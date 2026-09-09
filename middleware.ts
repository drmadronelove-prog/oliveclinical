import type { NextRequest } from 'next/server'
import { updateTeamSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return updateTeamSession(request)
}

export const config = {
  // Scoped deliberately to /team. The public marketing pages must not pay
  // for auth middleware, and must keep serving if Supabase is down.
  matcher: ['/team/:path*'],
}
