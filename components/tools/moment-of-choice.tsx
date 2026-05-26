"use client"

import { useState, useEffect, useRef } from "react"

type NodeId = "trigger" | "sense_data" | "senses_trusted" | "proportionate_response" | "imagination" | "sense_dismissed" | "obsession" | "hypervigilance" | "compulsion"

const NODES: Record<NodeId, { id: NodeId; label: string; sublabel?: string; question: string; side: string; color: "green" | "red" | "gray" }> = {
  trigger: {
    id: "trigger", label: "Trigger",
    question: "What is triggering you, and what feared version of yourself does it connect to?",
    side: "center", color: "gray",
  },
  sense_data: {
    id: "sense_data", label: "Sense data", sublabel: "What is actually here right now?",
    question: "What are you actually noticing in this moment through your senses?",
    side: "left", color: "green",
  },
  senses_trusted: {
    id: "senses_trusted", label: "Senses trusted", sublabel: "Evidence from this moment guides action",
    question: "What do your senses tell you is actually true in this situation?",
    side: "left", color: "green",
  },
  proportionate_response: {
    id: "proportionate_response", label: "Proportionate response", sublabel: "Action fits the actual situation",
    question: "Based on your sense data from the here and now, what is a reasonable response?",
    side: "left", color: "green",
  },
  imagination: {
    id: "imagination", label: "Imagination takes over", sublabel: "What could be happening?",
    question: 'What is the "what if" story your mind is creating?',
    side: "right", color: "red",
  },
  sense_dismissed: {
    id: "sense_dismissed", label: "Sense data dismissed", sublabel: "Own perception treated as unreliable",
    question: "What sense data are you pushing aside or not trusting?",
    side: "right", color: "red",
  },
  obsession: {
    id: "obsession", label: "Obsession", sublabel: "Feared self feels like real evidence",
    question: "What does the what-if story say about who you might be?",
    side: "right", color: "red",
  },
  hypervigilance: {
    id: "hypervigilance", label: "Hypervigilance", sublabel: "Scanning for proof of feared self",
    question: "What are you scanning for, and what would finding it mean?",
    side: "right", color: "red",
  },
  compulsion: {
    id: "compulsion", label: "Compulsion", sublabel: "Responds to the constructed story",
    question: "What are you doing to try to resolve the story, and is it working?",
    side: "right", color: "red",
  },
}

const ORDER_LEFT: NodeId[] = ["sense_data", "senses_trusted", "proportionate_response"]
const ORDER_RIGHT: NodeId[] = ["imagination", "sense_dismissed", "obsession", "hypervigilance", "compulsion"]

const COLORS = {
  green: { bg: "#EAF3DE", border: "#3B6D11", text: "#27500A", sub: "#3B6D11" },
  red:   { bg: "#FCEBEB", border: "#A32D2D", text: "#791F1F", sub: "#A32D2D" },
  gray:  { bg: "#F1EFE8", border: "#5F5E5A", text: "#2C2C2A", sub: "#5F5E5A" },
}

function storSave<T>(k: string, v: T) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
function storLoad<T>(k: string, fb: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb } catch { return fb }
}

// ── Clickable info label with popover tooltip ─────────────────────────────────
function InfoLabel({ label, tooltip, textColor, bgColor }: { label: string; tooltip: string; textColor: string; bgColor: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [open])

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          fontSize: 12, fontWeight: 500, color: textColor,
          background: bgColor, borderRadius: 6, padding: "4px 10px",
          border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
        }}
      >
        {label}
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.7 }}>
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <text x="8" y="12" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="700">i</text>
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
          background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px",
          fontSize: 12, color: "#444", lineHeight: 1.5, zIndex: 20,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)", width: 230, textAlign: "left",
        }}>
          {tooltip}
          <div style={{
            position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)",
            width: 8, height: 8, background: "#fff", border: "1px solid #ddd",
            borderBottom: "none", borderRight: "none", rotate: "45deg",
          }} />
        </div>
      )}
    </div>
  )
}

