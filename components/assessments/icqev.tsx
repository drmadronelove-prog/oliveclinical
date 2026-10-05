"use client"

import { useState } from "react"

// ── Data ──────────────────────────────────────────────────────────────────────

// 30 items, verbatim from Appendix 1, Inferential Confusion Questionnaire
// (ICQ-EV), in O'Connor & Aardema (2012), Clinician's Handbook for
// Obsessive-Compulsive Disorder: Inference-Based Therapy. Originally
// published in Aardema et al. (2010).
const icqItems: string[] = [
  "I am sometimes more convinced about what might be there than by what I actually see.",
  "I sometimes invent stories about certain problems that might be there without paying attention to what I actually see.",
  "Sometimes certain far-fetched ideas feel so real they could just as well be happening.",
  "Often my mind starts to race and I come up with all kinds of far-fetched ideas.",
  "I can get very easily absorbed in remote possibilities that feel as if they are real.",
  "I often confuse different events as if they were the same.",
  "I often connect ideas or events in my mind that would seem far-fetched to others or even to me.",
  "Certain disturbing thoughts of mine sometimes cast a shadow onto everything I see around me.",
  "I sometime forget who or where I am when I get absorbed into certain ideas or stories.",
  "My imagination is sometimes so strong that I feel stuck and unable to see things differently.",
  "I invent arbitrary rules, which I then feel I have to live by.",
  "I often cannot tell whether something is safe, because things are not what they appear to be.",
  "Sometimes every far-fetched possibility my mind comes up with feels real to me.",
  "I sometimes get so absorbed in certain ideas that I am completely unable to see things differently even if I try.",
  "In order to tell whether there is a problem or not I tend to look more for that which is hidden than what I can actually see.",
  "Even if I don't have any actual proof of a certain problem, my imagination can convince me otherwise.",
  "Just the thought that there could be a problem or something wrong is proof enough for me that there is.",
  "I can get so caught up in certain ideas of mine that I totally forget about everything around me.",
  "Often when I feel certain about something, a small detail comes to mind that puts everything into doubt.",
  "I sometimes come up with far-fetched reasons why there is a problem or something wrong, which then suddenly starts to feel real to me.",
  "I often cannot get rid of certain ideas, because I keep coming up with possibilities that confirm my ideas.",
  "My imagination can make me lose confidence in what I actually perceive.",
  "A mere possibility often has as much impact on me as reality itself.",
  "Even if I have all sorts of visible evidence against the existence of a certain problem, I still feel it will occur.",
  "Even the smallest possibility can make me lose confidence in what I know.",
  "I can imagine something and end up living it.",
  "I am more often concerned with something that I cannot see rather than something I can see.",
  "I sometimes come up with bizarre possibilities that feel real to me.",
  "I often react to a scenario that might happen as if it is actually happening.",
  "I sometimes cannot tell whether all the possibilities that enter my mind are real or not.",
]

const SCALE: { value: number; label: string; short: string }[] = [
  { value: 1, label: "Strongly disagree", short: "Strongly\ndisagree" },
  { value: 2, label: "Disagree",          short: "Disagree" },
  { value: 3, label: "Somewhat disagree", short: "Somewhat\ndisagree" },
  { value: 4, label: "Somewhat agree",    short: "Somewhat\nagree" },
  { value: 5, label: "Agree",             short: "Agree" },
  { value: 6, label: "Strongly agree",    short: "Strongly\nagree" },
]

// Reference group means and SDs from published validation samples.
const REF_GROUPS = [
  { key: "nonclinical", label: "Non-clinical",   mean: 62,  sd: 22 },
  { key: "anxiety",     label: "Mixed anxiety",  mean: 85,  sd: 30 },
  { key: "ocd",         label: "OCD clinical",   mean: 109, sd: 32 },
] as const

type Answers = Partial<Record<number, number>>

function totalScore(answers: Answers): number {
  let sum = 0
  for (const v of Object.values(answers)) {
    if (typeof v === "number") sum += v
  }
  return sum
}

function answeredCount(answers: Answers): number {
  return Object.values(answers).filter((v) => typeof v === "number").length
}

// Pick the reference group whose mean is closest to the score.
function closestGroup(score: number): typeof REF_GROUPS[number] {
  let best: typeof REF_GROUPS[number] = REF_GROUPS[0]
  let bestDist = Math.abs(score - best.mean)
  for (const g of REF_GROUPS) {
    const d = Math.abs(score - g.mean)
    if (d < bestDist) {
      best = g
      bestDist = d
    }
  }
  return best
}

