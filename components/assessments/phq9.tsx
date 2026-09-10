"use client"

import { ScaleAssessment, type ScaleConfig } from "./scale-assessment"

const OPTIONS = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
]

const config: ScaleConfig = {
  title: "PHQ-9: Patient Health Questionnaire",
  citation: "9-item depression scale · Kroenke, Spitzer & Williams, 2001",
  instructions: (
    <>
      Over the last two weeks, how often have you been bothered by any of the following problems?
    </>
  ),
  options: OPTIONS,
  items: [
    { text: "Little interest or pleasure in doing things." },
    { text: "Feeling down, depressed, or hopeless." },
    { text: "Trouble falling or staying asleep, or sleeping too much." },
    { text: "Feeling tired or having little energy." },
    { text: "Poor appetite or overeating." },
    { text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down." },
    { text: "Trouble concentrating on things, such as reading the newspaper or watching television." },
    { text: "Moving or speaking so slowly that other people could have noticed; or the opposite — being so fidgety or restless that you have been moving around a lot more than usual." },
    { text: "Thoughts that you would be better off dead, or of hurting yourself in some way." },
  ],
  thresholds: [
    { at: 5, label: "Mild depressive symptoms (5–9)", color: "text-muted-foreground" },
    { at: 10, label: "Moderate depressive symptoms (10–14)", color: "text-nav-amber" },
    { at: 15, label: "Moderately severe depressive symptoms (15–19)", color: "text-nav-coral" },
    { at: 20, label: "Severe depressive symptoms (20–27)", color: "text-nav-coral" },
  ],
  scoringNote: (
    <>
      A score below 5 falls in the minimal range. Item 9 asks about thoughts of self-harm; any
      endorsement is worth raising with a clinician regardless of the total.
    </>
  ),
  disclaimer: (
    <>
      The PHQ-9 is a screening tool, not a diagnostic instrument, and a score above a threshold does
      not constitute a diagnosis. If you are having thoughts of harming yourself, please contact your
      clinician, call or text 988 (Suicide &amp; Crisis Lifeline, US), or go to your nearest emergency
      department. Kroenke, K., Spitzer, R. L., &amp; Williams, J. B. W. (2001). The PHQ-9.{" "}
      <em>Journal of General Internal Medicine, 16</em>(9), 606&ndash;613. Free to reproduce.
    </>
  ),
}

export function PHQ9() {
  return <ScaleAssessment config={config} />
}
