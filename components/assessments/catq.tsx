"use client"

import { useState } from "react"

// ── Data ─────────────────────────────────────────────────────────────────────

const catqItems: string[] = [
  "I adjust my body language or facial expressions so that I seem interested in the conversation, even when I'm not.",    // 1
  "I have developed a script to follow in social situations.",                                                             // 2
  "I monitor my own body language or facial expressions to try to fit in.",                                               // 3
  "I rarely feel the need to put on an act in order to get through a social situation.",                                  // 4  reverse
  "I think about what my face is doing so that I appear interested in the person I'm talking to.",                        // 5
  "I notice when others are uncomfortable and try to make them feel better, even if I'm not sure what to do.",            // 6
  "I know I can use smiling and eye contact to make people feel comfortable around me, even when I don't feel comfortable myself.", // 7
  "I change my personality depending on who I am with.",                                                                  // 8
  "I have spent time learning social skills from TV shows, books, or by watching other people.",                          // 9
  "I have memorized scripts from TV shows or films to use in conversation.",                                              // 10
  "I naturally mimic the behaviors of the people I spend time with.",                                                     // 11
  "When talking to other people, I feel like I am performing rather than being myself.",                                  // 12
  "I hide my true self when with other people.",                                                                          // 13
  "In social situations, I feel like I'm going through the motions.",                                                     // 14
  "I am always myself in social situations.",                                                                             // 15 reverse
  "I adjust my language or vocabulary depending on who I am with.",                                                       // 16
  "I don't feel the need to make eye contact with others to seem interested.",                                            // 17 reverse
  "I try hard to fit in with the people around me.",                                                                      // 18
  "I force myself to make eye contact with people, even when it feels uncomfortable.",                                    // 19
  "I have always been good at making conversation.",                                                                      // 20 reverse
  "I often observe people and learn how to socialize from them.",                                                         // 21
  "I sometimes copy the way other people talk, even without meaning to.",                                                 // 22
  "I use humor, sarcasm, or wit to fit in.",                                                                              // 23
  "I act like a different person at work or school compared to at home.",                                                 // 24
  "I feel free to be myself in social situations.",                                                                       // 25 reverse
]

const REVERSE_ITEMS = new Set([4, 15, 17, 20, 25])

// Subscale membership (1-indexed)
const ASSIMILATION_ITEMS  = new Set([2, 8, 9, 10, 12, 13, 14, 18, 24])  // 9 items, max 63
const COMPENSATION_ITEMS  = new Set([1, 3, 5, 7, 11, 16, 19, 21, 22])   // 9 items, max 63
const MASKING_ITEMS       = new Set([4, 6, 15, 17, 20, 23, 25])          // 7 items, max 49

// ── Types ─────────────────────────────────────────────────────────────────────

type Answers = Partial<Record<number, number>> // item 1-25 → 1-7

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoredValue(itemNum: number, raw: number): number {
  return REVERSE_ITEMS.has(itemNum) ? 8 - raw : raw
}

function totalScore(answers: Answers): number {
  let sum = 0
  for (const [key, v] of Object.entries(answers)) {
    if (v !== undefined) sum += scoredValue(Number(key), v)
  }
  return sum
}

function subscaleScore(items: Set<number>, answers: Answers): number | null {
  let total = 0
  let answered = 0
  for (const n of items) {
    const v = answers[n]
    if (v !== undefined) { total += scoredValue(n, v); answered++ }
  }
  return answered === 0 ? null : total
}

