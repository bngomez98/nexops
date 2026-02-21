"use client"

import Link from "next/link"
import { ArrowRight, FileText, DollarSign, CalendarRange, CheckCircle2, Shield, Lock } from "lucide-react"
import { useEffect, useRef } from "react"

const steps = [
  {
    icon: FileText,
    title: "Document your project",
    description: "You upload 2–10 photos of the work area and describe the scope in your own words — what needs to be done, any materials involved, and anything the contractor needs to know before showing up. More detail means a faster match and a contractor who arrives already knowing the job.",
  },
  {
    icon: DollarSign,
    title: "Define your budget ceiling",
    description: "You enter the maximum dollar amount you're willing to spend before any contractor sees your request. Every contractor who considers claiming your job knows your ceiling upfront — no surprise estimates on-site, no pressure to negotiate up.",
  },
  {
    icon: CalendarRange,
    title: "Set your consultation window",
    description: "You pick 3–4 available time slots from your own calendar. The contractor who claims your request commits to one of those windows before the match is locked — no callbacks required, no back-and-forth scheduling.",
  },
  {
    icon: CheckCircle2,
    title: "One professional claims it",
    description: "One licensed, insured contractor in your area reviews your photos, scope, budget, and available windows — then commits to the job exclusively. From that moment, no other contractor in the network can see or respond to your request.",
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
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="submit" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-3xl border border-border/40 bg-card overflow-hidden reveal">
          {/* Animated background */}
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
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                  </span>
                  <span className="text-primary text-xs font-medium">Always free for homeowners</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                  Your project, your terms.
                  <br />
                  <span className="gradient-text">One contractor who earns it.</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Define your project completely before anyone is contacted. Set the budget ceiling, choose your consultation
                  window, and document the scope. A single verified professional reviews every detail and commits
                  to your job — not to winning a bid against six competitors.
                  There is no cost to homeowners, at any tier, ever.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <Link
                    href="/login?tab=signup"
                    className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/25 animate-pulse-glow"
                  >
                    Start Your Project — Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground self-center">
                    <span className="flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-primary" /> You control the terms
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-primary" /> Verified professionals only
                    </span>
                  </div>
                </div>
              </div>

              {/* Right — 4-step outcome flow */}
              <div className="hidden lg:block">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5">How your project moves</p>
                <div className="relative">
                  {steps.map((step, i) => (
                    <div key={step.title} className="flex items-start gap-4 mb-4 last:mb-0">
                      {/* Left column: number + line */}
                      <div className="flex flex-col items-center pt-1">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                          {i + 1}
                        </div>
                        {i < steps.length - 1 && (
                          <div className="w-px h-7 bg-border/40 my-1" />
                        )}
                      </div>
                      {/* Content */}
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
