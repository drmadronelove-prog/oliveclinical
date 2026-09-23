"use client"

import Link from "next/link"
import { motion } from "framer-motion"

// Every CTA on this page points at the free 15-minute consult. Swap this
// one constant if the booking link ever changes.
const CONSULT_HREF = "https://calendar.app.google/8JgFfgxurfS5xqDP7"
const CONSULT_LABEL = "Book a free 15-minute consult"

function CTAButton({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const external = href.startsWith("http")
  return (
    <Link
      href={href}
      // The booking tool is on someone else's domain, so it opens in a new
      // tab and gets the usual rel guard.
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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

function BodyText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={className}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.98rem",
        lineHeight: 1.7,
        color: "rgba(11,37,69,0.78)",
      }}
    >
      {children}
    </p>
  )
}

const HERO_STRIP = [
  "Telehealth across California and Colorado",
  "Three-week wait",
  "Full written report included",
]

const RECOGNITION_ITEMS = [
  "You have felt different in ways you could never quite name.",
  "Someone told you that you are too articulate, too successful, or too social to be autistic or ADHD.",
  "You have been treated for anxiety or depression and it helped, but it never explained the whole thing.",
  "You mask your way through work and social life and it costs you more than anyone sees.",
  "You have put this off because you were afraid of being dismissed, or of being told what you already suspect but in a way that makes you feel small.",
  "You want an answer you can actually do something with, not a label.",
]

const ASSESS_FOR = [
  {
    title: "Autism spectrum",
    body: "Identity-affirming autism assessment for adults, with particular attention to high-masking presentations that get missed or misread for decades. This includes adults who were assessed as children and told they did not qualify, and adults whose autism looks like burnout, social exhaustion, or lifelong anxiety from the outside.",
  },
  {
    title: "ADHD",
    body: "Evaluation of attention, focus, and executive functioning in adults, including people whose grades or careers kept them off anyone's radar until the demands outgrew the compensations.",
  },
  {
    title: "OCD",
    body: "Assessment for obsessive-compulsive disorder in adults, including the presentations that have no visible compulsions at all: rumination, mental reviewing, reassurance-seeking, and intrusive thoughts that have never been said out loud to anyone.",
  },
  {
    title: "PTSD and trauma",
    body: "Assessment for post-traumatic stress in adults, including the long-running presentations that were never named as trauma at the time. Trauma and neurodivergence are routinely mistaken for each other, so this is assessed alongside the rest rather than in isolation.",
  },
  {
    title: "PDA and demand sensitivity",
    body: "Many autistic adults describe an overwhelming resistance to demands, including demands they set for themselves. It is not laziness and it is not defiance. If this is part of why you are here, I assess for it and I address it directly in the report.",
  },
]

const PROCESS_STEPS = [
  {
    title: "A free 15-minute consult",
    body: "You tell me what brings you in, I tell you whether an assessment is the right step and what it would cover. No referral needed. If I am not the right person, I will say so on this call.",
  },
  {
    title: "Intake and questionnaires",
    body: "Before we meet, you complete background forms and standardized questionnaires at your own pace. If you would like, someone who knows you well can complete a brief observer questionnaire too. That outside perspective is genuinely useful for adults who mask, and it is optional.",
  },
  {
    title: "The clinical interview",
    body: "Two to three hours over telehealth, usually split across two sessions. Breaks whenever you want them, stimming welcome, camera off is fine, and you can have notes in front of you. Nothing about this is a test you can fail or perform your way through.",
  },
  {
    title: "Findings and report",
    body: "We meet again to go through what I found, in conversation, with room for your questions and your disagreement. You receive the full written report within one week of that session.",
  },
  {
    title: "What comes next",
    body: "An assessment is a beginning. I will help you think through next steps, whether that is therapy, medication consultation, workplace accommodations, or just a clearer understanding of the last thirty years.",
  },
]

