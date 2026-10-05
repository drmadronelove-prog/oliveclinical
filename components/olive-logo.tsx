import type { CSSProperties } from "react"
import Image from "next/image"

/**
 * The logo mark, rendered from the artwork in public/. It is a shaded
 * three-dimensional render rather than a flat shape, so it is a raster
 * image and cannot be recoloured — anywhere a tintable single-colour mark
 * is needed, use OliveMarkVector below.
 */
export function OliveMark({
  size = 200,
  style,
}: {
  size?: number | string
  style?: CSSProperties
}) {
  const px = typeof size === "number" ? size : 200
  return (
    <Image
      src="/olive-logo-512.png"
      alt=""
      aria-hidden="true"
      width={px}
      height={px}
      style={{ display: "block", width: size, height: size, ...style }}
      priority
    />
  )
}

const OLIVE_PATH =
  "M 100 30 C 138 30, 166 60, 166 100 C 166 140, 138 170, 100 170 C 62 170, 34 140, 34 100 C 34 60, 62 30, 100 30 Z " +
  "M 108 46 C 120.15 46, 130 55.85, 130 68 C 130 80.15, 120.15 90, 108 90 C 95.85 90, 86 80.15, 86 68 C 86 55.85, 95.85 46, 108 46 Z"

/** Flat, single-colour version of the mark, for places that tint it. */
export function OliveMarkVector({
  ink = "var(--ink)",
  size = 200,
  style,
}: {
  ink?: string
  size?: number | string
  style?: CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      style={{ display: "block", ...style }}
      aria-hidden="true"
    >
      <path d={OLIVE_PATH} fill={ink} fillRule="evenodd" />
    </svg>
  )
}

export function OliveLockup({
  size = 1,
  ink = "var(--ink)",
  className,
}: {
  size?: number
  ink?: string
  className?: string
}) {
  const ms = 72 * size
  const rh = 60 * size
  const fs = 56 * size
  const gp = 22 * size
  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: gp }}
    >
      <OliveMark size={ms} />
      <span
        aria-hidden="true"
        style={{ width: 1.5, height: rh, background: "#cba558" }}
      />
      <span
        style={{
          fontFamily: "var(--font-display), 'Fraunces', Georgia, serif",
          fontWeight: 400,
          fontSize: fs,
          letterSpacing: "-0.02em",
          color: ink,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        Olive Clinical
      </span>
    </span>
  )
}
