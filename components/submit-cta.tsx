"use client"

import Link from "next/link"
import { ArrowRight, FileText, DollarSign, CalendarRange, CheckCircle2, Shield, Lock } from "lucide-react"
import { useEffect, useRef } from "react"

const steps = [
  {
    icon: FileText,
    title: "Document your project",
    description: "Photos, written scope, and the specifics — so the contractor arrives knowing exactly what the job entails.",
  },
  {
    icon: DollarSign,
    title: "Define your budget ceiling",
    description: "Set a hard cap before anyone contacts you. No surprises on-site. No negotiating blind.",
  },
  {
    icon: CalendarRange,
    title: "Set your consultation window",
    description: "Choose when works for you. The contractor commits to that window before we confirm the match.",
  },
  {
    icon: CheckCircle2,
    title: "One professional claims it",
    description: "A single verified contractor reviews your full project profile and commits — exclusively, permanently.",
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
            setTimeout(() => node.classList.add("in-view"), i * 90)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="submit" className="py-24 lg:py-36 relative overflow-hidden">
      {/* Ambient orbs — full bleed, no container box */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="animate-orb-1 absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, oklch(0.76 0.17 158), transparent 70%)" }}
        />
        <div
          className="animate-orb-2 absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, oklch(0.70 0.15 85), transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top border */}
        <div className="brand-divider mb-16 reveal" />

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <div className="reveal">
            <div className="inline-flex items-center gap-2.5 mb-8">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              <span className="section-overline">Always free for homeowners</span>
            </div>

            <h2 className="text-3xl lg:text-[2.5rem] font-bold tracking-[-0.02em] leading-[1.12] mb-6">
              Your project, your terms.
              <br />
              <span className="gradient-text">One contractor who earns it.</span>
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-10">
              Define your project completely before anyone contacts you. Set the budget ceiling,
              choose your consultation window, and document the scope. A single verified professional
              reviews every detail and commits to your job — not to winning a bid against six competitors.
              No cost to homeowners, at any tier, ever.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link
                href="/login?tab=signup"
                className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] shadow-xl shadow-primary/20 animate-pulse-glow tracking-tight"
              >
                Start Your Project — Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-5 text-[13px] text-muted-foreground self-center">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-primary" /> You control the terms
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" /> Verified professionals only
                </span>
              </div>
            </div>
          </div>

          {/* Right — step flow, editorial list */}
          <div className="hidden lg:block reveal" style={{ transitionDelay: "100ms" }}>
            <p className="section-overline mb-8">How your project moves</p>
            <div className="space-y-0">
              {steps.map((step, i) => (
                <div key={step.title} className="group flex items-start gap-5 py-6 border-t border-border/25 hover:border-border/50 transition-colors duration-200 last-of-type:border-b">
                  <div className="w-7 h-7 rounded-full border border-primary/25 bg-primary/8 flex items-center justify-center text-[11px] font-bold text-primary shrink-0 mt-0.5 group-hover:bg-primary/15 transition-colors">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold mb-1">{step.title}</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div className="brand-divider mt-16 reveal" style={{ transitionDelay: "200ms" }} />
      </div>
    </section>
  )
}
