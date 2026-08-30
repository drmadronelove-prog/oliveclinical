"use client"

import Image from "next/image"
import { AnimatedHeading } from "@/components/animated-heading"
import { HeroPhotoBubbles } from "@/components/hero-photo-bubbles"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative px-5 sm:px-8 lg:px-12 pt-14 sm:pt-16 lg:pt-20 pb-16 sm:pb-20"
      style={{ backgroundColor: "var(--paper)", backgroundImage: "var(--bg-lines)" }}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-8 xl:gap-12">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-8 lg:shrink-0">
          {/* Blob cluster — transparent PNG, drops straight onto the paper */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="w-[16rem] sm:w-[19rem] lg:w-[22rem]"
          >
            <Image
              src="/blobs1.png"
              alt=""
              aria-hidden="true"
              width={842}
              height={806}
              priority
              className="w-full h-auto select-none pointer-events-none"
            />
          </motion.div>

          {/* Heading group */}
          <div className="space-y-1">
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

        {/* Photo bubbles — mirror the blob cluster's geometry to balance the page */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none lg:mx-0 lg:flex-1 lg:min-w-0">
          <HeroPhotoBubbles />
        </div>
      </div>
    </section>
  )
}
