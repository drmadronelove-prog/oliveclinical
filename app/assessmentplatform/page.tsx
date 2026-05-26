import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Assessment Platform — Olive Clinical",
}

export default function AssessmentPlatformPage() {
  return (
    <iframe
      src="/assessmentplatform.html"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        zIndex: 9999,
      }}
      title="Olive Clinical Assessment Platform"
    />
  )
}
