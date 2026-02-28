"use client"

import { Check } from "lucide-react"
import { useEffect, useRef } from "react"

const features = [
  {
    feature: "One contractor per project",
    detail:
      "Each project is assigned to a single verified contractor. Once claimed, it is removed from all other feeds permanently.",
  },
  {
    feature: "Free for property owners",
    detail:
      "There is no cost to submit a project or receive a match. The platform is funded entirely through contractor memberships.",
  },
  {
    feature: "Budget set before assignment",
    detail:
      "Property owners define their maximum budget during submission — before any contractor is involved.",
  },
  {
    feature: "Full documentation collected upfront",
    detail:
      "Photographs, a written scope, and the confirmed budget are gathered before any contractor sees the request.",
  },
  {
    feature: "Scheduling handled at submission",
    detail:
      "Property owners select preferred consultation windows when they submit — no back-and-forth required.",
  },
  {
    feature: "Verified credentials on every contractor",
    detail:
      "Every contractor in the network has passed license verification, insurance confirmation, and a background check.",
  },
  {
    feature: "One call. That's it.",
    detail:
      "Only the assigned contractor will reach out — one professional, for the project that belongs to them.",
  },
  {
    feature: "Post Implementation Review",
    detail:
      "After every project, Nexus delivers a Post Implementation Review evaluating outcomes and providing insights for future decisions.",
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
        style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-12 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">What you get</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            What every project includes.
            <span className="gradient-text"> From submission to consultation.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every project submitted through Nexus Operations is assigned to one verified contractor.
            That contractor has seen your photos, your scope, and your budget before contacting you —
            and is already committed to the consultation window you selected.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 reveal" style={{ transitionDelay: "100ms" }}>
          {features.map((item) => (
            <div
              key={item.feature}
              className="flex items-start gap-4 p-5 rounded-xl border border-border/40 bg-card hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20 shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{item.feature}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
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
            <p className="text-sm font-semibold text-foreground mb-0.5">The Nexus commitment</p>
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
