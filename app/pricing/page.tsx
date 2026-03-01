import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, Sparkles } from "lucide-react"
"use client"

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
    q: "Are there any per-project fees on top of my subscription?",
    a: "No. Your monthly membership is the only charge. You can claim as many projects as you can handle with no additional cost per claim.",
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
            <div className="max-w-2xl">
              <p className="text-primary text-sm font-medium tracking-wide mb-4">Membership plans</p>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight mb-4">
                One price. Unlimited projects.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every tier includes unlimited project claims with no per-project fees, no annual contracts,
                and no cancellation penalties. Higher tiers add advance notification windows and priority
                access to high-value projects.
              </p>
            </div>
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
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative p-8 rounded-2xl border flex flex-col ${
                    tier.highlighted
                      ? "bg-primary/5 border-primary/30 shadow-xl shadow-primary/5"
                      : "bg-card border-border/40"
                  }`}
                >
                  {tier.badge && (
                    <span className="absolute -top-3 left-8 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground bg-primary px-3 py-1 rounded-full">
                      {tier.badge}
                    </span>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-4xl font-bold tracking-tight" style={{ color: "var(--primary)" }}>
                        {tier.price}
                      </span>
                      <span className="text-sm text-muted-foreground">{tier.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tier.description}</p>
                  </div>

                  <ul className="flex flex-col gap-3 mb-8 flex-grow">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                      tier.highlighted
                        ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Guarantee strip */}
            <div className="mt-8 p-5 rounded-xl border border-border/40 bg-card/50 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Check className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">No lock-in.</span> Cancel anytime from your
                dashboard. Your account remains active through the end of the current billing period.
                No cancellation fees.
              </p>
            </div>
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

        {/* Free for homeowners */}
        <section className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Homeowners never pay to use Nexus Operations</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
              Submitting a project request and receiving a contractor match is free for homeowners.
              Nexus Operations is funded entirely by contractor memberships.
            </p>
            <Link
              href="/login?tab=signup"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
            >
              Submit a Request — It's Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
