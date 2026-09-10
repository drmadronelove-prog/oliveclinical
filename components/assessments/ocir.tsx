"use client"

import { useState } from "react"

// ── Data ─────────────────────────────────────────────────────────────────────

const ocirItems: string[] = [
  "I have saved up so many things that they get in the way.",                                            // 1
  "I check things more often than necessary.",                                                           // 2
  "I get upset if objects are not arranged properly.",                                                   // 3
  "I feel compelled to count while I am doing things.",                                                  // 4
  "I find it difficult to touch an object when I know it has been touched by strangers or certain people.", // 5
  "I find it difficult to control my own thoughts.",                                                     // 6
  "I collect things I don't need.",                                                                      // 7
  "I repeatedly check doors, windows, drawers, etc.",                                                    // 8
  "I get upset if others change the way I have arranged things.",                                        // 9
  "I feel I have to repeat certain numbers.",                                                            // 10
  "I sometimes have to wash or clean myself simply because I feel contaminated.",                        // 11
  "I am upset by unpleasant thoughts that come into my mind against my will.",                           // 12
  "I avoid throwing things away because I am afraid I might need them later.",                           // 13
  "I repeatedly check gas and water taps and light switches after turning them off.",                    // 14
  "I need things to be arranged in a particular way.",                                                   // 15
  "I feel that there are good and bad numbers.",                                                         // 16
  "I wash my hands more often and longer than necessary.",                                               // 17
  "I frequently get nasty thoughts and have difficulty in getting rid of them.",                         // 18
]

// The scale's six three-item subscales, which run in a repeating cycle through
// the item order. The administration sheet scores the total only, so these are
// shown as a secondary breakdown.
const SUBSCALES: { key: string; label: string; items: number[] }[] = [
  { key: "hoarding",    label: "Hoarding",    items: [1, 7, 13] },
  { key: "checking",    label: "Checking",    items: [2, 8, 14] },
  { key: "ordering",    label: "Ordering",    items: [3, 9, 15] },
  { key: "neutralizing", label: "Neutralizing", items: [4, 10, 16] },
  { key: "washing",     label: "Washing",     items: [5, 11, 17] },
  { key: "obsessing",   label: "Obsessing",   items: [6, 12, 18] },
]

const TOTAL_ITEMS = ocirItems.length // 18
const MAX_SCORE = TOTAL_ITEMS * 4 // 72
const CUTOFF = 21
const OCD_MEAN = 28.0

// ── Types ─────────────────────────────────────────────────────────────────────

type Response = 0 | 1 | 2 | 3 | 4
type Answers = Partial<Record<number, Response>>

// ── Scoring ───────────────────────────────────────────────────────────────────

const OPTIONS: { value: Response; label: string }[] = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "A little" },
  { value: 2, label: "Moderately" },
  { value: 3, label: "A lot" },
  { value: 4, label: "Extremely" },
]

function calcScore(answers: Answers): number {
  let total = 0
  for (const response of Object.values(answers)) {
    if (response !== undefined) total += response
  }
  return total
}

function calcSubscale(answers: Answers, items: number[]): { score: number; answered: number } {
  let score = 0
  let answered = 0
  for (const num of items) {
    const r = answers[num]
    if (r !== undefined) {
      score += r
      answered += 1
    }
  }
  return { score, answered }
}

function calcAnswered(answers: Answers): number {
  return Object.values(answers).filter((v) => v !== undefined).length
}

