"use client"

import { useState } from "react"

// ── Data ─────────────────────────────────────────────────────────────────────

const popsItems: string[] = [
  "I get lost in the details.",                                                                          // 1
  "I never let someone else do something because they almost always do it incorrectly.",                 // 2
  "I tend to keep my emotions to myself.",                                                               // 3
  "When someone crosses me, I make sure to get revenge.",                                                // 4
  "I hate changing my plans at the last minute.",                                                        // 5
  "I get upset when my day's schedule is disrupted.",                                                    // 6
  "My need to be perfect affects how much I get done.",                                                  // 7
  "I often have to take over others' responsibilities to make sure that the job is done right.",         // 8
  "I spend too much time on something in order to get it just right.",                                   // 9
  "I try to convince others of what I believe to be right and wrong.",                                   // 10
  "People are either with me or they are against me.",                                                   // 11
  "I have been told I am inconsiderate of others.",                                                      // 12
  "I punish those who deserve it.",                                                                      // 13
  "Expressing emotions usually leads to embarrassment.",                                                 // 14
  "I am easily upset by changes in my routine.",                                                         // 15
  "I have trouble dealing with unforeseen events.",                                                      // 16
  "I have trouble with last minute changes.",                                                            // 17
  "I often miss the deadlines I set for myself.",                                                        // 18
  "I trust others to carry out tasks competently.",                                                      // 19 (reverse)
  "I tend to take on more tasks because counting on others is useless.",                                 // 20
  "Other people say that I am argumentative.",                                                           // 21
  "I get angry when others try to change my mind.",                                                      // 22
  "I have difficulty adapting to change.",                                                               // 23
  "Others say that I am closed minded.",                                                                 // 24
  "I am happy to let others help me in my work.",                                                        // 25 (reverse)
  "I am a stubborn person.",                                                                             // 26
  "I often spend too much time getting organized.",                                                      // 27
  "I rarely feel comfortable showing affection toward others.",                                          // 28
  "I hold back my feelings.",                                                                            // 29
  "It is difficult for me to show my feelings to others.",                                               // 30
  "People think I am being critical whenever I give them advice.",                                       // 31
  "I insist that others do things my way.",                                                              // 32
  "People tell me that I am inflexible.",                                                                // 33
  "Others have told me I am demanding in my relationships.",                                             // 34
  "When working in a group, I find that I end up doing most of the work.",                               // 35
  "People have described me as being closed with my feelings.",                                          // 36
  "I will put off a task if I do not think I can do it perfectly.",                                      // 37
  "People say I am critical of the way they do things.",                                                 // 38
  "It is hard for me to shift from one task to another.",                                                // 39
  "I end up doing a lot of jobs myself because no one can live up to my standards.",                     // 40
  "People say that I dismiss points of view that differ from my own.",                                   // 41
  "There are few people who can meet my expectations.",                                                  // 42
  "It really irritates me when people don't stick to the plan.",                                         // 43
  "I frequently need extensions on deadlines.",                                                          // 44
  "It takes longer for me to complete a task to my high standards.",                                     // 45
  "I get caught up in the details no matter what I'm doing.",                                            // 46
  "I put pressure on myself to get things just right.",                                                  // 47
  "It is difficult for me to relate to other people's emotions.",                                        // 48
  "I am hard on myself when I am unable to complete a task to my high standards.",                       // 49
]

// Items 1-indexed. Reverse-scored items are re-keyed as 7 - raw.
const REVERSE_ITEMS = new Set([19, 25])

// Item 39 is deliberately shared between maladaptive perfectionism and
// difficulty with change, per the scale's scoring instructions, so the factor
// item counts sum to 50 while the scale itself has 49 items.
const FACTORS: { key: string; label: string; items: number[] }[] = [
  { key: "rigidity",      label: "Rigidity",                  items: [4, 10, 11, 12, 13, 21, 22, 24, 26, 31, 32, 33, 34, 38, 41] },
  { key: "overcontrol",   label: "Emotional overcontrol",     items: [3, 14, 28, 29, 30, 36, 48] },
  { key: "perfectionism", label: "Maladaptive perfectionism", items: [1, 7, 9, 18, 27, 37, 39, 44, 45, 46, 47, 49] },
  { key: "delegate",      label: "Reluctance to delegate",    items: [2, 8, 19, 20, 25, 35, 40, 42] },
  { key: "change",        label: "Difficulty with change",    items: [5, 6, 15, 16, 17, 23, 39, 43] },
]

const TOTAL_ITEMS = popsItems.length // 49
const MIN_SCORE = TOTAL_ITEMS * 1
const MAX_SCORE = TOTAL_ITEMS * 6

// ── Types ─────────────────────────────────────────────────────────────────────

type Response = 1 | 2 | 3 | 4 | 5 | 6
type Answers = Partial<Record<number, Response>>

// ── Scoring ───────────────────────────────────────────────────────────────────

const OPTIONS: { value: Response; label: string }[] = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Slightly Disagree" },
  { value: 4, label: "Slightly Agree" },
  { value: 5, label: "Agree" },
  { value: 6, label: "Strongly Agree" },
]

function scoreItem(itemNum: number, response: Response): number {
  return REVERSE_ITEMS.has(itemNum) ? 7 - response : response
}

function calcScore(answers: Answers): number {
  let total = 0
  for (const [key, response] of Object.entries(answers)) {
    if (response !== undefined) total += scoreItem(Number(key), response)
  }
  return total
}

