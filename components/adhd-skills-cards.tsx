"use client"

import { DeepWorkPlanner } from "@/components/tools/deep-work-planner"
import { ActMatrix } from "@/components/tools/act-matrix"
import { AdhdChecklist } from "@/components/assessments/adhd-checklist"
import { EisenhowerMatrix } from "@/components/tools/eisenhower-matrix"
import { FeatureCardGrid, type FeatureCard } from "@/components/feature-card-grid"

const CARDS: FeatureCard[] = [
  {
    kind: "modal",
    title: "Eisenhower Matrix",
    category: "ADHD · Task Management",
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
    modalSubtitle:
      "Long-term goals, weekly goals, and values + activities. Saved locally.",
    content: <DeepWorkPlanner />,
  },
  {
    kind: "modal",
    title: "ACT Matrix",
    category: "Acceptance & Commitment Therapy",
    footerLabel: "Open worksheet",
    modalTitle: "ACT Matrix",
    modalSubtitle:
      "Map what pulls you away from what matters — and what moves you toward it. Saved locally.",
    content: <ActMatrix />,
  },
  {
    kind: "modal",
    title: "ADHD Symptom Checklist",
    category: "DSM-5 + community",
    footerLabel: "Take checklist",
    modalTitle: "ADHD Symptom Checklist",
    modalSubtitle: "DSM-5 criteria · community-reported symptoms.",
    content: <AdhdChecklist />,
  },
  {
    kind: "link",
    title: "Body Doubling — 2h Pomodoro",
    category: "External · YouTube",
    footerLabel: "Watch",
    href: "https://youtu.be/7izHQ7Ojt-s",
  },
  {
    kind: "link",
    title: "60-min Visual Time Timer",
    category: "External · YouTube",
    footerLabel: "Watch",
    href: "https://www.youtube.com/watch?v=HSVqiA3sRdU",
  },
  {
    kind: "link",
    title: "Time Is a Rainbow",
    category: "Blog · ADHD",
    footerLabel: "Read essay",
    href: "/blog/time-is-a-rainbow",
  },
  {
    kind: "link",
    title: "Loving Across the Wiring",
    category: "Blog · ADHD",
    footerLabel: "Read essay",
    href: "/blog/loving-across-the-wiring",
  },
  {
    kind: "link",
    title: "Windows of Interest",
    category: "Blog · Neurodivergence",
    footerLabel: "Read essay",
    href: "/blog/windows-of-interest",
  },
  {
    kind: "link",
    title: "ADHD Part 1+2: Alie Ward & Russell Barkley",
    category: "Podcast · Ologies",
    footerLabel: "Listen",
    href: "https://www.alieward.com/ologies/adhd",
  },
]

export function ADHDSkillsCards() {
  return <FeatureCardGrid cards={CARDS} modalSize="wide" />
}
