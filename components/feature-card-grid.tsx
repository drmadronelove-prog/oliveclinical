"use client"

import { useState, useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

const PAPER_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E\")"

const VARIANTS = [
  { accent: "#5b6e88", surface: "#f2f2f2" }, // slate on paper
  { accent: "#7a4f6e", surface: "#e8e8e8" }, // plum on linen
  { accent: "#8c9bb0", surface: "#f2f2f2" }, // mist on paper
]

type CommonCard = {
  title: string
  category: string
  footerLabel: string
}

export type FeatureCard =
  | (CommonCard & {
      kind: "modal"
      modalTitle?: string
      modalSubtitle?: string
      content: ReactNode
    })
  | (CommonCard & { kind: "link"; href: string })

export type ModalSize = "default" | "wide"

export function FeatureCardGrid({
  cards,
  modalSize = "default",
}: {
  cards: FeatureCard[]
  modalSize?: ModalSize
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const active = activeIndex != null ? cards[activeIndex] : null

  // While a modal is open, mark the document so @media print rules can
  // collapse everything except the modal content. This makes the
  // "Print / Save as PDF" buttons inside assessments and worksheets
  // print just the modal contents instead of the whole page (with the
  // modal hidden by `.no-print`).
  useEffect(() => {
    const root = document.documentElement
    if (active) root.classList.add("fcg-modal-open")
    else root.classList.remove("fcg-modal-open")
    return () => root.classList.remove("fcg-modal-open")
  }, [active])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {cards.map((card, i) => (
          <FeatureCardView
            key={`${card.title}-${i}`}
            card={card}
            index={i}
            onOpen={() => setActiveIndex(i)}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && active.kind === "modal" && (
          <Modal onClose={() => setActiveIndex(null)} size={modalSize}>
            {(active.modalTitle || active.modalSubtitle) && (
              <div className="mb-4 pr-8">
                {active.modalTitle && (
                  <h2
                    className="text-xl sm:text-2xl text-foreground"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      letterSpacing: "-0.018em",
                    }}
                  >
                    {active.modalTitle}
                  </h2>
                )}
                {active.modalSubtitle && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {active.modalSubtitle}
                  </p>
                )}
              </div>
            )}
            {active.content}
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}

function FeatureCardView({
  card,
  index,
  onOpen,
}: {
  card: FeatureCard
  index: number
  onOpen: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const variant = VARIANTS[index % VARIANTS.length]

  const inner = (
    <motion.div
      animate={{
        y: hovered ? -6 : 0,
        scale: hovered ? 1.03 : 1,
        rotate: 0,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full"
      style={{
        aspectRatio: "5 / 4",
        backgroundColor: variant.surface,
        backgroundImage: PAPER_BG,
        backgroundSize: "200px 200px",
        border: `1px solid rgba(11,37,69,0.18)`,
        boxShadow: hovered
          ? `0 14px 32px rgba(11,37,69,0.18)`
          : `0 6px 18px rgba(11,37,69,0.08)`,
        cursor: "pointer",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <div className="relative h-full flex flex-col justify-between p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <span
            className="text-[0.65rem]"
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: variant.accent,
              opacity: 0.85,
            }}
          >
            {card.category}
          </span>
          <span
            className="text-[0.65rem] shrink-0"
            style={{
              fontFamily: "var(--font-mono)",
              color: "rgba(11,37,69,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3
          className="text-[1.4rem] sm:text-[1.7rem] leading-tight text-center px-2"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            color: "var(--ink)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {card.title}
        </h3>

        <div
          className="flex items-center gap-2 text-[0.7rem]"
          style={{
            fontFamily: "var(--font-mono)",
            color: variant.accent,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          <span>{card.footerLabel}</span>
          <svg
            width="14"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  )

  if (card.kind === "link") {
    return (
      <a href={card.href} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    )
  }
  return (
    <button
      type="button"
      onClick={onOpen}
      className="block w-full text-left appearance-none bg-transparent border-0 p-0"
    >
      {inner}
    </button>
  )
}

function Modal({
  children,
  onClose,
  size,
}: {
  children: ReactNode
  onClose: () => void
  size: ModalSize
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const maxW = size === "wide" ? "max-w-5xl" : "max-w-xl"

  const modal = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fcg-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/55"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className={`fcg-modal-content bg-background rounded-xl border border-border w-full ${maxW} max-h-[92vh] overflow-y-auto p-5 sm:p-7 relative`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="no-print absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-1.5 sm:p-1 rounded-full bg-background/70 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </motion.div>
    </motion.div>
  )

  if (!mounted) return null
  return createPortal(modal, document.body)
}
