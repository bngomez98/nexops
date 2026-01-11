import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Pricing } from "@/components/pricing"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Pricing | Nexus Operations",
  description:
    "Transparent, fixed pricing for product sourcing, project coordination, and professional support services.",
}

export default function PricingPage() {
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
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
