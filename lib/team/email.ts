import 'server-only'

import { Resend } from 'resend'

const DEFAULT_FROM = 'Olive Team <team@oliveclinical.com>'

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY?.trim()
}

/**
 * Sends one email through Resend. Reports failure instead of throwing —
 * the one caller (the notification webhook) always has an in-app
 * notification already sitting in Inbox regardless of whether the email
 * goes out, so a Resend outage or a bad API key should never turn into a
 * 500 for something that already succeeded.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY is not configured' }

  const from = process.env.EMAIL_FROM?.trim() || DEFAULT_FROM
  const resend = new Resend(apiKey)

  try {
    const { error } = await resend.emails.send({ from, to, subject, html })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error sending email' }
  }
}
