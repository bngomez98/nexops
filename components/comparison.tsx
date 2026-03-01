"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const guarantees = [
  {
    label: "One contractor, exclusively assigned.",
    body: "The moment a contractor claims your project, it is closed to everyone else in the network. Your submission is not visible to any other contractor from that point forward. The relationship is yours alone.",
  },
  {
    label: "Complete project information, before any contact.",
    body: "Your photographs, written scope, and budget ceiling are shared with the assigned contractor before the consultation is confirmed. They arrive informed — not asking introductory questions that waste your time.",
  },
  {
    label: "Budget ceiling set by you, upfront.",
    body: "You define the maximum you're willing to spend before any contractor is notified. That number is part of the submission. A contractor who claims your project has already accepted your budget parameters.",
  },
  {
    label: "Free for property owners. Always.",
    body: "Nexus charges contractors a flat monthly membership fee. Property owners and managers pay nothing to submit a project, consult with a contractor, or receive a Post Implementation Review.",
  },
  {
    label: "A full audit trail on every project.",
    body: "Every submission, consultation confirmation, estimate, approval, and outcome is timestamped and stored in your account. The record is complete and available permanently — useful for property management documentation, boards, and insurance.",
  },
  {
    label: "Verified credentials, confirmed before assignment.",
    body: "Every contractor in the Nexus network has completed license verification, insurance confirmation, and a background check before accessing the platform. These are not self-reported. They are confirmed by Nexus.",
  },
  {
    label: "Post Implementation Review on every project.",
    body: "After completion, Nexus delivers a structured PIR evaluating outcomes, contractor performance, materials cost, and labor cost. It is standard on every project — not optional, not an add-on.",
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
            <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">What You Receive</p>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] text-balance max-w-2xl">
              Every project on Nexus includes the following, without exception.
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm text-[15px]">
              These are not premium features or optional upgrades.
              They are the baseline — built into every submission, every assignment, every outcome.
            </p>
          </div>
        </div>

        {/* Guarantee list — editorial */}
        <div className="space-y-0">
          {guarantees.map((g, i) => (
            <div
              key={g.label}
              className="reveal border-t border-border/40 last:border-b py-10 flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-16"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="lg:w-80 shrink-0">
                <h3 className="text-base font-bold text-foreground leading-snug">{g.label}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-[15px] max-w-2xl">{g.body}</p>
            </div>
          ))}
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