function NodePill({ node, onClick, hasAnswer }: { node: typeof NODES[NodeId]; onClick: (id: NodeId) => void; hasAnswer: boolean }) {
  const c = COLORS[node.color]
  return (
    <button
      onClick={() => onClick(node.id)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        padding: "10px 16px", background: c.bg, border: `1px solid ${c.border}`,
        borderRadius: 10, cursor: "pointer", width: "100%", textAlign: "center",
        position: "relative", transition: "box-shadow 0.15s",
        boxShadow: hasAnswer ? `0 0 0 2px ${c.border}` : "none",
      }}
    >
      <span style={{ fontWeight: 500, fontSize: 14, color: c.text, lineHeight: 1.3 }}>{node.label}</span>
      {node.sublabel && (
        <span style={{ fontSize: 11, color: c.sub, lineHeight: 1.3 }}>{node.sublabel}</span>
      )}
      {hasAnswer && (
        <span style={{
          position: "absolute", top: -6, right: -6, width: 16, height: 16,
          borderRadius: "50%", background: c.border, display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M2 5.5L4 7.5L8 3" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </button>
  )
}

function Arrow() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2px 0" }}>
      <svg width="16" height="20" viewBox="0 0 16 20">
        <path d="M8 2L8 16" stroke="#888" strokeWidth="1.5" fill="none" />
        <path d="M4 13L8 17L12 13" stroke="#888" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function SplitArrows() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "0 25%", margin: "2px 0" }}>
      <svg width="40" height="28" viewBox="0 0 40 28">
        <path d="M30 2 L10 22" stroke="#888" strokeWidth="1.5" fill="none" />
        <path d="M6 17 L10 23 L16 19" stroke="#888" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg width="40" height="28" viewBox="0 0 40 28">
        <path d="M10 2 L30 22" stroke="#888" strokeWidth="1.5" fill="none" />
        <path d="M24 19 L30 23 L34 17" stroke="#888" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function Modal({ node, answer, onChange, onClose }: {
  node: typeof NODES[NodeId]; answer: string;
  onChange: (v: string) => void; onClose: () => void;
}) {
  const c = COLORS[node.color]
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: "#fff", borderRadius: 14, padding: 24, maxWidth: 440, width: "100%", border: `2px solid ${c.border}` }}>
        <div style={{ fontWeight: 500, fontSize: 16, color: c.text, marginBottom: 4 }}>{node.label}</div>
        <div style={{ fontSize: 14, color: "#444", marginBottom: 14, lineHeight: 1.5 }}>{node.question}</div>
        <textarea
          autoFocus
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your response here..."
          style={{
            width: "100%", minHeight: 120, padding: 12, border: `1px solid ${c.border}`,
            borderRadius: 8, fontSize: 14, lineHeight: 1.5, resize: "vertical",
            fontFamily: "inherit", boxSizing: "border-box", outline: "none",
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <button onClick={onClose} style={{
            padding: "8px 18px", borderRadius: 8, border: "1px solid #ccc",
            background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500,
          }}>Done</button>
        </div>
      </div>
    </div>
  )
}

