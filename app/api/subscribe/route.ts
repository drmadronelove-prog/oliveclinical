import { NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"

const SubscribeSchema = z.object({
  email: z.string().trim().min(1, "Please enter an email address.").email("Please enter a valid email address."),
  // Honeypot: hidden in the UI, so anything here means a bot filled it in.
  company: z.string().optional(),
})

/**
 * Newsletter signup via Mailchimp, configured through env vars:
 *   MAILCHIMP_API_KEY — looks like "abcd1234...-us21"; the "-us21" suffix
 *     names the datacenter and is required to build the API URL.
 *   MAILCHIMP_LIST_ID — the target Audience's ID (Audience > Settings >
 *     Audience name and defaults > Audience ID).
 *
 * If those aren't set we deliberately return 503 rather than a cheerful
 * "you're subscribed", so nobody is told they joined a list that never
 * received them.
 *
 * Upserts via PUT on the member's MD5-hashed email (Mailchimp's documented
 * way to add-or-update a member) rather than POST, and sets only
 * `status_if_new` — never `status` — so someone who previously unsubscribed
 * is never silently re-subscribed by refilling the form.
 *
 * status_if_new is "pending" (not "subscribed") for double opt-in: Mailchimp
 * auto-sends a confirmation email and the contact only becomes "subscribed"
 * once they click it. Note this is set here in the API call itself — the
 * double-opt-in toggle in Mailchimp's Audience settings only affects
 * Mailchimp's own hosted signup forms, not contacts added via the API.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const parsed = SubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please enter a valid email address." },
      { status: 400 },
    )
  }

  const { email, company } = parsed.data

  // Bot caught by the honeypot — accept quietly so it gets no signal, but
  // don't forward anything to Mailchimp.
  if (company && company.trim() !== "") {
    return NextResponse.json({ message: "You're on the list — thank you." })
  }

  const apiKey = process.env.MAILCHIMP_API_KEY
  const listId = process.env.MAILCHIMP_LIST_ID
  const dc = apiKey?.split("-")[1]

  if (!apiKey || !listId || !dc) {
    console.warn("[subscribe] MAILCHIMP_API_KEY / MAILCHIMP_LIST_ID are not configured; signup rejected.")
    return NextResponse.json(
      { error: "Email signup isn't available just yet. Please check back soon." },
      { status: 503 },
    )
  }

  const subscriberHash = crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex")

  try {
    const res = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: "pending",
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      console.error("[subscribe] Mailchimp rejected signup", res.status, detail.slice(0, 500))
      return NextResponse.json(
        { error: "We couldn't complete your signup. Please try again later." },
        { status: 502 },
      )
    }

    return NextResponse.json({ message: "Almost there — check your inbox to confirm your subscription." })
  } catch (err) {
    console.error("[subscribe] Mailchimp request failed", err)
    return NextResponse.json(
      { error: "We couldn't complete your signup. Please try again later." },
      { status: 502 },
    )
  }
}
