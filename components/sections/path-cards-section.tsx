"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const CARDS = [
  {
    title: "Therapy",
    description: "Ongoing neuroinclusive psychotherapy.",
    linkText: "Learn more",
    href: "/psychotherapy",
  },
  {
    title: "Assessment",
    description: "ADHD, autism, and co-occurring evaluations.",
    linkText: "Learn more",
    href: "/assessments",
  },
  {
    title: "Free resources",
    description: "Skills, tools, and brain games to explore.",
    linkText: "Browse",
    href: "/tools",
  },
]

export function PathCardsSection() {
  return (
    <section
      id="paths"
      className="scroll-mt-24 px-5 sm:px-8 lg:px-12 py-14 sm:py-16"
      style={{ backgroundColor: "var(--paper)", backgroundImage: "var(--bg-lines)" }}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link
              href={card.href}
              className="flex flex-col h-full p-6 sm:p-7 rounded-xl transition-transform duration-200 hover:-translate-y-1"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "0 3px 10px rgba(11,37,69,0.08), 0 1px 3px rgba(11,37,69,0.05)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.4rem",
                  fontWeight: 500,
                  color: "var(--ink)",
                  letterSpacing: "-0.015em",
                  marginBottom: "0.6rem",
                }}
              >
                {card.title}
              </h3>
              <p
                className="flex-1"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.98rem",
                  lineHeight: 1.6,
                  color: "var(--slate)",
                  marginBottom: "1.25rem",
                }}
              >
                {card.description}
              </p>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  color: "var(--plum)",
                }}
              >
                {card.linkText}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
