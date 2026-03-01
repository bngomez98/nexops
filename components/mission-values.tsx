"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

const principles = [
  {
    label: "Exclusivity is the model.",
    body: "Not a feature, not a policy, not a setting you can toggle off. When a contractor claims a project, it is removed from every other contractor's view permanently. This is how the platform is built, not how it's marketed.",
  },
  {
    label: "Documentation is the default.",
    body: "Every project generates a complete, timestamped audit trail — from submission to consultation to estimate to completion to Post Implementation Review. No other platform delivers this automatically.",
  },
  {
    label: "Verification is mandatory.",
    body: "No contractor accesses the platform without license verification, insurance confirmation, and a background check. Not recommended — mandatory. The network means nothing if you can't trust who's in it.",
  },
  {
    label: "Transparency before contact.",
    body: "Budget ceilings are set by property owners before any contractor is notified. Contractors see the complete scope, photos, and budget before they decide to claim. No surprises for either party.",
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

        {/* Top: problem statement narrative */}
        <div className="reveal mb-20 lg:mb-28 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-10 bg-primary shrink-0" />
            <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">Why Nexus Exists</p>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] mb-8 text-balance">
            The existing platforms cannot fix their own model.
            <br className="hidden lg:block" />
            {" "}We built a different one.
          </h2>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed max-w-3xl">
            <p>
              A property manager submits a roofing repair. Within minutes, six contractors call — all paid for the same lead.
              None of them have complete information. The manager repeats the same description six times, fields competing sales pitches,
              and chooses based on whoever sounds most convincing. No documentation. No audit trail. No accountability.
            </p>
            <p>
              A licensed contractor pays $60 for a lead, discovers three others are calling simultaneously,
              invests 40 minutes chasing a project, and loses to someone who quoted $200 less.
              They paid for a one-in-four chance and got nothing.
            </p>
            <p className="font-medium text-foreground/90">
              This isn&rsquo;t a design problem. It&rsquo;s an incentive problem.
              Those platforms profit by selling the same lead to as many contractors as possible.
              They cannot introduce exclusivity without eliminating the majority of their revenue.
              Their business model cannot be fixed from inside. It must be replaced.
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
            &ldquo;Nexus is not just an app. We are a partner with a human-centered approach — and a structural advantage that no existing platform can replicate without destroying their own business model.&rdquo;
          </blockquote>
          <p className="text-sm text-muted-foreground">
            Brianna Gomez &mdash; Chief Executive Member, Founder
          </p>
        </div>
      </div>
    </section>
  )
}
