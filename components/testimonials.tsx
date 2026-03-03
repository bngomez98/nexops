"use client"

import { useEffect, useRef, useState } from "react"
import { Quote, TrendingUp, Star } from "lucide-react"

const testimonials = [
  {
    quote: "Within two weeks of joining Nexus, I landed a full roof replacement. The homeowner already knew my name before I showed up, had photos ready, and knew exactly what they needed. I closed the deal on the first visit.",
    name: "Marcus T.",
    company: "MT Roofing Solutions",
    service: "Roofing",
    metric: "$14,200",
    metricLabel: "First project claimed",
  },
  {
    quote: "What sold me was the documentation. Every project comes with photos, a written scope, and a budget cap the homeowner already agreed to. I show up to a pre-qualified consultation. My close rate is through the roof.",
    name: "Denise K.",
    company: "Cornerstone Concrete & Flatwork",
    service: "Concrete Work",
    metric: "~80%",
    metricLabel: "Close rate on claimed projects",
  },
  {
    quote: "I pay one flat membership and every project I claim is mine. No one else calls that homeowner. The jobs are well-documented, the customers are prepared, and I can focus on doing great work.",
    name: "Ray A.",
    company: "Apex Tree & Land Services",
    service: "Tree Removal",
    metric: "$299/mo",
    metricLabel: "Flat membership, unlimited projects",
  },
]

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeCard, setActiveCard] = useState<number | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((node, i) => {
            setTimeout(() => node.classList.add("in-view"), i * 120)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-12 reveal">
          <p className="section-label mb-4">From our contractors</p>
          <h2 className="text-4xl lg:text-5xl font-display mb-4 leading-[1.05]">
            What contractors experience in the Nexus network
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every project is exclusively theirs the moment they claim it. Full documentation upfront.
            Flat monthly membership with unlimited project claims.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="reveal relative flex flex-col p-6 rounded-xl bg-card border border-border transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
              style={{ transitionDelay: `${i * 120}ms` }}
              onMouseEnter={() => setActiveCard(i)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <blockquote className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="border-t border-border pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.company}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 text-xs font-medium rounded-md bg-primary/10 text-primary">
                      {t.service}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1 mb-0.5">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      <span className="text-lg font-bold tabular-nums text-foreground">{t.metric}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight max-w-[100px] text-right">
                      {t.metricLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="mt-6 p-5 rounded-xl bg-foreground text-background flex flex-col sm:flex-row items-start sm:items-center gap-4 reveal" style={{ transitionDelay: "360ms" }}>
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary shrink-0">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-background mb-0.5">
              Exclusive project ownership at every tier.
            </p>
            <p className="text-sm text-background/60">
              The moment a contractor claims a project, it is exclusively theirs. The homeowner hears from exactly one professional.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
