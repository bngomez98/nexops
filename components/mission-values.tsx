"use client"

import { useEffect, useRef } from "react"
import { Users, ShieldCheck, FileText, Award } from "lucide-react"

const values = [
  {
    icon: Users,
    title: "Homeowners control their projects",
    body: "Homeowners define the project scope, maximum budget, and available consultation windows before any contractor is notified. The terms are established before the match is made.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: ShieldCheck,
    title: "Contractors own their projects",
    body: "The moment a contractor claims a project, it is removed from every other contractor's feed and cannot be reclaimed. One contractor contacts the homeowner — no one else.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    icon: FileText,
    title: "Both sides come prepared",
    body: "Every project requires photos, a written scope description, a maximum budget, and pre-selected consultation windows before any contractor is notified. The contractor arrives having reviewed all of it — no discovery conversation required.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    icon: Award,
    title: "Verified credentials, tracked outcomes",
    body: "Every contractor in the network is license-verified, insurance-confirmed, and background-checked before gaining access to project requests. Performance ratings reflect actual project outcomes — not self-reported reviews.",
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
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 relative overflow-hidden bg-card/20">
      {/* Background decoration */}
      <div
        className="absolute left-0 top-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)" }}
      />
      <div
        className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.025]"
        style={{ background: "radial-gradient(circle, oklch(0.70 0.15 85), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Mission statement */}
        <div className="max-w-3xl mb-16 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Why we exist</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-6">
            One request, one contractor.
            <span className="gradient-text"> No bidding wars, no exceptions.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Most platforms distribute your contact information to 5–15 contractors simultaneously and present that as a service. We built the opposite: exclusive, fully documented project requests for contractors, and a single verified professional for homeowners.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12 reveal" style={{ transitionDelay: "80ms" }}>
          <div className="h-px flex-1 bg-border/30" />
          <span className="text-xs text-muted-foreground tracking-wider uppercase font-medium">Our core commitments</span>
          <div className="h-px flex-1 bg-border/30" />
        </div>

        {/* Values grid */}
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

        {/* Closing brand statement */}
        <div
          className="mt-12 p-7 rounded-2xl border border-border/30 bg-secondary/20 reveal"
          style={{ transitionDelay: "500ms" }}
        >
          <p className="text-base lg:text-lg text-foreground/80 leading-relaxed max-w-3xl mx-auto text-center">
            Every project request includes photos, a written scope, a defined budget ceiling, and pre-selected consultation windows — all collected before any contractor is notified. The contractor who claims your project has reviewed all of it before showing up.
          </p>
        </div>
      </div>
    </section>
  )
}
