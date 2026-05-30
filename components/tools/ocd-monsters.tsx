"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

const MONSTERS = [
  {
    id: "whatifs",
    name: "The What-Ifs",
    src: "/whatifs.png",
    accent: "#B45309",
    bg: "#FEF3C7",
    rotate: "-2deg",
  },
  {
    id: "itspossibles",
    name: "The It's Possibles",
    src: "/itspossibles.png",
    accent: "#0369A1",
    bg: "#E0F2FE",
    rotate: "1.5deg",
  },
  {
    id: "ohnos",
    name: "The Oh Nos",
    src: "/ohnos.png",
    accent: "#9B1C1C",
    bg: "#FEE2E2",
    rotate: "-1deg",
  },
  {
    id: "mights",
    name: "The Mights",
    src: "/mights.png",
    accent: "#5B21B6",
    bg: "#EDE9FE",
    rotate: "2deg",
  },
]

function Polaroid({
  monster,
  size,
  onClick,
}: {
  monster: typeof MONSTERS[number]
  size: "normal" | "expanded"
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)
  const isExpanded = size === "expanded"

  return (
    <div
      onMouseEnter={() => !isExpanded && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: isExpanded
          ? "rotate(0deg)"
          : hovered
          ? "rotate(0deg) translateY(-10px) scale(1.04)"
          : `rotate(${monster.rotate}) translateY(0px) scale(1)`,
        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        cursor: isExpanded ? "zoom-out" : "zoom-in",
      }}
    >
      <div style={{
        background: "#fff",
        padding: isExpanded ? "16px 16px 52px 16px" : "10px 10px 32px 10px",
        boxShadow: isExpanded
          ? "0 32px 80px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.18)"
          : hovered
          ? "0 20px 40px rgba(0,0,0,0.22), 0 4px 10px rgba(0,0,0,0.14)"
          : "0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.08)",
        transition: "box-shadow 0.25s ease",
        width: isExpanded ? "min(1600px, 88vw, 78vh)" : "100%",
        maxWidth: isExpanded ? undefined : 400,
      }}>
        <div style={{
          width: "100%",
          aspectRatio: "1 / 1",
          background: monster.bg,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={monster.src}
              alt={monster.name}
              onError={() => setImgError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 16 }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" fill={monster.accent} opacity="0.15" />
                <text x="24" y="31" textAnchor="middle" fontSize="22" fill={monster.accent}>👾</text>
              </svg>
              <span style={{ fontSize: 10, color: monster.accent, fontWeight: 600, textAlign: "center", letterSpacing: "0.04em" }}>
                image coming soon
              </span>
            </div>
          )}
        </div>

        <div style={{
          paddingTop: isExpanded ? 14 : 10,
          textAlign: "center",
          fontFamily: "var(--font-display, Georgia, serif)",
          fontSize: isExpanded ? 22 : 15,
          fontWeight: 400,
          color: "#1a1a1a",
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
        }}>
          {monster.name}
        </div>
      </div>
    </div>
  )
}

function LightboxPortal({ monster, onClose }: { monster: typeof MONSTERS[number]; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "moc-fade-in 0.18s ease",
      }}
    >
      <style>{`@keyframes moc-fade-in { from { opacity: 0 } to { opacity: 1 } }`}</style>
      <div style={{ animation: "moc-pop-in 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <style>{`@keyframes moc-pop-in { from { transform: scale(0.82) } to { transform: scale(1) } }`}</style>
        <Polaroid monster={monster} size="expanded" onClick={onClose} />
      </div>
    </div>,
    document.body
  )
}

export function OCDMonsters() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const expandedMonster = MONSTERS.find(m => m.id === expanded) ?? null

  return (
    <div style={{ padding: "4px 0 12px", maxWidth: 580, margin: "0 auto" }}>
      <p style={{
        fontSize: 15, color: "#333", lineHeight: 1.65,
        marginBottom: 32, textAlign: "center",
        fontFamily: "var(--font-body, system-ui, sans-serif)",
      }}>
        Everyone with OCD is plagued by OCD monsters. The what-ifs, oh-nos,
        it&apos;s possibles, and the mights are popular monsters that are essential
        to get to know in OCD treatment.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "48px 40px",
        padding: "20px 8px 32px",
      }}>
        {MONSTERS.map(monster => (
          <Polaroid
            key={monster.id}
            monster={monster}
            size="normal"
            onClick={() => setExpanded(monster.id)}
          />
        ))}
      </div>

      {expandedMonster && (
        <LightboxPortal monster={expandedMonster} onClose={() => setExpanded(null)} />
      )}
    </div>
  )
}
