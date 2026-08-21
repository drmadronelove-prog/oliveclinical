"use client"

import { useState } from "react"

// ── Data ─────────────────────────────────────────────────────────────────────

type Subscale = "SK" | "SJ" | "CH" | "IS" | "Mind" | "OI"

interface Item {
  num: number
  text: string
  sub: Subscale
  reverse: boolean
}

const scsSfItems: Item[] = [
  { num: 1,  text: "When I fail at something important to me I become consumed by feelings of inadequacy.", sub: "OI",   reverse: true },
  { num: 2,  text: "I try to be understanding and patient towards those aspects of my personality I don't like.", sub: "SK", reverse: false },
  { num: 3,  text: "When something painful happens I try to take a balanced view of the situation.", sub: "Mind", reverse: false },
  { num: 4,  text: "When I'm feeling down, I tend to feel like most other people are probably happier than I am.", sub: "IS", reverse: true },
  { num: 5,  text: "I try to see my failings as part of the human condition.", sub: "CH", reverse: false },
  { num: 6,  text: "When I'm going through a very hard time, I give myself the caring and tenderness I need.", sub: "SK", reverse: false },
  { num: 7,  text: "When something upsets me I try to keep my emotions in balance.", sub: "Mind", reverse: false },
  { num: 8,  text: "When I fail at something that's important to me, I tend to feel alone in my failure.", sub: "IS", reverse: true },
  { num: 9,  text: "When I'm feeling down I tend to obsess and fixate on everything that's wrong.", sub: "OI", reverse: true },
  { num: 10, text: "When I feel inadequate in some way, I try to remind myself that feelings of inadequacy are shared by most people.", sub: "CH", reverse: false },
  { num: 11, text: "I'm disapproving and judgmental about my own flaws and inadequacies.", sub: "SJ", reverse: true },
  { num: 12, text: "I'm intolerant and impatient towards those aspects of my personality I don't like.", sub: "SJ", reverse: true },
]

const SUB_LABELS: Record<Subscale, string> = {
  SK: "Self-Kindness",
  SJ: "Self-Judgment",
  CH: "Common Humanity",
  IS: "Isolation",
  Mind: "Mindfulness",
  OI: "Over-Identification",
}
const SUB_ORDER: Subscale[] = ["SK", "SJ", "CH", "IS", "Mind", "OI"]

// ── Types ─────────────────────────────────────────────────────────────────────

type Answers = Partial<Record<number, number>> // item 1-12 → 1-5

// ── Scoring ───────────────────────────────────────────────────────────────────
// SCS-SF is scored as means, not sums: each subscale is the mean of its two
// (reverse-scored where applicable) items, and the total is the mean of the
// six subscale means — so everything lives on a 1–5 scale throughout.

function scoredValue(item: Item, raw: number): number {
  return item.reverse ? 6 - raw : raw
}

function subscaleMean(sub: Subscale, answers: Answers): number | null {
  const items = scsSfItems.filter((it) => it.sub === sub)
  const vals = items.map((it) => answers[it.num]).filter((v): v is number => v !== undefined)
  if (vals.length === 0) return null
  const sum = items.reduce((acc, it) => {
    const v = answers[it.num]
    return v !== undefined ? acc + scoredValue(it, v) : acc
  }, 0)
  return sum / vals.length
}

