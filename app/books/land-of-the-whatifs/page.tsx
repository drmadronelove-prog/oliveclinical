import { LandOfTheWhatifs } from "@/components/books/land-of-the-whatifs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Land of the Whatifs — Olive Clinical",
  description:
    "A picture book by Madrone Love about getting lost in what-if thinking and coming back to the senses.",
}

export default function LandOfTheWhatifsPage() {
  return <LandOfTheWhatifs />
}
