"use client"

import Image from "next/image"
import { motion } from "framer-motion"

/**
 * Photo bubbles that mirror the blob cluster on the left.
 *
 * Geometry is a horizontal mirror of blobs1.png, measured from the source
 * artwork: same six circle sizes, same spacing, same colour per circle —
 * so the two clusters read as a matched pair rather than two unrelated
 * groups. Coordinates are percentages of a square container: `left`/`top`
 * are the circle's top-left corner, `size` its diameter.
 */
type Bubble = {
  src: string
  left: number
  top: number
  size: number
  ring: string
  objectPosition: string
}

// Normalised so the circles' bounding box fills the container edge to edge —
// the source art carries uneven padding, which mirroring would otherwise flip
// into a visible left/right margin mismatch against the blobs. Vertically the
// ink is flush to the container's bottom (top 7.04% → bottom 100%), so
// bottom-aligning the container lines the lowest bubble up with the headline.
const BUBBLES: Bubble[] = [
  // Large tan blob, mirrored — the anchor of the cluster.
  { src: "/ChatGPT Image Aug 30, 2026, 04_11_50 PM.png", left: 27.54, top: 41.84, size: 47.94, ring: "var(--gold)", objectPosition: "52% 30%" },
  // Mauve blob, mirrored.
  { src: "/image 1.jpeg", left: 57.55, top: 6.82, size: 37.31, ring: "var(--plum)", objectPosition: "52% 26%" },
  // Rose blob, mirrored.
  { src: "/image 4.jpeg", left: 3.28, top: 29.76, size: 30.08, ring: "var(--rose)", objectPosition: "46% 26%" },
  // Pink blob, mirrored.
  { src: "/image 2.jpeg", left: -0.16, top: 73.71, size: 26.46, ring: "var(--dusk)", objectPosition: "46% 22%" },
  // Sage blob, mirrored.
  { src: "/image 3.jpeg", left: 77.16, top: 68.45, size: 24.58, ring: "var(--glass)", objectPosition: "52% 24%" },
  // Deep navy blob, mirrored.
  { src: "/image 5.jpeg", left: 31.39, top: 12.17, size: 21.38, ring: "var(--slate)", objectPosition: "50% 24%" },
]

export function HeroPhotoBubbles() {
  return (
    <div className="relative w-full aspect-square">
      {BUBBLES.map((b, i) => (
        <motion.div
          key={b.src}
          initial={{ opacity: 0, scale: 0.82, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="absolute"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: `${b.size}%`,
            aspectRatio: "1 / 1",
          }}
        >
          <div
            className="relative w-full h-full rounded-full overflow-hidden"
            style={{
              border: `3.04px solid ${b.ring}`,
              boxShadow: "0 10px 26px rgba(11,37,69,0.14), 0 2px 6px rgba(11,37,69,0.08)",
            }}
          >
            <Image
              src={b.src}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 1024px) 40vw, 20vw"
              className="select-none pointer-events-none"
              style={{ objectFit: "cover", objectPosition: b.objectPosition }}
            />
            {/* Soft top gloss, echoing the sheen on the blob artwork */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.22) 0%, transparent 52%)",
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
