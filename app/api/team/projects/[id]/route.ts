import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile } from '@/lib/team/auth'

export const dynamic = 'force-dynamic'

/**
 * Deletes a project for good — sections and tasks go with it (the
 * database cascades that automatically).
 *
 * A plain route handler on purpose, not a server action: deleting a
 * project through a server action returned a 500 from inside Next.js's
 * own action-request decoding on the deployed site, before any app code
 * ran — a failure the same production build does not reproduce locally,
 * and one no try/catch in the app can reach. A route handler is ordinary
 * HTTP with a JSON reply: no action manifest, no encoded arguments, no
 * automatic re-render of the page that called it, and it lives outside
 * the middleware's /team/:path* matcher entirely. Whatever fails in that
 * pipeline cannot fail here, and if anything else does, the real error
 * comes back in the response instead of a redacted digest.
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Same-origin only. Browsers set Sec-Fetch-Site on every fetch and a
  // cross-site page can neither omit it nor forge it — a simpler, more
  // reliable check than comparing Origin against forwarded host headers.
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'none') {
    return NextResponse.json({ ok: false, error: 'Cross-site request refused.' }, { status: 403 })
  }

  const profile = await getCurrentProfile()
  if (!profile) {
    return NextResponse.json({ ok: false, error: 'You need to be signed in.' }, { status: 401 })
  }

  const { id } = await params
  if (!id) return NextResponse.json({ ok: false, error: 'Missing project.' }, { status: 400 })

  const supabase = await createClient()
  // .select().maybeSingle() after the delete, not just the error — a
  // delete that matches nothing (wrong id, or row-level security
  // filtering it out) reports no error at all, and would otherwise look
  // exactly like success.
  const { data, error } = await supabase.from('projects').delete().eq('id', id).select('id').maybeSingle()

  if (error) {
    console.error('[team] delete project failed:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json(
      { ok: false, error: "That project couldn't be found, or you don't have permission to delete it." },
      { status: 404 },
    )
  }

  revalidatePath('/team/projects')
  revalidatePath('/team')
  return NextResponse.json({ ok: true })
}
