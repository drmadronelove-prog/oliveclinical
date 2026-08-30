"use client"

import Link from "next/link"
import { motion } from "framer-motion"

type StateTrack = {
  state: string
  provider: string
  descriptor: string
  blurb: string
}

const TRACKS: StateTrack[] = [
  {
    state: "California",
    provider: "Madrone Love, PsyD",
    descriptor: "Licensed Psychologist",
    blurb: "ADHD, autism, and OCD assessments for adults, available via telehealth throughout California.",
  },
  {
    state: "Colorado",
    provider: "Lindsay Moskowitz, PsyD",
    descriptor: "Olive Clinical Network Provider",
    blurb: "ADHD, autism, and OCD assessments for adults, available via telehealth throughout Colorado.",
  },
]

const PROCESS_STEPS = [
  {
    title: "Consultation",
    body: "A brief call to talk through what you're noticing, your goals for the assessment, and whether it's a good fit.",
  },
  {
    title: "Clinical interview",
    body: "An in-depth conversation about your developmental, academic, occupational, and personal history.",
  },
  {
    title: "Standardized measures",
    body: "Validated questionnaires and rating scales relevant to the conditions being assessed.",
  },
  {
    title: "Feedback & report",
    body: "A feedback session to review results together, followed by a written report you can share with providers, schools, or employers as needed.",
  },
]

const FAQS = [
  {
    q: "What conditions do you assess for?",
    a: "Olive Clinical provides diagnostic assessments for ADHD, autism (ASD), and OCD, including evaluation of co-occurring conditions where relevant.",
  },
  {
    q: "Do you offer assessments in Colorado?",
    a: "Yes. Diagnostic assessments for adults in Colorado are provided by Dr. Lindsay Moskowitz, PsyD. Ongoing psychotherapy is currently only available to clients in California.",
  },
  {
    q: "Are assessments available for children or teens?",
    a: "Not currently — diagnostic assessments are available for adults (18+) only.",
  },
  {
    q: "Are these assessments conducted virtually?",
    a: "Yes. All diagnostic assessments are conducted via telehealth, so you can complete the process from home.",
  },
  {
    q: "I'm not sure if I need a full assessment yet — is there somewhere to start?",
    a: "Our free self-report screening tools are a good starting point if you want to explore before booking a full evaluation.",
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

export default function AssessmentsPage() {
  return (
    <main className="relative bg-background overflow-x-hidden">
      <section
        className="relative"
        style={{ minHeight: "100svh", backgroundColor: "var(--paper)", backgroundImage: "var(--bg-lines)" }}
      >
        <div className="relative px-5 sm:px-6 lg:px-12 pt-8 sm:pt-10 lg:pt-12 pb-20 flex flex-col items-center gap-12 sm:gap-14">
          {/* Hero */}
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
              }}
            >
              Diagnostic{" "}
              <span
                className="italic"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--plum)" }}
              >
                assessments
              </span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                color: "var(--ink)",
                lineHeight: 1.4,
                marginTop: "0.9rem",
              }}
            >
              Virtual evaluations for ADHD, autism, and OCD.
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
              Telehealth · Adults 18+
            </p>
          </motion.div>

          {/* State tracks */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
          >
            {TRACKS.map((t) => (
              <div
                key={t.state}
                className="flex flex-col p-6 sm:p-7 rounded-xl"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  boxShadow: "0 3px 10px rgba(11,37,69,0.08), 0 1px 3px rgba(11,37,69,0.05)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--plum)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {t.state}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.3rem",
                    fontWeight: 500,
                    color: "var(--ink)",
                    letterSpacing: "-0.015em",
                    marginBottom: "0.2rem",
                  }}
                >
                  {t.provider}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--slate)",
                    marginBottom: "0.9rem",
                  }}
                >
                  {t.descriptor}
                </p>
                <p
                  className="flex-1"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    color: "rgba(11,37,69,0.78)",
                    marginBottom: "1.5rem",
                  }}
                >
                  {t.blurb}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-[0.88rem] transition-opacity hover:opacity-90 self-start"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 600, background: "var(--gold)", color: "var(--ink)" }}
                >
                  Book a consultation
                </Link>
              </div>
            ))}
          </motion.div>

          {/* Process */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="w-full max-w-3xl"
          >
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
              What to expect
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.title} className="flex gap-3">
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.85rem",
                      color: "var(--gold)",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 500,
                        fontSize: "1.05rem",
                        color: "var(--ink)",
                        letterSpacing: "-0.01em",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.92rem",
                        lineHeight: 1.6,
                        color: "rgba(11,37,69,0.72)",
                      }}
                    >
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
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
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                color: "rgba(11,37,69,0.65)",
                textAlign: "center",
                marginTop: "2rem",
              }}
            >
              Want to explore first? Try our free{" "}
              <Link href="/tests" style={{ color: "var(--plum)", fontWeight: 600 }}>
                self-report screening tools
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
