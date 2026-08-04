"use client"

import { useState } from "react"

// ── Data ─────────────────────────────────────────────────────────────────────
// Ritvo Autism Asperger Diagnostic Scale — Revised (RAADS-R).
// © Riva Ariella Ritvo, Ph.D. and Edward Ritvo, M.D., 2007
// (Ritvo et al., 2011, J Autism Dev Disord 41:1076–1089).
// 80 items; "rev" items are reverse-scored per the official scoring key.

type Direction = "std" | "rev"

const raadsrItems: { q: string; d: Direction }[] = [
  { q: "I am a sympathetic person.", d: "rev" },
  { q: "I often use words and phrases from movies and television in conversations.", d: "std" },
  { q: "I am often surprised when others tell me I have been rude.", d: "std" },
  { q: "Sometimes I talk too loudly or too softly, and I am not aware of it.", d: "std" },
  { q: "I often don't know how to act in social situations.", d: "std" },
  { q: "I can \"put myself in other people's shoes.\"", d: "rev" },
  { q: "I have a hard time figuring out what some phrases mean, like \"you are the apple of my eye.\"", d: "std" },
  { q: "I only like to talk to people who share my special interests.", d: "std" },
  { q: "I focus on details rather than the overall idea.", d: "std" },
  { q: "I always notice how food feels in my mouth. This is more important to me than how it tastes.", d: "std" },
  { q: "I miss my best friends or family when we are apart for a long time.", d: "rev" },
  { q: "Sometimes I offend others by saying what I am thinking, even if I don't mean to.", d: "std" },
  { q: "I only like to think and talk about a few things that interest me.", d: "std" },
  { q: "I'd rather go out to eat in a restaurant by myself than with someone I know.", d: "std" },
  { q: "I cannot imagine what it would be like to be someone else.", d: "std" },
  { q: "I have been told that I am clumsy or uncoordinated.", d: "std" },
  { q: "Others consider me odd or different.", d: "std" },
  { q: "I understand when friends need to be comforted.", d: "rev" },
  { q: "I am very sensitive to the way my clothes feel when I touch them. How they feel is more important to me than how they look.", d: "std" },
  { q: "I like to copy the way certain people speak and act. It helps me appear more normal.", d: "std" },
  { q: "It can be very intimidating for me to talk to more than one person at the same time.", d: "std" },
  { q: "I have to \"act normal\" to please other people and make them like me.", d: "std" },
  { q: "Meeting new people is usually easy for me.", d: "rev" },
  { q: "I get highly confused when someone interrupts me when I am talking about something I am very interested in.", d: "std" },
  { q: "It is difficult for me to understand how other people are feeling when we are talking.", d: "std" },
  { q: "I like having a conversation with several people, for instance around a dinner table, at school or at work.", d: "rev" },
  { q: "I take things too literally, so I often miss what people are trying to say.", d: "std" },
  { q: "It is very difficult for me to understand when someone is embarrassed or jealous.", d: "std" },
  { q: "Some ordinary textures that do not bother others feel very offensive when they touch my skin.", d: "std" },
  { q: "I get extremely upset when the way I like to do things is suddenly changed.", d: "std" },
  { q: "I have never wanted or needed to have what other people call an \"intimate relationship.\"", d: "std" },
  { q: "It is difficult for me to start and stop a conversation. I need to keep going until I am finished.", d: "std" },
  { q: "I speak with a normal rhythm.", d: "rev" },
  { q: "The same sound, color or texture can suddenly change from very sensitive to very dull.", d: "std" },
  { q: "The phrase \"I've got you under my skin\" makes me very uncomfortable.", d: "std" },
  { q: "Sometimes the sound of a word or a high-pitched noise can be painful to my ears.", d: "std" },
  { q: "I am an understanding type of person.", d: "rev" },
  { q: "I do not connect with characters in movies and cannot feel what they feel.", d: "std" },
  { q: "I cannot tell when someone is flirting with me.", d: "std" },
  { q: "I can see in my mind in exact detail things that I am interested in.", d: "std" },
  { q: "I keep lists of things that interest me, even when they have no practical use (for example sports statistics, train schedules, calendar dates, historical facts and dates).", d: "std" },
  { q: "When I feel overwhelmed by my senses, I have to isolate myself to shut them down.", d: "std" },
  { q: "I like to talk things over with my friends.", d: "rev" },
  { q: "I cannot tell if someone is interested or bored with what I am saying.", d: "std" },
  { q: "It can be very hard to read someone's face, hand and body movements when they are talking.", d: "std" },
  { q: "The same thing (like clothes or temperatures) can feel very different to me at different times.", d: "std" },
  { q: "I feel very comfortable with dating or being in social situations with others.", d: "rev" },
  { q: "I try to be as helpful as I can when other people tell me their personal problems.", d: "rev" },
  { q: "I have been told that I have an unusual voice (for example flat, monotone, childish, or high-pitched).", d: "std" },
  { q: "Sometimes a thought or a subject gets stuck in my mind and I have to talk about it even if no one is interested.", d: "std" },
  { q: "I do certain things with my hands over and over again (like flapping, twirling sticks or strings, waving things by my eyes).", d: "std" },
  { q: "I have never been interested in what most of the people I know consider interesting.", d: "std" },
  { q: "I am considered a compassionate type of person.", d: "rev" },
  { q: "I get along with other people by following a set of specific rules that help me look normal.", d: "std" },
  { q: "It is very difficult for me to work and function in groups.", d: "std" },
  { q: "When I am talking to someone, it is hard to change the subject. If the other person does so, I can get very upset and confused.", d: "std" },
  { q: "Sometimes I have to cover my ears to block out painful noises (like vacuum cleaners or people talking too much or too loudly).", d: "std" },
  { q: "I can chat and make small talk with people.", d: "rev" },
  { q: "Sometimes things that should feel painful are not (for instance when I hurt myself or burn my hand on a stove).", d: "std" },
  { q: "When talking to someone, I have a hard time telling when it is my turn to talk or to listen.", d: "std" },
  { q: "I am considered a loner by those who know me best.", d: "std" },
  { q: "I usually speak in a normal tone.", d: "rev" },
  { q: "I like things to be exactly the same day after day and even small changes in my routines upset me.", d: "std" },
  { q: "How to make friends and socialize is a mystery to me.", d: "std" },
  { q: "It calms me to spin around or to rock in a chair when I am feeling stressed.", d: "std" },
  { q: "The phrase, \"He wears his heart on his sleeve,\" does not make sense to me.", d: "std" },
  { q: "If I am in a place where there are many smells, textures to feel, noises or bright lights, I feel anxious or frightened.", d: "std" },
  { q: "I can tell when someone says one thing but means something else.", d: "rev" },
  { q: "I like to be by myself as much as I can.", d: "std" },
  { q: "I keep my thoughts stacked in my memory like they are on filing cards, and I pick out the ones I need by looking through the stack and finding the right one (or another unique way).", d: "std" },
  { q: "The same sound sometimes seems very loud or very soft, even though I know it has not changed.", d: "std" },
  { q: "I enjoy spending time eating and talking with my family and friends.", d: "rev" },
  { q: "I can't tolerate things I dislike (like smells, textures, sounds or colors).", d: "std" },
  { q: "I don't like to be hugged or held.", d: "std" },
  { q: "When I go somewhere, I have to follow a familiar route or I can get very confused and upset.", d: "std" },
  { q: "It is difficult to figure out what other people expect of me.", d: "std" },
  { q: "I like to have close friends.", d: "rev" },
  { q: "People tell me that I give too much detail.", d: "std" },
  { q: "I am often told that I ask embarrassing questions.", d: "std" },
  { q: "I tend to point out other people's mistakes.", d: "std" },
]

