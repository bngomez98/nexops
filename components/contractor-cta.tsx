"use client"

import Link from "next/link"
import { ArrowRight, Lock, BookOpen, CreditCard } from "lucide-react"
import { useEffect, useRef } from "react"

const benefits = [
  { icon: Lock, label: "No cost to join.", body: "Joining the Nexus network is free for licensed, insured contractors. Verification, onboarding, and full platform access carry no upfront or ongoing fees." },
  { icon: BookOpen, label: "Claim projects instantly.", body: "When a homeowner submits a project, you see the full scope, photographs, and budget ceiling. The first verified contractor to claim it owns it — exclusively." },
  { icon: CreditCard, label: "Show up prepared.", body: "Every project includes 2-10 photographs, a written scope, and a confirmed consultation window. You arrive informed." },
]

const panels = [
  { heading: "Exclusively assigned.", body: "The moment you claim a project, it is closed to every other contractor permanently. You own the relationship from claim through completion." },
  { heading: "Fully informed before you commit.", body: "You review the homeowner's photographs, written scope, and budget ceiling before claiming. Every consultation begins with complete information." },
  { heading: "One flat membership.", body: "One monthly fee covers unlimited project claims — no per-project costs, no variable pricing. Predictable overhead." },
]

export function ContractorCTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((node, i) => {
            setTimeout(() => node.classList.add("in-view"), i * 90)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="contractor-cta" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="reveal mb-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <p className="section-label mb-4">For Contractors</p>
              <h2 className="text-4xl lg:text-5xl font-display leading-[1.05] mb-5 text-balance">
                Every project you claim is yours — from submission to completion.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join the Nexus network and work exclusively on projects matched to your capabilities.
                One flat monthly membership. Unlimited project claims.
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm shrink-0 self-start lg:self-end"
            >
              Apply to Join the Network
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Panels */}
        <div className="reveal border-t border-border pt-10 mb-14">
          <p className="text-sm font-medium text-muted-foreground mb-8">What changes when you join</p>
          <div className="grid lg:grid-cols-3 gap-5">
            {panels.map((p, i) => (
              <div key={p.heading} className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-sm font-bold text-primary font-mono">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="text-lg font-semibold mb-2">{p.heading}</p>
                <p className="text-muted-foreground leading-relaxed text-sm">{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="reveal">
          <p className="text-sm font-medium text-muted-foreground mb-6">What you get</p>
          <div className="grid lg:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <div key={b.label} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <b.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="font-semibold mb-1">{b.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 border-l-2 border-primary/30 pl-3">
            Joining is free. Verification typically takes 3-5 business days.{" "}
            <Link href="/contact" className="text-primary hover:underline font-medium">Start your application</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