function bandStyle(key: typeof REF_GROUPS[number]["key"]) {
  if (key === "ocd")
    return { color: "text-nav-coral",  bg: "bg-nav-coral/10" }
  if (key === "anxiety")
    return { color: "text-nav-amber",  bg: "bg-nav-amber/10" }
  return    { color: "text-nav-teal",   bg: "bg-nav-teal/10"  }
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
  const groupId = `icqev-item-${num}`
  return (
    <li className="py-3 border-b border-border/50 last:border-0 print:break-inside-avoid">
      <fieldset>
        <legend className="text-sm text-foreground mb-2 leading-snug">
          <span className="font-semibold tabular-nums text-muted-foreground mr-1.5">{num}.</span>
          {text}
        </legend>
        <div
          className="grid grid-cols-6 gap-1"
          role="radiogroup"
          aria-labelledby={groupId}
        >
          {SCALE.map((opt) => {
            const active = response === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onSelect(opt.value)}
                title={opt.label}
                className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded border text-center transition-colors min-h-[44px] ${
                  active
                    ? "bg-nav-coral text-white border-nav-coral font-semibold"
                    : "border-border text-muted-foreground hover:border-nav-coral hover:text-foreground"
                }`}
              >
                <span className="text-sm font-bold">{opt.value}</span>
                <span className="text-[9px] leading-tight hidden sm:block whitespace-pre-line">
                  {opt.short}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>
    </li>
  )
}

// Compact item readout used in the print / results view.
function ItemReadout({ num, text, response }: { num: number; text: string; response: number }) {
  const label = SCALE.find((s) => s.value === response)?.label ?? ""
  return (
    <li className="py-2 border-b border-border/50 last:border-0 print:break-inside-avoid">
      <div className="flex items-start justify-between gap-4 text-sm">
        <p className="text-foreground leading-snug">
          <span className="font-semibold tabular-nums text-muted-foreground mr-1.5">{num}.</span>
          {text}
        </p>
        <span className="shrink-0 tabular-nums text-foreground font-medium">
          {response} <span className="text-muted-foreground font-normal">({label})</span>
        </span>
      </div>
    </li>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function ICQEV() {
  const [open, setOpen] = useState(true)
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)

  function select(itemNum: number, value: number) {
    setAnswers((prev) => ({ ...prev, [itemNum]: value }))
  }

  function reset() {
    setAnswers({})
    setSubmitted(false)
  }

  const answered = answeredCount(answers)
  const score = totalScore(answers)
  const complete = answered === 30
  const closest = submitted ? closestGroup(score) : null
  const bandColors = closest ? bandStyle(closest.key) : null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!complete) return
    setSubmitted(true)
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        document.getElementById("icqev-results")?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    }
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card icqev-root">
      {/* Collapsible header */}
      <button
        onClick={() => setOpen(!open)}
        className="no-print w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={open}
      >
        <div>
          <h2 className="font-[var(--font-display)] text-xl font-bold text-foreground">
            ICQ-EV: Inferential Confusion Questionnaire (Expanded Version)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            30-item self-report measure of inferential confusion · Aardema et al., 2010
          </p>
        </div>
        <div className="flex items-center gap-4 ml-4">
          {answered > 0 && (
            <span className="text-xs font-semibold tabular-nums px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground">
              {answered}/30 answered
            </span>
          )}
          <ChevronIcon open={open} />
        </div>
      </button>

      <div className={`assessment-content ${open ? "" : "hidden"}`}>
        <div className="p-5 sm:p-6 border-t border-border space-y-8">
          {/* Print-only heading + identifying info */}
          <div className="hidden print:block space-y-2 mb-2">
            <h1 className="text-2xl font-bold">
              ICQ-EV: Inferential Confusion Questionnaire (Expanded Version)
            </h1>
            <p className="text-sm">Aardema et al., 2010 · 30-item self-report</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Instructions */}
            <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <p>
                Rate your agreement or disagreement with each statement using the 6-point scale.
                Answer based on how you generally feel, not just today. All 30 items are required.
              </p>
              <div className="no-print rounded-md border border-border bg-muted/40 p-3">
                <p className="font-medium text-foreground mb-1 text-xs uppercase tracking-wider">Scale</p>
                <ol className="flex flex-wrap gap-x-5 gap-y-0.5">
                  {SCALE.map((s) => (
                    <li key={s.value} className="flex gap-1.5">
                      <span className="font-bold text-foreground">{s.value}</span>
                      <span>{s.label}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Items */}
            <ul className="divide-y divide-border/0">
              {icqItems.map((text, idx) => {
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

            {/* Submit row */}
            <div className="no-print flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={!complete}
                className="px-5 py-2.5 text-sm font-semibold rounded-md transition-colors bg-foreground text-background hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitted ? "Update results" : "Submit"}
              </button>
              <span className="text-xs text-muted-foreground tabular-nums">
                {answered} of 30 answered
              </span>
              <button
                type="button"
                onClick={reset}
                className="ml-auto px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
              >
                Start over
              </button>
            </div>
          </form>

          {/* Results view, rendered after submit */}
          {submitted && closest && bandColors && (
            <div id="icqev-results" className="rounded-lg border border-border bg-muted/40 p-4 space-y-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-[var(--font-display)] text-lg font-bold text-foreground">
                  Total score: {score} / 180
                </span>
                <span className="text-sm text-muted-foreground">30 of 30 answered</span>
              </div>

              {/* Reference band */}
              <div className={`rounded-md px-3 py-2 ${bandColors.bg}`}>
                <p className={`text-sm font-semibold ${bandColors.color}`}>
                  Closest to: {closest.label} (M = {closest.mean}, SD = {closest.sd})
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Published reference means: non-clinical ~62 (SD 22), mixed anxiety ~85 (SD 30), OCD clinical ~109 (SD 32).
                  This is a research-derived comparison, not a diagnosis.
                </p>
              </div>

              {/* Visual band */}
              <div className="space-y-1" aria-hidden="true">
                <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
                  <span>30</span>
                  <span className="text-nav-teal">62</span>
                  <span className="text-nav-amber">85</span>
                  <span className="text-nav-coral">109</span>
                  <span>180</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-nav-coral/70 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, ((score - 30) / 150) * 100))}%` }}
                  />
                  {REF_GROUPS.map((g) => (
                    <div
                      key={g.key}
                      className="absolute top-0 h-full w-px bg-foreground/40"
                      style={{ left: `${((g.mean - 30) / 150) * 100}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* All 30 items with selected responses */}
              <div className="border-t border-border pt-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Item responses
                </p>
                <ol className="divide-y divide-border/0">
                  {icqItems.map((text, idx) => {
                    const num = idx + 1
                    const r = answers[num]
                    if (typeof r !== "number") return null
                    return <ItemReadout key={num} num={num} text={text} response={r} />
                  })}
                </ol>
              </div>

              {/* Print + Save as PDF buttons */}
              <div className="no-print flex flex-wrap gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
                >
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
                  title="Choose Save as PDF in the print dialog"
                >
                  Save as PDF (choose "Save as PDF" in the print dialog)
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="ml-auto px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
                >
                  Start over
                </button>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground italic border-t border-border pt-4 leading-relaxed">
            The ICQ-EV is a self-report screening measure used in clinical and research settings for
            inferential confusion, a cognitive process associated with OCD. It is not a diagnostic
            instrument. Interpretation belongs in a conversation with a qualified clinician.
          </p>

          {/* Citation */}
          <p className="text-xs text-muted-foreground leading-relaxed">
            Aardema, F., Wu, K. D., Careau, Y., O&apos;Connor, K., Julien, D., &amp; Dennie, S. (2010).
            The Expanded Version of the Inferential Confusion Questionnaire: Further development and
            validation in clinical and non-clinical samples. <em>Journal of Psychopathology and
            Behavioral Assessment, 32</em>(3), 448 to 462.
          </p>
        </div>
      </div>

      {/* Print-only typography tweaks scoped to this assessment. */}
      <style>{`
        @media print {
          .icqev-root {
            font-family: Georgia, "Times New Roman", serif;
            color: #000;
          }
          .icqev-root, .icqev-root * {
            background: transparent !important;
          }
          .icqev-root {
            border: none !important;
            box-shadow: none !important;
          }
          .icqev-root .assessment-content { display: block !important; }
          .icqev-root h1 { font-size: 18pt; margin-bottom: 6pt; }
          .icqev-root h2 { font-size: 14pt; }
          .icqev-root p, .icqev-root li, .icqev-root dt, .icqev-root dd {
            font-size: 10pt;
            line-height: 1.4;
          }
          .icqev-root li { page-break-inside: avoid; break-inside: avoid; }
          @page { margin: 0.6in; }
        }
      `}</style>
    </div>
  )
}
