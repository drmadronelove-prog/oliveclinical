"use client"

import { DysregulationLog } from "@/components/tools/dysregulation-log"
import { MeltdownWorksheet } from "@/components/tools/meltdown-worksheet"
import { AQ50 } from "@/components/assessments/aq50"
import { DBTEmotionRegulation } from "@/components/tools/dbt-emotion-regulation"
import { FeatureCardGrid, type FeatureCard } from "@/components/feature-card-grid"

const CARDS: FeatureCard[] = [
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
    category: "Pattern tracking",
    footerLabel: "Open log",
    modalTitle: "Dysregulation Log",
    modalSubtitle: "Triggers, body signals, what helps. Saved locally.",
    content: <DysregulationLog />,
  },
  {
    kind: "modal",
    title: "Meltdown Workbook",
    category: "Awareness & recovery",
    footerLabel: "Open workbook",
    modalTitle: "Meltdown Awareness & Recovery Workbook",
    modalSubtitle: "A personal tracking workbook. Saved locally.",
    content: <MeltdownWorksheet />,
  },
  {
    kind: "modal",
    title: "AQ-50",
    category: "Autism Spectrum Quotient",
    footerLabel: "Take screen",
    modalTitle: "AQ-50: Autism Spectrum Quotient",
    modalSubtitle: "50-item screening questionnaire · Baron-Cohen et al., 2001.",
    content: <AQ50 />,
  },
  {
    kind: "link",
    title: "Regulation Station Game",
    category: "Neurodivergent · Dysregulation",
    footerLabel: "Play",
    href: "/games/regulation-station.html",
  },
  {
    kind: "link",
    title: "Autistic Culture Is Flourishing",
    category: "Blog · Autism",
    footerLabel: "Read essay",
    href: "/blog/autistic-culture-is-flourishing",
  },
]

export function ASDSkillsCards() {
  return <FeatureCardGrid cards={CARDS} modalSize="wide" />
}
