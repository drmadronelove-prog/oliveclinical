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
    label: "VITAL",
    placeholder: "Or type your own value...",
    color: "#4f6f6a",
    bgColor: "#e8efed",
    borderColor: "rgba(79, 111, 106, 0.38)",
  },
  bottomLeft: {
    title: "What shows up inside to get in the way?",
    subtitle: "Thoughts, feelings, memories, sensations",
    placeholder: '"I\'m not good enough", anxiety, dread...',
    label: "SUFFERING",
    color: "#7a4f6e",
    bgColor: "#efe9ed",
    borderColor: "rgba(122, 79, 110, 0.38)",
  },
  topLeft: {
    title: "What do you do when that inside stuff shows up?",
    subtitle: "Actions, reactions, behaviors, coping patterns",
    placeholder: "Isolate, scroll phone, shut down, avoid...",
    label: "SUFFERING MOVES",
    color: "#7a4f6e",
    bgColor: "#efe9ed",
    borderColor: "rgba(122, 79, 110, 0.38)",
  },
  topRight: {
    title: "What can you do to move toward what matters?",
    subtitle: "Actions, steps, commitments you can make",
    placeholder: "Call a friend, go for a walk, set a boundary...",
    label: "VITAL MOVES",
    color: "#4f6f6a",
    bgColor: "#e8efed",
    borderColor: "rgba(79, 111, 106, 0.38)",
  },
}

