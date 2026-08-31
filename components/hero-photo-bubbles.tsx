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
  { src: "/ChatGPT Image Aug 30, 2026, 04_11_50 PM.png", left: 24.27, top: 38.57, size: 54.48, ring: "var(--gold)", objectPosition: "52% 30%" },
  // Mauve blob, mirrored.
  { src: "/image 1.jpeg", left: 55.00, top: 4.27, size: 42.40, ring: "var(--plum)", objectPosition: "52% 26%" },
  // Rose blob, mirrored.
  { src: "/image 4.jpeg", left: 1.23, top: 27.71, size: 34.18, ring: "var(--rose)", objectPosition: "46% 26%" },
  // Pink blob, mirrored.
  { src: "/image 2.jpeg", left: -1.96, top: 71.90, size: 30.07, ring: "var(--dusk)", objectPosition: "46% 22%" },
  // Sage blob, mirrored.
  { src: "/image 3.jpeg", left: 75.48, top: 66.77, size: 27.93, ring: "var(--glass)", objectPosition: "52% 24%" },
  // Deep navy blob, mirrored.
  { src: "/image 5.jpeg", left: 29.93, top: 10.71, size: 24.29, ring: "var(--slate)", objectPosition: "50% 24%" },
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
