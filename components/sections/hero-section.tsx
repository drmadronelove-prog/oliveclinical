"use client"

import { AnimatedHeading } from "@/components/animated-heading"
import { HeroPhotoBubbles } from "@/components/hero-photo-bubbles"
import { HeroDriftingBlobs } from "@/components/hero-drifting-blobs"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-5 sm:px-8 lg:px-12 pt-14 sm:pt-16 lg:pt-20 pb-16 sm:pb-20"
      style={{ backgroundColor: "var(--paper)", backgroundImage: "var(--bg-lines)" }}
    >
      {/* Blobs float over the paper but stay behind the type */}
      <HeroDriftingBlobs homeSelector="[data-blob-home]" />

      <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col lg:flex-row lg:items-end gap-12 lg:gap-8 xl:gap-12">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-8 lg:shrink-0">
          {/* Reserves the blob cluster's original footprint so the headline keeps
              its position; the blobs themselves are drawn by the drifting layer,
              which starts them exactly over this box. */}
          <div
            data-blob-home
            aria-hidden="true"
            className="w-[16rem] sm:w-[19rem] lg:w-[24rem] xl:w-[26rem] 2xl:w-[28rem]"
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
        </div>

        {/* Photo bubbles — mirror the blob cluster's geometry. The row is
            bottom-aligned and the cluster's ink sits flush to this box's lower
            edge, so the lowest bubble lines up with the bottom of "different." */}
        <div
          data-blob-obstacle
          className="w-full max-w-sm sm:max-w-md mx-auto lg:mr-0 lg:ml-auto lg:flex-1 lg:min-w-0 lg:max-w-[42rem] 2xl:max-w-[46rem]"
        >
          <HeroPhotoBubbles />
        </div>
      </div>
    </section>
  )
}
