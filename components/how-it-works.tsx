"use client"

import { useState, useEffect, useRef } from "react"
import { PhoneCall, UserCheck, Wrench, ClipboardCheck, CheckCircle, FileSearch } from "lucide-react"

const steps = [
  {
    icon: PhoneCall,
    number: "01",
    title: "Service requested",
    detail:
      "Homeowner or property manager submits a request with photos, written scope, budget ceiling, and preferred consultation times.",
  },
  {
    icon: FileSearch,
    number: "02",
    title: "Project coordinated",
    detail:
      "Nexus manages project requirements and routes to a verified contractor by trade, proximity, and performance history.",
  },
  {
    icon: UserCheck,
    number: "03",
    title: "Contractor assigned",
    detail:
      "One verified contractor is exclusively assigned. If declined, backup reassignment runs automatically within service-level timelines.",
  },
  {
    icon: Wrench,
    number: "04",
    title: "Work completed",
    detail:
      "Full coordination continues until job completion. Contractors submit photos and work notes. Quality confirmation is verified before close-out.",
  },
  {
    icon: ClipboardCheck,
    number: "05",
    title: "Post Implementation Review",
    detail:
      "Nexus delivers a Post Implementation Review evaluating project outcomes, contractor performance, and insights for future decision-making.",
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
            How Nexus coordinates every project from request to completion.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            End-to-end coordination for homeowners and property managers: structured dispatch,
            contractor accountability, and a Post Implementation Review on every project.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const isActive = activeStep === i
            return (
              <div
                key={step.number}
                className={`reveal group relative p-6 rounded-2xl border bg-card transition-all duration-300 ${isActive ? "border-primary/60" : "border-border/40"}`}
                onMouseEnter={() => setActiveStep(i)}
                onMouseLeave={() => setActiveStep(null)}
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
              Urgent (4h assignment, next business day arrival), Routine (24h assignment, 3\u20135 business day arrival).
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
