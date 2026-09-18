/**
 * The drifting olive cluster from the marketing site's hero, reduced to a
 * decorative accent for the workspace home page.
 *
 * The public hero runs a physics simulation over six PNGs; that's far too
 * much machinery for a dashboard corner, so these are inline SVG olives —
 * a filled circle plus the off-centre sheen that makes it read as an olive
 * rather than a dot — nudged around by a CSS keyframe. Colors come from the
 * practice palette so the cluster shifts with the theme.
 */
type Blob = {
  color: string
  size: number
  top: number
  left?: number
  right?: number
  drift: 'a' | 'b' | 'c'
  seconds: number
  opacity: number
}

const BLOBS: Blob[] = [
  { color: 'var(--dusk)', size: 96, top: 0, left: 118, drift: 'a', seconds: 2.71, opacity: 0.85 },
  { color: 'var(--slate)', size: 54, top: 88, left: 24, drift: 'b', seconds: 3.29, opacity: 1 },
  { color: 'var(--rose)', size: 80, top: 52, right: -12, drift: 'c', seconds: 2.43, opacity: 0.9 },
  { color: 'var(--gold)', size: 124, top: 142, left: 62, drift: 'a', seconds: 3.71, opacity: 0.85 },
  { color: 'var(--glass)', size: 48, top: 132, right: 8, drift: 'b', seconds: 2.14, opacity: 0.9 },
]

export function OliveBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative hidden h-[290px] w-full lg:block"
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
