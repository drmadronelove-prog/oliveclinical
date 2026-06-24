"use client"

export function OCDTreatmentGoal() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <p style={{
        fontSize: 14,
        lineHeight: 1.7,
        color: "rgba(11,37,69,0.72)",
        fontFamily: "var(--font-body)",
        maxWidth: 680,
        margin: "0 auto",
        textAlign: "center",
      }}>
        Moving from over-reliance on possibility — getting pulled into obsessional doubt — to awareness and trust of the senses.
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 20,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <img
            src="/ChatGPT Image Jun 24, 2026, 09_43_55 AM.png"
            alt="Over-reliance on possibility and obsessional doubt"
            style={{ width: "100%", borderRadius: 10, display: "block" }}
          />
          <p style={{
            fontSize: 12,
            color: "rgba(11,37,69,0.5)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textAlign: "center",
          }}>
            Obsessional Doubt
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <img
            src="/ChatGPT Image Jun 24, 2026, 09_43_51 AM.png"
            alt="Awareness and trust of the senses"
            style={{ width: "100%", borderRadius: 10, display: "block" }}
          />
          <p style={{
            fontSize: 12,
            color: "rgba(11,37,69,0.5)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textAlign: "center",
          }}>
            Sensory Awareness
          </p>
        </div>
      </div>
    </div>
  )
}
