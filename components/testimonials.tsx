"use client"

import { useState } from "react"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Jason M.",
    role: "Roofing Contractor",
    quote:
      "The project briefs are complete before we claim. That alone removed half the back-and-forth from our week.",
      "Within two weeks of joining Nexus, I landed a full roof replacement. The homeowner already knew my name before I showed up, had photos ready, and knew exactly what they needed. I showed up prepared and closed the deal on the first visit.",
    name: "Marcus T.",
    company: "MT Roofing Solutions",
    service: "Roofing",
    metric: "$14,200",
    metricLabel: "First project claimed",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    name: "Elena R.",
    role: "Property Operations Director",
    quote:
      "We finally have consistent response targets and one dashboard to track what was assigned, accepted, and completed.",
      "What sold me was the documentation. Every project comes with photos, a written scope, and a budget cap the homeowner already agreed to. I show up to a pre-qualified consultation with everything I need. My close rate is through the roof.",
    name: "Denise K.",
    company: "Cornerstone Concrete & Flatwork",
    service: "Concrete Work",
    metric: "~80%",
    metricLabel: "Close rate on claimed projects",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    name: "Chris D.",
    role: "General Contractor",
    quote:
      "No lead auctions, no surprise fees. We claim the projects that fit and move straight to consultation.",
      "I pay one flat membership and every project I claim is mine. No one else calls that homeowner. The jobs I get are well-documented, the customers are prepared, and I can focus on doing great work instead of chasing opportunities.",
    name: "Ray A.",
    company: "Apex Tree & Land Services",
    service: "Tree Removal",
    metric: "$299/mo",
    metricLabel: "Flat membership, unlimited projects",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
]

export function Testimonials() {
  const [active, setActive] = useState<number | null>(0)

  return (
    <section className="py-24 lg:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Operator feedback</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">What teams notice first</h2>
          <p className="text-muted-foreground leading-relaxed">
            Faster handoff, cleaner communication, and better fit between project scope and contractor capability.
    <section ref={sectionRef} className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-14 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">From our contractors</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            What contractors experience in the Nexus network
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every project is exclusively theirs the moment they claim it. Full documentation upfront.
            Flat monthly membership with unlimited project claims.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <article
              key={t.name}
              onMouseEnter={() => setActive(i)}
              className={`rounded-2xl border p-6 transition-all duration-200 ${
                active === i ? "border-primary/40 bg-primary/5" : "border-border/40 bg-card"
              className={`reveal relative flex flex-col p-6 rounded-2xl border bg-card transition-all duration-300 cursor-default ${
                activeCard === i
                  ? "border-border/70 shadow-lg shadow-black/5 dark:shadow-black/20 translate-y-[-2px]"
                  : "border-border/40"
              }`}
            >
              <Quote className="h-5 w-5 text-primary mb-4" />
              <p className="text-sm text-foreground/85 leading-relaxed mb-6">“{t.quote}”</p>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Callout */}
        <div
          className="mt-10 p-5 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center gap-4 reveal"
          style={{ transitionDelay: "360ms" }}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-0.5">
              Exclusive project ownership at every tier.
            </p>
            <p className="text-sm text-muted-foreground">
              The moment a contractor claims a project, it is exclusively theirs. The homeowner hears from exactly one professional, and the contractor owns the relationship from start to finish.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
