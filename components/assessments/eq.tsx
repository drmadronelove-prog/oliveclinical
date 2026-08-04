"use client"

import { useState } from "react"

// ── Data ─────────────────────────────────────────────────────────────────────
// Empathy Quotient (Baron-Cohen & Wheelwright, 2004; Autism Research Centre,
// University of Cambridge). 60 items — 40 scored (positively- or
// negatively-keyed), 20 unscored filler items included to reduce response bias.

type Direction = "pos" | "neg" | "fil"

const eqItems: { q: string; d: Direction }[] = [
  { q: "I can easily tell if someone else wants to enter a conversation.", d: "pos" },
  { q: "I prefer animals to humans.", d: "fil" },
  { q: "I try to keep up with the current trends and fashions.", d: "fil" },
  { q: "I find it difficult to explain to others things that I understand easily, when they don't understand it first time.", d: "neg" },
  { q: "I dream most nights.", d: "fil" },
  { q: "I really enjoy caring for other people.", d: "pos" },
  { q: "I try to solve my own problems rather than discussing them with others.", d: "fil" },
  { q: "I find it hard to know what to do in a social situation.", d: "neg" },
  { q: "I am at my best first thing in the morning.", d: "fil" },
  { q: "People often tell me that I went too far in driving my point home in a discussion.", d: "neg" },
  { q: "It doesn't bother me too much if I am late meeting a friend.", d: "neg" },
  { q: "Friendships and relationships are just too difficult, so I tend not to bother with them.", d: "neg" },
  { q: "I would never break a law, no matter how minor.", d: "fil" },
  { q: "I often find it difficult to judge if something is rude or polite.", d: "neg" },
  { q: "In a conversation, I tend to focus on my own thoughts rather than on what my listener might be thinking.", d: "neg" },
  { q: "I prefer practical jokes to verbal humour.", d: "fil" },
  { q: "I live life for today rather than the future.", d: "fil" },
  { q: "When I was a child, I enjoyed cutting up worms to see what would happen.", d: "neg" },
  { q: "I can pick up quickly if someone says one thing but means another.", d: "pos" },
  { q: "I tend to have very strong opinions about morality.", d: "fil" },
  { q: "It is hard for me to see why some things upset people so much.", d: "neg" },
  { q: "I find it easy to put myself in somebody else's shoes.", d: "pos" },
  { q: "I think that good manners are the most important thing a parent can teach their child.", d: "fil" },
  { q: "I like to do things on the spur of the moment.", d: "fil" },
  { q: "I am good at predicting how someone will feel.", d: "pos" },
  { q: "I am quick to spot when someone in a group is feeling awkward or uncomfortable.", d: "pos" },
  { q: "If I say something that someone else is offended by, I think that that's their problem, not mine.", d: "neg" },
  { q: "If anyone asked me if I liked their haircut, I would reply truthfully, even if I didn't like it.", d: "neg" },
  { q: "I can't always see why someone should have felt offended by a remark.", d: "neg" },
  { q: "People often tell me that I am very unpredictable.", d: "fil" },
  { q: "I enjoy being the centre of attention at any social gathering.", d: "fil" },
  { q: "Seeing people cry doesn't really upset me.", d: "neg" },
  { q: "I enjoy having discussions about politics.", d: "fil" },
  { q: "I am very blunt, which some people take to be rudeness, even though this is unintentional.", d: "neg" },
  { q: "I don't tend to find social situations confusing.", d: "pos" },
  { q: "Other people tell me I am good at understanding how they are feeling and what they are thinking.", d: "pos" },
  { q: "When I talk to people, I tend to talk about their experiences rather than my own.", d: "pos" },
  { q: "It upsets me to see an animal in pain.", d: "pos" },
  { q: "I am able to make decisions without being influenced by people's feelings.", d: "neg" },
  { q: "I can't relax until I have done everything I had planned to do that day.", d: "fil" },
  { q: "I can easily tell if someone else is interested or bored with what I am saying.", d: "pos" },
  { q: "I get upset if I see people suffering on news programmes.", d: "pos" },
  { q: "Friends usually talk to me about their problems as they say that I am very understanding.", d: "pos" },
  { q: "I can sense if I am intruding, even if the other person doesn't tell me.", d: "pos" },
  { q: "I often start new hobbies but quickly become bored with them and move on to something else.", d: "fil" },
  { q: "People sometimes tell me that I have gone too far with teasing.", d: "neg" },
  { q: "I would be too nervous to go on a big rollercoaster.", d: "fil" },
  { q: "Other people often say that I am insensitive, though I don't always see why.", d: "neg" },
  { q: "If I see a stranger in a group, I think that it is up to them to make an effort to join in.", d: "neg" },
  { q: "I usually stay emotionally detached when watching a film.", d: "neg" },
  { q: "I like to be very organised in day to day life and often make lists of the chores I have to do.", d: "fil" },
  { q: "I can tune into how someone else feels rapidly and intuitively.", d: "pos" },
  { q: "I don't like to take risks.", d: "fil" },
  { q: "I can easily work out what another person might want to talk about.", d: "pos" },
  { q: "I can tell if someone is masking their true emotion.", d: "pos" },
  { q: "Before making a decision I always weigh up the pros and cons.", d: "fil" },
  { q: "I don't consciously work out the rules of social situations.", d: "pos" },
  { q: "I am good at predicting what someone will do.", d: "pos" },
  { q: "I tend to get emotionally involved with a friend's problems.", d: "pos" },
  { q: "I can usually appreciate the other person's viewpoint, even if I don't agree with it.", d: "pos" },
]

