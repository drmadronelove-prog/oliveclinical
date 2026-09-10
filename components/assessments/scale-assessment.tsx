"use client"

import { useMemo, useState } from "react"

/**
 * The shared shell every questionnaire on the assessments page renders through,
 * so they all read the same way: a collapsible header carrying a live score, the
 * scale's instructions, an option legend, numbered items, a score summary with
 * whatever thresholds and subscales the scale defines, the citation, and the
 * reset/print controls.
 *
 * Scales differ in the ways this config allows and no further — option set,
 * per-item option overrides (AUDIT and RBQ-3 change options mid-scale),
 * reverse-keyed items, subscales, and threshold markers.
 *
 * None of these collect a name, a date, or any other identifying detail. They
 * score in the browser and are never submitted anywhere.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type Option = { value: number; label: string }

export type Item = {
  /** Statement shown to the responder. */
  text: string
  /** Replaces the scale's default options for this item alone. */
  options?: Option[]
  /** Section heading rendered above this item. */
  section?: string
  /** Standing instruction for the section this item opens, e.g. a VVIQ scene. */
  sectionNote?: string
}

export type Subscale = {
  label: string
  /** 1-indexed item numbers. */
  items: number[]
}

export type Threshold = {
  /** Score at which this band starts. */
  at: number
  label: string
  /** Tailwind text colour class for the marker and summary line. */
  color?: string
}

export type ScaleConfig = {
  title: string
  /** Shown under the title and in the print header. */
  citation: string
  instructions: React.ReactNode
  options: Option[]
  items: Item[]
  /** 1-indexed item numbers scored as (reverseMax + reverseMin) - raw. */
  reverseItems?: number[]
  subscales?: Subscale[]
  /** Bands applied to the total, highest `at` first wins. */
  thresholds?: Threshold[]
  /** Citation/limitation text under the items. Defaults to a generic line. */
  disclaimer: React.ReactNode
  /**
   * Replaces the default "sum the selected values, flipping reverseItems"
   * scoring. Scales that key responses rather than sum them — the AQ family
   * scoring one point per keyed answer, the EQ scoring 0/1/2 by direction with
   * filler items scoring nothing — pass their own here. Supplying this means
   * the range can no longer be derived from the options, so pass scoreRange too.
   */
  scoreItem?: (itemNum: number, raw: number) => number
  /** Overrides the computed range (needed with a custom scoreItem, or when options start above 0). */
  scoreRange?: { min: number; max: number }
  /**
   * How item scores combine into the headline number. Most scales sum; the
   * MDS-16 and SCS-SF are defined on the mean of their items, so summing them
   * would report a number that means something different from the published
   * one. Subscales follow the same aggregate.
   */
  aggregate?: "sum" | "mean"
  /** Decimal places for a mean-scored total. Defaults to 2. */
  meanPrecision?: number
  /** Extra note rendered inside the score summary, e.g. reverse-key wrinkles. */
  scoringNote?: React.ReactNode
}

type Answers = Record<number, number | undefined>

// ── Scoring ───────────────────────────────────────────────────────────────────

function optionsFor(config: ScaleConfig, itemNum: number): Option[] {
  return config.items[itemNum - 1]?.options ?? config.options
}

function scoreItem(config: ScaleConfig, itemNum: number, raw: number): number {
  if (config.scoreItem) return config.scoreItem(itemNum, raw)
  if (!config.reverseItems?.includes(itemNum)) return raw
  const opts = optionsFor(config, itemNum)
  const lo = Math.min(...opts.map((o) => o.value))
  const hi = Math.max(...opts.map((o) => o.value))
  return lo + hi - raw
}

function totalFor(config: ScaleConfig, answers: Answers): number {
  let total = 0
  let n = 0
  for (const [num, raw] of Object.entries(answers)) {
    if (raw !== undefined) {
      total += scoreItem(config, Number(num), raw)
      n += 1
    }
  }
  if (config.aggregate !== "mean") return total
  return n === 0 ? 0 : total / n
}

/** Formats a score for display, keeping means to their decimal places. */
function fmt(config: ScaleConfig, value: number): string {
  if (config.aggregate !== "mean") return String(value)
  return value.toFixed(config.meanPrecision ?? 2)
}

function rangeFor(config: ScaleConfig): { min: number; max: number } {
  if (config.scoreRange) return config.scoreRange
  // A mean stays on the item's own scale rather than accumulating across items.
  if (config.aggregate === "mean") {
    const values = config.items.flatMap((_, i) => optionsFor(config, i + 1).map((o) => o.value))
    return { min: Math.min(...values), max: Math.max(...values) }
  }
  let min = 0
  let max = 0
  for (let n = 1; n <= config.items.length; n++) {
    const values = optionsFor(config, n).map((o) => o.value)
    min += Math.min(...values)
    max += Math.max(...values)
  }
  return { min, max }
}

