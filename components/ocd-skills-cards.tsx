"use client"

import { ICBTTrueSelfWorksheet } from "@/components/tools/icbt-true-self-worksheet"
import { ICQEV } from "@/components/assessments/icqev"
import { MomentOfChoice } from "@/components/tools/moment-of-choice"
import { OCDMonsters } from "@/components/tools/ocd-monsters"
import { FeatureCardGrid, type FeatureCard } from "@/components/feature-card-grid"

const CARDS: FeatureCard[] = [
  {
    kind: "modal",
    title: "OCD Monsters",
    category: "OCD · Psychoeducation",
    footerLabel: "Meet the monsters",
    modalTitle: "OCD Monsters",
    modalSubtitle: "The what-ifs, oh-nos, it's possibles, and the mights — essential to get to know in OCD treatment.",
    content: <OCDMonsters />,
  },
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
    modalSubtitle:
      "An Inference-Based CBT exercise for distinguishing the OCD self from the true self.",
    content: <ICBTTrueSelfWorksheet />,
  },
  {
    kind: "modal",
    title: "ICQ-EV",
    category: "Inferential confusion",
    footerLabel: "Take questionnaire",
    modalTitle: "ICQ-EV: Inferential Confusion Questionnaire (Expanded Version)",
    modalSubtitle: "30-item measure of inferential confusion · Aardema et al., 2010.",
    content: <ICQEV />,
  },
  {
    kind: "link",
    title: "Incoming Game",
    category: "I-CBT · Thought Catching",
    footerLabel: "Play",
    href: "/games/moment-one-incoming.html",
  },
  {
    kind: "link",
    title: "Am I a Monster? Game",
    category: "OCD · Narrative Work",
    footerLabel: "Play",
    href: "/games/am-i-a-monster.html",
  },
  {
    kind: "link",
    title: "Real News or Fake News? Game",
    category: "I-CBT · Reality Testing",
    footerLabel: "Play",
    href: "/games/fake-news.html",
  },
  {
    kind: "link",
    title: "The Inference Gap",
    category: "Blog · OCD",
    footerLabel: "Read essay",
    href: "/blog/the-inference-gap",
  },
  {
    kind: "link",
    title: "When Imagination Becomes Evidence",
    category: "Blog · OCD",
    footerLabel: "Read essay",
    href: "/blog/when-imagination-becomes-evidence",
  },
  {
    kind: "link",
    title: "\"The Drama\" & Relationship OCD",
    category: "Blog · Film & OCD",
    footerLabel: "Read essay",
    href: "/blog/watching-charlie-unravel",
  },
  {
    kind: "link",
    title: "What If Your OCD Is Feeding on a Knowledge Gap?",
    category: "Blog · OCD & Clinical Insight",
    footerLabel: "Read essay",
    href: "/blog/ocd-knowledge-gap",
  },
  {
    kind: "link",
    title: "OTC Supplements in OCD Treatment",
    category: "IOCDF · Psychoeducation",
    footerLabel: "Read",
    href: "https://iocdf.org/expert-opinions/over-the-counter-supplements-in-the-treatment-of-ocd/",
  },
]

export function OCDSkillsCards() {
  return <FeatureCardGrid cards={CARDS} modalSize="wide" />
}