const SCALE_LABELS = [
  { l: "True now and when I was young", v: 3 },
  { l: "True only now", v: 2 },
  { l: "True only when I was younger than 16", v: 1 },
  { l: "Never true", v: 0 },
]

type Answers = Partial<Record<number, number>> // item idx (0-based) → 0-3

// ── Scoring ───────────────────────────────────────────────────────────────────

function itemPoints(item: { d: Direction }, raw: number): number {
  return item.d === "rev" ? 3 - raw : raw
}

function totalScore(answers: Answers): number {
  let sum = 0
  raadsrItems.forEach((item, i) => {
    const v = answers[i]
    if (v !== undefined) sum += itemPoints(item, v)
  })
  return sum
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
        {SCALE_LABELS.map(({ l, v }) => {
          const active = response === v
          return (
            <button
              key={v}
              type="button"
              onClick={() => onSelect(v)}
              className={`py-2 px-1.5 rounded border text-xs font-medium text-center leading-tight transition-colors ${
                active
                  ? "bg-nav-salmon text-white border-nav-salmon"
                  : "border-border text-muted-foreground hover:border-nav-salmon hover:text-foreground"
              }`}
            >
              {l}
            </button>
          )
        })}
      </div>
    </li>
  )
}

function buildSummaryText(answers: Answers, score: number, complete: boolean): string {
  return [
    "RAADS-R (Ritvo Autism Asperger Diagnostic Scale — Revised) — results",
    `Total: ${score} / 240${complete ? "" : " (incomplete)"}`,
    `Items answered: ${answeredCount(answers)} / 80`,
  ].join("\n")
}

