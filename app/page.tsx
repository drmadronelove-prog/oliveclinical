import { HeroSection } from "@/components/sections/hero-section"
import { NewsletterSection } from "@/components/sections/newsletter-section"

export default function Home() {
  return (
    <main className="relative bg-background overflow-x-hidden">
      <HeroSection />
      <NewsletterSection />
    </main>
  )
}
