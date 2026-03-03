"use client"

import Link from "next/link"
import { ArrowRight, Lock, BookOpen, CreditCard } from "lucide-react"
import { useEffect, useRef } from "react"

const benefits = [
  {
    icon: Lock,
    label: "No cost to join.",
    body: "Joining the Nexus network is free for licensed, insured contractors. Verification, onboarding, and full platform access carry no upfront or ongoing fees.",
  },
  {
    icon: BookOpen,
    label: "Claim projects instantly.",
    body: "When a homeowner submits a project, you see the full scope, photographs, and budget ceiling. The first verified contractor to claim it owns it — exclusively and permanently.",
  },
  {
    icon: CreditCard,
    label: "Show up prepared.",
    body: "Every project includes 2–10 photographs, a written scope, and a confirmed consultation window. You arrive informed. The homeowner expects a professional conversation from the first minute.",
  },
]

const panels = [
  {
    heading: "Exclusively assigned.",
    body: "The moment you claim a project, it is closed to every other contractor permanently. You own the relationship from claim through completion — with the homeowner's full attention.",
  },
  {
    heading: "Fully informed before you commit.",
    body: "You review the homeowner's photographs, written scope, and budget ceiling before claiming. Every consultation begins with complete information already in hand.",
  },
  {
    heading: "One flat membership.",
    body: "One monthly fee covers unlimited project claims — no per-project costs, no variable pricing based on project size or location. Predictable overhead.",
  },
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
    <section ref={sectionRef} id="contractor-cta" className="py-28 lg:py-40 border-b-2 border-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Top header */}
        <div className="reveal mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="construct-label">For Contractors</div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-6xl font-display uppercase leading-[1.0] mb-6 text-balance">
                Every project you claim is yours — from submission to completion.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join the Nexus network and work exclusively on projects matched to your capabilities.
                You review the full scope, photographs, and budget ceiling before committing.
                One flat monthly membership. Unlimited project claims. Full information before every consultation.
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 construct-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-none transition-all duration-150 shrink-0 self-start lg:self-end"
            >
              Apply to Join the Network
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* What contractors get — panel grid */}
        <div className="reveal border-t-2 border-foreground/20 pt-12 mb-16">
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-10">What changes when you join</p>
          <div className="grid lg:grid-cols-3 gap-px bg-foreground/15">
            {panels.map((p, i) => (
              <div
                key={p.heading}
                className="group relative bg-background p-8 overflow-hidden hover:bg-secondary transition-colors duration-200"
              >
                {/* Red top accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="w-10 h-10 border-2 border-primary bg-primary flex items-center justify-center mb-5">
                  <span className="text-xs font-black text-primary-foreground font-mono">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="text-xl font-black mb-3 text-foreground uppercase tracking-tight">{p.heading}</p>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Free benefits */}
        <div className="reveal">
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-8">What you get</p>
          <div className="flex flex-col lg:flex-row gap-px bg-foreground/15">
            {benefits.map((b) => (
              <div key={b.label} className="flex-1 p-8 bg-background flex gap-5">
                <div className="w-10 h-10 bg-foreground border-2 border-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <b.icon className="h-5 w-5 text-background" />
                </div>
                <div>
                  <p className="text-base font-black mb-2 text-foreground uppercase tracking-tight">{b.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 border-l-4 border-primary pl-3">
            Joining is free. Verification typically takes 3–5 business days.{" "}
            <Link href="/contact" className="text-primary hover:underline font-bold">Start your application</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
