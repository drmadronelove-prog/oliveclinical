"use client"

import { ProviderCards } from "@/components/provider-cards"
import { motion } from "framer-motion"

const FAQS = [
  {
    q: "Do you offer ADHD assessments in Berkeley, CA?",
    a: "Yes. Dr. Love provides comprehensive ADHD assessments for teens and adults in Berkeley, CA, and via telehealth throughout California.",
  },
  {
    q: "Do you offer autism assessments for adults?",
    a: "Yes. Autism assessments are available for adults and teens, conducted in a neuroinclusive, affirming way that focuses on understanding your experience rather than pathologizing it.",
  },
  {
    q: "Can I get an ADHD or autism assessment via telehealth in California?",
    a: "Yes. Telehealth assessments and psychotherapy are available anywhere in California, in addition to in-person sessions in Berkeley.",
  },
  {
    q: "What does ‘neuroinclusive’ therapy mean?",
    a: "Neuroinclusive therapy affirms neurodivergent ways of thinking, feeling, and relating — including ADHD, autism, and other forms of neurodivergence — rather than treating them as something to be fixed or normalized. It centers understanding how your brain works and building on your strengths.",
  },
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
}

export default function PsychotherapyPage() {
  return (
    <main className="relative bg-background overflow-x-hidden">
      <section
        className="relative"
        style={{ minHeight: "100svh", backgroundColor: "var(--paper)", backgroundImage: "var(--bg-lines)" }}
      >
        <div className="relative px-5 sm:px-6 lg:px-12 pt-8 sm:pt-10 lg:pt-12 pb-20 flex flex-col items-center gap-10 sm:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center max-w-2xl"
          >
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.9rem, 6vw, 4.2rem)",
                fontWeight: 400,
                color: "var(--ink)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              Neuroinclusive
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1.25rem, 2vw, 1.6rem)",
                color: "var(--ink)",
                lineHeight: 1.3,
                marginTop: "0.4rem",
              }}
            >
              psychotherapy and{" "}
              <span
                className="italic"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  color: "var(--plum)",
                }}
              >
                assessment
              </span>
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(11,37,69,0.55)",
                marginTop: "1.4rem",
              }}
            >
              Clinical Providers
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full"
          >
            <ProviderCards />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-2xl"
          >
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                color: "var(--ink)",
                letterSpacing: "-0.018em",
                marginBottom: "1.75rem",
                textAlign: "center",
              }}
            >
              Frequently asked questions
            </h2>
            <div className="flex flex-col gap-6">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "1.05rem",
                      color: "var(--plum)",
                      letterSpacing: "-0.01em",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {f.q}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: "rgba(11,37,69,0.78)",
                    }}
                  >
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
