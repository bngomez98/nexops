import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, Sparkles } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Membership Plans",
  description: "Flat monthly contractor memberships with transparent pricing and no per-lead fees.",
}

const tiers = [
  {
    name: "Standard",
    price: "$299",
    perks: ["Unlimited claims", "Real-time alerts", "Core performance dashboard"],
  },
  {
    name: "Premium",
    price: "$499",
    perks: ["Everything in Standard", "Priority windows", "Advanced analytics and filters"],
    featured: true,
  },
  {
    name: "Elite",
    price: "$749",
    perks: ["Everything in Premium", "Dedicated support channel", "Priority high-value routing"],
  },
]

const faqs = [
  {
    q: "Are there per-lead charges?",
    a: "No. Billing is membership-based, so claim volume does not add additional lead fees.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. Tier updates can be requested at any time and are reflected in the next billing cycle.",
  },
  {
    q: "Who pays for homeowner requests?",
    a: "Homeowners are not charged to submit requests through the platform.",
  },
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
              One subscription model, predictable costs, and clear feature progression by growth stage.
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
                <p className="text-3xl font-semibold mb-5">
                  {tier.price}
                  <span className="text-sm text-muted-foreground">/month</span>
                </p>
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

        <section className="pb-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="rounded-2xl border border-border/40 bg-card p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-xl font-semibold">Pricing FAQ</h2>
              </div>
              <div className="space-y-5">
                {faqs.map((item) => (
                  <div key={item.q}>
                    <h3 className="text-sm font-semibold mb-1.5">{item.q}</h3>
                    <p className="text-sm text-muted-foreground">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