function totalMean(answers: Answers): number | null {
  const means = SUB_ORDER.map((s) => subscaleMean(s, answers)).filter((v): v is number => v !== null)
  if (means.length === 0) return null
  return means.reduce((a, b) => a + b, 0) / means.length
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

const SCALE_LABELS = ["Almost never", "Rarely", "Sometimes", "Often", "Almost always"]

function ItemRow({ num, text, response, onSelect }: ItemRowProps) {
  return (
    <li className="py-3 border-b border-border/50 last:border-0">
      <p className="text-sm text-foreground mb-2 leading-snug">
        <span className="font-semibold tabular-nums text-muted-foreground mr-1.5">{num}.</span>
        {text}
      </p>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
          <span>Almost never</span>
          <span>Almost always</span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {[1, 2, 3, 4, 5].map((v) => {
            const active = response === v
            return (
              <button
                key={v}
                type="button"
                onClick={() => onSelect(v)}
                title={SCALE_LABELS[v - 1]}
                className={`py-2 rounded border text-sm font-bold text-center transition-colors ${
                  active
                    ? "bg-nav-seafoam text-white border-nav-seafoam"
                    : "border-border text-muted-foreground hover:border-nav-seafoam hover:text-foreground"
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
  sub: Subscale
  answers: Answers
}

function SubscaleRow({ sub, answers }: SubscaleRowProps) {
  const items = scsSfItems.filter((it) => it.sub === sub)
  const mean = subscaleMean(sub, answers)
  const answeredHere = items.filter((it) => answers[it.num] !== undefined).length
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0">
      <div className="min-w-0">
        <span className="text-sm font-medium text-foreground">{SUB_LABELS[sub]}</span>
        <span className="ml-2 text-xs text-muted-foreground tabular-nums">
          {answeredHere}/{items.length} answered
        </span>
      </div>
      <span className="text-sm font-semibold tabular-nums text-foreground flex-shrink-0">
        {mean !== null ? mean.toFixed(2) : "—"}
      </span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function SCSSF() {
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
  const complete = answered === 12
  const total = totalMean(answers)

  let rangeLabel = ""
  let rangeClass = ""
  if (total !== null) {
    if (total < 2.5) {
      rangeLabel = "Low (1.00 – 2.49)"
      rangeClass = "bg-nav-salmon/10 text-nav-salmon"
    } else if (total <= 3.5) {
      rangeLabel = "Moderate (2.50 – 3.50)"
      rangeClass = "bg-nav-gold/15 text-nav-gold"
    } else {
      rangeLabel = "High (3.51 – 5.00)"
      rangeClass = "bg-nav-seafoam/15 text-nav-seafoam"
    }
  }

  async function copySummary() {
    const text = [
      "SCS-SF (Self-Compassion Scale — Short Form) — results",
      `Total: ${total !== null ? total.toFixed(2) : "—"} / 5.00${complete ? "" : " (incomplete)"}`,
      ...SUB_ORDER.map((s) => {
        const m = subscaleMean(s, answers)
        return `${SUB_LABELS[s]}: ${m !== null ? m.toFixed(2) : "—"}`
      }),
      `Items answered: ${answered} / 12`,
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
            SCS-SF: Self-Compassion Scale (Short Form)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            12-item self-compassion measure · Raes, Pommier, Neff &amp; Van Gucht, 2011
          </p>
        </div>
        <div className="flex items-center gap-4 ml-4">
          {answered > 0 && (
            <span className="text-xs font-semibold tabular-nums px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground">
              {total !== null ? total.toFixed(2) : "—"}&thinsp;/&thinsp;5.00 &nbsp;·&nbsp; {answered}/12
            </span>
          )}
          <ChevronIcon open={open} />
        </div>
      </button>

      <div className={`assessment-content ${open ? "" : "hidden"}`}>
        <div className="p-5 sm:p-6 border-t border-border space-y-8">
          {/* Print-only heading */}
          <div className="hidden print:block">
            <h1 className="text-2xl font-bold">SCS-SF: Self-Compassion Scale (Short Form)</h1>
            <p className="text-sm text-gray-500 mt-1">Raes, Pommier, Neff &amp; Van Gucht, 2011</p>
          </div>

          {/* Instructions */}
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground">How I typically act towards myself in difficult times.</p>
            <p>
              Please read each statement carefully before answering. Indicate how often you behave in the
              stated manner using the scale below. There are no right or wrong answers.
            </p>
          </div>

          {/* Items */}
          <ul className="divide-y divide-border/0">
            {scsSfItems.map((item) => (
              <ItemRow
                key={item.num}
                num={item.num}
                text={item.text}
                response={answers[item.num]}
                onSelect={(v) => select(item.num, v)}
              />
            ))}
          </ul>

          {/* Score summary */}
          {answered > 0 && (
            <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-[var(--font-display)] text-lg font-bold text-foreground">
                  Total: {total !== null ? total.toFixed(2) : "—"} / 5.00
                </span>
                <span className="text-sm text-muted-foreground">{answered} of 12 answered</span>
              </div>

              {complete && (
                <div className={`rounded-md px-3 py-2 ${rangeClass}`}>
                  <p className="text-sm font-semibold">{rangeLabel}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Higher scores indicate greater self-compassion. There are no established clinical
                    cutoffs — scores are most meaningful in a comparative context.
                  </p>
                </div>
              )}

              {!complete && (
                <p className="text-xs text-muted-foreground">
                  Complete all 12 items for a full interpretation.
                </p>
              )}

              {/* Subscales */}
              <div className="border-t border-border pt-4 space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Subscale scores (mean of 2 items each, 1–5)
                </p>
                {SUB_ORDER.map((s) => (
                  <SubscaleRow key={s} sub={s} answers={answers} />
                ))}
                <p className="text-xs text-muted-foreground pt-2 leading-relaxed">
                  Because each subscale contains only two items, subscale reliability is lower
                  (r = .54–.75) — interpret subscale scores with caution. The total score is the most
                  reliable indicator (Cronbach&rsquo;s α ≥ .86). Self-Judgment, Isolation, and
                  Over-Identification items are reverse scored before averaging.
                </p>
              </div>
            </div>
          )}

          {/* Clinical note */}
          <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Clinical note: </span>
            Self-compassion — treating oneself with kindness during difficulty rather than harsh
            self-judgment — is a useful adjunct construct alongside neurodivergence-affirming work,
            where self-criticism often compounds masking-related burnout and rejection sensitivity.
          </div>

          {/* Permission / disclaimer */}
          <p className="text-xs text-muted-foreground italic border-t border-border pt-4 leading-relaxed">
            The SCS-SF is a self-report measure, not a diagnostic instrument. Raes, F., Pommier, E.,
            Neff, K. D., &amp; Van Gucht, D. (2011). Construction and factorial validation of a short
            form of the Self-Compassion Scale. <em>Clinical Psychology &amp; Psychotherapy, 18</em>,
            250–255. Dr. Kristin Neff grants permission to use the SCS-SF for any purpose including
            research, clinical work, and teaching, with no license required, provided the reference
            above is cited.
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
