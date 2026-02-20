"use client"

import { useEffect, useRef } from "react"
import { Users, ShieldCheck, FileText, Award } from "lucide-react"

const values = [
  {
    icon: Users,
    title: "The homeowner controls the project",
    body: "You own the project. You set the scope, the budget ceiling, and the consultation window — before we contact a single contractor. Not after you have already given your number to six strangers who all received it at the same time.",
    color: "text-primary",
    accent: "oklch(0.76 0.17 158)",
  },
  {
    icon: ShieldCheck,
    title: "The contractor earns exclusivity",
    body: "A skilled professional should not fight five competitors for the same job, or undercut their margin just to win a bid. When a contractor claims a request on Nexus, they earn it outright — no auction, no race to the bottom, no erosion of their craft.",
    color: "text-amber-400",
    accent: "oklch(0.70 0.15 85)",
  },
  {
    icon: FileText,
    title: "Both sides arrive prepared",
    body: "Bad projects start with bad information. We require full documentation — photos, written scope, a defined budget cap — before any match. The result is a consultation that produces decisions from the first minute, not a fishing expedition.",
    color: "text-violet-400",
    accent: "oklch(0.60 0.15 285)",
  },
  {
    icon: Award,
    title: "We track quality. We never assume it.",
    body: "Every contractor in the network earned their place through license verification, insurance confirmation, and background review. Every completed project updates their standing. The standard is not a hurdle — it is the reason homeowners trust the match they receive.",
    color: "text-emerald-400",
    accent: "oklch(0.70 0.16 155)",
  },
]

export function MissionValues() {
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
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 relative overflow-hidden">
      <div
        className="absolute left-0 top-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.025]"
        style={{ background: "radial-gradient(circle, oklch(0.76 0.17 158), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Mission statement */}
        <div className="max-w-3xl mb-20 reveal">
          <p className="section-overline mb-4">Why we exist</p>
          <h2 className="text-3xl lg:text-[2.5rem] font-bold tracking-[-0.02em] leading-[1.12] mb-8">
            Home improvement became adversarial.
            <br />
            <span className="gradient-text">We built an alternative.</span>
          </h2>
          <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
            <p>
              Homeowners brace for spam calls the moment they submit a request. Contractors undercut their margin
              to survive a bidding war they never agreed to enter. The platforms connecting them profit by
              distributing contact information as widely as possible — five, ten, fifteen contractors
              per lead — and calling that a service.
            </p>
            <p className="text-foreground/80 font-medium">
              Nexus Operations runs on a different premise: one request, one verified contractor,
              no exceptions. Not as a feature. As a founding belief.
            </p>
          </div>
        </div>

        {/* Divider with label */}
        <div className="rule-label mb-16 reveal" style={{ transitionDelay: "70ms" }}>
          <span className="section-overline whitespace-nowrap">Our core commitments</span>
        </div>

        {/* Values — editorial open list */}
        <div className="space-y-0">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="reveal group"
              style={{ transitionDelay: `${(i + 2) * 80}ms` }}
            >
              <div className="grid sm:grid-cols-[48px_1fr] lg:grid-cols-[64px_240px_1fr] gap-x-8 gap-y-4 py-9 border-t border-border/30 hover:border-border/55 transition-colors duration-200">
                {/* Icon */}
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: `${v.accent}15`,
                    border: `1px solid ${v.accent}22`,
                  }}
                >
                  <v.icon className={`h-4 w-4 ${v.color}`} />
                </div>

                {/* Title */}
                <div className="flex items-center sm:col-start-2 lg:col-start-2">
                  <h3 className="text-[15px] font-semibold leading-snug">{v.title}</h3>
                </div>

                {/* Body */}
                <div className="sm:col-span-2 sm:col-start-2 lg:col-span-1 lg:col-start-3">
                  <p className="text-[14px] text-muted-foreground leading-relaxed">{v.body}</p>
                </div>
              </div>

              {i === values.length - 1 && (
                <div className="border-b border-border/30" />
              )}
            </div>
          ))}
        </div>

        {/* Closing brand statement */}
        <div
          className="mt-16 reveal"
          style={{ transitionDelay: "480ms" }}
        >
          <blockquote className="pl-6 border-l-2 border-primary/40">
            <p className="text-[1.0625rem] font-medium text-foreground/75 leading-relaxed max-w-2xl">
              &ldquo;This is what we mean by operations. Not just a marketplace.
              A system that handles the logistics so contractors can focus on the craft —
              and homeowners can focus on their lives.&rdquo;
            </p>
            <footer className="mt-4 text-[13px] text-muted-foreground">
              Nexus Operations — Topeka, KS
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
