"use client"

import { useEffect, useRef } from "react"
import { ShieldCheck, FileCheck2, BadgeCheck, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"

const principles = [
  {
    label: "Exclusivity is structural",
    body: "As soon as one contractor claims a project, it is automatically removed from all other contractor feeds.",
    icon: ShieldCheck,
    accent: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
  },
  {
    label: "Documentation is automatic",
    body: "Submission, consultation, estimate, project completion, and review are all timestamped in one project trail.",
    icon: FileCheck2,
    accent: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
  },
  {
    label: "Verification is mandatory",
    body: "Contractors must pass license, insurance, and background checks before they can view any project.",
    icon: BadgeCheck,
    accent: "from-violet-500/20 to-violet-500/5 border-violet-500/30",
  },
  {
    label: "Transparency before contact",
    body: "Budget ceilings, photos, and scope are captured up front so every conversation starts with full context.",
    icon: Eye,
    accent: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
  },
]

const flow = ["Project submitted", "Contractor matched", "Consultation confirmed", "Work completed", "Post review logged"]

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
      { threshold: 0.08 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 border-b border-border/40 overflow-hidden">
      <div className="absolute -top-24 right-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="reveal max-w-3xl mb-12">
          <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase mb-4">Why Nexus Exists</p>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight leading-tight mb-4 text-balance">
            Built for one clear outcome: less chaos, more accountability.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We replaced bidding chaos with a structured workflow that gives property owners one verified contractor and a fully documented project path.
          </p>
        </div>

        <div className="reveal rounded-2xl border border-border/50 bg-card/50 p-4 sm:p-6 mb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Workflow visibility</p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {flow.map((step, i) => (
              <div key={step} className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/70 px-3 py-1.5 text-xs sm:text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-[11px] font-semibold">{i + 1}</span>
                {step}
                {i < flow.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {principles.map((p, i) => {
            const Icon = p.icon
            return (
              <div
                key={p.label}
                className="reveal group rounded-2xl border border-border/50 bg-card/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border bg-gradient-to-br ${p.accent}`}>
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-2">{p.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            )
          })}
        </div>

        <div className="reveal mt-12 rounded-2xl border border-primary/25 bg-primary/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-foreground/90">See how these principles are enforced in every request lifecycle.</p>
          <Link href="/#how-it-works" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            Explore the process
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
