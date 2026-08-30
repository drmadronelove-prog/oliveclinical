"use client"

import { useEffect, useRef } from "react"

/**
 * The blob cluster, split into its six individual shapes, which settle in
 * their original arrangement and then slowly drift apart — bouncing off the
 * hero's edges, off the headline and photo bubbles (anything marked
 * `data-blob-obstacle`), and off each other.
 *
 * Percentages below are each shape's position within the original 842x806
 * artwork, so the starting arrangement is pixel-identical to the static
 * cluster it replaces.
 */
const ART_W = 842
const ART_H = 806

const BLOBS = [
  { src: "/blob-1.png", left: 25.416, top: 38.213, w: 42.874, h: 44.293 },
  { src: "/blob-2.png", left: 8.314, top: 5.459, w: 33.135, h: 34.491 },
  { src: "/blob-3.png", left: 63.302, top: 26.675, w: 26.841, h: 28.04 },
  { src: "/blob-4.png", left: 69.477, top: 67.742, w: 23.634, h: 24.69 },
  { src: "/blob-5.png", left: 3.444, top: 64.268, w: 19.24, h: 19.975 },
  { src: "/blob-6.png", left: 45.843, top: 10.298, w: 19.24, h: 19.851 },
]

/**
 * Quarter turn applied to every shape. The artwork's sheen sits upper-left at
 * ~127°; turning it clockwise brings it to ~37° — upper-right, matching where
 * the pimento sits in the Olive Clinical mark, so the shapes read as olives.
 */
const ROTATION = 90

/** Seconds of stillness after load before they start moving. */
const SETTLE_DELAY = 1.6
/** Seconds spent easing from stationary up to full drift speed. */
const SPIN_UP = 2.5
/** Target drift speed, px/sec — slow enough to read as floating. */
const SPEED = 27.3

type Body = {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  el: HTMLDivElement
}

