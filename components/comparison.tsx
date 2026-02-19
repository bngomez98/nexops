"use client"

import { Check, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const rows = [
  { feature: "Lead exclusivity", us: "1 contractor per request", them: "3–7 contractors per lead" },
  { feature: "Homeowner cost", us: "Free, always", them: "$0 but your data is sold" },
  { feature: "Budget transparency", us: "Set upfront by homeowner", them: "Discovered after estimate visit" },
  { feature: "Photo documentation", us: "Required before match", them: "Optional or not available" },
  { feature: "Consultation scheduling", us: "Pre-scheduled, confirmed", them: "Phone tag and callbacks" },
  { feature: "Contractor verification", us: "License, insurance, background", them: "Varies by platform" },
  { feature: "Phone calls to homeowner", us: "1 contractor contacts you", them: "5–15 calls within hours" },
]

export function Comparison() {
  const sectionRef = useRef<HTMLElement>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((node, i) => {
            setTimeout(() => node.classList.add("in-view"), i * 80)
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
      <div
        className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-12 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Why Nexus</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            Built to fix what&apos;s broken in home services
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Traditional platforms sell your info to multiple contractors. You get bombarded with calls.
            Contractors waste time on shared leads with low conversion. We eliminate both problems.
          </p>
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl border border-border/40 overflow-hidden bg-card reveal" style={{ transitionDelay: "100ms" }}>
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-border/40 bg-secondary/30">
            <div className="py-4 px-6 text-sm font-semibold text-muted-foreground">Feature</div>
            <div className="py-4 px-6 border-l border-border/40">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm font-bold text-primary">Nexus Operations</span>
              </div>
            </div>
            <div className="py-4 px-6 border-l border-border/40 text-sm font-medium text-muted-foreground">
              Traditional Platforms
            </div>
          </div>

          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 border-b border-border/20 last:border-0 transition-colors duration-150 cursor-default ${
                hoveredRow === i ? "bg-secondary/20" : ""
              }`}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div className="py-4 px-6 text-sm text-foreground/80 flex items-center">
                {row.feature}
              </div>
              <div className={`py-4 px-6 border-l transition-colors duration-150 ${
                hoveredRow === i ? "border-primary/30" : "border-border/40"
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 border border-primary/20 shrink-0 transition-transform duration-200 ${hoveredRow === i ? "scale-110" : ""}`}>
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground font-medium">{row.us}</span>
                </div>
              </div>
              <div className="py-4 px-6 border-l border-border/40">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary shrink-0">
                    <X className="h-3 w-3 text-muted-foreground/50" />
                  </div>
                  <span className="text-sm text-muted-foreground">{row.them}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div
          className="mt-6 p-5 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center gap-4 reveal"
          style={{ transitionDelay: "200ms" }}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
            <Check className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-0.5">The Nexus Guarantee</p>
            <p className="text-sm text-muted-foreground">
              One request. One contractor. Zero spam calls. If we can&apos;t find a verified match, we notify you immediately — no waiting in limbo.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
