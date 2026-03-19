import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { WhoWeServe } from "@/components/who-we-serve"
import { HowItWorks } from "@/components/how-it-works"
import { ValueProposition } from "@/components/value-proposition"
import { ContactCTA } from "@/components/contact-cta"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <WhoWeServe />
        <HowItWorks />
        <ValueProposition />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  )
}
