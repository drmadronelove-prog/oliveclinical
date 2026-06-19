"use client"

import { useState } from "react"
import { SubmittedMeasures } from "@/components/submitted-measures"

export function AssessmentPlatformClient() {
  const [tab, setTab] = useState<"platform" | "measures">("platform")

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 20px",
    fontSize: 13,
    fontWeight: 500,
    border: "none",
    borderBottom: active ? "2px solid #688E93" : "2px solid transparent",
    background: "none",
    cursor: "pointer",
    color: active ? "#688E93" : "#666",
    transition: "color 0.15s, border-color 0.15s",
    whiteSpace: "nowrap",
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Tab bar */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid #e2e8f0",
        background: "#fff",
        padding: "0 16px",
        gap: 4,
        flexShrink: 0,
      }}>
        <button style={tabStyle(tab === "platform")} onClick={() => setTab("platform")}>
          Assessment Platform
        </button>
        <button style={tabStyle(tab === "measures")} onClick={() => setTab("measures")}>
          Submitted Measures
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        {tab === "platform" && (
          <iframe
            src="/assessmentplatform.html"
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            title="Olive Clinical Assessment Platform"
          />
        )}
        {tab === "measures" && <SubmittedMeasures />}
      </div>
    </div>
  )
}
