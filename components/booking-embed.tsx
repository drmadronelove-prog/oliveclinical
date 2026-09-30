"use client"

import { useState } from "react"
import { BOOKING_EMBED_URL, BOOKING_LABEL, BOOKING_TITLE, BOOKING_URL } from "@/lib/booking"

/**
 * The Google appointment scheduler, inline.
 *
 * Renders the iframe when NEXT_PUBLIC_BOOKING_EMBED_URL is configured and
 * falls back to a plain button to the short link when it is not, so the
 * booking path never disappears. See lib/booking.ts for where that URL
 * comes from.
 */
export function BookingEmbed({ className = "" }: { className?: string }) {
  const [loaded, setLoaded] = useState(false)

  if (!BOOKING_EMBED_URL) {
    return (
      <div className={className}>
        <BookingButton />
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card">
        {/* Placeholder occupying the iframe's box until Google paints, so the
            surrounding layout does not jump when the scheduler arrives. */}
        {!loaded && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
            style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "rgba(11,37,69,0.55)" }}
          >
            Loading the calendar…
          </div>
        )}
        <iframe
          src={BOOKING_EMBED_URL}
          title={BOOKING_TITLE}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          // Google's scheduler is a full booking flow, so it needs its own
          // scripts and its own same-origin storage; scrolling stays on so
          // longer availability lists remain reachable inside the frame.
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          className="relative block w-full border-0 h-[760px] sm:h-[680px]"
        />
      </div>

      {/* Some browsers and privacy extensions block third-party frames
          outright. Anyone in that situation still needs a way through. */}
      <p
        className="mt-3"
        style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "rgba(11,37,69,0.6)" }}
      >
        Calendar not loading?{" "}
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
          style={{ color: "var(--ink)" }}
        >
          Open the scheduler in a new tab
        </a>
        .
      </p>
    </div>
  )
}

/** The outbound booking button, used as the no-embed fallback. */
export function BookingButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-md px-6 py-3 text-[0.95rem] transition-opacity hover:opacity-90 ${className}`}
      style={{ fontFamily: "var(--font-body)", fontWeight: 600, background: "var(--gold)", color: "var(--ink)" }}
    >
      {BOOKING_LABEL}
    </a>
  )
}
