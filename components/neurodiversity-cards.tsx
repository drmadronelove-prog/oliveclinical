"use client"

import { HoverProvider } from "@/components/hover-context"
import { NetworkGraph, type GraphNode } from "@/components/neurodivergence-network"
import { MechanismMatrix } from "@/components/mechanism-matrix"
import { TwoLevelFoundations } from "@/components/two-level-foundations"
import { FeatureCardGrid, type FeatureCard } from "@/components/feature-card-grid"

export function NeurodiversityCards({
  bigNodes,
  bigLinks,
}: {
  bigNodes: GraphNode[]
  bigLinks: [string, string][]
}) {
  const cards: FeatureCard[] = [
    {
      kind: "modal",
      title: "Comprehensive overlap map",
      category: "Interactive network",
      footerLabel: "Open map",
      modalTitle: "Comprehensive overlap map",
      modalSubtitle:
        "DSM diagnoses, non-DSM constructs, and shared cognitive mechanisms. Drag nodes to rearrange.",
      content: (
        <NetworkGraph
          graphId="big"
          nodes={bigNodes}
          links={bigLinks}
          title="Comprehensive overlap map"
          description="DSM diagnoses, non-DSM constructs, and shared cognitive mechanisms. Drag nodes to rearrange."
        />
      ),
    },
    {
      kind: "modal",
      title: "Spectrum foundations",
      category: "Cognitive spectra",
      footerLabel: "Open chart",
      modalTitle: "Spectrum foundations",
      modalSubtitle:
        "Four cognitive spectra with their defining mechanisms and associated conditions. Click a condition pill to see its mechanism profile.",
      content: <TwoLevelFoundations />,
    },
    {
      kind: "modal",
      title: "Mechanism matrix",
      category: "Conditions × mechanisms",
      footerLabel: "Open matrix",
      modalTitle: "Mechanism matrix",
      modalSubtitle:
        "Which cognitive mechanisms are present across each condition. Hover to highlight, click to select.",
      content: <MechanismMatrix />,
    },
    {
      kind: "link",
      title: "Neurodivergent Romantic Relationships",
      category: "Relationships · Presentation",
      footerLabel: "View slides",
      href: "https://www.beautiful.ai/player/-OnJpRkdzWpk0n0mEq0T/Neurodivergent-Romantic-Relationships",
    },
  ]

  return (
    <HoverProvider>
      <FeatureCardGrid cards={cards} modalSize="wide" />
    </HoverProvider>
  )
}
