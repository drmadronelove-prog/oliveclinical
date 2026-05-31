"use client"

import { HoverProvider } from "@/components/hover-context"
import { NetworkGraph, type GraphNode } from "@/components/neurodivergence-network"
import { MechanismMatrix } from "@/components/mechanism-matrix"
import { TwoLevelFoundations } from "@/components/two-level-foundations"
import { AdhdChecklist } from "@/components/assessments/adhd-checklist"
import { AQ50 } from "@/components/assessments/aq50"
import { VVIQ } from "@/components/assessments/vviq"
import { TAS20 } from "@/components/assessments/tas20"
import { CATQ } from "@/components/assessments/catq"
import { MDS16 } from "@/components/assessments/mds16"
import { GSQ } from "@/components/assessments/gsq"
import { OEQ2 } from "@/components/assessments/oeq2"
import { ICQEV } from "@/components/assessments/icqev"
import { OCTRS } from "@/components/assessments/octrs"
import { AQ10 } from "@/components/assessments/aq10"
import { DESB } from "@/components/assessments/desb"
import { DSS } from "@/components/assessments/dss"
import { FeatureCardGrid, type FeatureCard } from "@/components/feature-card-grid"

// ── Neurodiversity map data ────────────────────────────────────────────────────

const BIG_NODES: GraphNode[] = [
  { id: "ocd",         label: "OCD",                             type: "dsm"  },
  { id: "adhd",        label: "ADHD",                            type: "dsm"  },
  { id: "asd",         label: "Autism / ASD",                    type: "dsm"  },
  { id: "bpd",         label: "Borderline Personality Disorder", type: "dsm"  },
  { id: "dissoc",      label: "Dissociation",                    type: "dsm"  },
  { id: "cptsd",       label: "Complex PTSD",                    type: "dsm"  },
  { id: "limerence",   label: "Limerence",                       type: "ndsm" },
  { id: "md",          label: "Maladaptive daydreaming",         type: "ndsm" },
  { id: "gifted",      label: "Giftedness",                      type: "ndsm" },
  { id: "alexithymia", label: "Alexithymia",                     type: "ndsm" },
  { id: "rsd",         label: "Rejection sensitivity",           type: "ndsm" },
  { id: "flow",        label: "Flow states",                     type: "ndsm" },
  { id: "fantasy",     label: "Fantasy proneness",               type: "ndsm" },
  { id: "hsp",         label: "Highly sensitive person",         type: "ndsm" },
  { id: "justice",     label: "Justice sensitivity",             type: "ndsm" },
  { id: "cds",         label: "Cognitive disengagement",         type: "ndsm" },
  { id: "nvld",        label: "Nonverbal Learning Disorder",     type: "ndsm" },
  { id: "absorption",  label: "Absorption",                      type: "mech" },
  { id: "hyperphant",  label: "Hyperphantasia",                  type: "mech" },
  { id: "dmn",         label: "Default Mode Network intrusion",  type: "mech" },
  { id: "inferential", label: "Inferential confusion",           type: "mech" },
  { id: "monotropism", label: "Monotropism",                     type: "mech" },
  { id: "hyperfocus",  label: "Hyperfocus",                      type: "mech" },
  { id: "intero",      label: "Interoceptive differences",       type: "mech" },
  { id: "motivated",   label: "Motivated imagination",           type: "mech" },
  { id: "prefint",     label: "Preferential interiority",        type: "mech" },
  { id: "reality",     label: "Reality monitoring",              type: "mech" },
  { id: "dopamine",    label: "Dopamine dysregulation",          type: "mech" },
  { id: "persist",     label: "Perseverative cognition",         type: "mech" },
  { id: "emodysreg",   label: "Emotional dysregulation",         type: "mech" },
]