function interpretation(score: number): { label: string; color: string } {
  if (score >= CUTOFF) {
    return {
      label: `At or above the recommended cutoff (${CUTOFF}+) — indicating the likely presence of OCD`,
      color: "text-nav-coral",
    }
  }
  return { label: `Below the recommended cutoff (< ${CUTOFF})`, color: "text-muted-foreground" }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function ScoreBadge({ score, answered }: { score: number; answered: number }) {
  const { color } = interpretation(score)
  return (
    <span className={`text-xs font-semibold tabular-nums px-2.5 py-1 rounded-full border border-border bg-muted ${color}`}>
      Score: {score}&thinsp;/&thinsp;{MAX_SCORE} &nbsp;·&nbsp; {answered} answered
    </span>
  )
}

interface OCIRItemRowProps {
  num: number
  text: string
  response: Response | undefined
  onSelect: (r: Response) => void
}

function OCIRItemRow({ num, text, response, onSelect }: OCIRItemRowProps) {
  return (
    <li className="py-3 border-b border-border/50 last:border-0">
      <p className="text-sm text-foreground mb-2 leading-snug">
        <span className="font-semibold tabular-nums text-muted-foreground mr-1.5">{num}.</span>
        {text}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {OPTIONS.map((opt) => {
          const selected = response === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`text-xs px-2 py-1.5 rounded border transition-colors text-center leading-tight ${
                selected
                  ? "bg-nav-teal text-white border-nav-teal font-semibold"
                  : "border-border text-muted-foreground hover:border-nav-teal hover:text-foreground"
              }`}
            >
              <span className="tabular-nums opacity-60 mr-1">{opt.value}</span>
              {opt.label}
            </button>
          )
        })}
      </div>
    </li>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function OCIR() {
  const [open, setOpen] = useState(true)
  const [answers, setAnswers] = useState<Answers>({})

  function select(itemNum: number, response: Response) {
    setAnswers((prev) => ({ ...prev, [itemNum]: response }))
  }

  function reset() {
    setAnswers({})
  }

  const score = calcScore(answers)
  const answered = calcAnswered(answers)
  const { label: interpLabel, color: interpColor } = interpretation(score)

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Collapsible header */}
      <button
        onClick={() => setOpen(!open)}
        className="no-print w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={open}
      >
        <div>
          <h2 className="font-[var(--font-display)] text-xl font-bold text-foreground">
            OCI-R: Obsessive-Compulsive Inventory &ndash; Revised
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            18-item self-report scale · Foa et al., 2002
          </p>
        </div>
        <div className="flex items-center gap-4 ml-4">
          {answered > 0 && <ScoreBadge score={score} answered={answered} />}
          <ChevronIcon open={open} />
        </div>
      </button>

      <div className={`assessment-content ${open ? "" : "hidden"}`}>
        <div className="p-5 sm:p-6 border-t border-border space-y-8">
          {/* Print-only heading */}
          <div className="hidden print:block">
            <h1 className="text-2xl font-bold">OCI-R: Obsessive-Compulsive Inventory &ndash; Revised</h1>
            <p className="text-sm text-gray-500 mt-1">Foa et al., 2002</p>
          </div>

          {/* Instructions */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            The following statements refer to experiences that many people have in their everyday lives.
            Choose the response that best describes <strong>how much that experience has distressed or
            bothered you during the past month</strong>.
          </p>

          {/* Option legend (desktop) */}
          <div className="no-print hidden sm:grid grid-cols-5 gap-1.5 text-xs text-center text-muted-foreground font-medium border-b border-border pb-3">
            {OPTIONS.map((opt) => (
              <div key={opt.value}>
                <span className="tabular-nums opacity-60 mr-1">{opt.value}</span>
                {opt.label}
              </div>
            ))}
          </div>

          {/* Items */}
          <ul className="divide-y divide-border/0">
            {ocirItems.map((text, idx) => {
              const num = idx + 1
              return (
                <OCIRItemRow
                  key={num}
                  num={num}
                  text={text}
                  response={answers[num]}
                  onSelect={(r) => select(num, r)}
                />
              )
            })}
          </ul>

          {/* Score summary */}
          {answered > 0 && (
            <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-[var(--font-display)] text-lg font-bold text-foreground">
                  Score: {score} / {MAX_SCORE}
                </span>
                <span className="text-sm text-muted-foreground">
                  {answered} of {TOTAL_ITEMS} answered
                </span>
              </div>
              {answered === TOTAL_ITEMS && (
                <p className={`text-sm font-medium ${interpColor}`}>{interpLabel}</p>
              )}
              {answered < TOTAL_ITEMS && (
                <p className="text-xs text-muted-foreground">
                  Complete all {TOTAL_ITEMS} items for a full interpretation.
                </p>
              )}

              {/* Threshold markers */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span className="text-nav-coral">{CUTOFF} (cutoff)</span>
                  <span className="text-nav-amber">{OCD_MEAN} (OCD mean)</span>
                  <span>{MAX_SCORE}</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-nav-teal rounded-full transition-all duration-300"
                    style={{ width: `${(score / MAX_SCORE) * 100}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-px bg-nav-coral/60"
                    style={{ left: `${(CUTOFF / MAX_SCORE) * 100}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-px bg-nav-amber/60"
                    style={{ left: `${(OCD_MEAN / MAX_SCORE) * 100}%` }}
                  />
                </div>
              </div>

              {/* Subscale breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 pt-3">
                {SUBSCALES.map((s) => {
                  const { score: sScore, answered: sAnswered } = calcSubscale(answers, s.items)
                  return (
                    <div key={s.key} className="flex justify-between gap-2 text-xs">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="tabular-nums text-foreground">
                        {sAnswered === s.items.length ? `${sScore} / 12` : "—"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground italic border-t border-border pt-4 leading-relaxed">
            The OCI-R is a screening tool, not a diagnostic instrument. A score at or above the cutoff
            does not constitute a diagnosis. Scores should be interpreted by a qualified clinician in
            conjunction with a comprehensive evaluation. The mean score for people with OCD is {OCD_MEAN}
            {" "}(SD = 13.53). Foa, E. B., Huppert, J. D., Leiberg, S., Hajcak, G., Langner, R., et al.
            (2002). The Obsessive-Compulsive Inventory: Development and validation of a short version.
            {" "}<em>Psychological Assessment, 14</em>, 485&ndash;496.
          </p>

          {/* Action buttons */}
          <div className="no-print flex flex-wrap gap-3">
            <button
              onClick={reset}
              className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
            >
              Clear / Reset
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
            >
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
