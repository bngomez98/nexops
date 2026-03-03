"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const guarantees = [
  { label: "One contractor, exclusively assigned.", body: "The moment a contractor claims your project, it is closed to everyone else in the network. Your submission is not visible to any other contractor from that point forward." },
  { label: "Complete project information, before any contact.", body: "Your photographs, written scope, and budget ceiling are shared with the assigned contractor before the consultation is confirmed. They arrive informed." },
  { label: "Budget ceiling set by you, upfront.", body: "You define the maximum you're willing to spend before any contractor is notified. A contractor who claims your project has already accepted your budget parameters." },
  { label: "Free for property owners. Always.", body: "Nexus charges contractors a flat monthly membership fee. Property owners and managers pay nothing to submit a project, consult with a contractor, or receive a Post Implementation Review." },
  { label: "A full audit trail on every project.", body: "Every submission, consultation confirmation, estimate, approval, and outcome is timestamped and stored in your account. The record is complete and permanent." },
  { label: "Verified credentials, confirmed before assignment.", body: "Every contractor in the Nexus network has completed license verification, insurance confirmation, and a background check before accessing the platform." },
  { label: "Post Implementation Review on every project.", body: "After completion, Nexus delivers a structured PIR evaluating outcomes, contractor performance, materials cost, and labor cost. It is standard on every project." },
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
    <section ref={sectionRef} className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="reveal mb-14 lg:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="section-label mb-4">What You Receive</p>
              <h2 className="text-4xl lg:text-5xl font-display leading-[1.05] text-balance">
                Every project on Nexus includes the following, without exception.
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-sm border-l-2 border-primary/30 pl-4">
              These are not premium features or optional upgrades.
              They are the baseline — built into every submission.
            </p>
          </div>
        </div>

        <div className="space-y-0">
          {guarantees.map((g, i) => (
            <div
              key={g.label}
              className="reveal border-t border-border last:border-b py-7 flex flex-col lg:flex-row lg:items-start gap-3 lg:gap-12 group hover:bg-secondary/50 transition-colors px-0 hover:px-4 rounded-lg duration-200"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="lg:w-80 shrink-0 flex items-start gap-3">
                <span className="text-sm font-mono text-primary font-semibold mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-sm font-semibold text-foreground leading-snug">{g.label}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm max-w-2xl">{g.body}</p>
            </div>
          ))}
        </div>

        <div className="reveal mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Link
            href="/dashboard/homeowner/new"
            className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
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
