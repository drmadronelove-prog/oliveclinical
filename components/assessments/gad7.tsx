"use client"

import { ScaleAssessment, type ScaleConfig } from "./scale-assessment"

const OPTIONS = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
]

const config: ScaleConfig = {
  title: "GAD-7: Generalized Anxiety Disorder Scale",
  citation: "7-item anxiety scale · Spitzer, Kroenke, Williams & Löwe, 2006",
  instructions: (
    <>Over the last two weeks, how often have you been bothered by the following problems?</>
  ),
  options: OPTIONS,
  items: [
    { text: "Feeling nervous, anxious, or on edge." },
    { text: "Not being able to stop or control worrying." },
    { text: "Worrying too much about different things." },
    { text: "Trouble relaxing." },
    { text: "Being so restless that it is hard to sit still." },
    { text: "Becoming easily annoyed or irritable." },
    { text: "Feeling afraid, as if something awful might happen." },
  ],
  thresholds: [
    { at: 5, label: "Mild anxiety symptoms (5–9)", color: "text-muted-foreground" },
    { at: 10, label: "Moderate anxiety symptoms (10–14)", color: "text-nav-amber" },
    { at: 15, label: "Severe anxiety symptoms (15–21)", color: "text-nav-coral" },
  ],
  scoringNote: <>A score below 5 falls in the minimal range.</>,
  disclaimer: (
    <>
      The GAD-7 is a screening tool, not a diagnostic instrument. A score above a threshold does not
      constitute a diagnosis, and scores should be interpreted by a qualified clinician alongside a
      fuller evaluation. Spitzer, R. L., Kroenke, K., Williams, J. B. W., &amp; Löwe, B. (2006). A
      brief measure for assessing generalized anxiety disorder.{" "}
      <em>Archives of Internal Medicine, 166</em>(10), 1092&ndash;1097. Free to reproduce.
    </>
  ),
}

export function GAD7() {
  return <ScaleAssessment config={config} />
}
