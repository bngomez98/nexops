import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"
import { MissionValues } from "@/components/mission-values"
import { HowItWorks } from "@/components/how-it-works"
import { Services } from "@/components/services"
import { Comparison } from "@/components/comparison"
import { ContractorCTA } from "@/components/contractor-cta"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { SubmitCTA } from "@/components/submit-cta"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-12rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-[24rem] w-[24rem] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="pt-6">
          <Hero />
        </section>

        <section className="mt-8 rounded-2xl border border-border/50 bg-card/60 p-4 shadow-sm backdrop-blur sm:p-6">
          <Stats />
        </section>

        <section className="mt-10 space-y-10">
          <MissionValues />
          <HowItWorks />
          <Services />
          <Comparison />
          <ContractorCTA />
          <Testimonials />
          <FAQ />
        </section>

        <section className="my-12 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-6">
          <SubmitCTA />
        </section>
      </main>
      <Footer />
    </div>
  )
}
