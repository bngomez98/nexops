"use client"

import { useEffect, useRef } from "react"
import { Users, FileText, TrendingUp, Shield } from "lucide-react"

const values = [
  {
    icon: Users,
    title: "Relationship before process",
    body: "We coordinate through genuine relationships — with your vendors, your team, and your clients. Systems and software support relationships; they don't replace them. Every engagement is managed by a dedicated human partner, not a workflow automation.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: Shield,
    title: "Clients define the scope",
    body: "You set the priorities, the budget, and the outcomes you need. We operate within your framework and report to you — not to our own internal metrics. The engagement looks like what you need it to look like.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    icon: FileText,
    title: "Documentation as infrastructure",
    body: "Every vendor relationship, workflow decision, and coordination record is written down and accessible. When something needs to be referenced — or when your team changes — the knowledge stays with your organization.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    icon: TrendingUp,
    title: "Outcomes over activity",
    body: "We don't measure success by calls made or emails sent. We measure it by whether your operations run more smoothly because of what we did. If it doesn't move the needle for your portfolio, we won't bill you for it.",
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
            Property management operations deserve
            <span className="gradient-text"> more than a dashboard.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Most software assumes your team has the time and bandwidth to manage every vendor,
            document every workflow, and follow through on every coordination task. Most consultants
            deliver a report and leave. NexOps does both — we serve as your dedicated operations
            partner and, in 2026, deliver the platform built from your actual workflows.
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
          <blockquote className="text-center">
            <p className="text-lg lg:text-xl font-medium text-foreground/90 leading-relaxed max-w-3xl mx-auto">
              &ldquo;Operations management built on relationship — not just software.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-muted-foreground">
              Nexus Operations
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
