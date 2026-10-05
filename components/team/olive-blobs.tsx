/**
 * The drifting olive cluster from the marketing site's hero, reduced to a
 * decorative accent for the workspace home page.
 *
 * The public hero runs a physics simulation over six PNGs; that's far too
 * much machinery for a dashboard, so these are inline SVG olives — a filled
 * circle plus the off-centre sheen that makes it read as an olive rather
 * than a dot — carried along a CSS keyframe. Colors come from the practice
 * palette so the cluster shifts with the theme.
 *
 * This is a layer, not a block: it covers the open right half of whatever
 * element it's dropped into (that element being `relative`), and each olive
 * sits at a percentage of that box, so the cluster spreads over the hero
 * instead of bunching into one corner. The drift paths are long enough to
 * read as roaming rather than jitter, and each olive's spot is chosen with
 * its own path in mind, so none of them reaches the headline or the edge.
 * Below xl there isn't room for that to be true, so the field sits out.
 */
type Blob = {
  color: string
  /** Diameter in px — the olives keep a fixed size while the field around them flexes. */
  size: number
  /** Position as a percentage of the layer, measured from the named edges. */
  top: string
  left?: string
  right?: string
  drift: 'a' | 'b' | 'c' | 'd'
  seconds: number
  opacity: number
}

const BLOBS: Blob[] = [
  { color: 'var(--dusk)', size: 96, top: '26%', left: '46%', drift: 'a', seconds: 13, opacity: 0.85 },
  { color: 'var(--slate)', size: 54, top: '50%', left: '30%', drift: 'b', seconds: 16, opacity: 1 },
  { color: 'var(--rose)', size: 80, top: '34%', right: '8%', drift: 'c', seconds: 11.5, opacity: 0.9 },
  { color: 'var(--gold)', size: 124, top: '48%', left: '30%', drift: 'd', seconds: 18, opacity: 0.85 },
  { color: 'var(--glass)', size: 48, top: '70%', right: '24%', drift: 'b', seconds: 9.5, opacity: 0.9 },
]

export function OliveBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 overflow-hidden xl:block"
    >
      {BLOBS.map((blob, i) => (
        <svg
          key={i}
          viewBox="0 0 100 100"
          className={`absolute team-drift-${blob.drift}`}
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            right: blob.right,
            opacity: blob.opacity,
            animationDuration: `${blob.seconds}s`,
          }}
        >
          <circle cx="50" cy="50" r="50" fill={blob.color} />
          <ellipse cx="62" cy="39" rx="14" ry="22" fill="#ffffff" opacity="0.28" />
        </svg>
      ))}
    </div>
  )
}
