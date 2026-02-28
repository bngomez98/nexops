"use client"

import { useEffect, useRef } from "react"
import { Users, ShieldCheck, FileText, Award } from "lucide-react"

const values = [
  {
    icon: Users,
    title: "Dedicated coordination for every project",
    body: "Nexus manages each project end-to-end. One contractor is assigned exclusively per request, and coordination continues from the initial service request through completion.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: ShieldCheck,
    title: "Licensed, insured, verified contractors",
    body: "Every contractor in the Nexus network undergoes license verification, insurance confirmation, and a background check before they can access project requests.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    icon: FileText,
    title: "Complete documentation before dispatch",
    body: "Property owners submit photos, a written scope, and a defined budget ceiling before any contractor is notified. Contractors review all documentation before claiming and arriving prepared.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    icon: Award,
    title: "Post Implementation Review on every project",
    body: "After completion, Nexus delivers a Post Implementation Review evaluating project outcomes and providing insights to homeowners and property managers for ongoing strategic decision-making.",
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
        style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
      />
      <div
        className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.025]"
        style={{ background: "radial-gradient(circle, var(--chart-2), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-16 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">What Nexus delivers</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-6">
            End-to-end coordination built on
            <span className="gradient-text"> verification, documentation, and accountability.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nexus Operations connects property owners and managers with licensed contractors through a
            structured coordination process. Every project is exclusively assigned to one verified contractor,
            fully documented before dispatch, and reviewed after completion.
          </p>
        </div>

        <div className="flex items-center gap-4 mb-12 reveal" style={{ transitionDelay: "80ms" }}>
          <div className="h-px flex-1 bg-border/30" />
          <span className="text-xs text-muted-foreground tracking-wider uppercase font-medium">Core commitments</span>
          <div className="h-px flex-1 bg-border/30" />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="reveal group flex gap-5 p-6 rounded-2xl bg-card border border-border/40 hover:border-border/70 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 cursor-default"
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
          <blockquote className="text-center">
            <p className="text-lg lg:text-xl font-medium text-foreground/90 leading-relaxed max-w-3xl mx-auto">
              &ldquo;Nexus is a strategic and dependable partner providing skilled labor and intelligence &mdash;
              from the first request through project completion and beyond.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-muted-foreground">
              Nexus Operations
            </footer>
          </blockquote>
          <p className="text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center mt-4">
            Every project request includes photos, a written scope, a defined budget ceiling, and
            pre-selected consultation windows &mdash; all collected before any contractor is notified.
          </p>
        </div>
      </div>
    </section>
  )
}
