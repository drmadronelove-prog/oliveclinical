import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isEmailConfigured, sendEmail } from '@/lib/team/email'
import { describeNotification, notificationSubject } from '@/lib/team/notification-copy'
import type { NotificationType } from '@/lib/team/types'

export const dynamic = 'force-dynamic'

type WebhookPayload = {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: {
    id: string
    recipient_id: string
    type: NotificationType
    task_id: string | null
    actor_id: string | null
  } | null
}

/**
 * Not a real constant-time-safe-by-default compare — `===` on strings of
 * different lengths short-circuits fast, leaking timing information — so
 * a real signal, `timingSafeEqual`, is used instead. Same secret must be
 * pasted into the Supabase Database Webhook config; see PHASE-5.md.
 */
function secretMatches(provided: string | null, expected: string): boolean {
  if (!provided) return false
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/**
 * Fired by a Supabase Database Webhook on every INSERT into
 * `notifications` — assignment, mention, comment, and the daily
 * due-tomorrow check all funnel through this one row and this one
 * route, the same way the in-app Inbox does. This is what turns an
 * already-working in-app notification into an email; it never creates a
 * notification of its own.
 */
export async function POST(request: Request) {
  const secret = process.env.TEAM_NOTIFY_WEBHOOK_SECRET?.trim()
  if (!secret) {
    return NextResponse.json({ ok: false, error: 'Webhook not configured' }, { status: 501 })
  }

  const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null
  if (!secretMatches(provided, secret)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const payload = (await request.json()) as WebhookPayload
  if (payload.table !== 'notifications' || payload.type !== 'INSERT' || !payload.record) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ ok: true, skipped: 'email not configured' })
  }

  const { recipient_id, type, task_id, actor_id } = payload.record
  const admin = createAdminClient()

  const [{ data: recipient }, { data: task }, { data: actor }] = await Promise.all([
    admin.from('profiles').select('name, email').eq('id', recipient_id).maybeSingle(),
    task_id ? admin.from('tasks').select('id, title, project_id').eq('id', task_id).maybeSingle() : Promise.resolve({ data: null }),
    actor_id ? admin.from('profiles').select('name, email').eq('id', actor_id).maybeSingle() : Promise.resolve({ data: null }),
  ])

  if (!recipient?.email) {
    return NextResponse.json({ ok: true, skipped: 'recipient has no email' })
  }

  const source = { type, task: task ? { title: task.title } : null, actor }
  const link = task
    ? `https://oliveclinical.com/team/projects/${task.project_id}?task=${task.id}`
    : 'https://oliveclinical.com/team/inbox'

  const result = await sendEmail({
    to: recipient.email,
    subject: notificationSubject(source),
    html: renderNotificationEmail({ sentence: describeNotification(source), link }),
  })

  if (!result.ok) {
    // The in-app notification already exists regardless — this is best
    // effort on top of it, not the source of truth, so a failure here is
    // reported but never turned into a 500 the webhook would retry
    // forever on a permanently bad address or API key.
    return NextResponse.json({ ok: false, error: result.error })
  }

  return NextResponse.json({ ok: true })
}

function renderNotificationEmail({ sentence, link }: { sentence: string; link: string }): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f7f5f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#2b2926;">
    <table role="presentation" width="100%" style="max-width:480px;margin:0 auto;">
      <tr>
        <td style="padding-bottom:16px;font-size:13px;color:#8a8378;">Olive Team</td>
      </tr>
      <tr>
        <td style="background:#ffffff;border:1px solid #e6e1d8;border-radius:8px;padding:24px;">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.5;">${escapeHtml(sentence)}</p>
          <a href="${link}" style="display:inline-block;background:#2b2926;color:#ffffff;text-decoration:none;padding:8px 16px;border-radius:6px;font-size:14px;">Open in Olive Team</a>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
