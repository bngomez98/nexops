"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "You submit once — and only once.",
    body: "Upload 2–10 photographs of the work area. Write a description of what needs to be done. Set the maximum you're willing to spend. Pick 3–4 available windows for a consultation. That's it. You never repeat this to anyone. No callbacks, no re-explaining, no contractor showing up unprepared.",
    aside: "Most platforms send your request to 4–8 contractors simultaneously. Nexus sends it to one.",
  },
  {
    number: "02",
    title: "A single verified contractor claims your project.",
    body: "Contractors in the Nexus network see your complete submission — scope, photos, budget ceiling, and your available times. One contractor decides the project fits their business and claims it exclusively. The moment that happens, it disappears from every other contractor's feed. Permanently.",
    aside: "License verified. Insurance confirmed. Background checked. Before they ever see a single project.",
  },
  {
    number: "03",
    title: "Consultation confirmed within 24 hours.",
    body: "Nexus confirms the consultation with both parties. You receive the contractor's name, license number, insurance verification, and the confirmed time slot. The contractor arrives having already studied your photographs and read your scope description. The conversation starts at a professional level — not with \"So what's the problem?\"",
    aside: "Emergency response: contractor assigned within 1 hour, on-site within 4.",
  },
  {
    number: "04",
    title: "Agreement, then execution.",
    body: "The contractor delivers a documented estimate — scope of work, materials, labor breakdown, timeline, and total cost. You review it. If it meets your expectations, you proceed. If it doesn't, you decline without obligation, fees, or follow-up pressure. Every exchange is documented in the platform.",
    aside: "No obligation to proceed. No pressure. No penalty for walking away.",
  },
  {
    number: "05",
    title: "Post Implementation Review delivered.",
    body: "After the work is complete, Nexus delivers a Post Implementation Review. It evaluates project outcomes, contractor performance, materials cost, labor cost, and operational insights — so the next decision is better than the last. Every project. No exceptions.",
    aside: "Documentation that lives in your account. Useful for property owners, boards, and insurance claims.",
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
    <section ref={sectionRef} id="how-it-works" className="py-28 lg:py-40 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <div className="reveal flex items-start gap-8 mb-20 lg:mb-28">
          <div className="hidden lg:block pt-1">
            <span className="h-px w-16 bg-primary inline-block" />
          </div>
          <div className="max-w-3xl">
            <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase mb-5">The Process</p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] mb-6 text-balance">
              Understand exactly what happens after you submit a project.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Most platforms describe a process that sounds reasonable until you experience it.
              Here is what Nexus Operations actually does, step by step, with no ambiguity.
            </p>
          </div>
        </div>

        {/* Steps — editorial vertical flow */}
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`reveal group border-t border-border/40 py-14 lg:py-18 ${i === steps.length - 1 ? "border-b" : ""}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-16">
                {/* Step number */}
                <div className="lg:w-20 shrink-0">
                  <span className="text-5xl font-bold font-mono text-muted-foreground/20 group-hover:text-primary/30 transition-colors duration-300 leading-none">
                    {step.number}
                  </span>
                </div>

                {/* Main content */}
                <div className="flex-1 max-w-2xl">
                  <h3 className="text-xl lg:text-2xl font-bold tracking-tight mb-4 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-[15px]">{step.body}</p>
                </div>

                {/* Aside note */}
                <div className="lg:w-72 shrink-0">
                  <div className="border-l-2 border-primary/40 pl-5 group-hover:border-primary/70 transition-colors duration-300">
                    <p className="text-sm text-muted-foreground leading-relaxed italic">{step.aside}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="reveal mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
            The process is the same for every project — emergency, routine, or anything in between.
            It doesn't change based on budget or property type. That's the point.
          </p>
          <Link
            href="/dashboard/homeowner/new"
            className="btn-shimmer inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 shrink-0 shadow-lg shadow-primary/20"
          >
            Start Your Project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
