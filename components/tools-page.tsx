"use client"

import { BreathingBubble } from "@/components/breathing-bubble"
import { DeepWorkPlanner } from "@/components/tools/deep-work-planner"
import { ActMatrix } from "@/components/tools/act-matrix"
import { EisenhowerMatrix } from "@/components/tools/eisenhower-matrix"
import { DecisionalBalance } from "@/components/tools/decisional-balance"
import { MomentOfChoice } from "@/components/tools/moment-of-choice"
import { ICBTTrueSelfWorksheet } from "@/components/tools/icbt-true-self-worksheet"
import { OCDMonsters } from "@/components/tools/ocd-monsters"
import { DBTEmotionRegulation } from "@/components/tools/dbt-emotion-regulation"
import { DysregulationLog } from "@/components/tools/dysregulation-log"
import { MeltdownWorksheet } from "@/components/tools/meltdown-worksheet"
import { FeatureCardGrid, type FeatureCard } from "@/components/feature-card-grid"

function Section({
  title,
  subtitle,
  cards,
  color,
}: {
  title: string
  subtitle: string
  cards: FeatureCard[]
  color: string
}) {
  return (
    <section style={{
      marginTop: 52,
      background: `${color}12`,
      borderRadius: 12,
      padding: "24px 20px 28px",
      marginLeft: -20,
      marginRight: -20,
    }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "stretch", gap: 14, marginBottom: 8 }}>
          <div style={{ width: 4, borderRadius: 2, background: color, flexShrink: 0 }} />
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(20px, 2.8vw, 26px)",
                fontWeight: 500,
                color: "var(--ink)",
                letterSpacing: "-0.018em",
                lineHeight: 1.2,
                marginBottom: 5,
              }}
            >
              {title}
            </h2>
            <p style={{ fontSize: 13, color: "var(--ink-muted, #666)", lineHeight: 1.55, margin: 0 }}>
              {subtitle}
            </p>
          </div>
        </div>
        <div style={{ height: 1, background: color, opacity: 0.22, marginTop: 10 }} />
      </div>
      <FeatureCardGrid cards={cards} modalSize="wide" />
    </section>
  )
}

// ── Mindfulness ───────────────────────────────────────────────────────────────

const MINDFULNESS: FeatureCard[] = [
  {
    kind: "modal",
    title: "Breathing Circle",
    category: "Box Breath · 4·4·4·4",
    footerLabel: "Begin",
    modalTitle: "Breathing Circle",
    modalSubtitle: "Four-second inhale, hold, exhale, hold.",
    content: (
      <div className="flex justify-center pt-2">
        <BreathingBubble />
      </div>
    ),
  },
  {
    kind: "modal",
    title: "Guided Meditation",
    category: "Gil Fronsdal · IMC",
    footerLabel: "Watch",
    modalTitle: "Guided Meditation",
    modalSubtitle: "Gil Fronsdal · Insight Meditation Center, Redwood City.",
    content: (
      <div style={{ width: "100%", aspectRatio: "16 / 9", overflow: "hidden", background: "var(--ink)", border: "1px solid rgba(11,37,69,0.18)" }}>
        <iframe
          src="https://www.youtube.com/embed/Ptm0FE-KLyc"
          title="Gil Fronsdal guided meditation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        />
      </div>
    ),
  },
  {
    kind: "modal",
    title: "ACT Matrix",
    category: "Acceptance & Commitment Therapy",
    footerLabel: "Open worksheet",
    modalTitle: "ACT Matrix",
    modalSubtitle: "Map what pulls you away from what matters — and what moves you toward it. Saved locally.",
    content: <ActMatrix />,
  },
  { kind: "link", title: "Audiodharma", category: "Free dharma archive", footerLabel: "Visit", href: "https://www.audiodharma.org" },
  { kind: "link", title: "Insight Meditation Center", category: "IMC · Redwood City, CA", footerLabel: "Visit", href: "https://www.insightmeditationcenter.org" },
  { kind: "link", title: "Spirit Rock", category: "Spirit Rock · Woodacre, CA", footerLabel: "Visit", href: "https://www.spiritrock.org" },
]

// ── Executive Functioning ─────────────────────────────────────────────────────

