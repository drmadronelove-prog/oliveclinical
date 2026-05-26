"use client"

import { useState, useEffect } from "react"

const SECTIONS = [
  {
    id: "physical_illness",
    label: "PL: Treat physical and mental illness",
    question: "Are you taking care of any physical or mental health issues? Taking medication as prescribed? Seeing your doctor or therapist when needed?",
    placeholder: "Note any health issues, medications, appointments...",
  },
  {
    id: "eating",
    label: "E: Balanced eating",
    question: "Are you eating regularly and in a balanced way? Not skipping meals, not restricting, not eating past the point of fullness?",
    placeholder: "What did you eat today? Any meals skipped?",
  },
  {
    id: "substances",
    label: "A: Avoid mood-altering substances",
    question: "Are you staying away from non-prescribed drugs and alcohol? If you used any, what did you notice about how it affected your mood?",
    placeholder: "Any substance use? How did it affect your mood?",
  },
  {
    id: "sleep",
    label: "S: Balanced sleep",
    question: "Are you getting enough sleep? Not too much, not too little? Do you have a consistent sleep routine?",
    placeholder: "Hours slept, quality, bedtime routine...",
  },
  {
    id: "exercise",
    label: "E: Exercise",
    question: "Did you move your body today? Any physical activity, even a short walk counts.",
    placeholder: "What movement did you do? How long?",
  },
]

const ABC = [
  {
    id: "accumulate",
    label: "A: Accumulate positive emotions",
    question: "What pleasant or meaningful activity did you do or could you do today? (something small counts)",
    placeholder: "A walk, a good meal, music, time with someone...",
  },
  {
    id: "build_mastery",
    label: "B: Build mastery",
    question: "What is one thing you did today that gave you a sense of competence or accomplishment?",
    placeholder: "Finished a task, learned something, practiced a skill...",
  },
  {
    id: "cope_ahead",
    label: "C: Cope ahead",
    question: "Is there a difficult situation coming up? What is your plan for handling it skillfully?",
    placeholder: "The situation, your plan, what skills you will use...",
  },
]

const COLORS = {
  please: { bg: "#E6F1FB", border: "#85B7EB", text: "#0C447C", sub: "#185FA5" },
  abc:    { bg: "#E1F5EE", border: "#5DCAA5", text: "#085041", sub: "#0F6E56" },
}

function storSave<T>(k: string, v: T) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
function storLoad<T>(k: string, fb: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb } catch { return fb }
}

function FieldCard({ item, value, onChange, colorKey }: {
  item: { id: string; label: string; question: string; placeholder: string }
  value: string
  onChange: (v: string) => void
  colorKey: "please" | "abc"
}) {
  const c = COLORS[colorKey]
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: "10px 14px" }}>
      <div style={{ fontWeight: 500, fontSize: 13, color: c.text, marginBottom: 2 }}>{item.label}</div>
      <div style={{ fontSize: 11, color: c.sub, marginBottom: 6, lineHeight: 1.4 }}>{item.question}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={item.placeholder}
        style={{
          width: "100%", minHeight: 56, padding: 8,
          border: `1px solid ${c.border}`, borderRadius: 6,
          fontSize: 13, lineHeight: 1.5, resize: "vertical",
          fontFamily: "inherit", boxSizing: "border-box", outline: "none", background: "#fff",
        }}
      />
    </div>
  )
}

