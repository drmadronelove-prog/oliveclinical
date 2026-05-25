"use client"

import { useState, useEffect } from "react"

type Matrix = {
  id: string
  focus: string
  whoMatters: string
  towardMoves: string
  awayInner: string
  awayOuter: string
  noticing: string
}

function uid() { return Math.random().toString(36).slice(2) }
function storSave<T>(k: string, v: T) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
function storLoad<T>(k: string, fb: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb } catch { return fb }
}

const inputCls = "w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 transition-colors resize-y"
const labelCls = "block text-xs text-muted-foreground mb-1 uppercase tracking-wider"

// ── Print helpers ──────────────────────────────────────────────────────────────

function PrintQuadrant({
  label, sublabel, value, accent, corner,
}: { label: string; sublabel: string; value: string; accent: string; corner: string }) {
  return (
    <div style={{
      border: `1.5px solid ${accent}`,
      borderRadius: 6,
      padding: "10px 12px",
      minHeight: 130,
      display: "flex",
      flexDirection: "column",
      position: "relative",
    }}>
      <div style={{
        position: "absolute", top: 6, right: 8,
        fontSize: 8, color: accent, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7,
      }}>{corner}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 9, color: "#888", fontStyle: "italic", marginBottom: 8 }}>{sublabel}</div>
      <div style={{ fontSize: 11, color: "#1a202c", whiteSpace: "pre-wrap", wordBreak: "break-word", flex: 1 }}>{value || " "}</div>
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ActMatrix() {
  const [matrices, setMatrices] = useState<Matrix[]>([])

  useEffect(() => {
    setMatrices(storLoad("act-matrix", []))
  }, [])

  function add() {
    const next = [...matrices, {
      id: uid(), focus: "", whoMatters: "", towardMoves: "", awayInner: "", awayOuter: "", noticing: "",
    }]
    setMatrices(next); storSave("act-matrix", next)
  }
  function del(id: string) {
    const next = matrices.filter(m => m.id !== id)
    setMatrices(next); storSave("act-matrix", next)
  }
  function upd(id: string, field: keyof Matrix, val: string) {
    const next = matrices.map(m => m.id === id ? { ...m, [field]: val } : m)
    setMatrices(next); storSave("act-matrix", next)
  }

  return (
    <div className="mb-16">

      {/* ── Print styles ── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .act-print-root, .act-print-root * { visibility: visible !important; }
          .act-print-root {
            position: fixed !important;
            top: 0; left: 0;
            width: 100%;
            padding: 20px 28px;
            box-sizing: border-box;
            background: white;
          }
          .act-screen { display: none !important; }
        }
        @media screen {
          .act-print-root { display: none; }
        }
      `}</style>

      {/* ── Screen UI ── */}
      <div className="act-screen">
        <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
          <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            ACT MATRIX
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
        <p className="text-sm text-muted-foreground mb-2 max-w-2xl leading-relaxed">
          From Kevin Polk&apos;s ACT Matrix. Map what pulls you <em>away</em> from what matters — and what moves you <em>toward</em> it.
          The center is the noticing self: the part of you that can observe both. All data saved locally to your device.
        </p>

        {/* Axis legend */}
        <div className="flex flex-wrap gap-4 mb-8 text-xs text-muted-foreground">
          <span><span className="font-bold text-foreground">Vertical axis:</span> Toward (top) ↕ Away (bottom)</span>
          <span><span className="font-bold text-foreground">Horizontal axis:</span> Inner experience (left) ↔ Outer behavior (right)</span>
        </div>

        {matrices.map((m, idx) => (
          <div key={m.id} className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className={labelCls}>Situation / Value Focus</label>
                <input
                  type="text"
                  value={m.focus}
                  placeholder={`Matrix ${idx + 1} — e.g. "At work", "In close relationships"`}
                  onChange={e => upd(m.id, "focus", e.target.value)}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 transition-colors"
                />
              </div>
              <button onClick={() => del(m.id)} className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-4">
                remove
              </button>
            </div>

            {/* Axis label — top */}
            <div className="text-center text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">
              ↑ Toward what matters
            </div>

            {/* 2×2 grid */}
            <div className="grid grid-cols-2 gap-0 border border-border rounded-lg overflow-hidden mb-1">
              {/* Top-left: Who/What Matters */}
              <div className="border-r border-b border-border p-4 bg-background">
                <label className={labelCls + " text-plum"}>Who / What Matters</label>
                <p className="text-[10px] text-muted-foreground mb-2 italic">Values, people, things that matter to you — inner experience</p>
                <textarea
                  rows={5}
                  value={m.whoMatters}
                  placeholder={"e.g. Being present with my kids\nCreative work that challenges me\nMy health and wellbeing"}
                  onChange={e => upd(m.id, "whoMatters", e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Top-right: Toward Moves */}
              <div className="border-b border-border p-4 bg-background">
                <label className={labelCls + " text-plum"}>Toward Moves</label>
                <p className="text-[10px] text-muted-foreground mb-2 italic">Actions others could observe that move toward what matters</p>
                <textarea
                  rows={5}
                  value={m.towardMoves}
                  placeholder={"e.g. Putting phone away during dinner\nStarting the project even imperfectly\nGoing for a walk"}
                  onChange={e => upd(m.id, "towardMoves", e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Bottom-left: Unwanted Inner Experience */}
              <div className="border-r border-border p-4 bg-background">
                <label className={labelCls}>Unwanted Inner Experience</label>
                <p className="text-[10px] text-muted-foreground mb-2 italic">Thoughts, feelings, sensations, urges that show up and pull you away</p>
                <textarea
                  rows={5}
                  value={m.awayInner}
                  placeholder={"e.g. \"I'll fail anyway\"\nAnxiety in my chest\nUrge to check my phone\nShame"}
                  onChange={e => upd(m.id, "awayInner", e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Bottom-right: Away Moves */}
              <div className="p-4 bg-background">
                <label className={labelCls}>Away Moves</label>
                <p className="text-[10px] text-muted-foreground mb-2 italic">Behaviors others could observe that move away from unwanted experience</p>
                <textarea
                  rows={5}
                  value={m.awayOuter}
                  placeholder={"e.g. Scrolling social media\nCancelling plans\nOverworking\nProcrastinating"}
                  onChange={e => upd(m.id, "awayOuter", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Axis labels — horizontal */}
            <div className="grid grid-cols-2 text-center text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">
              <div>Inner experience ←</div>
              <div>→ Outer behavior</div>
            </div>

            {/* Axis label — bottom */}
            <div className="text-center text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-4">
              ↓ Away from unwanted experience
            </div>

            {/* Noticing self */}
            <div className="border border-dashed border-border rounded-lg p-4">
              <label className={labelCls}>The Noticing Self (Center)</label>
              <p className="text-[10px] text-muted-foreground mb-2 italic">
                The observer — the part of you that notices both inner experience and behavior without judgment.
                What do you notice right now?
              </p>
              <textarea
                rows={3}
                value={m.noticing}
                placeholder={"e.g. I notice I'm feeling anxious and that I want to avoid this. I notice that avoidance hasn't worked long-term..."}
                onChange={e => upd(m.id, "noticing", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        ))}

        <button
          onClick={add}
          className="text-sm font-bold tracking-wider text-muted-foreground hover:text-foreground border border-border rounded px-4 py-2 transition-colors"
        >
          + Add matrix
        </button>
      </div>

      {/* ── Print-only layout ── */}
      <div className="act-print-root" aria-hidden="true">
        {/* Header */}
        <div style={{ marginBottom: 16, borderBottom: "3px solid #2d3748", paddingBottom: 10 }}>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em", color: "#1a202c", textTransform: "uppercase" }}>
            ACT Matrix Worksheet
          </div>
          <div style={{ fontSize: 9, color: "#718096", marginTop: 2, letterSpacing: "0.06em" }}>
            Kevin Polk&apos;s ACT Matrix · Acceptance and Commitment Therapy · Olive Clinical · oliveclinical.com · Printed {new Date().toLocaleDateString()}
          </div>
          <div style={{ marginTop: 8, fontSize: 9, color: "#4a5568", display: "flex", gap: 24 }}>
            <span><strong>Vertical:</strong> Toward (top) ↕ Away (bottom)</span>
            <span><strong>Horizontal:</strong> Inner experience (left) ↔ Outer behavior (right)</span>
          </div>
        </div>

        {matrices.length === 0 && (
          <div style={{ fontSize: 11, color: "#aaa", fontStyle: "italic" }}>No matrices added.</div>
        )}

        {matrices.map((m, idx) => (
          <div key={m.id} style={{ marginBottom: 24, breakInside: "avoid" }}>
            {/* Focus label */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginBottom: 2 }}>
                Situation / Value Focus
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#2d3748", borderBottom: "1.5px solid #2d3748", paddingBottom: 3 }}>
                {m.focus || `Matrix ${idx + 1}`}
              </div>
            </div>

            {/* Toward axis label */}
            <div style={{ textAlign: "center", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6b46c1", marginBottom: 4 }}>
              ↑ Toward what matters
            </div>

            {/* 2×2 grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 4 }}>
              <PrintQuadrant
                label="Who / What Matters"
                sublabel="Values, people — inner experience"
                value={m.whoMatters}
                accent="#6b46c1"
                corner="Inner · Toward"
              />
              <PrintQuadrant
                label="Toward Moves"
                sublabel="Observable actions toward what matters"
                value={m.towardMoves}
                accent="#6b46c1"
                corner="Outer · Toward"
              />
              <PrintQuadrant
                label="Unwanted Inner Experience"
                sublabel="Thoughts, feelings, sensations, urges"
                value={m.awayInner}
                accent="#c05621"
                corner="Inner · Away"
              />
              <PrintQuadrant
                label="Away Moves"
                sublabel="Observable behaviors to escape inner experience"
                value={m.awayOuter}
                accent="#c05621"
                corner="Outer · Away"
              />
            </div>

            {/* Horizontal axis labels */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", textAlign: "center", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#718096", marginBottom: 2 }}>
              <div>← Inner experience</div>
              <div>Outer behavior →</div>
            </div>

            {/* Away axis label */}
            <div style={{ textAlign: "center", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#c05621", marginBottom: 8 }}>
              ↓ Away from unwanted experience
            </div>

            {/* Noticing self */}
            <div style={{ border: "1.5px dashed #a0aec0", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#4a5568", marginBottom: 2 }}>
                The Noticing Self (Center)
              </div>
              <div style={{ fontSize: 9, color: "#888", fontStyle: "italic", marginBottom: 6 }}>
                The observer — the part that notices both inner experience and outer behavior without judgment.
              </div>
              <div style={{ fontSize: 11, color: "#1a202c", whiteSpace: "pre-wrap", wordBreak: "break-word", minHeight: 36 }}>
                {m.noticing || " "}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
