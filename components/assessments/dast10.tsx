"use client"

import { ScaleAssessment, type ScaleConfig } from "./scale-assessment"

const YES_NO = [
  { value: 1, label: "Yes" },
  { value: 0, label: "No" },
]

const config: ScaleConfig = {
  title: "DAST-10: Drug Abuse Screening Test",
  citation: "10-item screen · Skinner, 1982",
  instructions: (
    <>
      These questions concern your possible involvement with drugs, <strong>not including alcohol</strong>,
      during the past 12 months. &ldquo;Drug abuse&rdquo; refers to the use of prescribed or
      over-the-counter drugs in excess of the directions, and any nonmedical use of drugs — which may
      include cannabis, solvents, tranquilizers, barbiturates, cocaine, stimulants, hallucinogens, or
      narcotics. Please answer every question; if you have difficulty with a statement, choose the
      response that is mostly right.
    </>
  ),
  options: YES_NO,
  // Item 3 is worded in the healthy direction, so a "No" earns the point.
  reverseItems: [3],
  items: [
    { text: "Have you used drugs other than those required for medical reasons?" },
    { text: "Do you use more than one drug at a time?" },
    { text: "Are you always able to stop using drugs when you want to? (If you never use drugs, answer “Yes”.)" },
    { text: "Have you ever had blackouts or flashbacks as a result of drug use?" },
    { text: "Do you ever feel bad or guilty about your drug use? (If you never use drugs, answer “No”.)" },
    { text: "Does your spouse (or parents) ever complain about your involvement with drugs?" },
    { text: "Have you neglected your family because of your use of drugs?" },
    { text: "Have you engaged in illegal activities in order to obtain drugs?" },
    { text: "Have you ever experienced withdrawal symptoms (felt sick) when you stopped taking drugs?" },
    { text: "Have you had medical problems as a result of your drug use (e.g. memory loss, hepatitis, convulsions, bleeding)?" },
  ],
  thresholds: [
    { at: 1, label: "Low level of problems related to drug use (1–2)", color: "text-muted-foreground" },
    { at: 3, label: "Intermediate level of problems related to drug use (3–5)", color: "text-nav-amber" },
    { at: 6, label: "Substantial to severe (6–10) — a diagnostic evaluation is indicated", color: "text-nav-coral" },
  ],
  scoringNote: (
    <>
      A total of 0 indicates no problems reported. Item 3 is reverse-keyed: a &ldquo;No&rdquo; scores
      the point, since the question is worded in the healthy direction.
    </>
  ),
  disclaimer: (
    <>
      The DAST-10 is a screening tool, not a diagnostic instrument, and a score above a threshold does
      not constitute a diagnosis. Scores should be interpreted by a qualified clinician alongside a
      fuller evaluation. Drug Abuse Screening Test (DAST-10). Copyright 1982 by the Addiction Research
      Foundation.
    </>
  ),
}

export function DAST10() {
  return <ScaleAssessment config={config} />
}