// ── Main component ────────────────────────────────────────────────────────────

export function RAADSR() {
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
  const score = totalScore(answers)
  const complete = answered === 80
  const consistent = complete && score >= 65
  const stronglyConsistent = complete && score >= 90

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
            RAADS-R
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            80-item autism screen · Ritvo et al., 2011
          </p>
        </div>
        <div className="flex items-center gap-4 ml-4">
          {answered > 0 && (
            <span className="text-xs font-semibold tabular-nums px-2.5 py-1 rounded-full border border-border bg-muted text-muted-foreground">
              {score}&thinsp;/&thinsp;240 &nbsp;·&nbsp; {answered}/80
            </span>
          )}
          <ChevronIcon open={open} />
        </div>
      </button>

      <div className={`assessment-content ${open ? "" : "hidden"}`}>
        <div className="p-5 sm:p-6 border-t border-border space-y-8">
          <div className="hidden print:block">
            <h1 className="text-2xl font-bold">RAADS-R: Ritvo Autism Asperger Diagnostic Scale — Revised</h1>
            <p className="text-sm text-gray-500 mt-1">Ritvo et al., 2011</p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>
              Below are some life experiences and personality characteristics that may apply to
              you. For each statement, choose the single column that best applies. There are no
              right or wrong answers.
            </p>
          </div>

          <ul className="divide-y divide-border/0">
            {raadsrItems.map((item, idx) => (
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
                  Total: {score} / 240
                </span>
                <span className="text-sm text-muted-foreground">{answered} of 80 answered</span>
              </div>

              {complete && (
                <div className={`rounded-md px-3 py-2 ${consistent ? "bg-nav-salmon/10" : "bg-nav-teal/10"}`}>
                  <p className={`text-sm font-semibold ${consistent ? "text-nav-salmon" : "text-nav-teal"}`}>
                    {stronglyConsistent
                      ? "≥ 90 — strongly consistent with autism"
                      : consistent
                        ? "≥ 65 — consistent with autism"
                        : "Below the ≥ 65 screening threshold"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Subscale scores (Social Relatedness, Language, Sensory-Motor, Circumscribed
                    Interests) require the original publication's item-to-subscale scoring key and
                    are not computed here — only the total is shown.
                  </p>
                </div>
              )}

              {!complete && (
                <p className="text-xs text-muted-foreground">
                  Complete all 80 items for a full interpretation.
                </p>
              )}

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>0</span>
                  <span className="text-nav-salmon">65 / 90</span>
                  <span>240</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-nav-salmon rounded-full transition-all duration-300"
                    style={{ width: `${(score / 240) * 100}%` }}
                  />
                  <div className="absolute top-0 h-full w-px bg-nav-salmon/70" style={{ left: `${(65 / 240) * 100}%` }} />
                  <div className="absolute top-0 h-full w-px bg-nav-salmon/70" style={{ left: `${(90 / 240) * 100}%` }} />
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Clinical note: </span>
            The RAADS-R asks about experiences both currently and before age 16, so it can capture
            traits that were masked or compensated for later in life — this is often useful for
            late-identified and camouflaging presentations.
          </div>

          <p className="text-xs text-muted-foreground italic border-t border-border pt-4 leading-relaxed">
            The RAADS-R is a screening tool, not a diagnostic instrument. Scores do not constitute
            a diagnosis of autism or any other condition. © Riva Ariella Ritvo, Ph.D. and Edward
            Ritvo, M.D., 2007. Ritvo, R. A., et al. (2011). The Ritvo Autism Asperger Diagnostic
            Scale-Revised (RAADS-R): A scale to assist the diagnosis of Autism Spectrum Disorder
            in adults.{" "}
            <em>Journal of Autism and Developmental Disorders, 41</em>(8), 1076–1089.
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
