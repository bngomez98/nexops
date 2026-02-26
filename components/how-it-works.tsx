"use client"

import { useState, useEffect, useRef } from "react"
import { PhoneCall, UserCheck, Wrench, Receipt, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: PhoneCall,
    number: "01",
    title: "Request intake",
    title: "Initial consultation",
    detail: "A 45-minute conversation about your portfolio, your current vendor setup, and where coordination is costing your team the most time. No forms, no intake questionnaires — just a direct conversation.",
    title: "Discovery call",
    detail:
      "Property managers submit by phone, text, or email with address, unit, issue details, urgency level, and tenant availability.",
  },
  {
    icon: UserCheck,
    number: "02",
    title: "Contractor assignment",
    detail:
      "Nexus Operations routes to a verified contractor by trade, proximity, and performance. If declined, backup reassignment runs automatically.",
  },
  {
    icon: Wrench,
    number: "03",
    title: "Work completion + QA",
    detail:
      "Contractors submit photos and work notes. We confirm completion with the property manager and track quality before payment release.",
  },
  {
    icon: Receipt,
    number: "04",
    title: "Monthly invoicing",
    title: "Platform access at launch",
    detail: "When the NexOps SaaS platform launches in 2026, your team gets early access to the tools built from your actual workflows — not a generic template applied to your business.",
    title: "Platform rollout",
    detail:
      "Clients receive a line-item invoice showing contractor costs and markup by urgency category, with net payment terms.",
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStep, setActiveStep] = useState<number | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((node, i) => {
            setTimeout(() => node.classList.add("in-view"), i * 120)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-14 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">How it works</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3">
            Maintenance coordination built for multifamily operations.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We operate as an outsourced coordination layer for Topeka property managers: faster dispatch,
            contractor accountability, and standardized reporting.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const isActive = activeStep === i
            return (
              <div
                key={step.number}
                className="reveal group relative p-6 rounded-2xl border bg-card transition-all duration-300"
                onMouseEnter={() => setActiveStep(i)}
                onMouseLeave={() => setActiveStep(null)}
                style={isActive ? { borderColor: "oklch(0.75 0.18 155 / 0.6)" } : {}}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 border border-primary/20">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold font-mono text-muted-foreground/30">{step.number}</span>
                </div>

                <h3 className="text-base font-semibold mb-2 leading-snug">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.detail}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-10 reveal">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15 max-w-3xl">
            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Service levels:</span> Emergency (1h assignment, 4h on-site),
              Urgent (4h assignment, next business day arrival), Routine (24h assignment, 3–5 business day arrival).
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
