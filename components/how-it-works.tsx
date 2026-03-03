"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "You submit once — and only once.",
    body: "Upload 2-10 photographs of the work area. Write a description of what needs to be done. Set the maximum you're willing to spend. Pick 3-4 available windows for a consultation. That's it. Your submission is complete.",
    detail: "Photos, scope, budget ceiling, and availability — all captured in a single structured submission.",
  },
  {
    number: "02",
    title: "A single verified contractor claims your project.",
    body: "Verified contractors in the Nexus network review your complete submission. One contractor — whose license, insurance, and background check are already confirmed — claims it exclusively. The moment that happens, it is closed to everyone else.",
    detail: "License verified. Insurance confirmed. Background checked. Every contractor, before platform access.",
  },
  {
    number: "03",
    title: "Consultation confirmed within 24 hours.",
    body: "Nexus confirms the appointment with both parties. You receive the contractor's name, license number, insurance verification, and the confirmed time window. The contractor arrives having already reviewed your project.",
    detail: "Emergency projects: contractor assigned within 1 hour, on-site within 4 hours.",
  },
  {
    number: "04",
    title: "A documented estimate. Your decision.",
    body: "The contractor delivers a written estimate — scope of work, materials, labor breakdown, timeline, and total cost. You review it at your own pace. If it meets your expectations, you proceed. If it doesn't, you decline without obligation.",
    detail: "No obligation to proceed. No penalty for walking away. Your decision is final.",
  },
  {
    number: "05",
    title: "Post Implementation Review delivered.",
    body: "After the work is complete, Nexus delivers a Post Implementation Review evaluating project outcomes, contractor performance, materials cost, labor cost, and operational insights. It lives in your account permanently.",
    detail: "Every project receives a PIR. No exceptions. No additional cost.",
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((node, i) => {
            setTimeout(() => node.classList.add("in-view"), i * 100)
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
    <section ref={sectionRef} id="how-it-works" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <div className="reveal max-w-3xl mb-16 lg:mb-20">
          <p className="section-label mb-4">The Process</p>
          <h2 className="text-4xl lg:text-5xl font-display leading-[1.05] mb-5 text-balance">
            Understand exactly what happens after you submit a project.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Here is exactly what happens after you submit a project — step by step, with no ambiguity.
            The process is identical for every project, every property type, every budget.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`reveal group border-t border-border py-10 lg:py-12 ${i === steps.length - 1 ? "border-b border-border" : ""}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-12">
                <div className="lg:w-20 shrink-0">
                  <span className="text-4xl font-bold font-mono text-primary leading-none">
                    {step.number}
                  </span>
                </div>
                <div className="flex-1 max-w-2xl">
                  <h3 className="text-lg lg:text-xl font-semibold mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
                <div className="lg:w-64 shrink-0">
                  <div className="border-l-2 border-primary/30 pl-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="reveal mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-muted-foreground max-w-lg leading-relaxed">
            The process is the same for every project — emergency, routine, or anything in between.
          </p>
          <Link
            href="/dashboard/homeowner/new"
            className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm shrink-0"
          >
            Start Your Project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
