import { NextResponse } from "next/server"
import { z } from "zod"

const SubscribeSchema = z.object({
  email: z.string().trim().min(1, "Please enter an email address.").email("Please enter a valid email address."),
  // Honeypot: hidden in the UI, so anything here means a bot filled it in.
  company: z.string().optional(),
})

/**
 * Newsletter signup.
 *
 * The list itself lives with an email provider, configured through env vars:
 *   NEWSLETTER_API_URL  — provider endpoint that accepts a subscriber POST
 *   NEWSLETTER_API_KEY  — bearer token for that endpoint
 *
 * If those aren't set we deliberately return 503 rather than a cheerful
 * "you're subscribed", so nobody is told they joined a list that never
 * received them.
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
  // don't forward anything to the provider.
  if (company && company.trim() !== "") {
    return NextResponse.json({ message: "You're on the list — thank you." })
  }

  const apiUrl = process.env.NEWSLETTER_API_URL
  const apiKey = process.env.NEWSLETTER_API_KEY

  if (!apiUrl || !apiKey) {
    console.warn("[subscribe] NEWSLETTER_API_URL / NEWSLETTER_API_KEY are not configured; signup rejected.")
    return NextResponse.json(
      { error: "Email signup isn't available just yet. Please check back soon." },
      { status: 503 },
    )
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      console.error("[subscribe] provider rejected signup", res.status, detail.slice(0, 500))
      return NextResponse.json(
        { error: "We couldn't complete your signup. Please try again later." },
        { status: 502 },
      )
    }

    return NextResponse.json({ message: "You're on the list — thank you." })
  } catch (err) {
    console.error("[subscribe] provider request failed", err)
    return NextResponse.json(
      { error: "We couldn't complete your signup. Please try again later." },
      { status: 502 },
    )
  }
}
