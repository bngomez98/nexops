"use client"

import { Check, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const rows = [
  {
    feature: "Who contacts the property owner",
    us: "Only one contractor contacts the property owner for each project",
    them: "Between 3 and 7 contractors may call about the same job",
  },
  {
    feature: "Cost to the property owner",
    us: "The service is free for property owners, with no hidden costs",
    them: "Services may appear free, but property owner information is often sold to contractors",
  },
  {
    feature: "Budget clarity",
    us: "Property owners set their maximum budget before any contractor is assigned",
    them: "Budget discussions typically occur only after a contractor arrives",
  },
  {
    feature: "Project documentation",
    us: "Photographs, a written scope, and the budget are collected before assignment",
    them: "Documentation is often incomplete or skipped",
  },
  {
    feature: "Scheduling",
    us: "Property owners select preferred times during submission",
    them: "Scheduling involves back-and-forth communications, voicemails, and potential missed connections",
  },
  {
    feature: "Contractor quality",
    us: "Contractors undergo license verification, insurance confirmation, and background checks",
    them: "Contractors often self-report their qualifications without independent verification",
  },
  {
    feature: "Expected contractor calls",
    us: "One call from the assigned contractor",
    them: "Between 5 and 15 calls may occur within the first hour",
  },
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
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Why Nexus Operations</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            Built differently from other platforms.
            <span className="gradient-text"> One contractor, not seven.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Many services share project details with multiple contractors, resulting in several
            inquiries for the same job. This platform assigns each project to only one contractor.
            The business model relies on contractor memberships rather than charging fees per project assignment.
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
            <p className="text-sm font-semibold text-foreground mb-0.5">The Nexus Operations commitment</p>
            <p className="text-sm text-muted-foreground">
              Each project request is assigned to one verified contractor. No unsolicited calls are
              made. If coverage is not available in a specific area, the platform notifies the
              property owner immediately.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