function calcFactor(answers: Answers, items: number[]): { score: number; answered: number; max: number } {
  let score = 0
  let answered = 0
  for (const num of items) {
    const r = answers[num]
    if (r !== undefined) {
      score += scoreItem(num, r)
      answered += 1
    }
  }
  return { score, answered, max: items.length * 6 }
}

function calcAnswered(answers: Answers): number {
  return Object.values(answers).filter((v) => v !== undefined).length
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
  return (
    <span className="text-xs font-semibold tabular-nums px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground">
      Score: {score}&thinsp;/&thinsp;{MAX_SCORE} &nbsp;·&nbsp; {answered} answered
    </span>
  )
}

interface POPSItemRowProps {
  num: number
  text: string
  response: Response | undefined
  onSelect: (r: Response) => void
}

function POPSItemRow({ num, text, response, onSelect }: POPSItemRowProps) {
  return (
    <li className="py-3 border-b border-border/50 last:border-0">
      <p className="text-sm text-foreground mb-2 leading-snug">
        <span className="font-semibold tabular-nums text-muted-foreground mr-1.5">{num}.</span>
        {text}
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        {OPTIONS.map((opt) => {
          const selected = response === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`text-[0.7rem] px-1.5 py-1.5 rounded border transition-colors text-center leading-tight ${
                selected
                  ? "bg-nav-teal text-white border-nav-teal font-semibold"
                  : "border-border text-muted-foreground hover:border-nav-teal hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </li>
  )
}

function FactorBar({
  label,
  score,
  answered,
  max,
  count,
}: {
  label: string
  score: number
  answered: number
  max: number
  count: number
}) {
  const min = count // every item contributes at least 1
  // Position within the factor's possible range, so a floor of all-1s reads as 0%.
  const pct = answered === count ? ((score - min) / (max - min)) * 100 : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-3 text-xs">
        <span className="text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {answered === count ? `${score} / ${max}` : `${answered} of ${count} answered`}
        </span>
      </div>
      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-nav-teal rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function POPS() {
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
  const complete = answered === TOTAL_ITEMS

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
            POPS: Pathological Obsessive-Compulsive Personality Scale
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            49-item measure across five factors · Pinto, Ansell &amp; Wright, 2019
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
            <h1 className="text-2xl font-bold">POPS: Pathological Obsessive-Compulsive Personality Scale</h1>
            <p className="text-sm text-gray-500 mt-1">Pinto, Ansell &amp; Wright, 2019</p>
          </div>

          {/* Instructions */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            The statements below describe attitudes, opinions, interests, feelings, and behaviors that
            people may experience. Choose the response that best describes the way you usually are.
            Please respond to every statement, even if you are not completely sure of your answer. Read
            each statement carefully, but don&rsquo;t spend too much time deciding on any one answer. Some
            statements are similar to each other — answer each one on its own, without concern for your
            other answers.
          </p>

          {/* Option legend (desktop) */}
          <div className="no-print hidden sm:grid grid-cols-6 gap-1.5 text-[0.7rem] text-center text-muted-foreground font-medium border-b border-border pb-3">
            {OPTIONS.map((opt) => (
              <div key={opt.value}>{opt.label}</div>
            ))}
          </div>

          {/* Items */}
          <ul className="divide-y divide-border/0">
            {popsItems.map((text, idx) => {
              const num = idx + 1
              return (
                <POPSItemRow
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
            <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-[var(--font-display)] text-lg font-bold text-foreground">
                  Total: {score} / {MAX_SCORE}
                </span>
                <span className="text-sm text-muted-foreground">
                  {answered} of {TOTAL_ITEMS} answered
                </span>
              </div>

              {!complete && (
                <p className="text-xs text-muted-foreground">
                  Complete all {TOTAL_ITEMS} items for the full factor breakdown. With every item
                  answered the total runs from {MIN_SCORE} to {MAX_SCORE}.
                </p>
              )}

              {/* Factor breakdown */}
              <div className="space-y-3 pt-1">
                <p className="text-xs font-semibold text-foreground">Factor scores</p>
                {FACTORS.map((f) => {
                  const { score: fScore, answered: fAnswered, max } = calcFactor(answers, f.items)
                  return (
                    <FactorBar
                      key={f.key}
                      label={f.label}
                      score={fScore}
                      answered={fAnswered}
                      max={max}
                      count={f.items.length}
                    />
                  )
                })}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                Items 19 and 25 are reverse-scored. Item 39 counts toward both maladaptive
                perfectionism and difficulty with change, so the factor item counts sum to more than
                49 while the total counts each item once.
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground italic border-t border-border pt-4 leading-relaxed">
            The POPS is a dimensional self-report measure, not a diagnostic instrument, and the source
            publishes no cut-off score — a higher total does not constitute a diagnosis of
            obsessive-compulsive personality disorder. Scores should be interpreted by a qualified
            clinician alongside a comprehensive evaluation. Pathological Obsessive-Compulsive
            Personality Scale (POPS) &copy; 2019 by Anthony Pinto, PhD, Emily B. Ansell, PhD, and Aidan
            G. C. Wright, PhD, in Grant, J. E., Chamberlain, S. R., &amp; Pinto, A. (Eds.), <em>
            Obsessive-Compulsive Personality Disorder</em>. American Psychiatric Association
            Publishing. All rights reserved.
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
