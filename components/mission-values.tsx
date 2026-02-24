"use client"

import { useEffect, useRef } from "react"
import { Users, FileText, TrendingUp, Shield } from "lucide-react"

const values = [
  {
    icon: Users,
    title: "Relationship-led execution",
    body: "You work with a dedicated NexOps operator who knows your properties, your vendors, and your standards. No ticket queue, no outsourced handoff model.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: Shield,
    title: "Clear accountability",
    body: "We define owners, deadlines, and escalation paths for vendor coordination so issues are resolved quickly and responsibility is obvious.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    icon: FileText,
    title: "Documented operating playbooks",
    body: "Every recurring workflow is documented in plain language your team can follow. When staff changes, process knowledge stays with your business.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    icon: TrendingUp,
    title: "Measured outcomes",
    body: "We report on response times, completion rates, and execution quality so leadership sees whether operations are improving month over month.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
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
            setTimeout(() => node.classList.add("in-view"), i * 100)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 relative overflow-hidden bg-card/20">
      <div
        className="absolute left-0 top-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)" }}
      />
      <div
        className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.025]"
        style={{ background: "radial-gradient(circle, oklch(0.70 0.15 85), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-16 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">What we do</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-6">
            We run day-to-day operations support for property managers.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            NexOps helps property management teams run cleaner operations by coordinating vendors,
            documenting repeatable workflows, and driving follow-through on maintenance execution.
            We combine consulting and software so you get immediate support now and a purpose-built platform in 2026.
          </p>
        </div>

        <div className="flex items-center gap-4 mb-12 reveal" style={{ transitionDelay: "80ms" }}>
          <div className="h-px flex-1 bg-border/30" />
          <span className="text-xs text-muted-foreground tracking-wider uppercase font-medium">How we operate</span>
          <div className="h-px flex-1 bg-border/30" />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="reveal group flex gap-5 p-6 rounded-2xl bg-card border border-border/40 hover:border-border/70 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 cursor-default"
              style={{ transitionDelay: `${(i + 2) * 80}ms` }}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl ${v.bg} border ${v.border} shrink-0 transition-transform duration-300 group-hover:scale-110`}
              >
                <v.icon className={`h-5 w-5 ${v.color}`} />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 leading-snug">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
