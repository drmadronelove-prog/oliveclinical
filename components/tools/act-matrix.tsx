"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const VALUES_LIST = [
  "Acceptance", "Achievement", "Adventure", "Authenticity", "Balance",
  "Beauty", "Belonging", "Compassion", "Connection", "Courage",
  "Creativity", "Curiosity", "Dependability", "Discipline", "Empathy",
  "Equality", "Excellence", "Fairness", "Faith", "Family",
  "Freedom", "Friendship", "Fun", "Generosity", "Grace",
  "Gratitude", "Growth", "Harmony", "Health", "Honesty",
  "Hope", "Humility", "Humor", "Independence", "Integrity",
  "Joy", "Justice", "Kindness", "Knowledge", "Leadership",
  "Love", "Loyalty", "Mindfulness", "Nature", "Patience",
  "Peace", "Purpose", "Respect", "Service", "Wisdom",
]

type QuadrantKey = "bottomRight" | "bottomLeft" | "topLeft" | "topRight"
type Items = Record<QuadrantKey, string[]>

const QUADRANT_INFO: Record<QuadrantKey, {
  title: string; subtitle: string; label: string; placeholder: string;
  color: string; bgColor: string; borderColor: string;
}> = {
  bottomRight: {
    title: "Who & what matters to you?",
    subtitle: "Select values or type your own",
    label: "TOWARD",
    placeholder: "Or type your own value...",
    color: "#6B7F47",
    bgColor: "rgba(107, 127, 71, 0.06)",
    borderColor: "rgba(107, 127, 71, 0.2)",
  },
  bottomLeft: {
    title: "What shows up inside to get in the way?",
    subtitle: "Thoughts, feelings, memories, sensations",
    placeholder: '"I\'m not good enough", anxiety, dread...',
    label: "AWAY",
    color: "#9E6B5A",
    bgColor: "rgba(158, 107, 90, 0.06)",
    borderColor: "rgba(158, 107, 90, 0.2)",
  },
  topLeft: {
    title: "What do you do when that inside stuff shows up?",
    subtitle: "Actions, reactions, behaviors, coping patterns",
    placeholder: "Isolate, scroll phone, shut down, avoid...",
    label: "AWAY MOVES",
    color: "#9E6B5A",
    bgColor: "rgba(158, 107, 90, 0.06)",
    borderColor: "rgba(158, 107, 90, 0.2)",
  },
  topRight: {
    title: "What can you do to move toward what matters?",
    subtitle: "Actions, steps, commitments you can make",
    placeholder: "Call a friend, go for a walk, set a boundary...",
    label: "TOWARD MOVES",
    color: "#6B7F47",
    bgColor: "rgba(107, 127, 71, 0.06)",
    borderColor: "rgba(107, 127, 71, 0.2)",
  },
}

const AXIS_LABELS = {
  top: "OUTER WORLD: actions, behaviors",
  bottom: "INNER WORLD: thoughts, feelings, memories",
  left: "AWAY",
  right: "TOWARD",
}

function storSave<T>(k: string, v: T) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
function storLoad<T>(k: string, fb: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb } catch { return fb }
}

const EMPTY_ITEMS: Items = { bottomRight: [], bottomLeft: [], topLeft: [], topRight: [] }

// ── Values dropdown ───────────────────────────────────────────────────────────

