"use client"

import { ScaleAssessment, type ScaleConfig } from "./scale-assessment"

// Items 1-8 score 0-4; items 9-10 score 0, 2, 4.
const FREQUENCY = [
  { value: 0, label: "Never" },
  { value: 1, label: "Less than monthly" },
  { value: 2, label: "Monthly" },
  { value: 3, label: "Weekly" },
  { value: 4, label: "Daily or almost daily" },
]

const LAST_YEAR = [
  { value: 0, label: "No" },
  { value: 2, label: "Yes, but not in the last year" },
  { value: 4, label: "Yes, during the last year" },
]

const config: ScaleConfig = {
  title: "AUDIT: Alcohol Use Disorders Identification Test",
  citation: "10-item screen · World Health Organization",
  instructions: (
    <>
      Because alcohol use can affect your health and can interfere with certain medications and
      treatments, these questions ask about your use of alcohol. One &ldquo;standard drink&rdquo; is
      roughly a 12 oz beer, a 5 oz glass of wine, or 1.5 oz of spirits.
    </>
  ),
  options: FREQUENCY,
  items: [
    {
      text: "How often do you have a drink containing alcohol?",
      options: [
        { value: 0, label: "Never" },
        { value: 1, label: "Monthly or less" },
        { value: 2, label: "2 to 4 times a month" },
        { value: 3, label: "2 to 3 times a week" },
        { value: 4, label: "4 or more times a week" },
      ],
    },
    {
      text: "How many drinks containing alcohol do you have on a typical day when you are drinking?",
      options: [
        { value: 0, label: "1 or 2" },
        { value: 1, label: "3 or 4" },
        { value: 2, label: "5 or 6" },
        { value: 3, label: "7 to 9" },
        { value: 4, label: "10 or more" },
      ],
    },
    { text: "How often do you have six or more drinks on one occasion?" },
    { text: "How often during the last year have you found that you were not able to stop drinking once you had started?" },
    { text: "How often during the last year have you failed to do what was normally expected of you because of drinking?" },
    { text: "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?" },
    { text: "How often during the last year have you had a feeling of guilt or remorse after drinking?" },
    { text: "How often during the last year have you been unable to remember what happened the night before because of your drinking?" },
    { text: "Have you or someone else been injured because of your drinking?", options: LAST_YEAR },
    { text: "Has a relative, friend, doctor, or other health worker been concerned about your drinking or suggested you cut down?", options: LAST_YEAR },
  ],
  thresholds: [
    { at: 8, label: "8 or more — indicating hazardous or harmful drinking", color: "text-nav-coral" },
  ],
  scoringNote: (
    <>
      Lower thresholds may apply for women and for older adults, so a total below 8 does not rule out
      a concern worth discussing.
    </>
  ),
  disclaimer: (
    <>
      The AUDIT is a screening tool, not a diagnostic instrument, and a score above the threshold does
      not constitute a diagnosis. Scores should be interpreted by a qualified clinician alongside a
      fuller evaluation. Developed by the World Health Organization (Babor, Higgins-Biddle, Saunders
      &amp; Monteiro, 2001). Public domain.
    </>
  ),
}

export function AUDIT() {
  return <ScaleAssessment config={config} />
}