const REPORT_CONTENTS = [
  "A plain-language summary on the first page that you could hand to a family member.",
  "Your history and what you reported, written so you recognize yourself in it.",
  "Every diagnostic criterion addressed individually, with the specific evidence for or against it. Not a checklist and not a paragraph of conclusions you have to take on faith.",
  "Test results with what each measure does and does not tell us.",
  "Differential diagnosis: what else was considered and why it was ruled in or out.",
  "Specific recommendations, including accommodations for work or school written in language an HR department will accept.",
]

const PRICING = [
  {
    title: "Autism or ADHD assessment",
    price: "$2,400",
    body: "A focused evaluation of one area: the consult, intake questionnaires, the full clinical interview, scoring and interpretation, the feedback session, and the comprehensive written report.",
  },
  {
    title: "OCD assessment",
    price: "$1,800",
    body: "Diagnostic evaluation for OCD, including subtypes that involve no visible compulsions. Same structure, same written report.",
  },
  {
    title: "PTSD assessment",
    price: "$1,800",
    body: "Diagnostic evaluation for post-traumatic stress, including presentations that have gone unrecognized for years. Same structure, same written report.",
  },
  {
    title: "Combined autism and ADHD assessment",
    price: "$3,200",
    body: "For the many adults who are wondering about both. Assessing them together in one process gives a fuller and more accurate picture than two separate evaluations, and costs less than running them one after the other.",
  },
]

