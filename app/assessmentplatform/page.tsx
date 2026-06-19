import type { Metadata } from "next"
import { AssessmentPlatformClient } from "./client"

export const metadata: Metadata = {
  title: "Assessment Platform — Olive Clinical",
}

export default function AssessmentPlatformPage() {
  return <AssessmentPlatformClient />
}
