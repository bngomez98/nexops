"use client"

import { Check, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const rows = [
  {
    feature: "Who coordinates your vendors",
    us: "Your dedicated NexOps partner",
    them: "Your property managers, on top of everything else",
  },
  {
    feature: "Workflow documentation",
    us: "Standardized, written, and accessible to your team",
    them: "Email threads, sticky notes, and institutional memory",
  },
  {
    feature: "Vendor relationship management",
    us: "Proactive, relationship-driven, handled by NexOps",
    them: "Reactive — called when something breaks",
  },
  {
    feature: "Operations continuity",
    us: "Documented processes that outlast any single employee",
    them: "Lost when a key team member leaves",
  },
  {
    feature: "Software + coordination",
    us: "Both included — platform built from your actual workflows",
    them: "Software you buy, then figure out how to use",
  },
  {
    feature: "Scalability",
    us: "Operations scale with your portfolio without adding overhead",
    them: "Coordination burden grows with every property added",
  },
  {
    feature: "Your existing vendor relationships",
    us: "We coordinate them — no replacement required",
    them: "You manage them yourself or switch platforms entirely",
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
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Why NexOps</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            Built differently from the start.
            <span className="gradient-text"> A partner, not just a tool.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Most solutions hand you software and expect your team to handle the rest. NexOps provides
            the coordination layer your portfolio actually needs — before, during, and after the platform launches.
            Other platforms sell your number to 5–15 contractors.
            <span className="gradient-text"> We send it to one.</span>
          </p>
          <p className="text-muted-foreground leading-relaxed">
            That contractor has seen your photos, your scope, and your budget before contacting you. They are already committed to the consultation window you selected.
          </p>
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl border border-border/40 overflow-hidden bg-card reveal" style={{ transitionDelay: "100ms" }}>
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-border/40 bg-secondary/30">
            <div className="py-4 px-6 text-sm font-semibold text-muted-foreground">Consideration</div>
            <div className="py-4 px-6 border-l border-border/40">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm font-bold text-primary">NexOps</span>
              </div>
            </div>
            <div className="py-4 px-6 border-l border-border/40 text-sm font-medium text-muted-foreground">
              Traditional Approach
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
            <p className="text-sm font-semibold text-foreground mb-0.5">The NexOps commitment</p>
            <p className="text-sm text-muted-foreground">
              One dedicated partner. Your vendor relationships, coordinated. Your workflows, documented.
              Your operations, running. We&apos;ll tell you immediately if we&apos;re not the right fit for your portfolio.
            </p>
            <p className="text-sm font-semibold text-foreground mb-0.5">What this means in practice</p>
            <p className="text-sm text-muted-foreground">
              One verified contractor contacts you — no one else. If coverage is unavailable in your area, we notify you immediately rather than leaving your request to expire unmatched.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
