"use client"

import Image from "next/image"
import { AnimatedHeading } from "@/components/animated-heading"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative px-5 sm:px-8 lg:px-12 pt-14 sm:pt-16 lg:pt-20 pb-16 sm:pb-20"
      style={{ backgroundColor: "var(--paper)", backgroundImage: "var(--bg-lines)" }}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row xl:items-center gap-10 xl:gap-10">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-8 xl:shrink-0">
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

        {/* People illustration — transparent PNG, fills the open space beside the hero text on wide screens */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="w-full max-w-sm sm:max-w-md mx-auto xl:max-w-none xl:flex-1 xl:min-w-0 xl:mx-0"
        >
          <Image
            src="/hero-people-illustration.png"
            alt=""
            aria-hidden="true"
            width={1152}
            height={550}
            className="w-full h-auto select-none pointer-events-none xl:ml-auto"
            style={{ maxWidth: "32rem" }}
          />
        </motion.div>
      </div>
    </section>
  )
}
