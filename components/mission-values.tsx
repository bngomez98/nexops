"use client"

import { useEffect, useRef } from "react"
import { ShieldCheck, FileCheck2, BadgeCheck, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"

const principles = [
  {
    label: "Exclusivity is structural",
    body: "As soon as one contractor claims a project, it is automatically removed from all other contractor feeds.",
    icon: ShieldCheck,
    accent: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
  },
  {
    label: "Documentation is automatic",
    body: "Submission, consultation, estimate, project completion, and review are all timestamped in one project trail.",
    icon: FileCheck2,
    accent: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
  },
  {
    label: "Verification is mandatory",
    body: "Contractors must pass license, insurance, and background checks before they can view any project.",
    icon: BadgeCheck,
    accent: "from-violet-500/20 to-violet-500/5 border-violet-500/30",
  },
  {
    label: "Transparency before contact",
    body: "Budget ceilings, photos, and scope are captured up front so every conversation starts with full context.",
    icon: Eye,
    accent: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
  },
]

const flow = ["Project submitted", "Contractor matched", "Consultation confirmed", "Work completed", "Post review logged"]

export function MissionValues() {
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
      { threshold: 0.08 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-28 lg:py-40 border-b-2 border-foreground bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Top: mission narrative */}
        <div className="reveal mb-20 lg:mb-28 max-w-4xl">
          <div className="construct-label mb-8">Why Nexus Exists</div>
          <h2 className="text-4xl lg:text-6xl font-display uppercase leading-[1.0] mb-8 text-balance">
            Built around the principle that a property owner
            {" "}deserves one expert — not a crowd.
          </h2>
          {/* Bold red accent bar */}
          <div className="h-1 w-24 bg-primary mb-8" />
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed max-w-3xl">
            <p>
              Nexus Operations was founded on a straightforward premise: property owners and managers
              deserve a structured, accountable path to getting work done. One submission.
              One verified professional. A documented outcome.
            </p>
            <p>
              That structure protects everyone involved. The property owner works with a single contractor
              who has studied their project before arriving. The contractor invests their time in a project
              already matched to their capabilities — with full information, no surprises, and a defined scope.
            </p>
            <p className="font-bold text-foreground">
              Every feature of this platform flows from that principle.
              Exclusivity, verification, documentation, and the Post Implementation Review are not additions
              to the model — they are the model.
            </p>
          </div>
        </div>

        {/* Divider with label */}
        <div className="reveal flex items-center gap-4 mb-16">
          <div className="h-0.5 flex-1 bg-foreground/20" />
          <span className="text-[10px] font-black tracking-[0.25em] uppercase text-muted-foreground shrink-0">Core Principles</span>
          <div className="h-0.5 flex-1 bg-foreground/20" />
        </div>

        {/* Principles — editorial list */}
        <div className="space-y-0">
          {principles.map((p, i) => (
            <div
              key={p.label}
              className="reveal border-t-2 border-foreground/20 py-10 last:border-b-2 flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-16"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="lg:w-80 shrink-0 flex items-start gap-3">
                <span className="text-xs font-black font-mono text-primary mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-base font-black text-foreground leading-snug uppercase tracking-tight">{p.label}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-12 rounded-2xl border border-primary/25 bg-primary/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-foreground/90">See how these principles are enforced in every request lifecycle.</p>
          <Link href="/#how-it-works" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            Explore the process
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Pull quote — constructivist bold style */}
        <div className="reveal mt-20 border-l-4 border-primary pl-8 max-w-3xl" style={{ transitionDelay: "360ms" }}>
          <blockquote className="text-xl lg:text-2xl font-bold text-foreground leading-relaxed mb-4">
            &ldquo;Nexus is not just an app. We are a coordination partner — purpose-built to give property owners a professional, documented, and fully accountable path from problem to resolution.&rdquo;
          </blockquote>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Brianna Gomez &mdash; Chief Executive Member, Founder
          </p>
        </div>
      </div>
    </section>
  )
}
