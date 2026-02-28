"use client"

import Link from "next/link"
import { ArrowRight, Shield, DollarSign, FileText, Lock, Users } from "lucide-react"
import { useEffect, useRef } from "react"

const benefits = [
  {
    icon: Lock,
    title: "Exclusive project claims",
    description: "Every project you claim is yours alone. No competing bids, no shared assignments.",
  },
  {
    icon: FileText,
    title: "Full documentation upfront",
    description: "Photos, written scope, budget, and preferred consultation times are provided before you claim.",
  },
  {
    icon: DollarSign,
    title: "Flat monthly membership",
    description: "One predictable monthly cost. Claim unlimited projects within your service categories.",
  },
  {
    icon: Shield,
    title: "Verified contractor network",
    description: "Join a network of licensed, insured professionals. Your credentials build homeowner trust.",
  },
]

export function ContractorCTA() {
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
    <section ref={sectionRef} id="contractor-cta" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-3xl border border-border/40 bg-card overflow-hidden reveal">
          {/* Animated background */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="animate-orb-1 absolute top-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.06]"
              style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
            />
            <div
              className="animate-orb-2 absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full opacity-[0.04]"
              style={{ background: "radial-gradient(circle, var(--chart-2), transparent 70%)" }}
            />
          </div>

          <div className="relative p-10 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  <span className="text-primary text-xs font-medium">Join the Nexus contractor network</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                  Projects that belong
                  <br />
                  <span className="gradient-text">to you from the start.</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Nexus Operations connects you with homeowners and property managers who have
                  already documented their project with photos, scope, and budget. Every project
                  you claim is exclusively yours. Flat monthly membership with no per-project fees.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <Link
                    href="/contact"
                    className="btn-shimmer inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/25"
                  >
                    Apply to Join
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold border border-border/50 rounded-xl hover:bg-secondary/50 hover:border-border transition-all duration-200"
                  >
                    View Membership Plans
                  </Link>
                </div>
              </div>

              {/* Right — benefits */}
              <div className="hidden lg:block">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5">Why contractors join Nexus</p>
                <div className="relative">
                  {benefits.map((benefit, i) => (
                    <div key={benefit.title} className="flex items-start gap-4 mb-4 last:mb-0">
                      <div className="flex flex-col items-center pt-1">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <benefit.icon className="h-4 w-4 text-primary" />
                        </div>
                        {i < benefits.length - 1 && (
                          <div className="w-px h-7 bg-border/40 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-secondary/30 border border-border/30 hover:bg-secondary/50 hover:border-border/50 transition-colors duration-200">
                          <div>
                            <p className="text-sm font-semibold leading-tight">{benefit.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{benefit.description}</p>
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
