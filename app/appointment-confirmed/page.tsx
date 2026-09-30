import type { Metadata } from "next"
import Link from "next/link"

import { ToolPageLayout } from "@/components/tool-page-layout"
import { BOOKING_PROVIDER, BOOKING_URL } from "@/lib/booking"

export const metadata: Metadata = {
  title: "Your Consultation Is Booked — Olive Clinical",
  description:
    "What happens next after booking a free 20 minute consultation with Dr. Madrone Love at Olive Clinical in Berkeley, CA.",
  alternates: { canonical: "/appointment-confirmed" },
}

const sectionHeading: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 500,
  letterSpacing: "-0.018em",
}

const buttonText: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontSize: "0.78rem",
}

const nextSteps: { title: string; body: string }[] = [
  {
    title: "Check your email",
    body: "Google sends the confirmation, including the video link or the office address, to the email address you booked with. It usually arrives within a minute. If you do not see it, look in your spam or promotions folder before assuming something went wrong.",
  },
  {
    title: "Put it in your calendar",
    body: "The confirmation email contains a calendar invitation. Accepting it is the simplest way to make sure the appointment does not quietly disappear between now and then.",
  },
  {
    title: "Nothing to prepare",
    body: "There are no forms to fill in beforehand and nothing to read. If it helps you to jot down what brought you here, do that, but arriving with nothing written down is completely fine.",
  },
]

export default function AppointmentConfirmedPage() {
  return (
    <ToolPageLayout title="Your consultation is booked" color="text-ink">
      <div className="space-y-14">

        {/* Confirmation */}
        <div className="space-y-6 max-w-prose">
          <h1
            className="text-3xl sm:text-4xl text-foreground"
            style={{ ...sectionHeading, lineHeight: 1.15 }}
          >
            Your consultation is booked
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Thank you for reaching out. Your free 20 minute consultation with{" "}
            {BOOKING_PROVIDER} is scheduled, and the details are on their way to
            your inbox.
          </p>
          {/* The booking lives in Google Calendar, not on this site, so this
              page deliberately does not claim to be the record of it. */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            The confirmation email from Google is the record of your appointment,
            with the exact time and the link to join. This page is just here to
            tell you what happens next.
          </p>
        </div>

        {/* What happens next */}
        <div>
          <h2 className="text-2xl text-foreground mb-6" style={sectionHeading}>
            What happens next
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {nextSteps.map((step) => (
              <div
                key={step.title}
                className="bg-card border border-border border-l-2 border-l-slate p-5 space-y-2"
              >
                <h3
                  className="text-foreground text-base"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-0.01em" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What the call is */}
        <div className="space-y-6 max-w-prose">
          <h2 className="text-2xl text-foreground" style={sectionHeading}>
            What the call is for
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Twenty minutes, free, with no commitment attached. You say what brings
            you in, and {BOOKING_PROVIDER} tells you whether this practice is the
            right fit and what working together would actually look like. If it is
            not the right fit, you will get a straight answer and a pointer
            somewhere better.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            No referral is needed, and nothing you say on the call commits you to
            anything.
          </p>
        </div>

        {/* Changing or cancelling */}
        <div className="space-y-6 max-w-prose">
          <h2 className="text-2xl text-foreground" style={sectionHeading}>
            Need to change or cancel
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The confirmation email has reschedule and cancel links in it, and you
            are welcome to use them without explaining why. You can also call or
            email, or{" "}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-foreground hover:opacity-80"
            >
              pick a different time
            </a>{" "}
            directly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:+14154843302"
              className="inline-flex items-center gap-3 px-5 py-3 border border-slate text-slate hover:bg-slate/10 transition-colors"
              style={buttonText}
            >
              (415) 484-3302
            </a>
            <a
              href="mailto:info@oliveclinical.com"
              className="inline-flex items-center gap-3 px-5 py-3 border border-slate text-slate hover:bg-slate/10 transition-colors"
              style={buttonText}
            >
              info@oliveclinical.com
            </a>
          </div>
        </div>

        {/* Where */}
        <div className="border-l-2 border-slate pl-6 space-y-2 max-w-prose">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Consultations are held by secure video for clients anywhere in
            California, or in person at Anam Cara Therapy Center, 2915 Martin
            Luther King Junior Way, Berkeley, CA 94703. Your confirmation email
            says which one you booked.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {BOOKING_PROVIDER} — licensed clinical psychologist, PSY35899.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Haven&apos;t booked yet?{" "}
            <Link href="/contact" className="underline text-foreground hover:opacity-80">
              Schedule a consultation
            </Link>
            .
          </p>
        </div>

      </div>
    </ToolPageLayout>
  )
}
