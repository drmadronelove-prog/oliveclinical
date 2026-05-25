"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const PAPER_BG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E\")"

const PALETTE_BORDERS = ["#5b6e88", "#7a4f6e", "#9fb3b0", "#c4877e", "#8c9bb0", "#c5a572"]

type Provider = {
  name: string
  role: string
  specialty: string
  href: string
  image: string
}

const PROVIDERS: Provider[] = [
  {
    name: "Madrone Love, PsyD",
    role: "Olive Clinical Founder",
    specialty: "Psychotherapy and Assessment",
    href: "https://madronelove.com",
    image: "/dr-love.jpg",
  },
  {
    name: "Jasmin Canfield, LCSW",
    role: "Network Provider",
    specialty: "Psychotherapy",
    href: "https://healingwithintention.org/",
    image: "/jasmin canfield.png",
  },
  {
    name: "Melinda Mahler, LPCC",
    role: "Network Provider",
    specialty: "Psychotherapy",
    href: "https://www.psychologytoday.com/us/therapists/melinda-malher-san-francisco-ca/1566575",
    image: "/Melinda Mahler.png",
  },
  {
    name: "Patrick",
    role: "Network Provider",
    specialty: "Psychotherapy",
    href: "https://patricktherapy.com/",
    image: "/Patrick3-1024x1024.jpg",
  },
  {
    name: "Network Provider",
    role: "Clinician",
    specialty: "Psychotherapy",
    href: "#",
    image: "/placeholder-user.jpg",
  },
  {
    name: "Network Provider",
    role: "Clinician",
    specialty: "Psychotherapy",
    href: "#",
    image: "/placeholder-user.jpg",
  },
]

export function ProviderCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
      {PROVIDERS.map((p, i) => (
        <ProviderCard
          key={i}
          provider={p}
          borderColor={PALETTE_BORDERS[i % PALETTE_BORDERS.length]}
        />
      ))}
    </div>
  )
}

function ProviderCard({
  provider,
  borderColor,
}: {
  provider: Provider
  borderColor: string
}) {
  const [hovered, setHovered] = useState(false)
  const isExternal = provider.href.startsWith("http")
  const isPlaceholder = provider.href === "#"

  const card = (
    <motion.div
      animate={{
        y: hovered ? -6 : 0,
        scale: hovered ? 1.04 : 1,
        rotate: 0,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        aspectRatio: "17 / 20",
        backgroundColor: "rgba(251, 248, 243, 0.94)",
        backgroundImage: `${PAPER_BG}, linear-gradient(160deg, ${borderColor}22 0%, ${borderColor}10 100%)`,
        backgroundSize: "200px 200px, cover",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: `1.5px solid ${borderColor}`,
        borderRadius: "12px",
        boxShadow: hovered
          ? `0 14px 32px rgba(11,37,69,0.18), 0 0 0 1px ${borderColor}55`
          : `0 3px 10px rgba(11,37,69,0.08), 0 1px 3px rgba(11,37,69,0.05)`,
        cursor: isPlaceholder ? "default" : "pointer",
        position: "relative",
        overflow: "hidden",
        opacity: isPlaceholder ? 0.85 : 1,
      }}
    >
      {/* Top gloss */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.35) 0%, transparent 55%)",
          borderRadius: "11px",
          pointerEvents: "none",
        }}
      />

      <div className="relative h-full flex flex-col items-center justify-start gap-2 sm:gap-3 p-3 sm:p-5">
        <div
          className="w-[74%] sm:w-[62%]"
          style={{
            aspectRatio: "1 / 1",
            borderRadius: "9999px",
            overflow: "hidden",
            border: `1.5px solid ${borderColor}`,
            boxShadow:
              "0 8px 22px rgba(11,37,69,0.28), 0 3px 8px rgba(11,37,69,0.18), 0 1px 2px rgba(11,37,69,0.10)",
            position: "relative",
            backgroundColor: "rgba(11,37,69,0.04)",
          }}
        >
          <Image
            src={provider.image}
            alt={provider.name}
            fill
            sizes="(max-width: 768px) 60vw, 220px"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="flex flex-col items-center text-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
          <h3
            className="text-[0.85rem] sm:text-[1.05rem]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              color: "var(--ink)",
              lineHeight: 1.15,
              letterSpacing: "-0.012em",
            }}
          >
            {provider.name}
          </h3>
          <p
            className="text-[0.55rem] sm:text-[0.65rem]"
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: borderColor,
              opacity: 0.85,
            }}
          >
            {provider.role}
          </p>
          <p
            className="text-[0.7rem] sm:text-[0.82rem] hidden sm:block"
            style={{
              fontFamily: "var(--font-body)",
              color: "rgba(11,37,69,0.72)",
              lineHeight: 1.3,
              marginTop: "0.15rem",
            }}
          >
            {provider.specialty}
          </p>
        </div>
      </div>
    </motion.div>
  )

  if (isPlaceholder) return card
  return isExternal ? (
    <a href={provider.href} target="_blank" rel="noopener noreferrer">
      {card}
    </a>
  ) : (
    <a href={provider.href}>{card}</a>
  )
}