const FAQS = [
  {
    q: "How long does the whole thing take?",
    a: "About six weeks from first contact to final report. The current wait for a first appointment is roughly three weeks.",
  },
  {
    q: "Do I need a referral?",
    a: "No. Most people find me on their own.",
  },
  {
    q: "Is telehealth as good as in person?",
    a: "For adult autism and ADHD assessment, yes. The evidence supports it, and for many autistic adults it is better: you are in your own space, you control the sensory environment, and you are not managing a waiting room before we start.",
  },
  {
    q: "What if I do not meet criteria?",
    a: "Then I tell you that, and I tell you what I think is going on instead. You still get the full report, which will be useful either way. Nobody has ever left that conversation with nothing.",
  },
  {
    q: "Can I get medication with this?",
    a: "I am a psychologist, so I do not prescribe. The report is written so a prescriber can use it, and I can point you toward psychiatrists and psychiatric nurse practitioners who work well with neurodivergent adults.",
  },
  {
    q: "I was assessed as a child and told I was not autistic. Does that matter?",
    a: "It is useful information and it does not settle anything. Diagnostic criteria have changed substantially, and the adults most often missed as children are exactly the ones who present here now.",
  },
  {
    q: "Will this go on my permanent record?",
    a: "Your report is yours. I do not send it anywhere without your written consent. If you want it sent to a doctor or an employer, you tell me and I send it; otherwise nobody sees it but you.",
  },
  {
    q: "I am worried I am making it up or exaggerating.",
    a: "Almost everyone says some version of this, including people with unambiguous findings. It is worth saying out loud during the assessment rather than managing quietly, because it is itself clinically interesting.",
  },
  {
    q: "Do you assess children?",
    a: "No, adults only. I can refer you to colleagues who assess children and teens.",
  },
  {
    q: "What if I need more detailed testing?",
    a: "Some people need full neuropsychological testing, usually to identify a specific learning disability or a more complex processing difference. When that is the case I will tell you and refer you to a colleague who does that work, either instead of or alongside an assessment with me. The goal is the right assessment, not just an assessment.",
  },
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

const CARD_STYLE = {
  backgroundColor: "#ffffff",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  boxShadow: "0 3px 10px rgba(11,37,69,0.08), 0 1px 3px rgba(11,37,69,0.05)",
} as const

function Bullet() {
  return (
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
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6 },
} as const

export default function AssessmentsPage() {
  return (
    <main className="relative bg-background overflow-x-hidden">
      <section
        className="relative"
        style={{ minHeight: "100svh", backgroundColor: "var(--paper)", backgroundImage: "var(--bg-lines)" }}
      >
        <div className="relative px-5 sm:px-6 lg:px-12 pt-8 sm:pt-10 lg:pt-12 pb-24 flex flex-col items-center gap-16 sm:gap-20">

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
                fontSize: "clamp(1.9rem, 5.2vw, 3.4rem)",
                fontWeight: 400,
                color: "var(--ink)",
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Adult autism, ADHD, and OCD assessment
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
              Affirming, unhurried evaluations from someone who assumes you already know a great deal about your own
              mind.
            </p>
            <div className="mt-8">
              <CTAButton href={CONSULT_HREF}>{CONSULT_LABEL}</CTAButton>
            </div>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 list-none p-0">
              {HERO_STRIP.map((item, i) => (
                <li
                  key={item}
                  className="flex items-center gap-3"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.88rem",
                    color: "rgba(11,37,69,0.7)",
                  }}
                >
                  {item}
                  {i < HERO_STRIP.length - 1 && (
                    <span aria-hidden="true" style={{ color: "var(--gold)" }}>
                      |
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 1. You might recognize some of this */}
          <motion.div {...fadeUp} className="w-full max-w-xl">
            <SectionHeading>You might recognize some of this</SectionHeading>
            <BodyText className="text-center !mb-7">
              Most of the adults I assess arrive after years of sensing something did not fit.
            </BodyText>
            <ul className="flex flex-col gap-3 mt-7">
              {RECOGNITION_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Bullet />
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
              If any of that lands, you are in the right place.
            </p>
          </motion.div>

          {/* 2. What I assess for */}
          <motion.div {...fadeUp} className="w-full max-w-4xl">
            <SectionHeading>What I assess for</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {ASSESS_FOR.map((a) => (
                <div key={a.title} className="flex flex-col p-6 rounded-xl" style={CARD_STYLE}>
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
              These overlap constantly. Most people arrive wondering about more than one, and the assessment is built
              to account for that rather than forcing a single answer.
            </p>
          </motion.div>

          {/* 3. Getting the right answer, not just an answer */}
          <motion.div {...fadeUp} className="w-full max-w-2xl flex flex-col gap-4">
            <SectionHeading>Getting the right answer, not just an answer</SectionHeading>
            <BodyText>
              A lot of things look like ADHD. Trauma looks like ADHD. Anxiety looks like ADHD. OCD looks like autism.
              Autistic burnout looks like depression. An assessment that only goes looking for the thing you asked
              about will usually find it.
            </BodyText>
            <BodyText>
              My training is in OCD and trauma as well as neurodivergence, so I work the differential deliberately. I
              will tell you when something else explains the picture better, and I will tell you when more than one
              thing is true at once, which is the most common outcome in adults.
            </BodyText>
            <BodyText>
              That also means I will tell you if I do not think you meet criteria. That answer is harder to hear and
              it is the reason the process is worth paying for.
            </BodyText>
          </motion.div>

          {/* 4. How it works */}
          <motion.div {...fadeUp} className="w-full max-w-3xl">
            <SectionHeading>How it works</SectionHeading>
            <BodyText className="text-center !mb-8">
              About six weeks from first contact to final report, though much of that is scheduling rather than work.
            </BodyText>
            <div className="flex flex-col gap-7 mt-8">
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

          {/* 5. What the report actually contains */}
          <motion.div {...fadeUp} className="w-full max-w-2xl">
            <SectionHeading>What the report actually contains</SectionHeading>
            <BodyText className="text-center !mb-7">
              The report is the thing you are paying for, so here is what is in it.
            </BodyText>
            <ul className="flex flex-col gap-3 mt-7">
              {REPORT_CONTENTS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Bullet />
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
            <div className="mt-7 flex flex-col gap-4">
              <BodyText>
                If you want one, I will also write a separate strengths-based accommodation letter for your employer.
                It describes the conditions under which you do your best work and includes no diagnostic language at
                all, so you can hand it over without disclosing anything you would rather keep private. There is no
                extra fee for it.
              </BodyText>
              <BodyText>
                Reports typically run 12 to 20 pages. They are written for you first and for clinicians second, which
                is the opposite of how most evaluation reports are written.
              </BodyText>
            </div>
          </motion.div>

          {/* 6. Pricing */}
          <motion.div {...fadeUp} className="w-full max-w-4xl">
            <SectionHeading>Pricing</SectionHeading>
            <BodyText className="text-center !mb-8">
              Flat fees. You know the full cost before anything begins, and the written report is included at every
              price point rather than sold as an add-on.
            </BodyText>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mt-8">
              {PRICING.map((p) => (
                <div key={p.title} className="flex flex-col p-6 sm:p-7 rounded-xl" style={CARD_STYLE}>
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
                    {p.title}
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
                    {p.price}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.92rem",
                      lineHeight: 1.6,
                      color: "rgba(11,37,69,0.75)",
                    }}
                  >
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
            <dl className="mt-8 flex flex-col gap-5 mx-auto" style={{ maxWidth: "38rem" }}>
              {[
                {
                  label: "Payment",
                  value:
                    "Half at booking, half before the feedback session. We are private pay. A superbill is available on request if you would like to submit for out-of-network reimbursement.",
                },
                {
                  label: "Sliding scale",
                  value:
                    "A limited number of reduced-fee assessments are available each quarter. Ask during the consult. There is no application and no means-testing paperwork.",
                },
              ].map((d) => (
                <div key={d.label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                  <dt
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--slate)",
                      minWidth: "8rem",
                      flexShrink: 0,
                    }}
                  >
                    {d.label}
                  </dt>
                  <dd
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.94rem",
                      lineHeight: 1.65,
                      color: "rgba(11,37,69,0.78)",
                      margin: 0,
                    }}
                  >
                    {d.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* 7. Questions people actually ask */}
          <motion.div {...fadeUp} className="w-full max-w-2xl">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <SectionHeading>Questions people actually ask</SectionHeading>
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

          {/* 8. Who I am */}
          <motion.div {...fadeUp} className="w-full max-w-2xl flex flex-col gap-4">
            <SectionHeading>Who I am</SectionHeading>
            <BodyText>
              I am Madrone Love, a licensed clinical psychologist (PSY35899) in Oakland. I trained at UC Berkeley and
              the Wright Institute, did my internship at the University of Wisconsin-Madison and my postdoctoral
              fellowship at UCSF, and taught clinical psychology at the California Institute of Integral Studies for
              years.
            </BodyText>
            <BodyText>
              My specialized training is in OCD (exposure and response prevention, and inference-based CBT through the
              I-CBT Institute) and in trauma, alongside neurodivergence. That combination is the reason I assess the
              way I do: the conditions that get confused with each other are ones I actually treat.
            </BodyText>
            <BodyText>
              I am neurodivergent-affirming in practice and not only in the words on this page. That means I do not
              treat masking as deception, I do not treat your self-knowledge as a symptom, and I do not write reports
              that describe you as a collection of deficits.
            </BodyText>
          </motion.div>

          {/* 9. Assessments in Colorado */}
          <motion.div {...fadeUp} className="w-full max-w-xl">
            <SectionHeading>Assessments in Colorado</SectionHeading>
            <BodyText className="text-center !mb-7">
              Olive Clinical works with licensed providers in other states so you can be assessed by someone licensed
              where you live.
            </BodyText>
            <div className="flex flex-col p-6 sm:p-8 rounded-xl text-center mt-7" style={CARD_STYLE}>
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
                Dr. Moskowitz provides adult ADHD, autism, and OCD assessments via telehealth throughout Colorado,
                using the same process, the same report standard, and the same fees described on this page.
              </p>
              <CTAButton href={CONSULT_HREF} className="mx-auto">
                {CONSULT_LABEL}
              </CTAButton>
            </div>
          </motion.div>

          {/* 10. Closing */}
          <motion.div {...fadeUp} className="text-center max-w-xl">
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
              When you are ready
            </h2>
            <BodyText className="!mb-8">
              If you have been putting this off, that is a common place to be, and it is usually not procrastination.
              Waiting has often been the sensible response to a system that has not made room for you.
            </BodyText>
            <BodyText className="!mb-8">Start with fifteen minutes and no commitment.</BodyText>
            <div className="mt-8">
              <CTAButton href={CONSULT_HREF} className="mx-auto">
                {CONSULT_LABEL}
              </CTAButton>
            </div>
          </motion.div>

        </div>
      </section>
    </main>
  )
}
