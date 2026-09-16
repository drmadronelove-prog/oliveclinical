/**
 * A link someone pastes into "Add a link" rarely includes the scheme —
 * treat a bare "drive.google.com/..." the same as
 * "https://drive.google.com/...". Returns null for anything that still
 * isn't a valid URL once a scheme is assumed, rather than saving
 * something that can't actually be opened.
 */
export function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    return new URL(withScheme).toString()
  } catch {
    return null
  }
}
