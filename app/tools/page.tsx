import type { Metadata } from "next"
import { ToolPageLayout } from "@/components/tool-page-layout"
import { ToolsPageContent } from "@/components/tools-page"

export const metadata: Metadata = {
  title: "Therapeutic Tools — Olive Clinical",
  description: "Virtual worksheets and interactive tools for mindfulness, executive functioning, cognitive (CBT), and emotion regulation.",
}

export default function ToolsPage() {
  return (
    <ToolPageLayout title="Therapeutic Tools" color="text-ink">
      <ToolsPageContent />
    </ToolPageLayout>
  )
}
