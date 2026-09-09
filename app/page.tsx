import { HeroSection } from "@/components/sections/hero-section"
import { PathCardsSection } from "@/components/sections/path-cards-section"
import { NewsletterSection } from "@/components/sections/newsletter-section"
import { AuthHashCatcher } from "@/components/auth-hash-catcher"

export default function Home() {
  return (
    <main className="relative bg-background overflow-x-hidden">
      {/* Invisible. Only ever does anything if a Supabase invite or
          reset link lands here instead of at /team — see the component
          for why that happens. */}
      <AuthHashCatcher />
      <HeroSection />
      <PathCardsSection />
      <NewsletterSection />
    </main>
  )
}
