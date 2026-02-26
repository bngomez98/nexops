"use client"

import { useState } from "react"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Jason M.",
    role: "Roofing Contractor",
    quote:
      "The project briefs are complete before we claim. That alone removed half the back-and-forth from our week.",
  },
  {
    name: "Elena R.",
    role: "Property Operations Director",
    quote:
      "We finally have consistent response targets and one dashboard to track what was assigned, accepted, and completed.",
  },
  {
    name: "Chris D.",
    role: "General Contractor",
    quote:
      "No lead auctions, no surprise fees. We claim the projects that fit and move straight to consultation.",
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
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <article
              key={t.name}
              onMouseEnter={() => setActive(i)}
              className={`rounded-2xl border p-6 transition-all duration-200 ${
                active === i ? "border-primary/40 bg-primary/5" : "border-border/40 bg-card"
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
      </div>
    </section>
  )
}
