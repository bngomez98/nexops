"use client"

import Link from "next/link"
import { ArrowRight, Upload, Lock, CalendarCheck, ClipboardList, Shield, CheckCircle } from "lucide-react"
import { useEffect, useRef } from "react"

const steps = [
  {
    icon: Upload,
    title: "Document the service request",
    description: "Upload photographs and provide a written scope so the assignment team can classify the request accurately.",
  },
  {
    icon: Lock,
    title: "Define budget and availability",
    description: "Set a budget limit and consultation windows to keep scheduling and cost expectations explicit from the start.",
  },
  {
    icon: CalendarCheck,
    title: "Contractor assignment and confirmation",
    description: "A verified contractor reviews the full request package, accepts the work, and confirms the consultation window.",
  },
  {
    icon: ClipboardList,
    title: "Estimate review with full context",
    description: "The consultation proceeds with complete project information already in hand, followed by a written estimate for decision-making.",
  },
]

export function SubmitCTA() {
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
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="submit" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-3xl border border-border/40 bg-card overflow-hidden reveal">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="animate-orb-1 absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.06]"
              style={{ background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)" }}
            />
            <div
              className="animate-orb-2 absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-[0.04]"
              style={{ background: "radial-gradient(circle, oklch(0.70 0.15 85), transparent 70%)" }}
            />
          </div>

          <div className="relative p-10 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
                  <span className="text-primary text-xs font-medium">Process and documentation framework</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                  Service requests are structured around documented operations standards.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  The workflow in our business operations manual guides intake, assignment, consultation scheduling, and completion
                  records. This gives property owners and managers a predictable process with full context at each step.
                </p>

                <p className="text-muted-foreground leading-relaxed mb-8">
                  Each request includes supporting documentation, defined budget parameters, and a confirmed consultation window.
                  The assigned contractor receives the full request package prior to the appointment.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <Link
                    href="/dashboard/homeowner/new"
                    className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/25 animate-pulse-glow"
                  >
                    Start a Service Request
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground self-center">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-primary" /> Documented workflow
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-primary" /> Verified contractors only
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5">How the process is executed</p>
                <div className="relative">
                  {steps.map((step, i) => (
                    <div key={step.title} className="flex items-start gap-4 mb-4 last:mb-0">
                      <div className="flex flex-col items-center pt-1">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                          {i + 1}
                        </div>
                        {i < steps.length - 1 && <div className="w-px h-7 bg-border/40 my-1" />}
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/30 border border-border/30 hover:bg-secondary/50 hover:border-border/50 transition-colors duration-200">
                          <step.icon className="h-4 w-4 text-primary shrink-0" />
                          <div>
                            <p className="text-sm font-semibold leading-tight">{step.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
