"use client"

import Link from "next/link"
import { AnimatedHeading } from "@/components/animated-heading"
import { HeroPhotoBubbles } from "@/components/hero-photo-bubbles"
import { HeroDriftingBlobs } from "@/components/hero-drifting-blobs"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-5 sm:px-8 lg:px-12 pt-12 sm:pt-14 lg:pt-16 pb-14 sm:pb-16 lg:pb-20"
      style={{ backgroundColor: "var(--paper)", backgroundImage: "var(--bg-lines)" }}
    >
      {/* Blobs float over the paper but stay behind the type */}
      <HeroDriftingBlobs homeSelector="[data-blob-home]" />

      {/* Centring the row keeps the two clusters weighted against each other and
          keeps the photo cluster clear of the section's bottom edge, which is
          clipped by overflow-hidden. */}
      <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-8 xl:gap-12">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-7 lg:shrink-0">
          {/* Reserves the blob cluster's footprint so the copy below keeps its
              place; the blobs themselves are drawn by the drifting layer, which
              starts them exactly over this box. */}
          <div
            data-blob-home
            aria-hidden="true"
            className="w-[15rem] sm:w-[18rem] lg:w-[21rem] xl:w-[23rem] 2xl:w-[25rem]"
            style={{ aspectRatio: "842 / 806" }}
          />

          {/* Heading group */}
          <div className="space-y-1" data-blob-obstacle>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.9rem, 7vw, 6rem)",
                fontWeight: 400,
                color: "var(--ink)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                margin: 0,
                whiteSpace: "nowrap",
              }}>
                Neuroinclusive
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AnimatedHeading />
            </motion.div>
          </div>

          {/* Gives the column enough mass to balance the photo cluster, and
              gives the hero the call to action it was missing. */}
          <motion.div
            data-blob-obstacle
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col items-center lg:items-start gap-4"
          >
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md px-6 py-3 text-[0.95rem] transition-opacity hover:opacity-90"
                style={{ fontFamily: "var(--font-body)", fontWeight: 600, background: "var(--gold)", color: "var(--ink)" }}
              >
                Book a consultation
              </Link>
              <Link
                href="#paths"
                className="inline-flex items-center justify-center rounded-md px-6 py-3 text-[0.95rem] transition-colors hover:bg-[rgba(11,37,69,0.04)]"
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  color: "var(--ink)",
                  border: "1px solid var(--border)",
                }}
              >
                See how we help
              </Link>
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                lineHeight: 1.5,
                color: "var(--slate)",
                margin: 0,
              }}
            >
              San Francisco, Oakland &amp; Berkeley — telehealth across CA &amp; CO
            </p>
          </motion.div>
        </div>

        {/* Photo bubbles — mirror the blob cluster's geometry so the two read as
            a matched pair across the row. */}
        <div
          data-blob-obstacle
          className="w-full max-w-sm sm:max-w-md mx-auto lg:mr-0 lg:ml-auto lg:flex-1 lg:min-w-0 lg:max-w-[40rem] 2xl:max-w-[44rem]"
        >
          <HeroPhotoBubbles />
        </div>
      </div>
    </section>
  )
}
