"use client"

import { useEffect, useRef, useState } from "react"
import { Quote, TrendingUp, Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "I was skeptical at first — I'd been burned by services that sent the same lead to seven other contractors. Within two weeks of joining Nexus, I landed a full roof replacement I never would have seen otherwise. The homeowner already had my information before I arrived.",
    name: "Marcus T.",
    company: "MT Roofing Solutions",
    service: "Roofing",
    metric: "$14,200",
    metricLabel: "First job landed",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    quote:
      "What convinced me was the documentation. Every project comes with photos, a written scope, and a budget cap the homeowner already agreed to. I'm not driving out to give a quote on a job that was never real — I'm showing up to a pre-qualified consultation with all the information I need.",
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
    quote:
      "I spent years competing for shared leads on the big platforms. Now I pay one flat membership and every project I claim is assigned exclusively to me. No one else contacts that homeowner. The projects I'm getting are larger and the customers are better prepared going into the consultation.",
    name: "Ray A.",
    company: "Apex Tree & Land Services",
    service: "Tree Removal",
    metric: "$299/mo",
    metricLabel: "Flat membership, no per-lead fees",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
]

function StarRow() {
  return (
    <div className="flex items-center gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

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
    <section ref={sectionRef} className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-14 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">From our contractors</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            What contractors receive
            <span className="gradient-text"> through Nexus Operations.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Projects are exclusively assigned upon claiming. Full documentation is included. There are no per-lead fees.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`reveal relative flex flex-col p-6 rounded-2xl border bg-card transition-all duration-300 cursor-default ${
                activeCard === i
                  ? "border-border/70 shadow-lg shadow-black/20 translate-y-[-2px]"
                  : "border-border/40"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
              onMouseEnter={() => setActiveCard(i)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Quote icon */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl ${t.bg} border ${t.border} mb-5 transition-transform duration-300 ${activeCard === i ? "scale-110" : ""}`}
              >
                <Quote className={`h-4 w-4 ${t.color}`} />
              </div>

              <StarRow />

              <blockquote className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Divider */}
              <div className="border-t border-border/30 pt-5">
                <div className="flex items-start justify-between gap-3">
                  {/* Author */}
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.company}</p>
                    <span
                      className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${t.bg} ${t.color} border ${t.border}`}
                    >
                      {t.service}
                    </span>
                  </div>

                  {/* Metric */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1 mb-0.5">
                      <TrendingUp className={`h-3.5 w-3.5 ${t.color}`} />
                      <span className={`text-lg font-bold tabular-nums ${t.color}`}>{t.metric}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight max-w-[100px] text-right">
                      {t.metricLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
              Leads are not shared across contractors, regardless of membership tier.
            </p>
            <p className="text-sm text-muted-foreground">
              The moment a contractor claims a project, it is removed from every other contractor&apos;s feed and cannot be reclaimed. The homeowner hears from exactly one professional.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