export function HeroDriftingBlobs({ homeSelector }: { homeSelector: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const elRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")

    let raf = 0
    let bodies: Body[] = []
    let running = false
    let elapsed = 0
    let last = 0

    // Lay the blobs out over their "home" box, matching the static cluster.
    function layout() {
      const home = document.querySelector(homeSelector) as HTMLElement | null
      const rootRect = root!.getBoundingClientRect()
      if (!home || rootRect.width === 0) return false
      const hr = home.getBoundingClientRect()
      const originX = hr.left - rootRect.left
      const originY = hr.top - rootRect.top
      const scaleW = hr.width
      const scaleH = (hr.width * ART_H) / ART_W

      bodies = BLOBS.map((b, i) => {
        const el = elRefs.current[i]!
        const w = (b.w / 100) * scaleW
        const h = (b.h / 100) * scaleH
        el.style.width = `${w}px`
        el.style.height = `${h}px`
        const x = originX + (b.left / 100) * scaleW
        const y = originY + (b.top / 100) * scaleH
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${ROTATION}deg)`
        // Give each a distinct heading so they fan out rather than travel as a pack.
        const angle = (i / BLOBS.length) * Math.PI * 2 + Math.random() * 0.9
        return { x, y, r: Math.min(w, h) / 2, vx: Math.cos(angle), vy: Math.sin(angle), el }
      })
      return true
    }

    function obstacles() {
      const rootRect = root!.getBoundingClientRect()
      return Array.from(document.querySelectorAll("[data-blob-obstacle]")).map((n) => {
        const r = (n as HTMLElement).getBoundingClientRect()
        return {
          l: r.left - rootRect.left,
          t: r.top - rootRect.top,
          r: r.right - rootRect.left,
          b: r.bottom - rootRect.top,
        }
      })
    }

    function step(now: number) {
      if (!running) return
      const rootRect = root!.getBoundingClientRect()
      const dt = Math.min((now - last) / 1000, 0.05) // clamp so tab-switches don't teleport
      last = now
      elapsed += dt

      // Hold still, then ease up to speed.
      const t = elapsed - SETTLE_DELAY
      const ramp = t <= 0 ? 0 : Math.min(t / SPIN_UP, 1)
      const speed = SPEED * ramp * ramp * (3 - 2 * ramp) // smoothstep

      if (speed > 0) {
        const obs = obstacles()
        for (const b of bodies) {
          b.x += b.vx * speed * dt
          b.y += b.vy * speed * dt

          // Hero edges
          if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx) }
          if (b.y < 0) { b.y = 0; b.vy = Math.abs(b.vy) }
          const maxX = rootRect.width - b.r * 2
          const maxY = rootRect.height - b.r * 2
          if (b.x > maxX) { b.x = maxX; b.vx = -Math.abs(b.vx) }
          if (b.y > maxY) { b.y = maxY; b.vy = -Math.abs(b.vy) }

          // Page elements — circle vs. rect, pushed out along the shallowest axis
          const cx = b.x + b.r
          const cy = b.y + b.r
          for (const o of obs) {
            const nx = Math.max(o.l, Math.min(cx, o.r))
            const ny = Math.max(o.t, Math.min(cy, o.b))
            let dx = cx - nx
            let dy = cy - ny
            const d2 = dx * dx + dy * dy
            if (d2 >= b.r * b.r) continue
            let d = Math.sqrt(d2)
            if (d === 0) {
              // Centre sits inside the rect — eject via the nearest edge.
              const dl = cx - o.l, dr = o.r - cx, dt2 = cy - o.t, db = o.b - cy
              const m = Math.min(dl, dr, dt2, db)
              dx = m === dl ? -1 : m === dr ? 1 : 0
              dy = m === dt2 ? -1 : m === db ? 1 : 0
              d = 1
            }
            const ux = dx / d
            const uy = dy / d
            const push = b.r - d
            b.x += ux * push
            b.y += uy * push
            const dot = b.vx * ux + b.vy * uy
            if (dot < 0) { b.vx -= 2 * dot * ux; b.vy -= 2 * dot * uy }
          }
        }

        // Blob against blob
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const a = bodies[i], c = bodies[j]
            const dx = (c.x + c.r) - (a.x + a.r)
            const dy = (c.y + c.r) - (a.y + a.r)
            const d = Math.hypot(dx, dy)
            const min = a.r + c.r
            if (d === 0 || d >= min) continue
            const ux = dx / d, uy = dy / d
            const push = (min - d) / 2
            a.x -= ux * push; a.y -= uy * push
            c.x += ux * push; c.y += uy * push
            const rel = (c.vx - a.vx) * ux + (c.vy - a.vy) * uy
            if (rel < 0) {
              a.vx += rel * ux; a.vy += rel * uy
              c.vx -= rel * ux; c.vy -= rel * uy
            }
          }
        }

        for (const b of bodies) {
          // Renormalise so numeric drift can't bleed speed away.
          const m = Math.hypot(b.vx, b.vy) || 1
          b.vx /= m; b.vy /= m
          b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) rotate(${ROTATION}deg)`
        }
      }

      raf = requestAnimationFrame(step)
    }

    function start() {
      if (running || reduced.matches) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(step)
    }
    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    if (!layout()) return
    if (reduced.matches) return

    // Only animate while the hero is actually on screen.
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0 }
    )
    io.observe(root)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVisibility)

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        stop()
        elapsed = SETTLE_DELAY + SPIN_UP // already warmed up; don't re-stall
        if (layout()) start()
      }, 180)
    }
    window.addEventListener("resize", onResize)

    const onMotionChange = () => (reduced.matches ? stop() : start())
    reduced.addEventListener("change", onMotionChange)

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("resize", onResize)
      reduced.removeEventListener("change", onMotionChange)
      clearTimeout(resizeTimer)
    }
  }, [homeSelector])

  return (
    <div ref={rootRef} className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {BLOBS.map((b, i) => (
        <div
          key={b.src}
          ref={(el) => { elRefs.current[i] = el }}
          className="absolute top-0 left-0 will-change-transform"
          style={{ backgroundImage: `url(${b.src})`, backgroundSize: "100% 100%" }}
        />
      ))}
    </div>
  )
}