const BIG_LINKS: [string, string][] = [
  ["ocd","inferential"],["ocd","absorption"],["ocd","hyperphant"],["ocd","motivated"],["ocd","reality"],["ocd","persist"],["ocd","dopamine"],["ocd","alexithymia"],["ocd","emodysreg"],["ocd","justice"],
  ["adhd","dmn"],["adhd","absorption"],["adhd","motivated"],["adhd","dopamine"],["adhd","persist"],["adhd","hyperphant"],["adhd","prefint"],["adhd","hyperfocus"],["adhd","rsd"],["adhd","emodysreg"],["adhd","alexithymia"],["adhd","cptsd"],["adhd","flow"],["adhd","justice"],["adhd","cds"],
  ["asd","monotropism"],["asd","intero"],["asd","absorption"],["asd","hyperphant"],["asd","prefint"],["asd","dmn"],["asd","persist"],["asd","motivated"],["asd","hyperfocus"],["asd","alexithymia"],["asd","emodysreg"],["asd","cptsd"],["asd","flow"],["asd","justice"],["asd","nvld"],["asd","inferential"],
  ["bpd","motivated"],["bpd","absorption"],["bpd","inferential"],["bpd","reality"],["bpd","rsd"],["bpd","emodysreg"],["bpd","dopamine"],["bpd","persist"],["bpd","limerence"],["bpd","cptsd"],["bpd","dissoc"],["bpd","intero"],["bpd","alexithymia"],["bpd","hyperphant"],
  ["dissoc","absorption"],["dissoc","reality"],["dissoc","prefint"],["dissoc","intero"],["dissoc","cptsd"],["dissoc","emodysreg"],
  ["cptsd","intero"],["cptsd","reality"],["cptsd","emodysreg"],["cptsd","absorption"],["cptsd","persist"],["cptsd","dissoc"],["cptsd","hsp"],["cptsd","justice"],
  ["limerence","motivated"],["limerence","absorption"],["limerence","inferential"],["limerence","dopamine"],["limerence","prefint"],["limerence","persist"],["limerence","hyperphant"],["limerence","reality"],["limerence","rsd"],["limerence","emodysreg"],["limerence","alexithymia"],["limerence","fantasy"],
  ["md","absorption"],["md","hyperphant"],["md","motivated"],["md","prefint"],["md","dmn"],["md","reality"],["md","persist"],["md","dissoc"],["md","fantasy"],["md","cds"],
  ["gifted","absorption"],["gifted","hyperphant"],["gifted","motivated"],["gifted","prefint"],["gifted","hyperfocus"],["gifted","persist"],["gifted","dmn"],["gifted","intero"],["gifted","flow"],["gifted","fantasy"],["gifted","hsp"],["gifted","justice"],
  ["alexithymia","intero"],["alexithymia","emodysreg"],
  ["rsd","dopamine"],["rsd","emodysreg"],["rsd","persist"],["rsd","motivated"],["rsd","justice"],
  ["flow","absorption"],["flow","hyperfocus"],["flow","motivated"],["flow","prefint"],["flow","dmn"],["flow","monotropism"],
  ["fantasy","absorption"],["fantasy","hyperphant"],["fantasy","prefint"],["fantasy","reality"],
  ["hsp","absorption"],["hsp","intero"],["hsp","emodysreg"],["hsp","prefint"],["hsp","dmn"],["hsp","hyperphant"],["hsp","cptsd"],["hsp","alexithymia"],["hsp","justice"],
  ["justice","emodysreg"],["justice","persist"],["justice","motivated"],["justice","dopamine"],
  ["cds","absorption"],["cds","dmn"],["cds","prefint"],["cds","reality"],["cds","motivated"],["cds","dissoc"],
  ["nvld","inferential"],["nvld","alexithymia"],["nvld","intero"],["nvld","emodysreg"],["nvld","monotropism"],["nvld","justice"],["nvld","persist"],
  ["emodysreg","dopamine"],["emodysreg","intero"],
  ["dmn","absorption"],["monotropism","absorption"],["monotropism","prefint"],["monotropism","dmn"],["monotropism","hyperfocus"],
  ["hyperfocus","absorption"],["hyperfocus","prefint"],["hyperfocus","dopamine"],
  ["hyperphant","inferential"],["hyperphant","reality"],["inferential","motivated"],["inferential","persist"],
  ["absorption","prefint"],["dopamine","motivated"],["persist","inferential"],["motivated","prefint"],
]

