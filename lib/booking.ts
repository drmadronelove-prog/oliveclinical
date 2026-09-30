/**
 * Single source of truth for the consult booking links.
 *
 * There are two distinct Google URLs and they are not interchangeable:
 *
 *   BOOKING_URL       the short share link, safe to put in an <a href>, but
 *                     Google serves it with X-Frame-Options so it CANNOT be
 *                     iframed. This is the fallback everywhere.
 *
 *   BOOKING_EMBED_URL the long appointment-schedule URL ending in `?gv=true`,
 *                     which is the only form Google allows in an iframe. Get
 *                     it from Google Calendar: open the appointment schedule,
 *                     click "Share", choose the "Embed" tab, and copy the src
 *                     out of the snippet it shows you. It looks like
 *                     https://calendar.google.com/calendar/appointments/schedules/<long id>?gv=true
 *
 * The embed URL is read from NEXT_PUBLIC_BOOKING_EMBED_URL so it can be set
 * in Vercel without a code change. Until it is set, every booking surface
 * degrades to the plain button pointing at BOOKING_URL — the point is that a
 * missing env var never leaves a blank space where the scheduler should be.
 */
export const BOOKING_URL = "https://calendar.app.google/8JgFfgxurfS5xqDP7"

export const BOOKING_LABEL = "Book a free 20-minute consult"

/** Whose calendar this is. The scheduler books this person specifically. */
export const BOOKING_PROVIDER = "Dr. Madrone Love"

export const BOOKING_TITLE = `Book a free 20-minute consult with ${BOOKING_PROVIDER}`

const rawEmbedUrl = process.env.NEXT_PUBLIC_BOOKING_EMBED_URL?.trim()

/**
 * Only accept the embeddable form. A short calendar.app.google link pasted
 * into the env var by mistake would render as a permanently blank iframe, so
 * we reject anything that is not on the appointments/schedules path and fall
 * back to the button instead.
 */
export const BOOKING_EMBED_URL: string | null =
  rawEmbedUrl && rawEmbedUrl.startsWith("https://calendar.google.com/calendar/appointments/schedules/")
    ? rawEmbedUrl
    : null

export const hasBookingEmbed = BOOKING_EMBED_URL !== null
