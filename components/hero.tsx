"use client"

import Link from "next/link"
import { ArrowRight, Phone, CheckCircle2, Shield, Clock, FileText } from "lucide-react"
import { useEffect, useRef } from "react"

const signals = [
  { label: "One contractor per project", sub: "Mechanically enforced" },
  { label: "24-hour consultation confirmed", sub: "Guaranteed, every time" },
  { label: "Free for everyone", sub: "Property owners and contractors" },
  { label: "Post Implementation Review", sub: "Every project, every time" },
]

const steps = [
  { label: "Submitted", done: true },
  { label: "Assigned", done: true },
  { label: "Consult", done: false, active: true },
  { label: "Complete", done: false },
]

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const nodes = el.querySelectorAll(".reveal")
    nodes.forEach((node, i) => {
      setTimeout(() => node.classList.add("in-view"), 120 + i * 110)
    })
  }, [])

  return (
    <section ref={ref} className="relative pt-28 lg:pt-36 pb-20 lg:pb-28 overflow-hidden">
      {/* Soft background accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-12 xl:gap-16 items-center">

          {/* Left column: text */}
          <div>
            <div className="reveal">
              <p className="section-label mb-6">
                Topeka, Kansas &middot; Contractor Coordination
              </p>
            </div>

            <div className="reveal mb-6" style={{ transitionDelay: "110ms" }}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display leading-[0.95] tracking-tight text-balance max-w-2xl">
                One project.{" "}
                <br className="hidden sm:block" />
                One contractor.{" "}
                <span className="text-primary">Full documentation.</span>
              </h1>
            </div>

            <div className="reveal" style={{ transitionDelay: "220ms" }}>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-4">
                Nexus Operations connects Topeka property owners and managers with a single,
                verified contractor exclusively assigned to their project.
              </p>
              <p className="text-lg font-medium text-foreground leading-relaxed max-w-xl mb-8">
                That contractor arrives knowing your scope, your photographs, and your budget ceiling.
                Every step is documented, timestamped, and available in your account.
              </p>
            </div>

            {/* CTAs */}
            <div className="reveal flex flex-col sm:flex-row items-start gap-3 mb-12" style={{ transitionDelay: "330ms" }}>
              <Link
                href="/login?tab=signup"
                className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
              >
                Submit a Request — Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-md text-foreground border border-border hover:bg-secondary transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Talk to Us First
              </Link>
            </div>

            {/* Signal strip */}
            <div className="reveal border-t border-border pt-8" style={{ transitionDelay: "440ms" }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                {signals.map((s) => (
                  <div key={s.label} className="border-l-2 border-primary/40 pl-3">
                    <p className="text-sm font-semibold text-foreground leading-snug mb-0.5">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact line */}
            <p className="reveal mt-6 flex items-center gap-2 text-sm text-muted-foreground" style={{ transitionDelay: "550ms" }}>
              <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
              <a href="tel:+17854280244" className="font-mono hover:text-primary transition-colors">785-428-0244</a>
              <span className="text-border">&middot;</span>
              <a href="mailto:contact@nexusoperations.org" className="hover:text-primary transition-colors">contact@nexusoperations.org</a>
            </p>
          </div>

          {/* Right column: project card mockup */}
          <div className="hidden lg:flex flex-col items-center justify-center reveal" style={{ transitionDelay: "200ms" }}>
            <div className="relative w-full">
              {/* Main card */}
              <div className="rounded-xl border border-border bg-card shadow-elevated overflow-hidden">

                {/* Card header */}
                <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-secondary">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Nexus Project</p>
                    <p className="text-sm font-bold text-foreground">#NX-2847</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Contractor Assigned
                  </span>
                </div>

                {/* Card body */}
                <div className="p-5 space-y-3">
                  <div>
                    <p className="text-base font-bold text-foreground mb-1">Roof Repair — 3,200 sqft</p>
                    <p className="text-xs text-muted-foreground font-mono">1847 SW Gage Blvd, Topeka KS</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary border border-border">
                      <span className="text-xs text-muted-foreground">Budget ceiling:</span>
                      <span className="text-xs font-bold text-foreground">$12,500</span>
                    </div>
                  </div>

                  {/* Contractor info */}
                  <div className="p-3 rounded-lg bg-secondary border border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                        MT
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground">Marcus T.</p>
                        <p className="text-xs text-muted-foreground">MT Roofing Solutions</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                            <CheckCircle2 className="h-3 w-3" /> Licensed
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                            <Shield className="h-3 w-3" /> Insured
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Consultation time */}
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg border-l-3 border-l-primary bg-primary/5">
                    <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Consultation confirmed</p>
                      <p className="text-sm font-semibold text-foreground">Tomorrow &middot; 2:00 PM</p>
                    </div>
                  </div>

                  {/* PIR note */}
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-secondary">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <p className="text-xs text-muted-foreground">Post Implementation Review included on completion</p>
                  </div>
                </div>

                {/* Progress strip */}
                <div className="px-5 pb-5 border-t border-border pt-4">
                  <div className="flex items-start">
                    {steps.map((step, i) => (
                      <div key={step.label} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full shrink-0 transition-colors ${
                              step.done
                                ? "bg-primary text-primary-foreground"
                                : step.active
                                ? "bg-primary/10 border-2 border-primary text-primary"
                                : "bg-secondary border border-border text-muted-foreground"
                            }`}
                          >
                            {step.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                          </div>
                          <p
                            className={`text-[10px] mt-1.5 font-medium whitespace-nowrap ${
                              step.done || step.active ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                        {i < steps.length - 1 && (
                          <div
                            className={`h-0.5 flex-1 mb-4 mx-1.5 rounded-full ${step.done ? "bg-primary" : "bg-border"}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge: 1 contractor */}
              <div className="absolute -top-3 -right-3 rounded-lg border border-border bg-card px-3 py-2 shadow-card">
                <p className="text-xs font-bold text-foreground">1 Contractor Only</p>
                <p className="text-[10px] text-muted-foreground">Exclusively assigned</p>
              </div>

              {/* Floating badge: free */}
              <div className="absolute -bottom-3 -left-3 rounded-lg bg-primary px-3 py-2 shadow-sm">
                <p className="text-xs font-bold text-primary-foreground">Free for Owners</p>
                <p className="text-[10px] text-primary-foreground/70">No cost, ever</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