// ── Section layout ─────────────────────────────────────────────────────────────

function Section({
  title,
  subtitle,
  cards,
  color,
}: {
  title: string
  subtitle: string
  cards: FeatureCard[]
  color: string
}) {
  return (
    <section style={{
      marginTop: 52,
      background: `${color}12`,
      borderRadius: 12,
      padding: "24px 20px 28px",
      marginLeft: -20,
      marginRight: -20,
    }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "stretch", gap: 14, marginBottom: 8 }}>
          <div style={{ width: 4, borderRadius: 2, background: color, flexShrink: 0 }} />
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(20px, 2.8vw, 26px)",
                fontWeight: 500,
                color: "var(--ink)",
                letterSpacing: "-0.018em",
                lineHeight: 1.2,
                marginBottom: 5,
              }}
            >
              {title}
            </h2>
            <p style={{ fontSize: 13, color: "var(--ink-muted, #666)", lineHeight: 1.55, margin: 0 }}>
              {subtitle}
            </p>
          </div>
        </div>
        <div style={{ height: 1, background: color, opacity: 0.22, marginTop: 10 }} />
      </div>
      <FeatureCardGrid cards={cards} modalSize="wide" />
    </section>
  )
}

// ── Neurodiversity tools ───────────────────────────────────────────────────────

const TOOLS: FeatureCard[] = [
  {
    kind: "modal",
    title: "Comprehensive Overlap Map",
    category: "Interactive network",
    footerLabel: "Open map",
    modalTitle: "Comprehensive Overlap Map",
    modalSubtitle: "DSM diagnoses, non-DSM constructs, and shared cognitive mechanisms. Drag nodes to rearrange.",
    content: (
      <NetworkGraph
        graphId="big"
        nodes={BIG_NODES}
        links={BIG_LINKS}
        title="Comprehensive overlap map"
        description="DSM diagnoses, non-DSM constructs, and shared cognitive mechanisms. Drag nodes to rearrange."
      />
    ),
  },
  {
    kind: "modal",
    title: "Spectrum Foundations",
    category: "Cognitive spectra",
    footerLabel: "Open chart",
    modalTitle: "Spectrum Foundations",
    modalSubtitle: "Four cognitive spectra with their defining mechanisms and associated conditions. Click a condition pill to see its mechanism profile.",
    content: <TwoLevelFoundations />,
  },
  {
    kind: "modal",
    title: "Mechanism Matrix",
    category: "Conditions × mechanisms",
    footerLabel: "Open matrix",
    modalTitle: "Mechanism Matrix",
    modalSubtitle: "Which cognitive mechanisms are present across each condition. Hover to highlight, click to select.",
    content: <MechanismMatrix />,
  },
]

// ── Questionnaires & screeners ─────────────────────────────────────────────────