const SCALE_LABELS = ["Strongly Agree", "Slightly Agree", "Slightly Disagree", "Strongly Disagree"]

type Answers = Partial<Record<number, number>> // item idx (0-based) → 1-4

// ── Scoring ───────────────────────────────────────────────────────────────────

function itemPoints(item: { d: Direction }, raw: number): number {
  if (item.d === "pos") return raw === 1 ? 2 : raw === 2 ? 1 : 0
  if (item.d === "neg") return raw === 4 ? 2 : raw === 3 ? 1 : 0
  return 0
}

function totalScore(answers: Answers): number {
  let sum = 0
  eqItems.forEach((item, i) => {
    const v = answers[i]
    if (v !== undefined) sum += itemPoints(item, v)
  })
  return sum
}

function scoredAnsweredCount(answers: Answers): number {
  let n = 0
  eqItems.forEach((item, i) => {
    if (item.d !== "fil" && answers[i] !== undefined) n++
  })
  return n
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {SCALE_LABELS.map((label, idx) => {
          const v = idx + 1
          const active = response === v
          return (
            <button
              key={v}
              type="button"
              onClick={() => onSelect(v)}
              className={`py-2 px-1.5 rounded border text-xs font-medium text-center leading-tight transition-colors ${
                active
                  ? "bg-nav-teal text-white border-nav-teal"
                  : "border-border text-muted-foreground hover:border-nav-teal hover:text-foreground"
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </li>
  )
}

// ── Copy / summary helpers ─────────────────────────────────────────────────────

function buildSummaryText(answers: Answers, score: number, complete: boolean): string {
  const lines = [
    "Empathy Quotient (EQ) — results",
    `Total: ${score} / 80${complete ? "" : " (incomplete)"}`,
    `Items answered: ${answeredCount(answers)} / 60`,
  ]
  return lines.join("\n")
}

// ── Main component ────────────────────────────────────────────────────────────

export function EQ() {
  const [open, setOpen] = useState(true)
  const [answers, setAnswers] = useState<Answers>({})
  const [copied, setCopied] = useState(false)

  function select(idx: number, value: number) {
    setAnswers((prev) => ({ ...prev, [idx]: value }))
  }

  function reset() {
    setAnswers({})
  }

  const answered = answeredCount(answers)
  const scoredAnswered = scoredAnsweredCount(answers)
  const score = totalScore(answers)
  const complete = answered === 60
  const low = complete && score <= 30

  async function copySummary() {
    const text = buildSummaryText(answers, score, complete)
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
      <button
        onClick={() => setOpen(!open)}
        className="no-print w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={open}
      >
        <div>
          <h2 className="font-[var(--font-display)] text-xl font-bold text-foreground">
            EQ: Empathy Quotient
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            60 items · Baron-Cohen &amp; Wheelwright, 2004
          </p>
        </div>
        <div className="flex items-center gap-4 ml-4">
          {answered > 0 && (
            <span className="text-xs font-semibold tabular-nums px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground">
              {score}&thinsp;/&thinsp;80 &nbsp;·&nbsp; {answered}/60
            </span>
          )}
          <ChevronIcon open={open} />
        </div>
      </button>

      <div className={`assessment-content ${open ? "" : "hidden"}`}>
        <div className="p-5 sm:p-6 border-t border-border space-y-8">
          <div className="hidden print:block">
            <h1 className="text-2xl font-bold">EQ: Empathy Quotient</h1>
            <p className="text-sm text-gray-500 mt-1">Baron-Cohen &amp; Wheelwright, 2004</p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>
              Please read each statement and select how strongly you agree or disagree with it.
              There are no right or wrong answers, or trick questions. In order for the scale to
              be valid, please answer every item.
            </p>
          </div>

          <ul className="divide-y divide-border/0">
            {eqItems.map((item, idx) => (
              <ItemRow
                key={idx}
                num={idx + 1}
                text={item.q}
                response={answers[idx]}
                onSelect={(v) => select(idx, v)}
              />
            ))}
          </ul>

          {answered > 0 && (
            <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-[var(--font-display)] text-lg font-bold text-foreground">
                  Total: {score} / 80
                </span>
                <span className="text-sm text-muted-foreground">
                  {answered} of 60 answered ({scoredAnswered} of 40 scored items)
                </span>
              </div>

              {complete && (
                <div className={`rounded-md px-3 py-2 ${low ? "bg-nav-salmon/10" : "bg-nav-teal/10"}`}>
                  <p className={`text-sm font-semibold ${low ? "text-nav-salmon" : "text-nav-teal"}`}>
                    {low
                      ? "Low range (≤ 30) — in the range more commonly seen in autistic samples"
                      : "Within the general-population range"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    General-population mean ≈ 42; autistic-sample mean ≈ 20. There is no single
                    hard clinical cutoff — interpret alongside other measures, not in isolation.
                  </p>
                </div>
              )}

              {!complete && (
                <p className="text-xs text-muted-foreground">
                  All 60 items (including filler items) must be answered for the scale to be valid.
                </p>
              )}

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>0</span>
                  <span className="text-nav-salmon">30 (low range)</span>
                  <span>80</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-nav-teal rounded-full transition-all duration-300"
                    style={{ width: `${(score / 80) * 100}%` }}
                  />
                  <div className="absolute top-0 h-full w-px bg-nav-salmon/70" style={{ left: `${(30 / 80) * 100}%` }} />
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Clinical note: </span>
            The EQ includes 20 unscored filler items (about morality, planning, risk-taking, and
            similar topics) mixed in with the 40 scored items to reduce response bias — please
            still answer those, even though they don't contribute to the total.
          </div>

          <p className="text-xs text-muted-foreground italic border-t border-border pt-4 leading-relaxed">
            The EQ is a screening tool, not a diagnostic instrument. Scores do not constitute a
            diagnosis of autism or any other condition. Baron-Cohen, S., &amp; Wheelwright, S.
            (2004). The Empathy Quotient: An investigation of adults with Asperger syndrome or
            high functioning autism, and normal sex differences.{" "}
            <em>Journal of Autism and Developmental Disorders, 34</em>(2), 163–175. © MRC-SBC/SJW,
            Autism Research Centre, University of Cambridge — reproduced here for free clinical
            and research use with citation.
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
