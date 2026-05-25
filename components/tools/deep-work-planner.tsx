"use client"

import { useState, useEffect } from "react"
import type { ReactNode } from "react"

type LTG = { id: string; goal: string; steps: string; deadline: string; process: string; measure: string; motivation: string }
type WK  = { id: string; ltg: string; week: string; goal: string; penalty: string; reward: string; score: string; giw: string }
type VAL = { id: string; value: string; painful: string; avoidance: string; a1: string; a2: string; a3: string }

const WHAT_GOT = [
  "— select —", "All-or-nothing thinking", "Perfectionism", "Procrastination",
  "Emotional dysregulation", "Sensory overload", "Demand avoidance", "Time blindness",
  "Overwhelm", "Executive dysfunction", "Forgot", "RSD", "Burnout", "Life happened", "Other",
]

function uid() { return Math.random().toString(36).slice(2) }

function storSave<T>(k: string, v: T) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
function storLoad<T>(k: string, fb: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb } catch { return fb }
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputCls = "w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 transition-colors"

function Field({ label, className = "", children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

// ── Print layout helpers ───────────────────────────────────────────────────────

const pRow = (label: string, value: string) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginBottom: 2 }}>{label}</div>
    <div style={{
      fontSize: 12, color: "#1a1a1a", borderBottom: "1px solid #ddd",
      minHeight: 20, paddingBottom: 4, whiteSpace: "pre-wrap", wordBreak: "break-word",
    }}>{value || " "}</div>
  </div>
)

const pCard = (children: ReactNode, key?: string) => (
  <div key={key} style={{
    border: "1px solid #ccc", borderRadius: 6, padding: "14px 16px",
    marginBottom: 12, breakInside: "avoid",
  }}>{children}</div>
)

// ── Component ─────────────────────────────────────────────────────────────────