const SCREENERS: FeatureCard[] = [
  {
    kind: "modal",
    title: "ADHD Symptom Checklist",
    category: "DSM-5 + community",
    footerLabel: "Take checklist",
    modalTitle: "ADHD Symptom Checklist",
    modalSubtitle: "DSM-5 criteria · community-reported symptoms.",
    content: <AdhdChecklist />,
  },
  {
    kind: "modal",
    title: "AQ-50",
    category: "Autism Spectrum Quotient",
    footerLabel: "Take screen",
    modalTitle: "AQ-50: Autism Spectrum Quotient",
    modalSubtitle: "50-item screening questionnaire · Baron-Cohen et al., 2001.",
    content: <AQ50 />,
  },
  {
    kind: "modal",
    title: "CAT-Q",
    category: "Camouflaging traits",
    footerLabel: "Take screen",
    modalTitle: "CAT-Q: Camouflaging Autistic Traits Questionnaire",
    modalSubtitle: "25 items across compensation, masking, and assimilation.",
    content: <CATQ />,
  },
  {
    kind: "modal",
    title: "TAS-20",
    category: "Alexithymia scale",
    footerLabel: "Take scale",
    modalTitle: "TAS-20: Toronto Alexithymia Scale",
    modalSubtitle: "20 items measuring difficulty identifying and describing feelings.",
    content: <TAS20 />,
  },
  {
    kind: "modal",
    title: "VVIQ",
    category: "Mental imagery",
    footerLabel: "Take questionnaire",
    modalTitle: "VVIQ: Vividness of Visual Imagery Questionnaire",
    modalSubtitle: "Rate the vividness of imagined scenes.",
    content: <VVIQ />,
  },
  {
    kind: "modal",
    title: "MDS-16",
    category: "Maladaptive daydreaming",
    footerLabel: "Take screen",
    modalTitle: "MDS-16: Maladaptive Daydreaming Scale",
    modalSubtitle: "16 items screening for immersive daydreaming.",
    content: <MDS16 />,
  },
  {
    kind: "modal",
    title: "GSQ",
    category: "Sensory processing",
    footerLabel: "Take questionnaire",
    modalTitle: "GSQ: Glasgow Sensory Questionnaire",
    modalSubtitle: "Hyper- and hyposensitivity across visual, auditory, and other modalities.",
    content: <GSQ />,
  },
  {
    kind: "modal",
    title: "OEQ-II",
    category: "Overexcitabilities",
    footerLabel: "Take questionnaire",
    modalTitle: "OEQ-II: Overexcitabilities Questionnaire",
    modalSubtitle: "Five Dabrowskian overexcitabilities — psychomotor, sensual, intellectual, imaginational, emotional.",
    content: <OEQ2 />,
  },
  {
    kind: "modal",
    title: "ICQ-EV",
    category: "Inferential confusion",
    footerLabel: "Take questionnaire",
    modalTitle: "ICQ-EV: Inferential Confusion Questionnaire (Expanded Version)",
    modalSubtitle: "30-item measure of inferential confusion · Aardema et al., 2010.",
    content: <ICQEV />,
  },
  {
    kind: "modal",
    title: "OCT-RS",
    category: "Overcontrol traits",
    footerLabel: "Take scale",
    modalTitle: "OCT-RS: OC Trait Rating Scale",
    modalSubtitle: "24-item measure of maladaptive overcontrol · Seretis, Hempel & Lynch, 2015.",
    content: <OCTRS />,
  },
  {
    kind: "modal",
    title: "AQ-10",
    category: "Autism referral screen",
    footerLabel: "Take screen",
    modalTitle: "AQ-10: Autism Spectrum Quotient (short)",
    modalSubtitle: "10-item adult referral screen · Allison, Auyeung & Baron-Cohen, 2012.",
    content: <AQ10 />,
  },
  {
    kind: "modal",
    title: "DES-B",
    category: "Dissociative symptoms",
    footerLabel: "Take scale",
    modalTitle: "DES-B: Brief Dissociative Experiences Scale (Modified)",
    modalSubtitle: "8-item severity measure · Dalenberg & Carlson, 2010 (modified for DSM-5).",
    content: <DESB />,
  },
  {
    kind: "modal",
    title: "DSS",
    category: "Dissociative symptoms",
    footerLabel: "Take scale",
    modalTitle: "DSS: Dissociative Symptoms Scale",
    modalSubtitle: "20-item self-report measure · Carlson et al., 2018.",
    content: <DSS />,
  },
]

// ── Page component ─────────────────────────────────────────────────────────────

export function TestsCards() {
  return (
    <HoverProvider>
      <div style={{ paddingBottom: 48 }}>
        <Section
          title="Neurodiversity Tools"
          subtitle="Interactive maps and matrices exploring the overlap of neurodivergent conditions and cognitive mechanisms."
          cards={TOOLS}
          color="#688E93"
        />
        <Section
          title="Questionnaires & Screeners"
          subtitle="Self-report measures for ADHD, autism, alexithymia, mental imagery, sensory processing, dissociation, and more."
          cards={SCREENERS}
          color="#5b6e88"
        />
      </div>
    </HoverProvider>
  )
}
