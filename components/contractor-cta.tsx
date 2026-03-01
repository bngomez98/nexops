"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef } from "react"

const tiers = [
  {
    name: "Standard",
    price: "$299",
    period: "/mo",
    description: "Unlimited project claims. No per-project fees. Ideal for contractors building pipeline.",
  },
  {
    name: "Premium",
    price: "$499",
    period: "/mo",
    description: "Priority project visibility and enhanced profile placement within the network.",
    highlight: true,
  },
  {
    name: "Elite",
    price: "$749",
    period: "/mo",
    description: "Full network access, top-tier placement, and dedicated account coordination.",
  },
]

export function ContractorCTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((node, i) => {
            setTimeout(() => node.classList.add("in-view"), i * 90)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="contractor-cta" className="py-28 lg:py-40 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Top header */}
        <div className="reveal mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-10 bg-primary shrink-0" />
            <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">For Contractors</p>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] mb-6 text-balance">
                Stop paying per lead. Start owning every project you claim.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                When you join the Nexus network, every project you claim is yours alone. You see the scope, the photos,
                and the budget ceiling before you commit. The homeowner hears from exactly one professional: you.
                Flat monthly membership. Unlimited claims. No race to the bottom.
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-shimmer inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/20 shrink-0 self-start lg:self-end"
            >
              Apply to Join the Network
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* What contractors get — narrative list */}
        <div className="reveal border-t border-border/40 pt-12 mb-16">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-10">What changes when you join</p>
          <div className="grid lg:grid-cols-3 gap-px bg-border/40 border border-border/40 rounded-2xl overflow-hidden">
            <div className="bg-background p-8">
              <p className="text-2xl font-bold mb-3">Every project is yours.</p>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                The moment you claim a project, it vanishes from every other feed. No competing bids.
                No shared assignments. You own the relationship from claim through completion.
              </p>
            </div>
            <div className="bg-background p-8">
              <p className="text-2xl font-bold mb-3">Show up prepared.</p>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                You see the homeowner's photos, their written scope, and their budget ceiling before you commit.
                The consultation starts informed — not with you asking, "So what's the problem?"
              </p>
            </div>
            <div className="bg-background p-8">
              <p className="text-2xl font-bold mb-3">Predictable cost. No surprises.</p>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                One flat monthly membership. Claim as many projects as fit your schedule.
                No per-lead fees, no pay-to-win ranking, no hidden costs at checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Membership tiers */}
        <div className="reveal">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-8">Membership plans</p>
          <div className="flex flex-col lg:flex-row gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex-1 p-8 rounded-2xl border transition-colors ${
                  tier.highlight
                    ? "border-primary/50 bg-primary/5"
                    : "border-border/40 bg-card"
                }`}
              >
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-bold tracking-tight text-foreground font-mono">{tier.price}</span>
                  <span className="text-muted-foreground text-sm mb-1">{tier.period}</span>
                </div>
                <p className={`text-sm font-semibold mb-3 ${tier.highlight ? "text-primary" : "text-foreground"}`}>
                  {tier.name}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{tier.description}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            No cancellation penalties. No per-project fees. No limits on projects claimed.
            <Link href="/pricing" className="text-primary hover:underline ml-1">See full plan details</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