export function DeepWorkPlanner() {
  const [tab,  setTab]  = useState<"ltg"|"wk"|"val">("ltg")
  const [ltgs, setLtgs] = useState<LTG[]>([])
  const [wks,  setWks]  = useState<WK[]>([])
  const [vals, setVals] = useState<VAL[]>([])

  useEffect(() => {
    setLtgs(storLoad("nd-ltg", []))
    setWks(storLoad("nd-wk",   []))
    setVals(storLoad("nd-val", []))
  }, [])

  // ── Long-term goals
  function addLTG() {
    const next: LTG[] = [...ltgs, { id: uid(), goal: "", steps: "", deadline: "", process: "", measure: "", motivation: "" }]
    setLtgs(next); storSave("nd-ltg", next)
  }
  function delLTG(id: string) {
    const next = ltgs.filter(l => l.id !== id)
    setLtgs(next); storSave("nd-ltg", next)
  }
  function updLTG(id: string, field: keyof LTG, val: string) {
    const next = ltgs.map(l => l.id === id ? { ...l, [field]: val } : l)
    setLtgs(next); storSave("nd-ltg", next)
  }

  // ── Weekly goals
  function addWK() {
    const next: WK[] = [...wks, { id: uid(), ltg: "", week: "Week 1", goal: "", penalty: "", reward: "", score: "", giw: "" }]
    setWks(next); storSave("nd-wk", next)
  }
  function delWK(id: string) {
    const next = wks.filter(w => w.id !== id)
    setWks(next); storSave("nd-wk", next)
  }
  function updWK(id: string, field: keyof WK, val: string) {
    const next = wks.map(w => w.id === id ? { ...w, [field]: val } : w)
    setWks(next); storSave("nd-wk", next)
  }

  // ── Values
  function addVAL() {
    const next: VAL[] = [...vals, { id: uid(), value: "", painful: "", avoidance: "", a1: "", a2: "", a3: "" }]
    setVals(next); storSave("nd-val", next)
  }
  function delVAL(id: string) {
    const next = vals.filter(v => v.id !== id)
    setVals(next); storSave("nd-val", next)
  }
  function updVAL(id: string, field: keyof VAL, val: string) {
    const next = vals.map(v => v.id === id ? { ...v, [field]: val } : v)
    setVals(next); storSave("nd-val", next)
  }

  const tabCls = (t: string) =>
    `px-4 py-2 text-xs font-bold tracking-wider transition-colors rounded whitespace-nowrap ${
      tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
    }`

  const sectionHead = (title: string, subtitle?: string) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
        color: "#4a5568", borderBottom: "2px solid #4a5568", paddingBottom: 4, marginBottom: subtitle ? 4 : 0,
      }}>{title}</div>
      {subtitle && <div style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>{subtitle}</div>}
    </div>
  )

  return (
    <div className="mb-16">

      {/* ── Print styles ── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .dwp-print-root, .dwp-print-root * { visibility: visible !important; }
          .dwp-print-root {
            position: fixed !important;
            top: 0; left: 0;
            width: 100%;
            padding: 24px 32px;
            box-sizing: border-box;
            background: white;
          }
          .dwp-screen { display: none !important; }
        }
        @media screen {
          .dwp-print-root { display: none; }
        }
      `}</style>

      {/* ── Screen UI ── */}
      <div className="dwp-screen">
        <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
          <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            DEEP WORK PLANNER
          </h2>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-xs font-bold tracking-wider border border-border rounded px-4 py-2 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors whitespace-nowrap mt-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print / Save as PDF
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          Based on Cal Newport&apos;s Deep Work framework + ACT. Focus on <em>process first</em> — the habit or practice,
          not just the outcome. Anchor weekly goals in long-term intentions. All data saved locally to your device.
        </p>

        {/* Tab strip */}
        <div className="flex gap-1 bg-card border border-border rounded p-1 mb-8 w-fit flex-wrap">
          <button className={tabCls("ltg")} onClick={() => setTab("ltg")}>Long-term Goals</button>
          <button className={tabCls("wk")}  onClick={() => setTab("wk")}>Weekly Goals</button>
          <button className={tabCls("val")} onClick={() => setTab("val")}>Values + Activities</button>
        </div>

        {/* ── Long-term goals ── */}
        {tab === "ltg" && (
          <div>
            {ltgs.map(l => (
              <div key={l.id} className="bg-card border border-border rounded-lg p-6 mb-4">
                <div className="flex justify-end mb-3">
                  <button onClick={() => delLTG(l.id)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    remove
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Long-term goal">
                    <input type="text" value={l.goal} placeholder="What are you working toward?"
                      onChange={e => updLTG(l.id, "goal", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Deadline">
                    <input type="text" value={l.deadline} placeholder="e.g. 6/1/26"
                      onChange={e => updLTG(l.id, "deadline", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Key steps / milestones" className="sm:col-span-2">
                    <input type="text" value={l.steps} placeholder="Key milestones or actions"
                      onChange={e => updLTG(l.id, "steps", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Process focus (habit or practice)">
                    <input type="text" value={l.process} placeholder="What will I do regularly?"
                      onChange={e => updLTG(l.id, "process", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="How will I measure this?">
                    <input type="text" value={l.measure} placeholder="Concrete indicators"
                      onChange={e => updLTG(l.id, "measure", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Why does this matter?" className="sm:col-span-2">
                    <input type="text" value={l.motivation} placeholder="Your motivation"
                      onChange={e => updLTG(l.id, "motivation", e.target.value)} className={inputCls} />
                  </Field>
                </div>
              </div>
            ))}
            <button onClick={addLTG} className="text-sm font-bold tracking-wider text-muted-foreground hover:text-foreground border border-border rounded px-4 py-2 transition-colors">
              + Add long-term goal
            </button>
          </div>
        )}

        {/* ── Weekly goals ── */}
        {tab === "wk" && (
          <div>
            {wks.map(w => (
              <div key={w.id} className="bg-card border border-border rounded-lg p-6 mb-4">
                <div className="flex justify-end mb-3">
                  <button onClick={() => delWK(w.id)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    remove
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Linked long-term goal">
                    <select value={w.ltg} onChange={e => updWK(w.id, "ltg", e.target.value)} className={inputCls}>
                      <option value="">— select —</option>
                      {ltgs.map(l => (
                        <option key={l.id} value={l.goal}>{l.goal || "Unnamed goal"}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Week">
                    <input type="text" value={w.week} placeholder="Week 1"
                      onChange={e => updWK(w.id, "week", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Weekly goal" className="sm:col-span-2">
                    <input type="text" value={w.goal} placeholder="Specific goal for this week"
                      onChange={e => updWK(w.id, "goal", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Penalty for not completing">
                    <input type="text" value={w.penalty} placeholder="e.g. no weekend movies"
                      onChange={e => updWK(w.id, "penalty", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Reward for completing">
                    <input type="text" value={w.reward} placeholder="e.g. favorite coffee"
                      onChange={e => updWK(w.id, "reward", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Completion score (1–10)">
                    <input type="text" value={w.score} placeholder="1–10"
                      onChange={e => updWK(w.id, "score", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="What got in the way?">
                    <select value={w.giw} onChange={e => updWK(w.id, "giw", e.target.value)} className={inputCls}>
                      {WHAT_GOT.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            ))}
            <button onClick={addWK} className="text-sm font-bold tracking-wider text-muted-foreground hover:text-foreground border border-border rounded px-4 py-2 transition-colors">
              + Add weekly goal
            </button>
          </div>
        )}

        {/* ── Values + activities ── */}
        {tab === "val" && (
          <div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              From ACT: name what matters, identify what gets in the way, and choose low-demand actions that keep you
              connected to your values even when capacity is depleted.
            </p>
            {vals.map(v => (
              <div key={v.id} className="bg-card border border-border rounded-lg p-6 mb-4">
                <div className="flex justify-end mb-3">
                  <button onClick={() => delVAL(v.id)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    remove
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Value" className="sm:col-span-2">
                    <input type="text" value={v.value} placeholder="e.g. Connection, Creativity, Justice, Rest"
                      onChange={e => updVAL(v.id, "value", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Painful thoughts / feelings in the way">
                    <textarea rows={3} value={v.painful} placeholder={`"I'm not good enough..."`}
                      onChange={e => updVAL(v.id, "painful", e.target.value)} className={`${inputCls} resize-y`} />
                  </Field>
                  <Field label="Avoidance strategies I use">
                    <textarea rows={3} value={v.avoidance} placeholder="Scrolling, isolating, overplanning..."
                      onChange={e => updVAL(v.id, "avoidance", e.target.value)} className={`${inputCls} resize-y`} />
                  </Field>
                  <Field label="Low-energy value-aligned activity 1">
                    <textarea rows={2} value={v.a1} placeholder="Option 1"
                      onChange={e => updVAL(v.id, "a1", e.target.value)} className={`${inputCls} resize-y`} />
                  </Field>
                  <Field label="Value-aligned activity 2">
                    <textarea rows={2} value={v.a2} placeholder="Option 2"
                      onChange={e => updVAL(v.id, "a2", e.target.value)} className={`${inputCls} resize-y`} />
                  </Field>
                  <Field label="Value-aligned activity 3" className="sm:col-span-2">
                    <textarea rows={2} value={v.a3} placeholder="Option 3"
                      onChange={e => updVAL(v.id, "a3", e.target.value)} className={`${inputCls} resize-y`} />
                  </Field>
                </div>
              </div>
            ))}
            <button onClick={addVAL} className="text-sm font-bold tracking-wider text-muted-foreground hover:text-foreground border border-border rounded px-4 py-2 transition-colors">
              + Add value
            </button>
          </div>
        )}
      </div>

      {/* ── Print-only layout (all three sections together) ── */}
      <div className="dwp-print-root" aria-hidden="true">
        {/* Header */}
        <div style={{ marginBottom: 20, borderBottom: "3px solid #2d3748", paddingBottom: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", color: "#1a202c", textTransform: "uppercase" }}>
            Deep Work Planner
          </div>
          <div style={{ fontSize: 10, color: "#718096", marginTop: 3, letterSpacing: "0.06em" }}>
            Cal Newport&apos;s Deep Work + ACT · Olive Clinical · oliveclinical.com · Printed {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Long-term Goals */}
        <div style={{ marginBottom: 20 }}>
          {sectionHead("Long-term Goals", "Focus on process first — the habit or practice, not just the outcome.")}
          {ltgs.length === 0 && (
            <div style={{ fontSize: 11, color: "#aaa", fontStyle: "italic" }}>No long-term goals added.</div>
          )}
          {ltgs.map((l, i) => pCard(
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
              <div style={{ gridColumn: "1 / -1", fontWeight: 700, fontSize: 12, color: "#2d3748", marginBottom: 4 }}>
                Goal {i + 1}
              </div>
              <div style={{ gridColumn: "1 / -1" }}>{pRow("Long-term goal", l.goal)}</div>
              {pRow("Deadline", l.deadline)}
              {pRow("Process focus (habit or practice)", l.process)}
              <div style={{ gridColumn: "1 / -1" }}>{pRow("Key steps / milestones", l.steps)}</div>
              {pRow("How will I measure this?", l.measure)}
              {pRow("Why does this matter?", l.motivation)}
            </div>,
            l.id
          ))}
        </div>

        {/* Weekly Goals */}
        <div style={{ marginBottom: 20 }}>
          {sectionHead("Weekly Goals", "Anchor each weekly goal to a long-term intention.")}
          {wks.length === 0 && (
            <div style={{ fontSize: 11, color: "#aaa", fontStyle: "italic" }}>No weekly goals added.</div>
          )}
          {wks.map((w, i) => pCard(
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
              <div style={{ gridColumn: "1 / -1", fontWeight: 700, fontSize: 12, color: "#2d3748", marginBottom: 4 }}>
                {w.week || `Week ${i + 1}`}
              </div>
              {pRow("Linked long-term goal", w.ltg)}
              {pRow("Week", w.week)}
              <div style={{ gridColumn: "1 / -1" }}>{pRow("Weekly goal", w.goal)}</div>
              {pRow("Penalty for not completing", w.penalty)}
              {pRow("Reward for completing", w.reward)}
              {pRow("Completion score (1–10)", w.score)}
              {pRow("What got in the way?", w.giw === "— select —" ? "" : w.giw)}
            </div>,
            w.id
          ))}
        </div>

        {/* Values + Activities */}
        <div style={{ marginBottom: 12 }}>
          {sectionHead("Values + Activities", "Name what matters, identify what gets in the way, and choose low-demand actions.")}
          {vals.length === 0 && (
            <div style={{ fontSize: 11, color: "#aaa", fontStyle: "italic" }}>No values added.</div>
          )}
          {vals.map(v => pCard(
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
              <div style={{ gridColumn: "1 / -1" }}>{pRow("Value", v.value)}</div>
              {pRow("Painful thoughts / feelings in the way", v.painful)}
              {pRow("Avoidance strategies I use", v.avoidance)}
              {pRow("Low-energy value-aligned activity 1", v.a1)}
              {pRow("Value-aligned activity 2", v.a2)}
              <div style={{ gridColumn: "1 / -1" }}>{pRow("Value-aligned activity 3", v.a3)}</div>
            </div>,
            v.id
          ))}
        </div>
      </div>

    </div>
  )
}