function ValuesDropdown({ selectedValues, onToggle, borderColor }: {
  selectedValues: string[]; onToggle: (v: string) => void; borderColor: string;
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filtered = VALUES_LIST.filter(v => v.toLowerCase().includes(search.toLowerCase()))

  return (
    <div ref={ref} style={{ position: "relative", marginBottom: 6 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          padding: "8px 12px", border: `1px solid ${borderColor}`, borderRadius: 8,
          background: "rgba(255,255,255,0.7)", color: "#8B7B68", cursor: "pointer",
          textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <span>Select from 50 values...</span>
        <span style={{ fontSize: 10, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, background: "#FFFCF7",
          border: `1px solid ${borderColor}`, borderRadius: 8, marginTop: 4, zIndex: 20,
          maxHeight: 240, display: "flex", flexDirection: "column",
          boxShadow: "0 4px 16px rgba(58, 46, 34, 0.12)",
        }}>
          <div style={{ padding: "8px 8px 4px" }}>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search values..." autoFocus
              style={{
                width: "100%", fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                padding: "6px 10px", border: `1px solid ${borderColor}`, borderRadius: 6,
                background: "#fff", color: "#3A2E22", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ overflowY: "auto", flex: 1, padding: "4px 4px 8px" }}>
            {filtered.map(value => {
              const isSelected = selectedValues.includes(value)
              return (
                <div
                  key={value}
                  onClick={() => onToggle(value)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
                    cursor: "pointer", borderRadius: 6, fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, color: isSelected ? "#6B7F47" : "#3A2E22",
                    fontWeight: isSelected ? 600 : 400,
                    background: isSelected ? "rgba(107, 127, 71, 0.1)" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{
                    width: 18, height: 18, minWidth: 18, borderRadius: 4,
                    border: isSelected ? "none" : "1.5px solid #C4A882",
                    background: isSelected ? "#6B7F47" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}>
                    {isSelected && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {value}
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div style={{ padding: "12px 10px", color: "#B8A898", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                No match. Type your own below.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Quadrant card ─────────────────────────────────────────────────────────────

function QuadrantCard({ quadrant, items, onAdd, onRemove, onToggleValue }: {
  quadrant: QuadrantKey; items: string[];
  onAdd: (q: QuadrantKey, text: string) => void;
  onRemove: (q: QuadrantKey, i: number) => void;
  onToggleValue: (val: string) => void;
}) {
  const info = QUADRANT_INFO[quadrant]
  const [inputVal, setInputVal] = useState("")
  const isValues = quadrant === "bottomRight"

  const handleAdd = useCallback(() => {
    const trimmed = inputVal.trim()
    if (trimmed) { onAdd(quadrant, trimmed); setInputVal("") }
  }, [inputVal, quadrant, onAdd])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd()
  }, [handleAdd])

  return (
    <div style={{
      background: info.bgColor, border: `1px solid ${info.borderColor}`, borderRadius: 12,
      padding: "20px 18px 16px", display: "flex", flexDirection: "column", gap: 10,
      minHeight: 220, position: "relative",
    }}>
      <div>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17,
          fontWeight: 600, color: info.color, lineHeight: 1.3, marginBottom: 2,
        }}>
          {info.title}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8B7B68", lineHeight: 1.4 }}>
          {info.subtitle}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#3A2E22",
            padding: "6px 10px", background: "rgba(255,255,255,0.6)", borderRadius: 8, lineHeight: 1.3,
          }}>
            <span style={{ flex: 1 }}>{item}</span>
            <button
              onClick={() => onRemove(quadrant, i)}
              style={{
                background: "none", border: "none", cursor: "pointer", color: "#B8A898",
                fontSize: 16, padding: "0 4px", lineHeight: 1, fontFamily: "'DM Sans', sans-serif",
              }}
              aria-label="Remove item"
            >×</button>
          </div>
        ))}
      </div>

      {isValues && (
        <ValuesDropdown selectedValues={items} onToggle={onToggleValue} borderColor={info.borderColor} />
      )}

      <div style={{ display: "flex", gap: 6 }}>
        <input
          type="text" value={inputVal} onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown} placeholder={info.placeholder}
          style={{
            flex: 1, fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            padding: "8px 12px", border: `1px solid ${info.borderColor}`, borderRadius: 8,
            background: "rgba(255,255,255,0.7)", color: "#3A2E22", outline: "none",
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "8px 14px",
            background: info.color, color: "#fff", border: "none", borderRadius: 8,
            cursor: "pointer", fontWeight: 500,
          }}
        >
          Add
        </button>
      </div>
    </div>
  )
}

// ── Print quadrant ────────────────────────────────────────────────────────────

function PrintQuadrant({ title, subtitle, items, color, borderColor }: {
  title: string; subtitle: string; items: string[]; color: string; borderColor: string;
}) {
  return (
    <div style={{ border: `1.5px solid ${borderColor}`, borderRadius: 8, padding: "12px 14px", minHeight: 130 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>
        {title}
      </div>
      <div style={{ fontSize: 9, color: "#888", fontStyle: "italic", marginBottom: 8 }}>{subtitle}</div>
      {items.length === 0
        ? <div style={{ fontSize: 10, color: "#ccc", fontStyle: "italic" }}>—</div>
        : items.map((item, i) => (
          <div key={i} style={{
            fontSize: 11, color: "#1a202c", padding: "3px 0",
            borderBottom: i < items.length - 1 ? "1px solid #eee" : "none",
          }}>
            {item}
          </div>
        ))
      }
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function ActMatrix() {
  const [items, setItems] = useState<Items>(EMPTY_ITEMS)
  const [showIntro, setShowIntro] = useState(true)
  const [centerLabel, setCenterLabel] = useState("ME")

  useEffect(() => {
    setItems(storLoad("act-matrix-items", EMPTY_ITEMS))
    setCenterLabel(storLoad("act-matrix-center", "ME"))
  }, [])

  const handleAdd = useCallback((quadrant: QuadrantKey, text: string) => {
    setItems(prev => {
      const next = { ...prev, [quadrant]: [...prev[quadrant], text] }
      storSave("act-matrix-items", next)
      return next
    })
  }, [])

  const handleRemove = useCallback((quadrant: QuadrantKey, index: number) => {
    setItems(prev => {
      const next = { ...prev, [quadrant]: prev[quadrant].filter((_, i) => i !== index) }
      storSave("act-matrix-items", next)
      return next
    })
  }, [])

  const handleToggleValue = useCallback((value: string) => {
    setItems(prev => {
      const current = prev.bottomRight
      const next = {
        ...prev,
        bottomRight: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value],
      }
      storSave("act-matrix-items", next)
      return next
    })
  }, [])

  const handleReset = useCallback(() => {
    setItems(EMPTY_ITEMS)
    setCenterLabel("ME")
    storSave("act-matrix-items", EMPTY_ITEMS)
    storSave("act-matrix-center", "ME")
  }, [])

  const toggleCenter = useCallback(() => {
    setCenterLabel(prev => {
      const next = prev === "ME" ? "AWARENESS" : "ME"
      storSave("act-matrix-center", next)
      return next
    })
  }, [])

  const toward = QUADRANT_INFO.topRight
  const away = QUADRANT_INFO.topLeft

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Fonts */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap"
        rel="stylesheet"
      />

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
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32,
            fontWeight: 700, color: "#3A2E22", letterSpacing: "-0.5px", lineHeight: 1.2,
          }}>
            The ACT Matrix
          </div>
          <div style={{ fontSize: 14, color: "#8B7B68", marginTop: 6, maxWidth: 480, margin: "6px auto 0", lineHeight: 1.5 }}>
            A tool for sorting your experience into what moves you toward what matters and what moves you away.
          </div>
        </div>

        {/* Print button */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <button
            onClick={() => window.print()}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
              padding: "8px 16px", border: "1px solid #D4C4A8", borderRadius: 8,
              background: "rgba(255,255,255,0.7)", color: "#8B7B68", cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print / Save as PDF
          </button>
        </div>

        {showIntro && (
          <div style={{
            background: "#F7F0E6", border: "1px solid #E8DFD4", borderRadius: 12,
            padding: "18px 20px", marginBottom: 24, position: "relative",
          }}>
            <button
              onClick={() => setShowIntro(false)}
              style={{
                position: "absolute", top: 12, right: 14, background: "none", border: "none",
                cursor: "pointer", color: "#B8A898", fontSize: 18, fontFamily: "'DM Sans', sans-serif",
              }}
              aria-label="Close introduction"
            >×</button>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18,
              fontWeight: 600, color: "#3A2E22", marginBottom: 8,
            }}>
              How to use this
            </div>
            <div style={{ fontSize: 14, color: "#5A4A38", lineHeight: 1.7 }}>
              Think of yourself as a rabbit. Rabbits move toward things they want (carrots) and away from things that
              scare them (foxes). Humans do the same, but we also have an inner world of thoughts and feelings that
              influence our moves.
              <br /><br />
              Start in the bottom right: select the values that matter to you. Then move to the bottom left: what
              thoughts and feelings get in the way? Top left: what do you tend to do when that stuff shows up? Top
              right: what could you do instead to move toward what matters?
              <br /><br />
              There are no right or wrong answers. This is not a good vs. bad system. It is simply toward and away.
            </div>
          </div>
        )}

        {/* Axis top label */}
        <div style={{
          textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 11,
          fontWeight: 500, color: "#8B7B68", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8,
        }}>
          {AXIS_LABELS.top}
        </div>

        {/* Matrix grid */}
        <div style={{ position: "relative" }}>
          {/* Left axis label */}
          <div style={{
            position: "absolute", left: -4, top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 16, fontWeight: 700, color: "#9E6B5A", letterSpacing: "2px", zIndex: 2,
          }}>
            {AXIS_LABELS.left}
          </div>
          {/* Right axis label */}
          <div style={{
            position: "absolute", right: -14, top: "50%",
            transform: "translateY(-50%) rotate(90deg)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 16, fontWeight: 700, color: "#6B7F47", letterSpacing: "2px", zIndex: 2,
          }}>
            {AXIS_LABELS.right}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 24px" }}>
            <QuadrantCard quadrant="topLeft" items={items.topLeft} onAdd={handleAdd} onRemove={handleRemove} onToggleValue={handleToggleValue} />
            <QuadrantCard quadrant="topRight" items={items.topRight} onAdd={handleAdd} onRemove={handleRemove} onToggleValue={handleToggleValue} />

            {/* Center circle */}
            <div style={{
              gridColumn: "1 / -1", display: "flex", justifyContent: "center",
              margin: "-16px 0", zIndex: 3, position: "relative",
            }}>
              <div
                onClick={toggleCenter}
                style={{
                  width: centerLabel === "ME" ? 72 : 96,
                  height: centerLabel === "ME" ? 72 : 96,
                  borderRadius: "50%",
                  background: centerLabel === "ME"
                    ? "linear-gradient(135deg, #F7F0E6, #FFFCF7)"
                    : "linear-gradient(135deg, #6B7F47, #8B9F5A)",
                  border: centerLabel === "ME" ? "2px solid #D4C4A8" : "2px solid #556438",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: centerLabel === "ME" ? 22 : 13,
                  fontWeight: 700,
                  color: centerLabel === "ME" ? "#3A2E22" : "#FFFCF7",
                  boxShadow: centerLabel === "ME"
                    ? "0 2px 12px rgba(58, 46, 34, 0.1)"
                    : "0 2px 16px rgba(107, 127, 71, 0.3)",
                  cursor: "pointer", transition: "all 0.35s ease", userSelect: "none",
                  textTransform: centerLabel === "ME" ? "none" : "uppercase",
                  letterSpacing: centerLabel === "ME" ? "0" : "1px",
                }}
                title="Click to toggle"
              >
                {centerLabel}
              </div>
            </div>

            <QuadrantCard quadrant="bottomLeft" items={items.bottomLeft} onAdd={handleAdd} onRemove={handleRemove} onToggleValue={handleToggleValue} />
            <QuadrantCard quadrant="bottomRight" items={items.bottomRight} onAdd={handleAdd} onRemove={handleRemove} onToggleValue={handleToggleValue} />
          </div>
        </div>

        {/* Axis bottom label */}
        <div style={{
          textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 11,
          fontWeight: 500, color: "#8B7B68", textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 8,
        }}>
          {AXIS_LABELS.bottom}
        </div>

        {/* Stuck loop explanation */}
        <div style={{
          marginTop: 24, padding: "16px 20px", background: "#F7F0E6",
          border: "1px solid #E8DFD4", borderRadius: 12,
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16,
            fontWeight: 600, color: "#3A2E22", marginBottom: 6,
          }}>
            The stuck loop
          </div>
          <div style={{ fontSize: 13, color: "#5A4A38", lineHeight: 1.7 }}>
            Notice the left side: inner stuff shows up, you react with away moves, and then more inner stuff shows up.
            That loop is natural and human. It only becomes a problem when you get so stuck you can&apos;t move toward
            what matters. The goal isn&apos;t to eliminate away moves. It&apos;s to find ways to also move toward what
            matters, even when the hard stuff is present.
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button
            onClick={handleReset}
            style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#A89880",
              background: "none", border: "none", cursor: "pointer", textDecoration: "underline",
            }}
          >
            Clear all
          </button>
        </div>
      </div>

      {/* ── Print-only layout ── */}
      <div className="act-print-root" aria-hidden="true">
        {/* Header */}
        <div style={{ marginBottom: 14, borderBottom: "3px solid #3A2E22", paddingBottom: 10 }}>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em", color: "#3A2E22", textTransform: "uppercase" }}>
            ACT Matrix
          </div>
          <div style={{ fontSize: 9, color: "#8B7B68", marginTop: 2, letterSpacing: "0.06em" }}>
            Acceptance and Commitment Therapy · Olive Clinical · oliveclinical.com · Printed {new Date().toLocaleDateString()}
          </div>
          <div style={{ marginTop: 6, display: "flex", gap: 24, fontSize: 9, color: "#4a5568" }}>
            <span><strong>Vertical:</strong> Outer world (top) ↕ Inner world (bottom)</span>
            <span><strong>Horizontal:</strong> Away (left) ↔ Toward (right)</span>
          </div>
        </div>

        {/* Outer world label */}
        <div style={{ textAlign: "center", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#8B7B68", marginBottom: 6 }}>
          {AXIS_LABELS.top}
        </div>

        {/* 2×2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
          <PrintQuadrant
            title={QUADRANT_INFO.topLeft.title}
            subtitle="Away moves — outer behaviors"
            items={items.topLeft}
            color={away.color}
            borderColor={away.borderColor}
          />
          <PrintQuadrant
            title={QUADRANT_INFO.topRight.title}
            subtitle="Toward moves — outer behaviors"
            items={items.topRight}
            color={toward.color}
            borderColor={toward.borderColor}
          />
          <PrintQuadrant
            title={QUADRANT_INFO.bottomLeft.title}
            subtitle="Away — inner world"
            items={items.bottomLeft}
            color={away.color}
            borderColor={away.borderColor}
          />
          <PrintQuadrant
            title={QUADRANT_INFO.bottomRight.title}
            subtitle="Toward — values & what matters"
            items={items.bottomRight}
            color={toward.color}
            borderColor={toward.borderColor}
          />
        </div>

        {/* Horizontal axis labels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", textAlign: "center", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#8B7B68", marginBottom: 4 }}>
          <div style={{ color: "#9E6B5A" }}>← Away</div>
          <div style={{ color: "#6B7F47" }}>Toward →</div>
        </div>

        {/* Inner world label */}
        <div style={{ textAlign: "center", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#8B7B68", marginBottom: 14 }}>
          {AXIS_LABELS.bottom}
        </div>

        {/* Stuck loop note */}
        <div style={{ border: "1px solid #E8DFD4", borderRadius: 6, padding: "10px 14px", background: "#F7F0E6" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#3A2E22", marginBottom: 4 }}>The stuck loop</div>
          <div style={{ fontSize: 10, color: "#5A4A38", lineHeight: 1.6 }}>
            Inner stuff shows up → away moves → more inner stuff. The goal isn&apos;t to eliminate away moves —
            it&apos;s to find ways to also move toward what matters, even when the hard stuff is present.
          </div>
        </div>
      </div>

    </div>
  )
}