// ── Answer summary section shown below diagram when a side is complete ─────────
function AnswerSummary({ answers }: { answers: Record<string, string> }) {
  const leftDone = ORDER_LEFT.every(id => answers[id]?.trim())
  const rightDone = ORDER_RIGHT.every(id => answers[id]?.trim())
  if (!leftDone && !rightDone) return null

  return (
    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      {leftDone && (
        <div style={{ background: "#EAF3DE", border: "1px solid #3B6D11", borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#3B6D11", marginBottom: 10 }}>
            Sense-based reasoning — your answers
          </div>
          {ORDER_LEFT.map(id => (
            <div key={id} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#27500A", marginBottom: 2 }}>{NODES[id].label}</div>
              <div style={{ fontSize: 13, color: "#1a1a1a", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{answers[id]}</div>
            </div>
          ))}
        </div>
      )}
      {rightDone && (
        <div style={{ background: "#E6F1FB", border: "2px solid #185FA5", borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A32D2D", marginBottom: 10 }}>
            What-if reasoning (OCD bubble) — your answers
          </div>
          {ORDER_RIGHT.map(id => (
            <div key={id} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#791F1F", marginBottom: 2 }}>{NODES[id].label}</div>
              <div style={{ fontSize: 13, color: "#1a1a1a", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{answers[id]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Print row helper ──────────────────────────────────────────────────────────
function PrintRow({ label, question, answer, color }: { label: string; question: string; answer: string; color: "green" | "red" | "gray" }) {
  const c = COLORS[color]
  return (
    <div style={{ marginBottom: 10, breakInside: "avoid" }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: c.border, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 9, color: "#666", fontStyle: "italic", marginBottom: 4 }}>{question}</div>
      <div style={{
        fontSize: 11, color: "#1a1a1a", borderBottom: "1px solid #ddd", paddingBottom: 4,
        minHeight: 18, whiteSpace: "pre-wrap", wordBreak: "break-word",
      }}>{answer || " "}</div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function MomentOfChoice() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [activeNode, setActiveNode] = useState<NodeId | null>(null)

  useEffect(() => {
    setAnswers(storLoad("moc-answers", {}))
  }, [])

  const setAnswer = (id: string, val: string) => {
    const next = { ...answers, [id]: val }
    setAnswers(next)
    storSave("moc-answers", next)
  }

  const hasAnyAnswers = Object.values(answers).some(a => a && a.trim())

  return (
    <div style={{ padding: "12px 0", maxWidth: 640, margin: "0 auto" }}>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .moc-print-root, .moc-print-root * { visibility: visible !important; }
          .moc-print-root {
            position: fixed !important;
            top: 0; left: 0; width: 100%;
            padding: 20px 28px; box-sizing: border-box; background: white;
          }
          .moc-screen { display: none !important; }
        }
        @media screen { .moc-print-root { display: none; } }
      `}</style>

      {/* ── Screen UI ── */}
      <div className="moc-screen">
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0, color: "var(--ink)" }}>
              The OCD Moment of Choice
            </h2>
            {hasAnyAnswers && (
              <button
                onClick={() => window.print()}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 8, border: "1px solid #ccc",
                  background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#555",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Print / Save as PDF
              </button>
            )}
          </div>
          <p style={{ fontSize: 12, color: "var(--ink-muted, #666)", margin: "6px 0 0", lineHeight: 1.4 }}>
            Tap each node to answer. Based on I-CBT inference-based reasoning.
          </p>
        </div>

        <div style={{ maxWidth: 300, margin: "0 auto" }}>
          <NodePill node={NODES.trigger} onClick={setActiveNode} hasAnswer={!!answers.trigger?.trim()} />
        </div>

        <SplitArrows />

        <div style={{ display: "flex", gap: 16 }}>
          {/* Left: sense-based reasoning */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <InfoLabel
              label="Sense-based reasoning"
              tooltip="Sense data = what you are hearing, seeing, touching, tasting, and smelling right now"
              textColor="#27500A"
              bgColor="#EAF3DE"
            />
            <div style={{ height: 6 }} />
            {ORDER_LEFT.map((id, i) => (
              <div key={id} style={{ width: "100%" }}>
                <NodePill node={NODES[id]} onClick={setActiveNode} hasAnswer={!!answers[id]?.trim()} />
                {i < ORDER_LEFT.length - 1 && <Arrow />}
              </div>
            ))}
          </div>

          <div style={{ width: 1, background: "rgba(0,0,0,0.10)", alignSelf: "stretch" }} />

          {/* Right: what-if reasoning inside OCD bubble */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <InfoLabel
              label="What-if reasoning"
              tooltip="What-if reasoning = reasoning based on facts, rules, hearsay, personal experiences, possibility and imagination"
              textColor="#791F1F"
              bgColor="#FCEBEB"
            />
            <div style={{ height: 6 }} />

            <div style={{
              border: "2px solid #185FA5", borderRadius: 20,
              padding: "24px 30px 20px 20px", position: "relative",
              width: "100%", boxSizing: "border-box", background: "#E6F1FB",
            }}>
              <div style={{
                position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                background: "#B5D4F4", border: "1px solid #85B7EB", borderRadius: 4,
                padding: "1px 8px", fontSize: 11, fontWeight: 500, color: "#0C447C", whiteSpace: "nowrap",
              }}>OCD bubble</div>

              <div style={{ display: "flex" }}>
                {/* Loop arrow */}
                <div style={{ width: 22, minWidth: 22, marginRight: 8, display: "flex", alignItems: "stretch", position: "relative" }}>
                  <svg width="22" height="100%" viewBox="0 0 22 100" preserveAspectRatio="none"
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                    <path d="M 20 96 L 6 96 L 6 4 L 20 4" stroke="#A32D2D" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                    <path d="M 15 0 L 21 4 L 15 8" stroke="#A32D2D" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  {ORDER_RIGHT.map((id, i) => (
                    <div key={id}>
                      <NodePill node={NODES[id]} onClick={setActiveNode} hasAnswer={!!answers[id]?.trim()} />
                      {i < ORDER_RIGHT.length - 1 && <Arrow />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Answers below diagram ── */}
        <AnswerSummary answers={answers} />

        {hasAnyAnswers && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              onClick={() => { setAnswers({}); storSave("moc-answers", {}) }}
              style={{ fontSize: 12, color: "#999", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Print layout ── */}
      <div className="moc-print-root" aria-hidden="true">
        <div style={{ marginBottom: 14, borderBottom: "3px solid #2d3748", paddingBottom: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em", color: "#1a202c", textTransform: "uppercase" }}>
            OCD Moment of Choice
          </div>
          <div style={{ fontSize: 9, color: "#718096", marginTop: 2, letterSpacing: "0.06em" }}>
            Inference-Based CBT · Olive Clinical · oliveclinical.com · Printed {new Date().toLocaleDateString()}
          </div>
          <div style={{ marginTop: 6, fontSize: 9, background: "#EAF3DE", border: "1px solid #97C459", borderRadius: 4, padding: "4px 10px", display: "inline-block", color: "#27500A" }}>
            <strong>Sense data</strong> = what you are hearing, seeing, touching, tasting, and smelling right now
          </div>
        </div>

        <PrintRow label="Trigger" question={NODES.trigger.question} answer={answers.trigger || ""} color="gray" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 10 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#3B6D11", marginBottom: 8, borderBottom: "2px solid #3B6D11", paddingBottom: 3 }}>
              Sense-based reasoning
            </div>
            {ORDER_LEFT.map(id => (
              <PrintRow key={id} label={NODES[id].label} question={NODES[id].question} answer={answers[id] || ""} color="green" />
            ))}
          </div>
          <div style={{ border: "2px solid #185FA5", borderRadius: 8, padding: "10px 12px", background: "#E6F1FB" }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#A32D2D", marginBottom: 8, borderBottom: "2px solid #A32D2D", paddingBottom: 3 }}>
              What-if reasoning · OCD bubble
            </div>
            {ORDER_RIGHT.map(id => (
              <PrintRow key={id} label={NODES[id].label} question={NODES[id].question} answer={answers[id] || ""} color="red" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {activeNode && (
        <Modal
          node={NODES[activeNode]}
          answer={answers[activeNode] || ""}
          onChange={(val) => setAnswer(activeNode, val)}
          onClose={() => setActiveNode(null)}
        />
      )}
    </div>
  )
}
