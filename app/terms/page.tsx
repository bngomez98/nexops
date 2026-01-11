import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Terms of Service | Nexus Operations",
  description: "Terms of service for Nexus Operations, LLC",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <h1 className="font-serif text-5xl font-light mb-8">Terms of Service</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground">Last updated: January 2025</p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">Service Agreement</h2>
            <p>
              By engaging Nexus Operations, LLC for services, you agree to these terms. All services are provided with
              transparent pricing and clear deliverables outlined in project agreements.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">Service Delivery</h2>
            <p>
              We commit to same-day response for all inquiries and will provide estimated timelines for each project.
              Specific deliverables, pricing, and timelines are confirmed before work begins.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">Payment Terms</h2>
            <p>
              Payment terms are specified in each project agreement. Standard terms include 50% upfront for projects
              over $500, with the remainder due upon completion. Hourly services are billed weekly.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">Cancellation Policy</h2>
            <p>
              Projects can be cancelled with 24 hours notice. Work completed up to the cancellation point will be billed
              at the agreed rate. Deposits are non-refundable once work has commenced.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">Limitation of Liability</h2>
            <p>
              Nexus Operations, LLC acts as a coordination and sourcing service. We vet vendors and coordinate services
              but are not liable for the performance of third-party vendors. We stand behind our coordination and will
              work to resolve any issues.
            </p>

            <h2 className="font-serif text-3xl font-semibold mt-12 mb-4">Contact</h2>
            <p>For questions about these terms, contact us at admin@nexusoperations.org or call (913) 951-1711.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
