"use client"

import { ScaleAssessment, type ScaleConfig } from "./scale-assessment"

const OPTIONS = [
  { value: 1, label: "Definitely disagree" },
  { value: 2, label: "Slightly disagree" },
  { value: 3, label: "Slightly agree" },
  { value: 4, label: "Definitely agree" },
]

const config: ScaleConfig = {
  title: "GQ-ASC: Scale for Adult Women",
  citation:
    "Girls' Questionnaire for Autism Spectrum Condition, modified for adult women · Brown et al., 2020",
  instructions: (
    <>
      This screening questionnaire is designed to identify behaviours and abilities in women that are
      associated with autism. Please read each statement carefully and rate how strongly you agree or
      disagree with it.
    </>
  ),
  options: OPTIONS,
  reverseItems: [1, 2, 3, 4, 5, 18],
  items: [
    { section: "Imagination and play", text: "I enjoy fantasy worlds." },
    { text: "I am interested in fiction." },
    { text: "When I was 5–12 years old, I played as imaginatively as other girls." },
    { text: "When I was 5–12 years old, I had imaginary friends or imaginary animals." },
    { text: "When I was 5–12 years old, I created my own complex ‘set ups’ with toys." },
    { section: "Camouflaging", text: "I copy or ‘clone’ myself on other females." },
    { text: "I avidly observe other females socialising." },
    { text: "I am attracted to females with strong personalities who tell me what to do." },
    { text: "I adopt a different persona in different situations." },
    {
      section: "Sensory sensitivities",
      text: "I am attached to certain objects or toys (e.g. a favourite toy, pillow, or piece of cloth) which I carry, touch, or rub to calm myself.",
    },
    { text: "I expressed distress during grooming (e.g. I fought or cried during fingernail cutting, haircutting, or combing) or when I am touched (e.g. someone touches my feet)." },
    { text: "Some social situations make me mute." },
    { text: "I am distressed by certain smells, or I avoid certain tastes that are a typical part of a diet." },
    { section: "Socialising", text: "I socialise quite well for a while, but subsequently feel exhausted." },
    { text: "I often have a facial ‘mask’ that hides my social confusion." },
    { text: "I have intense emotions." },
    { text: "I apologise when I make a social error." },
    { section: "Interests", text: "When I was 5–12 years old, I preferred to play with girls’ toys." },
    { text: "When I was 5–12 years old, I preferred to play with boys’ toys." },
    { text: "My interests were advanced for my age (e.g. opera)." },
    { text: "I am talented in music." },
  ],
  thresholds: [
    {
      at: 57,
      label: "Above 56 — indicating a high level of autistic traits",
      color: "text-nav-coral",
    },
  ],
  scoringNote: (
    <>
      Items 1&ndash;5 and 18 are reverse-scored. The published threshold is a total greater than 56,
      which is sensitive to roughly 80% of cases.
    </>
  ),
  disclaimer: (
    <>
      The GQ-ASC is a screening tool, not a diagnostic instrument, and a score above the threshold does
      not constitute a diagnosis. Scores should be interpreted by a qualified clinician alongside a
      comprehensive evaluation. Brown, C. M., Attwood, T., Garnett, M., &amp; Stokes, M. A. (2020).
      Am I autistic? Utility of the Girls Questionnaire for Autism Spectrum Condition as an autism
      assessment in adult women. <em>Autism in Adulthood, 2</em>(3), 216&ndash;226.
    </>
  ),
}

export function GQASC() {
  return <ScaleAssessment config={config} />
}
