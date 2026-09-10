"use client"

import { ScaleAssessment, type ScaleConfig } from "./scale-assessment"

const OPTIONS = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "A little" },
  { value: 2, label: "Moderately" },
  { value: 3, label: "A lot" },
  { value: 4, label: "Extremely" },
]

const config: ScaleConfig = {
  title: "OCI-R: Obsessive-Compulsive Inventory – Revised",
  citation: "18-item self-report scale · Foa et al., 2002",
  instructions: (
    <>
      The following statements refer to experiences that many people have in their everyday lives.
      Choose the response that best describes{" "}
      <strong>how much that experience has distressed or bothered you during the past month</strong>.
    </>
  ),
  options: OPTIONS,
  items: [
    { text: "I have saved up so many things that they get in the way." },
    { text: "I check things more often than necessary." },
    { text: "I get upset if objects are not arranged properly." },
    { text: "I feel compelled to count while I am doing things." },
    { text: "I find it difficult to touch an object when I know it has been touched by strangers or certain people." },
    { text: "I find it difficult to control my own thoughts." },
    { text: "I collect things I don't need." },
    { text: "I repeatedly check doors, windows, drawers, etc." },
    { text: "I get upset if others change the way I have arranged things." },
    { text: "I feel I have to repeat certain numbers." },
    { text: "I sometimes have to wash or clean myself simply because I feel contaminated." },
    { text: "I am upset by unpleasant thoughts that come into my mind against my will." },
    { text: "I avoid throwing things away because I am afraid I might need them later." },
    { text: "I repeatedly check gas and water taps and light switches after turning them off." },
    { text: "I need things to be arranged in a particular way." },
    { text: "I feel that there are good and bad numbers." },
    { text: "I wash my hands more often and longer than necessary." },
    { text: "I frequently get nasty thoughts and have difficulty in getting rid of them." },
  ],
  // The scale's six three-item subscales run in a repeating cycle through the
  // item order. The administration sheet scores the total only.
  subscales: [
    { label: "Hoarding", items: [1, 7, 13] },
    { label: "Checking", items: [2, 8, 14] },
    { label: "Ordering", items: [3, 9, 15] },
    { label: "Neutralizing", items: [4, 10, 16] },
    { label: "Washing", items: [5, 11, 17] },
    { label: "Obsessing", items: [6, 12, 18] },
  ],
  thresholds: [
    {
      at: 21,
      label: "At or above the recommended cutoff (21+) — indicating the likely presence of OCD",
      color: "text-nav-coral",
    },
  ],
  scoringNote: <>The mean score for people with OCD is 28.0 (SD = 13.53).</>,
  disclaimer: (
    <>
      The OCI-R is a screening tool, not a diagnostic instrument. A score at or above the cutoff does
      not constitute a diagnosis. Scores should be interpreted by a qualified clinician in conjunction
      with a comprehensive evaluation. Foa, E. B., Huppert, J. D., Leiberg, S., Hajcak, G., Langner, R.,
      et al. (2002). The Obsessive-Compulsive Inventory: Development and validation of a short version.{" "}
      <em>Psychological Assessment, 14</em>, 485&ndash;496.
    </>
  ),
}

export function OCIR() {
  return <ScaleAssessment config={config} />
}
