"use client"

import Link from "next/link"
import { motion } from "framer-motion"

function CTAButton({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-md px-6 py-3 text-[0.95rem] transition-opacity hover:opacity-90 ${className}`}
      style={{ fontFamily: "var(--font-body)", fontWeight: 600, background: "var(--gold)", color: "var(--ink)" }}
    >
      {children}
    </Link>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 500,
        fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
        color: "var(--ink)",
        letterSpacing: "-0.018em",
        marginBottom: "1.5rem",
        textAlign: "center",
      }}
    >
      {children}
    </h2>
  )
}

const RECOGNITION_ITEMS = [
  "You've long felt different in ways you couldn't quite name.",
  "You've been told you're “too articulate” or “too successful” to be autistic or ADHD.",
  "Earlier providers focused on anxiety or depression, but it never fully explained things.",
  "You mask to get through work and social situations, and it's exhausting.",
  "You've hesitated to seek an assessment because you feared being dismissed or stereotyped.",
]

const ASSESS_FOR = [
  {
    title: "Autism Spectrum (ASD)",
    body: "Identity-affirming autism assessment for adults, including those with high-masking presentations that are often missed or misread.",
  },
  {
    title: "ADHD",
    body: "Evaluation for attention, focus, and executive functioning differences in adults, including people who were overlooked earlier in life.",
  },
  {
    title: "OCD",
    body: "Assessment for obsessive-compulsive disorder in adults, including presentations that go beyond visible compulsions and are often missed.",
  },
]

const PROCESS_STEPS = [
  {
    title: "Reach out",
    body: (
      <>We start with a brief consultation so you can share what's bringing you in and ask questions. No referral needed.</>
    ),
  },
  {
    title: "Intake and questionnaires",
    body: (
      <>Before we meet, you'll complete some background forms and standardized questionnaires at your own pace.</>
    ),
  },
  {
    title: "The assessment",
    body: (
      <>
        A collaborative clinical interview conducted over telehealth, at a pace that works for you. Breaks, stimming,
        camera off — all welcome.
      </>
    ),
  },
  {
    title: "Findings and report",
    body: (
      <>
        We review what I found together, and you receive a comprehensive written report — included with every
        assessment — that you can use for your own understanding and for accommodations where needed.
      </>
    ),
  },
  {
    title: "Where to go next",
    body: (
      <>An assessment is a beginning, not an endpoint. I'll help you think through next steps, whether that's therapy, accommodations, or simply a clearer understanding of yourself.</>
    ),
  },
]

const PRACTICAL_DETAILS = [
  { label: "Format", value: "Telehealth" },
  { label: "Locations served", value: "San Francisco, Oakland & Berkeley, CA" },
  { label: "Ages", value: "Adults" },
]

export default function AssessmentsPage() {
  return (
    <main className="relative bg-background overflow-x-hidden">
      <section
        className="relative"
        style={{ minHeight: "100svh", backgroundColor: "var(--paper)", backgroundImage: "var(--bg-lines)" }}
      >
        <div className="relative px-5 sm:px-6 lg:px-12 pt-8 sm:pt-10 lg:pt-12 pb-24 flex flex-col items-center gap-16 sm:gap-20">

          {/* 1. Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center max-w-2xl"
          >
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.9rem, 5.2vw, 3.4rem)",
                fontWeight: 400,
                color: "var(--ink)",
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Neurodivergent assessment for adults
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
                color: "var(--ink)",
                lineHeight: 1.5,
                marginTop: "1rem",
              }}
            >
              Affirming, unhurried evaluations for autism, ADHD, and OCD — from someone who assumes you know your own
              mind.
            </p>
            <div className="mt-8">
              <CTAButton href="/contact">Book a consultation</CTAButton>
            </div>
          </motion.div>

          {/* 2. You may recognize yourself here */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl"
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.05rem",
                lineHeight: 1.6,
                color: "var(--ink)",
                textAlign: "center",
                marginBottom: "1.75rem",
              }}
            >
              Many of the adults I work with arrive after years of sensing something didn't fit. You might recognize
              some of this:
            </p>
            <ul className="flex flex-col gap-3">
              {RECOGNITION_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "9999px",
                      background: "var(--gold)",
                      flexShrink: 0,
                      marginTop: "0.55em",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.98rem",
                      lineHeight: 1.6,
                      color: "rgba(11,37,69,0.82)",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "var(--ink)",
                textAlign: "center",
                marginTop: "1.75rem",
              }}
            >
              If any of this resonates, you're in a good place to start.
            </p>
          </motion.div>

          {/* 4. What I assess for */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            <SectionHeading>What I assess for</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              {ASSESS_FOR.map((a) => (
                <div
                  key={a.title}
                  className="flex flex-col p-6 rounded-xl"
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
                      fontSize: "1.15rem",
                      fontWeight: 500,
                      color: "var(--ink)",
                      letterSpacing: "-0.012em",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {a.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.92rem",
                      lineHeight: 1.6,
                      color: "rgba(11,37,69,0.75)",
                    }}
                  >
                    {a.body}
                  </p>
                </div>
              ))}
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.92rem",
                color: "rgba(11,37,69,0.65)",
                textAlign: "center",
                marginTop: "1.5rem",
              }}
            >
              These often overlap. Many adults come in wondering about more than one, and the assessment can account
              for that.
            </p>
          </motion.div>

          {/* 5. How the process works */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl"
          >
            <SectionHeading>How the process works</SectionHeading>
            <div className="flex flex-col gap-7">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.title} className="flex gap-4">
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
                        fontSize: "0.94rem",
                        lineHeight: 1.65,
                        color: "rgba(11,37,69,0.75)",
                      }}
                    >
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 6. When another specialist is a better fit */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl"
          >
            <SectionHeading>When another specialist is a better fit</SectionHeading>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.98rem",
                lineHeight: 1.7,
                color: "rgba(11,37,69,0.78)",
                textAlign: "center",
              }}
            >
              Some people need more detailed neuropsychological testing — for example, to identify specific learning
              disabilities or more complex processing differences. When that's the case, I'll refer you to a trusted
              colleague who specializes in that testing, either instead of or alongside working with me. My goal is
              for you to get the right assessment, not just an assessment.
            </p>
          </motion.div>

          {/* 7. Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl"
          >
            <SectionHeading>Pricing</SectionHeading>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.98rem",
                color: "rgba(11,37,69,0.72)",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              Clear, flat-fee pricing. Every assessment includes a comprehensive written report — you'll know the
              full cost before we begin.
            </p>
            <div
              className="text-center rounded-lg px-5 py-3 mb-8 mx-auto"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--ink)",
                background: "rgba(197,165,114,0.22)",
                border: "1px solid rgba(197,165,114,0.5)",
                maxWidth: "34rem",
              }}
            >
              Every assessment includes an in-depth written report — not just a brief diagnostic letter.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div
                className="flex flex-col p-6 sm:p-7 rounded-xl"
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
                    fontSize: "1.2rem",
                    fontWeight: 500,
                    color: "var(--ink)",
                    letterSpacing: "-0.015em",
                    marginBottom: "0.3rem",
                  }}
                >
                  Autism (ASD) or ADHD assessment
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.6rem",
                    fontWeight: 500,
                    color: "var(--plum)",
                    marginBottom: "0.9rem",
                  }}
                >
                  $1,200
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.92rem",
                    lineHeight: 1.6,
                    color: "rgba(11,37,69,0.75)",
                  }}
                >
                  A focused, affirming evaluation for one area, including the clinical interview, questionnaires, and
                  a comprehensive written report you can use for your own understanding and for accommodations at
                  work or school.
                </p>
              </div>
              <div
                className="flex flex-col p-6 sm:p-7 rounded-xl"
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
                    fontSize: "1.2rem",
                    fontWeight: 500,
                    color: "var(--ink)",
                    letterSpacing: "-0.015em",
                    marginBottom: "0.3rem",
                  }}
                >
                  Combined autism and ADHD assessment
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.6rem",
                    fontWeight: 500,
                    color: "var(--plum)",
                    marginBottom: "0.9rem",
                  }}
                >
                  $1,600
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.92rem",
                    lineHeight: 1.6,
                    color: "rgba(11,37,69,0.75)",
                  }}
                >
                  For adults who want both areas evaluated together. Many people come in wondering about more than
                  one, and assessing them together gives a fuller picture in a single process. Also includes the full
                  written report.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 8. Practical details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl"
          >
            <SectionHeading>Practical details</SectionHeading>
            <dl className="flex flex-col gap-4">
              {PRACTICAL_DETAILS.map((d) => (
                <div key={d.label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <dt
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--slate)",
                      minWidth: "9rem",
                      flexShrink: 0,
                    }}
                  >
                    {d.label}
                  </dt>
                  <dd
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.96rem",
                      color: "var(--ink)",
                      margin: 0,
                    }}
                  >
                    {d.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Colorado track — Dr. Lindsay Moskowitz */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl"
          >
            <SectionHeading>Assessments in Colorado</SectionHeading>
            <div
              className="flex flex-col p-6 sm:p-8 rounded-xl text-center"
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
                Colorado
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
                Lindsay Moskowitz, PsyD
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
                Olive Clinical Network Provider
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  color: "rgba(11,37,69,0.78)",
                  marginBottom: "1.5rem",
                }}
              >
                ADHD, autism, and OCD assessments for adults, available via telehealth throughout Colorado.
              </p>
              <CTAButton href="/contact" className="mx-auto">Book a consultation</CTAButton>
            </div>
          </motion.div>

          {/* 9. Closing CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-xl"
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(1.6rem, 3.4vw, 2.2rem)",
                color: "var(--ink)",
                letterSpacing: "-0.018em",
                marginBottom: "0.75rem",
              }}
            >
              Ready when you are
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "rgba(11,37,69,0.78)",
                marginBottom: "2rem",
              }}
            >
              If you've been putting this off, that's okay. When you're ready, I'm here.
            </p>
            <CTAButton href="/contact" className="mx-auto">Book a consultation</CTAButton>
          </motion.div>

        </div>
      </section>
    </main>
  )
}