const EXECUTIVE: FeatureCard[] = [
  {
    kind: "modal",
    title: "Decisional Balance Matrix",
    category: "Motivational Interviewing",
    footerLabel: "Open worksheet",
    modalTitle: "Decisional Balance Matrix",
    modalSubtitle: "See the full picture of what you're weighing — benefits and costs of changing and staying the same.",
    content: <DecisionalBalance />,
  },
  {
    kind: "modal",
    title: "Eisenhower Matrix",
    category: "Task Management · ADHD",
    footerLabel: "Open planner",
    modalTitle: "Eisenhower Matrix",
    modalSubtitle: "Brain dump, sort by urgency and importance, export to Google Tasks.",
    content: <EisenhowerMatrix />,
  },
  {
    kind: "modal",
    title: "Deep Work Planner",
    category: "Goals · Cal Newport · ACT",
    footerLabel: "Open planner",
    modalTitle: "Deep Work Planner",
    modalSubtitle: "Long-term goals, weekly goals, and values + activities. Saved locally.",
    content: <DeepWorkPlanner />,
  },
]

// ── Cognitive (CBT) ───────────────────────────────────────────────────────────

const COGNITIVE: FeatureCard[] = [
  {
    kind: "modal",
    title: "OCD Moment of Choice",
    category: "I-CBT · Inference-Based",
    footerLabel: "Open worksheet",
    modalTitle: "OCD Moment of Choice",
    modalSubtitle: "Map your trigger through sense-based vs. what-if reasoning. Saved locally.",
    content: <MomentOfChoice />,
  },
  {
    kind: "modal",
    title: "True Self Worksheet",
    category: "I-CBT · Inference-Based",
    footerLabel: "Open worksheet",
    modalTitle: "True Self Worksheet",
    modalSubtitle: "An Inference-Based CBT exercise for distinguishing the OCD self from the true self.",
    content: <ICBTTrueSelfWorksheet />,
  },
  {
    kind: "modal",
    title: "OCD Monsters",
    category: "OCD · Psychoeducation",
    footerLabel: "Meet the monsters",
    modalTitle: "OCD Monsters",
    modalSubtitle: "The what-ifs, oh-nos, it's possibles, and the mights — essential to get to know in OCD treatment.",
    content: <OCDMonsters />,
  },
]

// ── Emotion Regulation ────────────────────────────────────────────────────────

const EMOTION: FeatureCard[] = [
  {
    kind: "modal",
    title: "ABC PLEASE Worksheet",
    category: "DBT · Emotion Regulation",
    footerLabel: "Open worksheet",
    modalTitle: "ABC PLEASE Worksheet",
    modalSubtitle: "Reduce emotional vulnerability by taking care of the basics. Saved locally.",
    content: <DBTEmotionRegulation />,
  },
  {
    kind: "modal",
    title: "Dysregulation Log",
    category: "Pattern Tracking",
    footerLabel: "Open log",
    modalTitle: "Dysregulation Log",
    modalSubtitle: "Triggers, body signals, what helps. Saved locally.",
    content: <DysregulationLog />,
  },
  {
    kind: "modal",
    title: "Meltdown Workbook",
    category: "Awareness & Recovery",
    footerLabel: "Open workbook",
    modalTitle: "Meltdown Awareness & Recovery Workbook",
    modalSubtitle: "A personal tracking workbook. Saved locally.",
    content: <MeltdownWorksheet />,
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export function ToolsPageContent() {
  return (
    <div style={{ paddingBottom: 48 }}>
      <Section
        title="Mindfulness"
        subtitle="Breathing practices, guided meditation, and contemplative tools for present-moment awareness."
        cards={MINDFULNESS}
        color="#9fb3b0"
      />
      <Section
        title="Planning and Decision Making"
        subtitle="Task prioritization, long-term goal-setting, and values-based planning for ADHD and beyond."
        cards={EXECUTIVE}
        color="#5b6e88"
      />
      <Section
        title="Cognitive Behavioral Therapy (CBT)"
        subtitle="Inference-based reasoning, reality testing, and OCD-specific cognitive tools."
        cards={COGNITIVE}
        color="#7a4f6e"
      />
      <Section
        title="Emotion Regulation"
        subtitle="DBT skills, dysregulation tracking, and body-based awareness for managing intense emotions."
        cards={EMOTION}
        color="#b88894"
      />
    </div>
  )
}
