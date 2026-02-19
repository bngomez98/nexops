import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"
import { MissionValues } from "@/components/mission-values"
import { HowItWorks } from "@/components/how-it-works"
import { Services } from "@/components/services"
import { Comparison } from "@/components/comparison"
import { ContractorCTA } from "@/components/contractor-cta"
import { SubmitCTA } from "@/components/submit-cta"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Stats />
        <MissionValues />
        <HowItWorks />
        <Services />
        <Comparison />
        <ContractorCTA />
        <SubmitCTA />
      </main>
      <Footer />
    </div>
  )
}
