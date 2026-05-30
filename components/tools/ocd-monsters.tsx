"use client"

import { useState } from "react"

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

function MonsterFrame({ monster }: { monster: typeof MONSTERS[number] }) {
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: hovered ? "rotate(0deg) translateY(-10px) scale(1.04)" : `rotate(${monster.rotate}) translateY(0px) scale(1)`,
        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        cursor: "default",
      }}
    >
      {/* Polaroid frame */}
      <div style={{
        background: "#fff",
        padding: "10px 10px 32px 10px",
        boxShadow: hovered
          ? "0 20px 40px rgba(0,0,0,0.22), 0 4px 10px rgba(0,0,0,0.14)"
          : "0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.08)",
        transition: "box-shadow 0.25s ease",
        maxWidth: 200,
        width: "100%",
      }}>
        {/* Image area */}
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
            /* Placeholder when image not yet uploaded */
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 8, padding: 16,
            }}>
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

        {/* Monster name in polaroid caption area */}
        <div style={{
          paddingTop: 10, textAlign: "center",
          fontFamily: "var(--font-display, Georgia, serif)",
          fontSize: 15, fontWeight: 400,
          color: "#1a1a1a", letterSpacing: "-0.01em",
          lineHeight: 1.2,
        }}>
          {monster.name}
        </div>
      </div>
    </div>
  )
}

export function OCDMonsters() {
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
        gap: "40px 32px",
        padding: "20px 24px 32px",
      }}>
        {MONSTERS.map(monster => (
          <MonsterFrame key={monster.id} monster={monster} />
        ))}
      </div>
    </div>
  )
}