function bandFor(config: ScaleConfig, score: number): Threshold | undefined {
  if (!config.thresholds?.length) return undefined
  return [...config.thresholds].sort((a, b) => b.at - a.at).find((t) => score >= t.at)
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

function ItemRow({
  num,
  item,
  options,
  response,
  onSelect,
}: {
  num: number
  item: Item
  options: Option[]
  response: number | undefined
  onSelect: (v: number) => void
}) {
  // Keep the buttons legible however many options the scale uses.
  const cols =
    options.length <= 2
      ? "grid-cols-2"
      : options.length === 3
        ? "grid-cols-3"
        : options.length === 4
          ? "grid-cols-2 sm:grid-cols-4"
          : options.length === 5
            ? "grid-cols-2 sm:grid-cols-5"
            : "grid-cols-3 sm:grid-cols-6"

  return (
    <li className="py-3 border-b border-border/50 last:border-0">
      <p className="text-sm text-foreground mb-2 leading-snug">
        <span className="font-semibold tabular-nums text-muted-foreground mr-1.5">{num}.</span>
        {item.text}
      </p>
      <div className={`grid ${cols} gap-1.5`}>
        {options.map((opt) => {
          const selected = response === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`text-[0.7rem] sm:text-xs px-2 py-1.5 rounded border transition-colors text-center leading-tight ${
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

// ── Main component ────────────────────────────────────────────────────────────

export function ScaleAssessment({ config }: { config: ScaleConfig }) {
  const [open, setOpen] = useState(true)
  const [answers, setAnswers] = useState<Answers>({})

  const totalItems = config.items.length
  const { min, max } = useMemo(() => rangeFor(config), [config])
  const score = totalFor(config, answers)
  const answered = Object.values(answers).filter((v) => v !== undefined).length
  const complete = answered === totalItems
  const band = complete ? bandFor(config, score) : undefined

  // Every item shares the scale's options unless one overrides them, in which
  // case the legend would be wrong and is dropped.
  const uniformOptions = config.items.every((i) => !i.options)

  function reset() {
    setAnswers({})
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="no-print w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={open}
      >
        <div>
          <h2 className="font-[var(--font-display)] text-xl font-bold text-foreground">
            {config.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{config.citation}</p>
        </div>
        <div className="flex items-center gap-4 ml-4">
          {answered > 0 && (
            <span
              className={`text-xs font-semibold tabular-nums px-2.5 py-1 rounded-full border border-border bg-muted ${band?.color ?? "text-muted-foreground"}`}
            >
              Score: {fmt(config, score)}&thinsp;/&thinsp;{max} &nbsp;·&nbsp; {answered} answered
            </span>
          )}
          <ChevronIcon open={open} />
        </div>
      </button>

      <div className={`assessment-content ${open ? "" : "hidden"}`}>
        <div className="p-5 sm:p-6 border-t border-border space-y-8">
          {/* Print-only heading */}
          <div className="hidden print:block">
            <h1 className="text-2xl font-bold">{config.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{config.citation}</p>
          </div>

          <div className="text-sm text-muted-foreground leading-relaxed">{config.instructions}</div>

          {uniformOptions && (
            <div
              className={`no-print hidden sm:grid gap-1.5 text-[0.7rem] text-center text-muted-foreground font-medium border-b border-border pb-3`}
              style={{ gridTemplateColumns: `repeat(${config.options.length}, minmax(0, 1fr))` }}
            >
              {config.options.map((opt) => (
                <div key={opt.value}>{opt.label}</div>
              ))}
            </div>
          )}

          <ul className="divide-y divide-border/0">
            {config.items.map((item, idx) => {
              const num = idx + 1
              return (
                <div key={num}>
                  {item.section && (
                    <div className="pt-5 pb-1">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.section}
                      </p>
                      {item.sectionNote && (
                        <p className="text-sm text-foreground mt-1.5">{item.sectionNote}</p>
                      )}
                    </div>
                  )}
                  <ItemRow
                    num={num}
                    item={item}
                    options={optionsFor(config, num)}
                    response={answers[num]}
                    onSelect={(v) => setAnswers((prev) => ({ ...prev, [num]: v }))}
                  />
                </div>
              )
            })}
          </ul>

          {answered > 0 && (
            <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-[var(--font-display)] text-lg font-bold text-foreground">
                  Score: {fmt(config, score)} / {max}
                </span>
                <span className="text-sm text-muted-foreground">
                  {answered} of {totalItems} answered
                </span>
              </div>

              {complete && band && (
                <p className={`text-sm font-medium ${band.color ?? "text-muted-foreground"}`}>
                  {band.label}
                </p>
              )}
              {!complete && (
                <p className="text-xs text-muted-foreground">
                  Complete all {totalItems} items for a full interpretation.
                  {min > 0 && ` With every item answered the total runs from ${min} to ${max}.`}
                </p>
              )}

              {config.thresholds && config.thresholds.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{min}</span>
                    {[...config.thresholds]
                      .sort((a, b) => a.at - b.at)
                      .map((t) => (
                        <span key={t.at} className={t.color}>
                          {t.at}
                        </span>
                      ))}
                    <span>{max}</span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-nav-teal rounded-full transition-all duration-300"
                      style={{ width: `${((score - min) / (max - min)) * 100}%` }}
                    />
                    {config.thresholds.map((t) => (
                      <div
                        key={t.at}
                        className="absolute top-0 h-full w-px bg-foreground/30"
                        style={{ left: `${((t.at - min) / (max - min)) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {config.subscales && config.subscales.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 pt-2">
                  {config.subscales.map((s) => {
                    let sScore = 0
                    let sAnswered = 0
                    let sMax = 0
                    for (const n of s.items) {
                      const raw = answers[n]
                      sMax += Math.max(...optionsFor(config, n).map((o) => o.value))
                      if (raw !== undefined) {
                        sScore += scoreItem(config, n, raw)
                        sAnswered += 1
                      }
                    }
                    const shown =
                      config.aggregate === "mean"
                        ? { value: sScore / (s.items.length || 1), of: max }
                        : { value: sScore, of: sMax }
                    return (
                      <div key={s.label} className="flex justify-between gap-2 text-xs">
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className="tabular-nums text-foreground">
                          {sAnswered === s.items.length
                            ? `${fmt(config, shown.value)} / ${shown.of}`
                            : "—"}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {config.scoringNote && (
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  {config.scoringNote}
                </p>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground italic border-t border-border pt-4 leading-relaxed">
            {config.disclaimer}
          </p>

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
