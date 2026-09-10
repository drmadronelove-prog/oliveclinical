import { ToolPageLayout } from "@/components/tool-page-layout"
import { TestsCards } from "@/components/tests-cards"

export const metadata = {
  title: "Neuroinclusive Assessments — Olive Clinical",
  description: "Interactive neurodiversity maps, self-report screening tools for ADHD, autism, alexithymia, mental imagery, sensory processing, camouflaging, and more.",
}

export default function TestsPage() {
  return (
    <ToolPageLayout title="Neuroinclusive Assessments" color="text-slate">
      <TestsCards />
    </ToolPageLayout>
  )
}
