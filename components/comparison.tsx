"use client"

import { Check, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const rows = [
  { feature: "Lead exclusivity", us: "One contractor per request, always", them: "3–7 contractors competing for the same lead" },
  { feature: "Homeowner cost", us: "Free — no hidden fees, ever", them: "Technically free, but your data gets sold" },
  { feature: "Budget transparency", us: "Homeowner sets a cap before matching", them: "Contractor guesses after visiting the site" },
  { feature: "Project documentation", us: "Photos + specs required before match", them: "Optional, often absent" },
  { feature: "Consultation scheduling", us: "Pre-confirmed by homeowner at submission", them: "Phone tag, voicemails, missed calls" },
  { feature: "Contractor vetting", us: "License, insurance, and background verified", them: "Self-reported; varies widely by platform" },
  { feature: "Inbound contact volume", us: "One contractor reaches out", them: "5–15 contractor calls within the first hour" },
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
            setTimeout(() => node.classList.add("in-view"), i * 70)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 relative overflow-hidden">
      <div
        className="absolute right-0 bottom-0 w-[450px] h-[450px] rounded-full pointer-events-none opacity-[0.025]"
        style={{ background: "radial-gradient(circle, oklch(0.76 0.17 158), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-14 reveal">
          <p className="section-overline mb-4">Why Nexus Operations</p>
          <h2 className="text-3xl lg:text-[2.5rem] font-bold tracking-[-0.02em] leading-[1.12] mb-5">
            The old model ran on volume.
            <br />
            <span className="gradient-text">Ours runs on outcomes.</span>
          </h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Traditional platforms generate revenue by distributing your contact information to as many contractors as
            possible — routinely 5 to 15 per request. The result is an inbox flooded with calls, a race to the bottom
            on pricing, and an experience that disadvantages everyone. We rejected that model from day one.
          </p>
        </div>

        {/* Comparison table */}
        <div className="reveal overflow-x-auto" style={{ transitionDelay: "80ms" }}>
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-4 pr-8 text-[13px] font-medium text-muted-foreground w-[220px]">Feature</th>
                <th className="text-left py-4 pr-8">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[13px] font-bold text-primary">Nexus Operations</span>
                  </div>
                </th>
                <th className="text-left py-4 text-[13px] font-medium text-muted-foreground">
                  Traditional Platforms
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-border/20 last:border-0 transition-colors duration-150 cursor-default ${
                    hoveredRow === i ? "bg-secondary/15" : ""
                  }`}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="py-4 pr-8 text-[13px] text-foreground/65 align-top">{row.feature}</td>
                  <td className="py-4 pr-8 align-top">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`flex items-center justify-center w-4.5 h-4.5 rounded-full bg-primary/10 border border-primary/25 shrink-0 mt-0.5 transition-transform duration-200 ${
                          hoveredRow === i ? "scale-110" : ""
                        }`}
                      >
                        <Check className="h-2.5 w-2.5 text-primary" />
                      </div>
                      <span className="text-[13px] font-medium leading-relaxed">{row.us}</span>
                    </div>
                  </td>
                  <td className="py-4 align-top">
                    <div className="flex items-start gap-2.5">
                      <div className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-secondary shrink-0 mt-0.5">
                        <X className="h-2.5 w-2.5 text-muted-foreground/45" />
                      </div>
                      <span className="text-[13px] text-muted-foreground leading-relaxed">{row.them}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Commitment callout */}
        <div
          className="mt-8 pl-6 border-l-2 border-primary/35 reveal"
          style={{ transitionDelay: "160ms" }}
        >
          <p className="text-[13px] font-semibold text-foreground mb-1">The Nexus Commitment</p>
          <p className="text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
            One request. One verified contractor. Zero unsolicited calls. No platform has the right to sell your
            contact information to seven people and call that a service. If no qualified contractor is available
            in your area, we tell you immediately — no indefinite wait, no ambiguity.
          </p>
        </div>
      </div>
    </section>
  )
}
