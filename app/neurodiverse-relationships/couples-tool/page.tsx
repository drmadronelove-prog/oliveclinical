import type { Metadata } from "next"
import { CouplesClassificationTool } from "@/components/tools/couples-classification-tool"

export const metadata: Metadata = {
  title: "Couples Classification Interactive Tool — Olive Clinical",
  description:
    "A 50-question tool for two primary partners: see how you each move under stress, where blame lands, how you react and recover, and how your two patterns fit together.",
}

export default function CouplesToolPage() {
  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <CouplesClassificationTool />
    </main>
  )
}
