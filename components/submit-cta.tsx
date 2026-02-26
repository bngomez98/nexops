"use client"

import Link from "next/link"
import { ArrowRight, Upload, Lock, CalendarCheck, ClipboardList, Shield, CheckCircle } from "lucide-react"
import { useEffect, useRef } from "react"

const steps = [
  {
    icon: Upload,
    title: "Upload photos and describe the work",
    description: "Provide 2 to 10 photographs and a written description of the scope, including what needs to be done, any materials required, and other relevant details.",
  },
  {
    icon: Lock,
    title: "Set your budget and preferred times",
    description: "Specify the maximum budget you are willing to spend. Select 3 to 4 available time slots for the consultation. A contractor commits to one of those slots.",
  },
  {
    icon: CalendarCheck,
    title: "One contractor claims your project",
    description: "A single licensed and insured contractor reviews your project details and claims it exclusively. No other contractors can view or respond to your request after the claim.",
  },
  {
    icon: ClipboardList,
    title: "Review the estimate and decide",
    description: "The contractor arrives with full knowledge of your project. They provide a written estimate. You decide whether to proceed. There is no obligation to continue.",
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
                  <span className="text-primary text-xs font-medium">Free for property owners &mdash; no hidden fees</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                  Submit your project.
                  <br />
                  <span className="gradient-text">One contractor. Your terms.</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Property owners submit their project details once, including documentation and a
                  specified budget. The platform then assigns the project to a single verified
                  contractor. A consultation is confirmed within 24 hours at a time selected by
                  the property owner.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <Link
                    href="/dashboard/homeowner/new"
                    className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/25 animate-pulse-glow"
                  >
                    Start Your Project &mdash; Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground self-center">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-primary" /> No obligation
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-primary" /> Verified contractors only
                    </span>
                  </div>
                </div>
              </div>

              {/* Right — process flow */}
              <div className="hidden lg:block">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5">How it works for property owners</p>
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
