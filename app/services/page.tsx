import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Services } from "@/components/services"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Services | Nexus Operations",
  description:
    "Product sourcing, vendor coordination, project management, and on-demand support for busy professionals.",
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
        <Services />
        <section className="py-20 bg-primary/5">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Tell us what you need. We'll respond same day with a plan and fixed pricing.
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/#contact">Request a Quote</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
