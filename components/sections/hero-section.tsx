"use client"

import Image from "next/image"
import { HeroCards } from "@/components/hero-cards"
import { AnimatedHeading } from "@/components/animated-heading"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative"
      style={{ minHeight: "100svh", backgroundColor: "var(--paper)", backgroundImage: "var(--bg-lines)" }}
    >
      {/* Main content — same max-w-[1400px] px frame as the nav so the
          blob/heading left edge lines up with the lockup and the card
          grid's right edge lines up with the nav's right edge. */}
      <div
        className="relative min-h-[100svh] max-w-[1400px] mx-auto flex flex-col justify-end px-5 sm:px-8 lg:px-12 pt-8 sm:pt-10 lg:pt-12 pb-10"
        style={{ zIndex: 2 }}
      >
        <div className="flex flex-col gap-6 w-full lg:max-w-none mx-auto">

          {/* On phone/tablet the cluster + heading stack in one centered
              column. On desktop `lg:contents` dissolves this wrapper so the
              cluster and heading become independent absolutely-positioned
              blocks. */}
          <div className="shrink-0 mx-auto flex flex-col items-stretch max-w-[340px] gap-6 text-center lg:text-left lg:contents">

            {/* Blob cluster — transparent PNG, drops straight onto the paper */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="lg:absolute lg:left-12 lg:top-[3rem] lg:w-[clamp(18rem,56svh,76rem)]"
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
            <div className="space-y-1 lg:absolute lg:left-12 lg:bottom-[clamp(0.5rem,4svh,10rem)] lg:max-w-none">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:absolute lg:right-12 lg:top-1/2 lg:-translate-y-1/2"
          >
            <HeroCards />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
