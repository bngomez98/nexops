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
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden border-b-2 border-foreground">
      {/* Constructivist diagonal stripe overlay — top right corner block */}
      <div
        className="absolute top-0 right-0 w-[340px] h-[340px] pointer-events-none opacity-[0.04] construct-stripes-muted"
        style={{ backgroundSize: "14px 14px" }}
      />

      {/* Red geometric block — top left accent */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary pointer-events-none" />

      {/* Bold red horizontal rule at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-8 lg:px-10 pt-36 pb-28 w-full">
        <div className="grid lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-16 xl:gap-20 items-center">

          {/* ── Left column: text ── */}
          <div>
            {/* Eyebrow — constructivist label */}
            <div className="reveal">
              <div className="construct-label mb-10">
                Topeka, Kansas &middot; Contractor Coordination
              </div>
            </div>

            {/* Main headline — Bebas Neue display type */}
            <div className="reveal mb-6" style={{ transitionDelay: "110ms" }}>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-display leading-[0.95] tracking-[0.01em] text-balance max-w-3xl uppercase">
                One project.{" "}
                <br />
                One contractor.{" "}
                <span className="text-primary">Full documentation.</span>
              </h1>
            </div>

            {/* Bold red accent bar */}
            <div className="reveal h-1 w-24 bg-primary mb-8" style={{ transitionDelay: "160ms" }} />

            {/* Sub-narrative */}
            <div className="reveal" style={{ transitionDelay: "220ms" }}>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-3">
                Nexus Operations connects Topeka property owners and managers with a single,
                verified contractor — exclusively assigned to their project from the moment of submission.
              </p>
              <p className="text-lg font-semibold text-foreground leading-relaxed max-w-2xl mb-10">
                That contractor arrives knowing your scope, your photographs, and your budget ceiling.
                The conversation starts at a professional level. Every step is documented, timestamped, and available in your account.
              </p>
            </div>

            {/* CTAs */}
            <div className="reveal flex flex-col sm:flex-row items-start gap-3 mb-14" style={{ transitionDelay: "330ms" }}>
              <Link
                href="/login?tab=signup"
                className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 construct-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-none transition-all duration-150"
              >
                Submit a Request — Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold tracking-widest uppercase text-foreground border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                How It Works
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold tracking-widest uppercase border-2 border-foreground/30 text-foreground/60 hover:border-foreground hover:text-foreground transition-colors"
              >
                Talk to Us First
              </Link>
            </div>

            {/* Signal strip */}
            <div className="reveal border-t-2 border-foreground/20 pt-10" style={{ transitionDelay: "440ms" }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                {signals.map((s) => (
                  <div key={s.label} className="border-l-2 border-primary pl-3">
                    <p className="text-xs font-bold tracking-wide text-foreground uppercase leading-snug mb-0.5">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact line */}
            <p className="reveal mt-7 flex items-center gap-2 text-sm text-muted-foreground" style={{ transitionDelay: "550ms" }}>
              <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
              <a href="tel:+17854280244" className="font-mono tracking-wide hover:text-primary transition-colors">785-428-0244</a>
              <span className="text-foreground/30 select-none">&middot;</span>
              <a href="mailto:contact@nexusoperations.org" className="hover:text-primary transition-colors">contact@nexusoperations.org</a>
            </p>
          </div>

          {/* ── Right column: project card mockup ── */}
          <div className="hidden lg:flex flex-col items-center justify-center reveal" style={{ transitionDelay: "200ms" }}>
            <div className="relative w-full">
              {/* Main card — sharp constructivist style */}
              <div className="border-2 border-foreground bg-card construct-shadow-lg overflow-hidden">

                {/* Card header — red accent bar */}
                <div className="px-5 py-4 border-b-2 border-foreground flex items-center justify-between bg-foreground text-background">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-background/60">Nexus Project</p>
                    <p className="text-sm font-black text-background">#NX-2847</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground border border-primary/50">
                    <span className="w-1.5 h-1.5 bg-primary-foreground" />
                    Contractor Assigned
                  </span>
                </div>

                {/* Card body */}
                <div className="p-5 space-y-3">
                  {/* Project info */}
                  <div>
                    <p className="text-base font-black text-foreground mb-1 uppercase tracking-tight">Roof Repair — 3,200 sqft</p>
                    <p className="text-xs text-muted-foreground font-mono">1847 SW Gage Blvd, Topeka KS</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 border-2 border-foreground/30 bg-secondary">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">Budget ceiling:</span>
                      <span className="text-[10px] font-black text-foreground">$12,500</span>
                    </div>
                  </div>

                  {/* Contractor info */}
                  <div className="p-3 border-2 border-foreground/30 bg-secondary">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-primary border-2 border-foreground flex items-center justify-center text-primary-foreground font-black text-sm shrink-0">
                        MT
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-foreground uppercase">Marcus T.</p>
                        <p className="text-[11px] text-muted-foreground">MT Roofing Solutions</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] text-primary font-bold">
                            <CheckCircle2 className="h-3 w-3" /> License verified
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-primary font-bold">
                            <Shield className="h-3 w-3" /> Insured
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Consultation time */}
                  <div className="flex items-center gap-2.5 p-2.5 border-l-4 border-primary bg-secondary">
                    <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">Consultation confirmed</p>
                      <p className="text-xs font-black text-foreground">Tomorrow &middot; 2:00 PM</p>
                    </div>
                  </div>

                  {/* PIR note */}
                  <div className="flex items-center gap-2.5 p-2.5 border-l-4 border-foreground/20 bg-secondary">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <p className="text-[10px] text-muted-foreground font-medium">Post Implementation Review included on completion</p>
                  </div>
                </div>

                {/* Progress strip */}
                <div className="px-5 pb-5 border-t-2 border-foreground/10 pt-4">
                  <div className="flex items-start">
                    {steps.map((step, i) => (
                      <div key={step.label} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-5 h-5 flex items-center justify-center text-[9px] font-black border-2 shrink-0 transition-colors ${
                              step.done
                                ? "bg-primary border-primary text-primary-foreground"
                                : step.active
                                ? "bg-background border-primary text-primary"
                                : "bg-background border-foreground/40 text-muted-foreground"
                            }`}
                          >
                            {step.done ? "✓" : i + 1}
                          </div>
                          <p
                            className={`text-[9px] mt-1 font-bold uppercase tracking-wide whitespace-nowrap ${
                              step.done || step.active ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                        {i < steps.length - 1 && (
                          <div
                            className={`h-0.5 flex-1 mb-3.5 mx-1 ${step.done ? "bg-primary" : "bg-foreground/15"}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge: 1 contractor */}
              <div className="absolute -top-4 -right-4 border-2 border-foreground bg-background px-3 py-2.5 construct-shadow-sm">
                <p className="text-[10px] font-black text-foreground uppercase tracking-wide">1 Contractor Only</p>
                <p className="text-[9px] text-muted-foreground font-medium">Exclusively assigned</p>
              </div>

              <a href="#how-it-works" className="inline-flex items-center gap-2 mt-4 text-xs font-bold text-primary hover:underline uppercase tracking-wide">
                Explore workflow details <ArrowRight className="h-3.5 w-3.5" />
              </a>

              {/* Floating badge: free */}
              <div className="absolute -bottom-4 -left-4 border-2 border-primary bg-primary px-3 py-2.5 construct-shadow-sm">
                <p className="text-[10px] font-black text-primary-foreground uppercase tracking-wide">Free for Owners</p>
                <p className="text-[9px] text-primary-foreground/80 font-medium">No cost, ever</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