const AXIS_LABELS = {
  top: "OUTER WORLD: actions, behaviors",
  bottom: "INNER WORLD: thoughts, feelings, memories",
  left: "SUFFERING",
  right: "VITAL",
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
          background: "#f7f7f8", color: "#5b6e88", cursor: "pointer",
          textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <span>Select from 50 values...</span>
        <span style={{ fontSize: 10, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, background: "#f3f3f3",
          border: `1px solid ${borderColor}`, borderRadius: 8, marginTop: 4, zIndex: 20,
          maxHeight: 240, display: "flex", flexDirection: "column",
          boxShadow: "0 4px 16px rgba(11, 37, 69, 0.12)",
        }}>
          <div style={{ padding: "8px 8px 4px" }}>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search values..." autoFocus
              style={{
                width: "100%", fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                padding: "6px 10px", border: `1px solid ${borderColor}`, borderRadius: 6,
                background: "#fff", color: "#0b2545", outline: "none", boxSizing: "border-box",
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
                    fontSize: 13, color: isSelected ? "#4f6f6a" : "#0b2545",
                    fontWeight: isSelected ? 600 : 400,
                    background: isSelected ? "rgba(79, 111, 106, 0.1)" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{
                    width: 18, height: 18, minWidth: 18, borderRadius: 4,
                    border: isSelected ? "none" : "1.5px solid #c5a572",
                    background: isSelected ? "#4f6f6a" : "transparent",
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
              <div style={{ padding: "12px 10px", color: "#9aa3b0", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
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
      background: info.bgColor, border: `1.5px solid ${info.borderColor}`, borderRadius: 14,
      padding: "24px 22px 20px", display: "flex", flexDirection: "column", gap: 12,
      minHeight: 300, position: "relative",
    }}>
      <div>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 21,
          fontWeight: 600, color: info.color, lineHeight: 1.25, marginBottom: 4,
        }}>
          {info.title}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#5b6e88", lineHeight: 1.45 }}>
          {info.subtitle}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#0b2545",
            padding: "8px 12px", background: "#ffffff", borderRadius: 8, lineHeight: 1.35,
            border: "1px solid rgba(11, 37, 69, 0.08)",
          }}>
            <span style={{ flex: 1 }}>{item}</span>
            <button
              onClick={() => onRemove(quadrant, i)}
              style={{
                background: "none", border: "none", cursor: "pointer", color: "#9aa3b0",
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
            flex: 1, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            padding: "10px 14px", border: `1px solid ${info.borderColor}`, borderRadius: 8,
            background: "#ffffff", color: "#0b2545", outline: "none",
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, padding: "10px 18px",
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
            fontSize: 11, color: "#0b2545", padding: "3px 0",
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
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 20px", fontFamily: "'DM Sans', sans-serif" }}>

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
            fontWeight: 700, color: "#0b2545", letterSpacing: "-0.5px", lineHeight: 1.2,
          }}>
            The ACT Matrix
          </div>
          <div style={{ fontSize: 14, color: "#5b6e88", marginTop: 6, maxWidth: 480, margin: "6px auto 0", lineHeight: 1.5 }}>
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
              padding: "8px 16px", border: "1px solid #c9ccd2", borderRadius: 8,
              background: "#f7f7f8", color: "#5b6e88", cursor: "pointer",
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
            background: "#e9e9e9", border: "1px solid #d9dde2", borderRadius: 12,
            padding: "18px 20px", marginBottom: 24, position: "relative",
          }}>
            <button
              onClick={() => setShowIntro(false)}
              style={{
                position: "absolute", top: 12, right: 14, background: "none", border: "none",
                cursor: "pointer", color: "#9aa3b0", fontSize: 18, fontFamily: "'DM Sans', sans-serif",
              }}
              aria-label="Close introduction"
            >×</button>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18,
              fontWeight: 600, color: "#0b2545", marginBottom: 8,
            }}>
              How to use this
            </div>
            <div style={{ fontSize: 14, color: "#33455f", lineHeight: 1.7 }}>
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
          fontWeight: 500, color: "#5b6e88", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8,
        }}>
          {AXIS_LABELS.top}
        </div>

        {/* Matrix grid */}
        <div style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 28px" }}>
            <QuadrantCard quadrant="topLeft" items={items.topLeft} onAdd={handleAdd} onRemove={handleRemove} onToggleValue={handleToggleValue} />
            <QuadrantCard quadrant="topRight" items={items.topRight} onAdd={handleAdd} onRemove={handleRemove} onToggleValue={handleToggleValue} />

            {/* Center circle, sitting on the suffering → vital axis */}
            <div style={{
              gridColumn: "1 / -1", display: "flex", justifyContent: "center",
              margin: "-20px 0", zIndex: 3, position: "relative",
            }}>
              {/* Horizontal axis: an open circle at suffering, a rule running
                  across, and a solid arrowhead at vital. Built from CSS shapes
                  rather than a stretched SVG so the circle stays round and the
                  arrowhead keeps its proportions at any width. Sits behind the
                  centre circle so the line reads as passing through it. */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute", left: 0, right: 0, top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex", alignItems: "center", gap: 8,
                  zIndex: 1, pointerEvents: "none",
                }}
              >
                <span style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 17, fontWeight: 700, color: "#7a4f6e",
                  letterSpacing: "1px", whiteSpace: "nowrap",
                }}>
                  {AXIS_LABELS.left}
                </span>
                <span style={{
                  width: 9, height: 9, borderRadius: "50%", flex: "none",
                  background: "#f3f3f3", border: "1px solid #7a4f6e",
                }} />
                <span style={{ flex: 1, minWidth: 0, height: 1, background: "#9aa3b0" }} />
                <span style={{
                  width: 0, height: 0, flex: "none",
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  borderLeft: "10px solid #4f6f6a",
                  marginLeft: -1,
                }} />
                <span style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 17, fontWeight: 700, color: "#4f6f6a",
                  letterSpacing: "1px", whiteSpace: "nowrap",
                }}>
                  {AXIS_LABELS.right}
                </span>
              </div>
              <div
                onClick={toggleCenter}
                style={{
                  width: centerLabel === "ME" ? 88 : 112,
                  height: centerLabel === "ME" ? 88 : 112,
                  borderRadius: "50%",
                  background: centerLabel === "ME"
                    ? "linear-gradient(135deg, #e9e9e9, #f3f3f3)"
                    : "linear-gradient(135deg, #4f6f6a, #6e8e88)",
                  border: centerLabel === "ME" ? "2px solid #c9ccd2" : "2px solid #3f5a55",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: centerLabel === "ME" ? 26 : 14,
                  fontWeight: 700,
                  color: centerLabel === "ME" ? "#0b2545" : "#f3f3f3",
                  boxShadow: centerLabel === "ME"
                    ? "0 2px 12px rgba(11, 37, 69, 0.1)"
                    : "0 2px 16px rgba(79, 111, 106, 0.3)",
                  cursor: "pointer", transition: "all 0.35s ease", userSelect: "none",
                  position: "relative", zIndex: 2,
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
          fontWeight: 500, color: "#5b6e88", textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 8,
        }}>
          {AXIS_LABELS.bottom}
        </div>

        {/* Stuck loop explanation */}
        <div style={{
          marginTop: 24, padding: "16px 20px", background: "#e9e9e9",
          border: "1px solid #d9dde2", borderRadius: 12,
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16,
            fontWeight: 600, color: "#0b2545", marginBottom: 6,
          }}>
            The stuck loop
          </div>
          <div style={{ fontSize: 13, color: "#33455f", lineHeight: 1.7 }}>
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
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#7f8a99",
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
        <div style={{ marginBottom: 14, borderBottom: "3px solid #0b2545", paddingBottom: 10 }}>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em", color: "#0b2545", textTransform: "uppercase" }}>
            ACT Matrix
          </div>
          <div style={{ fontSize: 9, color: "#5b6e88", marginTop: 2, letterSpacing: "0.06em" }}>
            Acceptance and Commitment Therapy · Olive Clinical · oliveclinical.com · Printed {new Date().toLocaleDateString()}
          </div>
          <div style={{ marginTop: 6, display: "flex", gap: 24, fontSize: 9, color: "#5b6e88" }}>
            <span><strong>Vertical:</strong> Outer world (top) ↕ Inner world (bottom)</span>
            <span><strong>Horizontal:</strong> Suffering (left) ↔ Vital (right)</span>
          </div>
        </div>

        {/* Outer world label */}
        <div style={{ textAlign: "center", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#5b6e88", marginBottom: 6 }}>
          {AXIS_LABELS.top}
        </div>

        {/* 2×2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
          <PrintQuadrant
            title={QUADRANT_INFO.topLeft.title}
            subtitle="Suffering moves — outer behaviors"
            items={items.topLeft}
            color={away.color}
            borderColor={away.borderColor}
          />
          <PrintQuadrant
            title={QUADRANT_INFO.topRight.title}
            subtitle="Vital moves — outer behaviors"
            items={items.topRight}
            color={toward.color}
            borderColor={toward.borderColor}
          />
          <PrintQuadrant
            title={QUADRANT_INFO.bottomLeft.title}
            subtitle="Suffering — inner world"
            items={items.bottomLeft}
            color={away.color}
            borderColor={away.borderColor}
          />
          <PrintQuadrant
            title={QUADRANT_INFO.bottomRight.title}
            subtitle="Vital — values & what matters"
            items={items.bottomRight}
            color={toward.color}
            borderColor={toward.borderColor}
          />
        </div>

        {/* Horizontal axis labels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", textAlign: "center", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#5b6e88", marginBottom: 4 }}>
          <div style={{ color: "#7a4f6e" }}>← Suffering</div>
          <div style={{ color: "#4f6f6a" }}>Vital →</div>
        </div>

        {/* Inner world label */}
        <div style={{ textAlign: "center", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#5b6e88", marginBottom: 14 }}>
          {AXIS_LABELS.bottom}
        </div>

        {/* Stuck loop note */}
        <div style={{ border: "1px solid #d9dde2", borderRadius: 6, padding: "10px 14px", background: "#e9e9e9" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#0b2545", marginBottom: 4 }}>The stuck loop</div>
          <div style={{ fontSize: 10, color: "#33455f", lineHeight: 1.6 }}>
            Inner stuff shows up → away moves → more inner stuff. The goal isn&apos;t to eliminate away moves —
            it&apos;s to find ways to also move toward what matters, even when the hard stuff is present.
          </div>
        </div>
      </div>

    </div>
  )
}
