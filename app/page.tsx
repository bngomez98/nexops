import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Services } from "@/components/services"
import { ServicePackages } from "@/components/service-packages"
import { Pricing } from "@/components/pricing"
import { SuccessStories } from "@/components/success-stories"
import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Services />
        <ServicePackages />
        <Pricing />
        <SuccessStories />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
