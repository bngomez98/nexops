import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Services } from "@/components/services"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Service Categories | Home Services in Topeka, KS",
  description:
    "Nexus Operations covers residential trade categories in the Topeka, KS area including tree removal, concrete, roofing, HVAC, fencing, and electrical. Every request requires photos, a written scope, and a defined budget before a contractor is matched.",
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Page header */}
        <section className="pt-32 pb-6 lg:pt-40 lg:pb-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-primary text-sm font-medium tracking-wide mb-3">Service categories</p>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight mb-4">
                Residential trade categories in the Topeka area
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nexus Operations covers the highest-demand residential trades and expands based on
                verified contractor availability and homeowner demand. New categories are added only
                when enough qualified contractors exist in the area to meet our response and quality standards.
              </p>
            </div>
          </div>
        </section>

        <Services />

        {/* CTA section */}
        <section className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              Ready to submit your project?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
              Document your project with photos, a written scope, and a budget cap. We match you with one
              verified, insured contractor in your area — no competing bids, no unsolicited calls.
              Always free for homeowners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login?tab=signup"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                Submit a Request — Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/40 rounded-xl hover:border-border/70 hover:bg-secondary/50 transition-all duration-200"
              >
                Request a category
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
