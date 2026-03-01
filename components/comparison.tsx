"use client"

import { useEffect, useRef } from "react"
import { Check, X } from "lucide-react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const rows = [
  {
    item: "Who contacts the property owner",
    nexus: "One contractor — exclusively assigned",
    others: "4–8 contractors calling simultaneously",
  },
  {
    item: "What the contractor knows before showing up",
    nexus: "Photos, written scope, full budget ceiling",
    others: "Nothing — they learn it on the call",
  },
  {
    item: "Budget transparency",
    nexus: "Set by property owner before any contractor is notified",
    others: "Discussed live, subject to negotiation",
  },
  {
    item: "Cost to property owners",
    nexus: "Free — always",
    others: "Varies; some charge listing or platform fees",
  },
  {
    item: "Documentation produced",
    nexus: "Complete timestamped audit trail on every project",
    others: "None — no record unless you create it yourself",
  },
  {
    item: "Contractor verification",
    nexus: "License, insurance, background check — all three required",
    others: "Self-reported credentials, sometimes unverified",
  },
  {
    item: "Post-project insight",
    nexus: "Post Implementation Review delivered after every job",
    others: "A review form, if you remember to fill it out",
  },
]

export function Comparison() {
  const sectionRef = useRef<HTMLElement>(null)

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
      { threshold: 0.05 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-28 lg:py-40 bg-card/20 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="reveal mb-16 lg:mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-10 bg-primary shrink-0" />
            <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">What You Actually Get</p>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] text-balance max-w-2xl">
              What changes when exclusivity is the foundation — not a feature.
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm text-[15px]">
              Every item below is structural, not a policy statement.
              It is the way the platform works by design.
            </p>
          </div>
        </div>

        {/* Comparison table — editorial list */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left pb-4 text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground w-1/3">What we're comparing</th>
                <th className="text-left pb-4 pl-8 text-xs font-semibold tracking-[0.14em] uppercase text-primary w-1/3">Nexus Operations</th>
                <th className="text-left pb-4 pl-8 text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground/60 w-1/3">Other Platforms</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.item}
                  className={`reveal border-b border-border/30 last:border-0 ${i % 2 === 0 ? "bg-transparent" : "bg-card/40"}`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <td className="py-6 pr-8 text-sm font-medium text-foreground/80 align-top leading-snug">{row.item}</td>
                  <td className="py-6 px-8 align-top">
                    <div className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground leading-snug">{row.nexus}</span>
                    </div>
                  </td>
                  <td className="py-6 pl-8 align-top">
                    <div className="flex items-start gap-2.5">
                      <X className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground leading-snug">{row.others}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA nudge */}
        <div className="reveal mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Link
            href="/dashboard/homeowner/new"
            className="btn-shimmer inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/20"
          >
            Submit a Project
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-sm text-muted-foreground">Free for homeowners and property managers. No account required to start.</p>
        </div>
      </div>
    </section>
  )
}
