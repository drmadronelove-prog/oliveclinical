"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

const PAPER_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")"

// Each card gets a clear colour identity from the settled palette: a
// saturated accent (border + stripe + labels) over a soft matching tint.
const VARIANTS = [
  { accent: "#5b6e88", surface: "#edf0f4" }, // slate
  { accent: "#7a4f6e", surface: "#f2e9ef" }, // plum
  { accent: "#c5a572", surface: "#f5efe0" }, // gold
  { accent: "#9fb3b0", surface: "#e9f0ee" }, // glass
  { accent: "#c4877e", surface: "#f6ece7" }, // rose
  { accent: "#8c9bb0", surface: "#ecf0f4" }, // mist
]

export type BlogHeroCardData = {
  slug: string
  title: string
  category?: string
  date?: string
}

export function BlogHeroCard({
  post,
  index,
}: {
  post: BlogHeroCardData
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  const variant = VARIANTS[index % VARIANTS.length]

  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <motion.div
        animate={{ y: isHovered ? -5 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full"
        style={{
          aspectRatio: "5 / 4",
          backgroundColor: variant.surface,
          backgroundImage: PAPER_BG,
          backgroundSize: "200px 200px",
          border: `1.5px solid ${variant.accent}`,
          borderRadius: "4px",
          boxShadow: isHovered
            ? `0 16px 34px -12px ${variant.accent}66`
            : `0 6px 16px -8px rgba(11,37,69,0.18)`,
          cursor: "pointer",
          overflow: "hidden",
          transition: "box-shadow 0.2s ease",
        }}
      >
        {/* Left accent stripe — editorial anchor */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0"
          style={{ width: "6px", background: variant.accent }}
        />

        <div className="relative h-full flex flex-col justify-between p-5 sm:p-7 pl-7 sm:pl-9">
          <div className="flex items-start justify-between gap-3">
            <span
              className="text-[0.66rem]"
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: variant.accent,
              }}
            >
              {post.category ?? "Essay"}
            </span>
            {post.date && (
              <span
                className="text-[0.66rem] shrink-0"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "rgba(11,37,69,0.4)",
                  letterSpacing: "0.1em",
                }}
              >
                {post.date}
              </span>
            )}
          </div>

          <h3
            className="text-[1.4rem] sm:text-[1.7rem] leading-tight text-left"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              color: "var(--ink)",
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
            }}
          >
            {post.title}
          </h3>

          <div className="flex items-center justify-between gap-3">
            <span
              className="flex items-center gap-2 text-[0.7rem]"
              style={{
                fontFamily: "var(--font-mono)",
                color: variant.accent,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Read essay
              <svg
                width="16"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isHovered ? "translateX(3px)" : "translateX(0)",
                  transition: "transform 0.2s ease",
                }}
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
