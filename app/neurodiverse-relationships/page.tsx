import type { Metadata } from "next"
import { ToolPageLayout } from "@/components/tool-page-layout"
import { FeatureCardGrid, type FeatureCard } from "@/components/feature-card-grid"

export const metadata: Metadata = {
  title: "Neurodiverse Relationships — Olive Clinical",
  description: "Blog posts and resources on neurodivergent relationships, ROCD, and loving across different neurotypes.",
}

const CARDS: FeatureCard[] = [
  {
    kind: "link",
    title: "Loving Across the Wiring",
    category: "Relationships & Neurodivergence",
    footerLabel: "Read",
    href: "/blog/loving-across-the-wiring",
  },
  {
    kind: "link",
    title: "\"The Drama\" as a Portrait of Relationship OCD",
    category: "Film & Relationship OCD",
    footerLabel: "Read",
    href: "/blog/watching-charlie-unravel",
  },
  {
    kind: "link",
    title: "What Couples Therapy Reveals About Access Needs",
    category: "Neurodiverse Relationships · Accountability",
    footerLabel: "Read",
    href: "/blog/couples-therapy-access-needs",
  },
  {
    kind: "link",
    title: "Neurodivergent Romantic Relationships",
    category: "Relationships · Presentation",
    footerLabel: "View slides",
    href: "https://www.beautiful.ai/player/-OnJpRkdzWpk0n0mEq0T/Neurodivergent-Romantic-Relationships",
  },
]

export default function NeurodiverseRelationshipsPage() {
  return (
    <ToolPageLayout title="Neurodiverse Relationships" color="text-ink">
      <FeatureCardGrid cards={CARDS} />
    </ToolPageLayout>
  )
}