function answeredCount(answers: Answers): number {
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

interface ItemRowProps {
  num: number
  text: string
  response: number | undefined
  onSelect: (v: number) => void
}

function ItemRow({ num, text, response, onSelect }: ItemRowProps) {
  return (
    <li className="py-3 border-b border-border/50 last:border-0">
      <p className="text-sm text-foreground mb-2 leading-snug">
        <span className="font-semibold tabular-nums text-muted-foreground mr-1.5">{num}.</span>
        {text}
      </p>
      {/* 7-point scale */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
          <span>Strongly Disagree</span>
          <span>Strongly Agree</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((v) => {
            const active = response === v
            return (
              <button
                key={v}
                type="button"
                onClick={() => onSelect(v)}
                title={v === 1 ? "Strongly Disagree" : v === 7 ? "Strongly Agree" : String(v)}
                className={`py-2 rounded border text-sm font-bold text-center transition-colors ${
                  active
                    ? "bg-nav-salmon text-white border-nav-salmon"
                    : "border-border text-muted-foreground hover:border-nav-salmon hover:text-foreground"
                }`}
              >
                {v}
              </button>
            )
          })}
        </div>
      </div>
    </li>
  )
}

interface SubscaleRowProps {
  label: string
  abbr: string
  items: Set<number>
  max: number
  answers: Answers
}

function SubscaleRow({ label, abbr, items, max, answers }: SubscaleRowProps) {
  const score = subscaleScore(items, answers)
  const answeredHere = [...items].filter((n) => answers[n] !== undefined).length
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0">
      <div className="min-w-0">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="ml-1.5 text-xs text-muted-foreground">({abbr})</span>
        <span className="ml-2 text-xs text-muted-foreground tabular-nums">
          {answeredHere}/{items.size} answered
        </span>
      </div>
      <span className="text-sm font-semibold tabular-nums text-foreground flex-shrink-0">
        {score ?? "—"}&thinsp;/&thinsp;{max}
      </span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function CATQ() {
  const [open, setOpen] = useState(true)
  const [answers, setAnswers] = useState<Answers>({})
  const [copied, setCopied] = useState(false)

  function select(itemNum: number, value: number) {
    setAnswers((prev) => ({ ...prev, [itemNum]: value }))
  }

  function reset() {
    setAnswers({})
  }

  const answered = answeredCount(answers)
  const score = totalScore(answers)
  const complete = answered === 25
  const significant = complete && score > 100
  const compensation = subscaleScore(COMPENSATION_ITEMS, answers)
  const assimilation = subscaleScore(ASSIMILATION_ITEMS, answers)
  const masking = subscaleScore(MASKING_ITEMS, answers)

  async function copySummary() {
    const text = [
      "CAT-Q (Camouflaging Autistic Traits Questionnaire) — results",
      `Total: ${score} / 175${complete ? "" : " (incomplete)"}`,
      `Compensation: ${compensation ?? "—"} / 63`,
      `Assimilation: ${assimilation ?? "—"} / 63`,
      `Masking: ${masking ?? "—"} / 49`,
      `Items answered: ${answered} / 25`,
    ].join("\n")
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — no-op, Print/Save remains available
    }
  }

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
            CAT-Q: Camouflaging Autistic Traits
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            25-item camouflaging questionnaire · Hull et al., 2019
          </p>
        </div>
        <div className="flex items-center gap-4 ml-4">
          {answered > 0 && (
            <span className="text-xs font-semibold tabular-nums px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground">
              {score}&thinsp;/&thinsp;175 &nbsp;·&nbsp; {answered}/25
            </span>
          )}
          <ChevronIcon open={open} />
        </div>
      </button>

      <div className={`assessment-content ${open ? "" : "hidden"}`}>
        <div className="p-5 sm:p-6 border-t border-border space-y-8">
          {/* Print-only heading */}
          <div className="hidden print:block">
            <h1 className="text-2xl font-bold">CAT-Q: Camouflaging Autistic Traits Questionnaire</h1>
            <p className="text-sm text-gray-500 mt-1">Hull et al., 2019</p>
          </div>

          {/* Instructions */}
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>
              Rate how strongly each statement applies to you on a scale from 1 (Strongly Disagree)
              to 7 (Strongly Agree). Think about how you generally behave in social situations.
            </p>
          </div>

          {/* Items */}
          <ul className="divide-y divide-border/0">
            {catqItems.map((text, idx) => {
              const num = idx + 1
              return (
                <ItemRow
                  key={num}
                  num={num}
                  text={text}
                  response={answers[num]}
                  onSelect={(v) => select(num, v)}
                />
              )
            })}
          </ul>

          {/* Score summary */}
          {answered > 0 && (
            <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-[var(--font-display)] text-lg font-bold text-foreground">
                  Total: {score} / 175
                </span>
                <span className="text-sm text-muted-foreground">{answered} of 25 answered</span>
              </div>

              {complete && (
                <div className={`rounded-md px-3 py-2 ${significant ? "bg-nav-salmon/10" : "bg-nav-teal/10"}`}>
                  <p className={`text-sm font-semibold ${significant ? "text-nav-salmon" : "text-nav-teal"}`}>
                    {significant
                      ? "Significant camouflaging (score > 100)"
                      : "Below significant camouflaging threshold (≤ 100)"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Higher scores indicate greater use of camouflaging strategies.
                  </p>
                </div>
              )}

              {!complete && (
                <p className="text-xs text-muted-foreground">
                  Complete all 25 items for a full interpretation.
                </p>
              )}

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>25</span>
                  <span className="text-nav-salmon">100 (threshold)</span>
                  <span>175</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-nav-salmon rounded-full transition-all duration-300"
                    style={{ width: `${((score - 25) / 150) * 100}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-px bg-nav-salmon/70"
                    style={{ left: `${((100 - 25) / 150) * 100}%` }}
                  />
                </div>
              </div>

              {/* Subscales */}
              <div className="border-t border-border pt-4 space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Subscale scores
                </p>
                <SubscaleRow
                  label="Assimilation"
                  abbr="trying to fit in"
                  items={ASSIMILATION_ITEMS}
                  max={63}
                  answers={answers}
                />
                <SubscaleRow
                  label="Compensation"
                  abbr="masking difficulties"
                  items={COMPENSATION_ITEMS}
                  max={63}
                  answers={answers}
                />
                <SubscaleRow
                  label="Masking"
                  abbr="hiding autistic traits"
                  items={MASKING_ITEMS}
                  max={49}
                  answers={answers}
                />
              </div>
            </div>
          )}

          {/* Clinical note */}
          <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Clinical note: </span>
            Camouflaging is particularly common in women, non-binary individuals, and late-diagnosed
            autistic adults. High camouflaging scores are associated with increased risk of burnout,
            mental health difficulties, and delayed diagnosis — even when other autistic traits are
            present.
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground italic border-t border-border pt-4 leading-relaxed">
            The CAT-Q is a screening tool, not a diagnostic instrument. Scores do not constitute a
            diagnosis of autism or any other condition. Hull, L., Mandy, W., Lai, M-C., Baron-Cohen, S.,
            Allison, C., Smith, P., &amp; Petrides, K. V. (2019). Development and validation of the
            Camouflaging Autistic Traits Questionnaire (CAT-Q).{" "}
            <em>Journal of Autism and Developmental Disorders, 49</em>(3), 819–833.
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
            <button
              onClick={copySummary}
              disabled={answered === 0}
              className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? "Copied!" : "Copy Results Summary"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
