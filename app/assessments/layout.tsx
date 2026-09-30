import type { Metadata } from "next"

// The page itself is a client component, so its metadata lives here.
// Without this the route inherits the site-wide description from the
// root layout, which says nothing about assessments.
const DESCRIPTION =
  "Affirming autism, ADHD, OCD, and PTSD assessments for adults in California. Telehealth, three-week wait, full written report included."

export const metadata: Metadata = {
  title: "Adult Autism & ADHD Assessment | Oakland | Olive Clinical",
  description: DESCRIPTION,
  alternates: { canonical: "/assessments" },
  openGraph: {
    title: "Adult Autism & ADHD Assessment | Oakland | Olive Clinical",
    description: DESCRIPTION,
    url: "https://oliveclinical.com/assessments",
    siteName: "Olive Clinical",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adult Autism & ADHD Assessment | Oakland | Olive Clinical",
    description: DESCRIPTION,
  },
}

export default function AssessmentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
