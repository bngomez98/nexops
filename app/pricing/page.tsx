import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Membership Plans",
  description: "Flat monthly contractor memberships with transparent pricing and no per-lead fees.",
}

const tiers = [
  { name: "Standard", price: "$299", perks: ["Unlimited claims", "Real-time alerts", "Performance dashboard"] },
  { name: "Premium", price: "$499", perks: ["Everything in Standard", "Priority windows", "Advanced analytics"], featured: true },
  { name: "Elite", price: "$749", perks: ["Everything in Premium", "Dedicated support", "Priority high-value projects"] },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <p className="text-primary text-sm font-medium tracking-wide mb-3">Pricing</p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">Simple monthly access tiers</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              One subscription, unlimited claim volume, and no per-lead add-ons.
            </p>
          </div>
        </section>

        <section className="pb-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={`rounded-2xl border p-8 ${tier.featured ? "border-primary/40 bg-primary/5" : "border-border/40 bg-card"}`}
              >
                <h2 className="text-xl font-semibold mb-2">{tier.name}</h2>
                <p className="text-3xl font-semibold mb-5">{tier.price}<span className="text-sm text-muted-foreground">/month</span></p>
                <ul className="space-y-3 mb-8">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-foreground/85">
                      <Check className="h-4 w-4 text-primary" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80">
                  Apply now <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
