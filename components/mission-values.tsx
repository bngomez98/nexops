"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

const principles = [
  {
    label: "Exclusivity is structural.",
    body: "When a contractor claims a project, it is removed from every other contractor's view immediately and permanently. This is how the platform is built — a technical constraint, not a policy statement.",
  },
  {
    label: "Documentation is the default.",
    body: "Every project generates a complete, timestamped audit trail — from submission through consultation, estimate, execution, and Post Implementation Review. It lives in your account automatically, without any action on your part.",
  },
  {
    label: "Verification is mandatory.",
    body: "No contractor accesses the platform without license verification, insurance confirmation, and a background check. All three are required before a contractor views a single project. The integrity of the network depends on it.",
  },
  {
    label: "Transparency before contact.",
    body: "Budget ceilings are set by property owners before any contractor is notified. Contractors see the complete scope, photographs, and budget before they decide to claim. Every party enters the relationship informed.",
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
    <section ref={sectionRef} className="py-28 lg:py-40 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Top: mission narrative */}
        <div className="reveal mb-20 lg:mb-28 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-10 bg-primary shrink-0" />
            <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">Why Nexus Exists</p>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] mb-8 text-balance">
            Built around the principle that a property owner
            <br className="hidden lg:block" />
            {" "}deserves one expert — not a crowd.
          </h2>
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
            <p className="font-medium text-foreground/90">
              Every feature of this platform flows from that principle.
              Exclusivity, verification, documentation, and the Post Implementation Review are not additions
              to the model — they are the model.
            </p>
          </div>
        </div>

        {/* Divider with label */}
        <div className="reveal flex items-center gap-4 mb-16">
          <div className="h-px flex-1 bg-border/40" />
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground shrink-0">Core Principles</span>
          <div className="h-px flex-1 bg-border/40" />
        </div>

        {/* Principles — editorial list */}
        <div className="space-y-0">
          {principles.map((p, i) => (
            <div
              key={p.label}
              className="reveal border-t border-border/40 py-10 last:border-b flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-16"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="lg:w-80 shrink-0">
                <h3 className="text-base font-bold text-foreground leading-snug">{p.label}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-[15px] max-w-2xl">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <div className="reveal mt-20 border-l-4 border-primary pl-8 max-w-3xl" style={{ transitionDelay: "360ms" }}>
          <blockquote className="text-xl lg:text-2xl font-medium text-foreground/90 leading-relaxed mb-4">
            &ldquo;Nexus is not just an app. We are a coordination partner — purpose-built to give property owners a professional, documented, and fully accountable path from problem to resolution.&rdquo;
          </blockquote>
          <p className="text-sm text-muted-foreground">
            Brianna Gomez &mdash; Chief Executive Member, Founder
          </p>
        </div>
      </div>
    </section>
  )
}
