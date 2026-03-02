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
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden border-b border-border/40">
      {/* Fine grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Accent glow — top right */}
      <div
        className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at 70% 20%, oklch(from var(--primary) l c h / 0.10), transparent 65%)" }}
      />

      {/* Accent glow — bottom left */}
      <div
        className="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at 30% 80%, oklch(from var(--primary) l c h / 0.05), transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-36 pb-28 w-full">
        <div className="grid lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-16 xl:gap-24 items-center">

          {/* ── Left column: text ── */}
          <div>
            {/* Eyebrow */}
            <div className="reveal">
              <div className="inline-flex items-center gap-3 mb-10">
                <span className="h-px w-10 bg-primary" />
                <span className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
                  Topeka, Kansas &middot; Contractor Coordination
                </span>
              </div>
            </div>

            {/* Main headline */}
            <div className="reveal mb-8" style={{ transitionDelay: "110ms" }}>
              <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-bold leading-[1.0] tracking-tight text-balance max-w-4xl">
                One project.{" "}
                <br className="hidden lg:block" />
                One contractor.{" "}
                <span className="gradient-text">Full documentation.</span>
              </h1>
            </div>

            {/* Sub-narrative */}
            <div className="reveal" style={{ transitionDelay: "220ms" }}>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-4">
                Nexus Operations connects Topeka property owners and managers with a single,
                verified contractor — exclusively assigned to their project from the moment of submission.
              </p>
              <p className="text-xl font-medium text-foreground/90 leading-relaxed max-w-2xl mb-10">
                That contractor arrives knowing your scope, your photographs, and your budget ceiling.
                The conversation starts at a professional level. Every step is documented, timestamped, and available in your account.
              </p>
            </div>

            {/* CTAs */}
            <div className="reveal flex flex-col sm:flex-row items-start gap-4 mb-16" style={{ transitionDelay: "330ms" }}>
              <Link
                href="/login?tab=signup"
                className="btn-shimmer inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200"
              >
                Submit a Request — Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/40 rounded-xl hover:border-border/70 hover:bg-secondary/50 transition-all duration-200"
              >
                How It Works
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium border border-border/40 rounded-xl hover:bg-secondary/50 hover:border-border/70 transition-all duration-200"
              >
                Talk to Us First
              </Link>
            </div>

            {/* Divider + signal strip */}
            <div className="reveal border-t border-border/40 pt-10" style={{ transitionDelay: "440ms" }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                {signals.map((s) => (
                  <div key={s.label}>
                    <p className="text-sm font-semibold text-foreground mb-0.5 leading-snug">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact line */}
            <p className="reveal mt-8 flex items-center gap-2 text-sm text-muted-foreground" style={{ transitionDelay: "550ms" }}>
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <a href="tel:+17854280244" className="font-mono tracking-wide hover:text-primary transition-colors">785-428-0244</a>
              <span className="text-border/70 select-none">&middot;</span>
              <a href="mailto:contact@nexusoperations.org" className="hover:text-primary transition-colors">contact@nexusoperations.org</a>
            </p>
          </div>

          {/* ── Right column: project card mockup ── */}
          <div className="hidden lg:flex flex-col items-center justify-center reveal" style={{ transitionDelay: "200ms" }}>
            <div className="relative w-full animate-float-slow">
              {/* Main card */}
              <div className="rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden">

                {/* Card header */}
                <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between bg-secondary/40">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Nexus Project</p>
                    <p className="text-sm font-bold text-foreground">#NX-2847</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Contractor Assigned
                  </span>
                </div>

                {/* Card body */}
                <div className="p-5 space-y-4">
                  {/* Project info */}
                  <div>
                    <p className="text-base font-bold text-foreground mb-1">Roof Repair — 3,200 sqft</p>
                    <p className="text-xs text-muted-foreground">1847 SW Gage Blvd, Topeka KS</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary/60 border border-border/30">
                      <span className="text-[10px] text-muted-foreground">Budget ceiling:</span>
                      <span className="text-[10px] font-semibold text-foreground">$12,500</span>
                    </div>
                  </div>

                  {/* Contractor info */}
                  <div className="p-3 rounded-xl bg-secondary/40 border border-border/30">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        MT
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Marcus T.</p>
                        <p className="text-[11px] text-muted-foreground">MT Roofing Solutions</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] text-primary">
                            <CheckCircle2 className="h-3 w-3" /> License verified
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-primary">
                            <Shield className="h-3 w-3" /> Insured
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Consultation time */}
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border/30 bg-card">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Consultation confirmed</p>
                      <p className="text-xs font-semibold text-foreground">Tomorrow &middot; 2:00 PM</p>
                    </div>
                  </div>

                  {/* PIR note */}
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border/30 bg-card">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <p className="text-[10px] text-muted-foreground">Post Implementation Review included on completion</p>
                  </div>
                </div>

                {/* Progress strip */}
                <div className="px-5 pb-5">
                  <div className="flex items-start">
                    {steps.map((step, i) => (
                      <div key={step.label} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 shrink-0 transition-colors ${
                              step.done
                                ? "bg-primary border-primary text-primary-foreground"
                                : step.active
                                ? "bg-background border-primary text-primary"
                                : "bg-background border-border/50 text-muted-foreground"
                            }`}
                          >
                            {step.done ? "✓" : i + 1}
                          </div>
                          <p
                            className={`text-[9px] mt-1 font-medium whitespace-nowrap ${
                              step.done || step.active ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                        {i < steps.length - 1 && (
                          <div
                            className={`h-px flex-1 mb-3.5 mx-1 ${step.done ? "bg-primary/40" : "bg-border/40"}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge: 1 contractor */}
              <div className="absolute -top-5 -right-5 glass-card rounded-xl px-3 py-2.5 shadow-xl shadow-black/10 dark:shadow-black/30 border border-border/60">
                <p className="text-[10px] font-bold text-foreground">1 Contractor Only</p>
                <p className="text-[9px] text-muted-foreground">Exclusively assigned</p>
              </div>

              <a href="#how-it-works" className="inline-flex items-center gap-2 mt-5 text-xs text-primary hover:underline">
                Explore workflow details <ArrowRight className="h-3.5 w-3.5" />
              </a>
              {/* Floating badge: free */}
              <div className="absolute -bottom-5 -left-5 glass-card rounded-xl px-3 py-2.5 shadow-xl shadow-black/10 dark:shadow-black/30 border border-border/60">
                <p className="text-[10px] font-bold text-primary">Free for Owners</p>
                <p className="text-[9px] text-muted-foreground">No cost, ever</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