function PrintRow({ label, question, answer, colorKey }: { label: string; question: string; answer: string; colorKey: "please" | "abc" }) {
  const c = COLORS[colorKey]
  return (
    <div style={{ marginBottom: 10, breakInside: "avoid" }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.07em", color: c.text, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 9, color: "#666", fontStyle: "italic", marginBottom: 4 }}>{question}</div>
      <div style={{
        fontSize: 11, color: "#1a1a1a", borderBottom: "1px solid #ddd", paddingBottom: 4,
        minHeight: 18, whiteSpace: "pre-wrap" as const, wordBreak: "break-word" as const,
      }}>{answer || " "}</div>
    </div>
  )
}

export function DBTEmotionRegulation() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedDate, setSelectedDate] = useState("")

  useEffect(() => {
    setAnswers(storLoad("dbt-er-answers", {}))
    setSelectedDate(storLoad("dbt-er-date", ""))
  }, [])

  const setAnswer = (id: string, val: string) => {
    const next = { ...answers, [id]: val }
    setAnswers(next)
    storSave("dbt-er-answers", next)
  }

  const handleDateChange = (val: string) => {
    setSelectedDate(val)
    storSave("dbt-er-date", val)
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const d = new Date(dateStr + "T12:00:00")
    return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  const hasAnyAnswers = Object.values(answers).some(a => a && a.trim())

  return (
    <div style={{ padding: "12px 0", maxWidth: 540, margin: "0 auto" }}>

      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .dbt-er-print-root, .dbt-er-print-root * { visibility: visible !important; }
          .dbt-er-print-root {
            position: fixed !important;
            top: 0; left: 0; width: 100%;
            padding: 20px 28px; box-sizing: border-box; background: white;
          }
          .dbt-er-screen { display: none !important; }
        }
        @media screen { .dbt-er-print-root { display: none; } }
      `}</style>

      <div className="dbt-er-screen">
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0, color: "var(--ink)" }}>
              ABC PLEASE worksheet
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
          <p style={{ fontSize: 12, color: "#666", margin: "4px 0 0", lineHeight: 1.4 }}>
            Reducing emotional vulnerability by taking care of the basics.
          </p>
        </div>

        {/* Date picker */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#666" }}>Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            style={{
              padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd",
              fontSize: 13, fontFamily: "inherit", background: "#fff", color: "#333", cursor: "pointer",
            }}
          />
          {selectedDate && (
            <span style={{ fontSize: 12, color: "#888" }}>{formatDate(selectedDate)}</span>
          )}
        </div>

        <div style={{
          background: "#F1EFE8", border: "1px solid #D3D1C7", borderRadius: 8,
          padding: "8px 12px", fontSize: 11, color: "#444441", lineHeight: 1.5,
          marginBottom: 16, textAlign: "center",
        }}>
          When your body is well, your emotions are more manageable. These skills reduce vulnerability to intense emotions by building a foundation of physical self-care and positive experiences.
        </div>

        {/* PLEASE section */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: COLORS.please.text, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: COLORS.please.bg, border: `1px solid ${COLORS.please.border}`, borderRadius: 6, padding: "2px 8px", fontSize: 12 }}>
              PLEASE
            </span>
            <span style={{ fontSize: 12, fontWeight: 400, color: "#888" }}>Physical self-care</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SECTIONS.map(item => (
              <FieldCard key={item.id} item={item} value={answers[item.id] || ""} onChange={val => setAnswer(item.id, val)} colorKey="please" />
            ))}
          </div>
        </div>

        {/* ABC section */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: COLORS.abc.text, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: COLORS.abc.bg, border: `1px solid ${COLORS.abc.border}`, borderRadius: 6, padding: "2px 8px", fontSize: 12 }}>
              ABC
            </span>
            <span style={{ fontSize: 12, fontWeight: 400, color: "#888" }}>Building emotional resilience</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ABC.map(item => (
              <FieldCard key={item.id} item={item} value={answers[item.id] || ""} onChange={val => setAnswer(item.id, val)} colorKey="abc" />
            ))}
          </div>
        </div>

        {hasAnyAnswers && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <button
              onClick={() => { setAnswers({}); storSave("dbt-er-answers", {}) }}
              style={{ fontSize: 12, color: "#999", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Print layout ── */}
      <div className="dbt-er-print-root" aria-hidden="true">
        <div style={{ marginBottom: 14, borderBottom: "3px solid #2d3748", paddingBottom: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em", color: "#1a202c", textTransform: "uppercase" }}>
            DBT Emotion Regulation: ABC PLEASE Worksheet
          </div>
          <div style={{ fontSize: 9, color: "#718096", marginTop: 2, letterSpacing: "0.06em" }}>
            {selectedDate ? formatDate(selectedDate) : "No date selected"} · Olive Clinical · oliveclinical.com · Printed {new Date().toLocaleDateString()}
          </div>
          <div style={{ marginTop: 6, fontSize: 9, background: "#F1EFE8", border: "1px solid #D3D1C7", borderRadius: 4, padding: "4px 10px", display: "inline-block", color: "#444441" }}>
            ABC PLEASE helps reduce emotional vulnerability by taking care of the basics. When your body is well, your emotions are more manageable.
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: COLORS.please.text, marginBottom: 8, borderBottom: `2px solid ${COLORS.please.border}`, paddingBottom: 3 }}>
          PLEASE — Physical self-care
        </div>
        {SECTIONS.map(item => (
          <PrintRow key={item.id} label={item.label} question={item.question} answer={answers[item.id] || ""} colorKey="please" />
        ))}

        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: COLORS.abc.text, marginBottom: 8, marginTop: 14, borderBottom: `2px solid ${COLORS.abc.border}`, paddingBottom: 3 }}>
          ABC — Building emotional resilience
        </div>
        {ABC.map(item => (
          <PrintRow key={item.id} label={item.label} question={item.question} answer={answers[item.id] || ""} colorKey="abc" />
        ))}
      </div>
    </div>
  )
}
