"use client"

import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "R. Alvarez",
    company: "Alvarez Roofing",
    quote:
      "The project details are complete before we claim. That removes wasted calls and helps us bid accurately.",
  },
  {
    name: "K. Turner",
    company: "Turner Concrete",
    quote:
      "The exclusivity model improved close rates immediately. We are no longer racing five contractors on the same lead.",
  },
  {
    name: "S. Morgan",
    company: "Morgan Property Services",
    quote:
      "Clear scope and one point of contact means smoother scheduling and fewer project handoff issues.",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Contractor feedback</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            What contractors report after switching to NexOps
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Contractors cite cleaner project intake, better conversion, and less time lost to duplicate lead competition.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="flex flex-col p-6 rounded-2xl border border-border/40 bg-card">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 mb-5">
                <Quote className="h-4 w-4 text-primary" />
              </div>
              <blockquote className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="border-t border-border/30 pt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
