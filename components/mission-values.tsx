"use client"

import { useEffect, useRef } from "react"
import { ShieldCheck, FileCheck2, BadgeCheck, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"

const principles = [
  {
    label: "Exclusivity is structural",
    body: "As soon as one contractor claims a project, it is automatically removed from all other contractor feeds.",
    icon: ShieldCheck,
  },
  {
    label: "Documentation is automatic",
    body: "Submission, consultation, estimate, project completion, and review are all timestamped in one project trail.",
    icon: FileCheck2,
  },
  {
    label: "Verification is mandatory",
    body: "Contractors must pass license, insurance, and background checks before they can view any project.",
    icon: BadgeCheck,
  },
  {
    label: "Transparency before contact",
    body: "Budget ceilings, photos, and scope are captured up front so every conversation starts with full context.",
    icon: Eye,
  },
]

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
    <section ref={sectionRef} className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Mission narrative */}
        <div className="reveal mb-16 lg:mb-20 max-w-3xl">
          <p className="section-label mb-4">Why Nexus Exists</p>
          <h2 className="text-4xl lg:text-5xl font-display leading-[1.05] mb-6 text-balance">
            Built around the principle that a property owner
            deserves one expert — not a crowd.
          </h2>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              Nexus Operations was founded on a straightforward premise: property owners and managers
              deserve a structured, accountable path to getting work done.
            </p>
            <p className="font-medium text-foreground">
              Every feature of this platform flows from that principle.
              Exclusivity, verification, documentation, and the Post Implementation Review are not additions
              to the model — they are the model.
            </p>
          </div>
        </div>

        {/* Principles */}
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {principles.map((p, i) => {
            const Icon = p.icon
            return (
              <div
                key={p.label}
                className="reveal group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">{p.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            )
          })}
        </div>

        {/* Pull quote */}
        <div className="reveal border-l-2 border-primary/40 pl-6 max-w-3xl" style={{ transitionDelay: "360ms" }}>
          <blockquote className="text-xl lg:text-2xl font-medium text-foreground leading-relaxed mb-3 italic">
            &ldquo;Nexus is not just an app. We are a coordination partner — purpose-built to give property owners a professional, documented, and fully accountable path from problem to resolution.&rdquo;
          </blockquote>
          <p className="text-sm text-muted-foreground font-medium">
            Brianna Gomez — Chief Executive Member, Founder
          </p>
        </div>

        {/* CTA */}
        <div className="reveal mt-10 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-foreground">See how these principles are enforced in every request lifecycle.</p>
          <Link href="/#how-it-works" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            Explore the process
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
