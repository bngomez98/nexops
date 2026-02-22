"use client"

import { Users, Network, FileText, Monitor, ArrowRight, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

const services = [
  {
    icon: Users,
    name: "Operations Consulting",
    description: "We analyze your current workflows, vendor relationships, and coordination processes — and deliver a documented operations framework tailored to your portfolio.",
    tag: "Launching Soon",
    available: false,
    tagStyle: "early",
  },
  {
    icon: Network,
    name: "Workflow Coordination",
    description: "A dedicated coordination layer between your team and your vendors. Scheduling, scope documentation, and follow-through managed by your NexOps partner.",
    tag: "Launching Soon",
    available: false,
    tagStyle: "early",
  },
  {
    icon: FileText,
    name: "Vendor Relationship Management",
    description: "We build, maintain, and coordinate your vendor network on your behalf — from onboarding to ongoing relationship management. Your relationships, better managed.",
    tag: "Launching Soon",
    available: false,
    tagStyle: "early",
  },
  {
    icon: LayoutDashboard,
    name: "Fractional Operations Director",
    description: "For companies that need ongoing strategic operations leadership without a full-time hire. Your NexOps partner serves as your dedicated fractional ops director.",
    tag: "Launching Soon",
    available: false,
    tagStyle: "early",
  },
  {
    icon: Monitor,
    name: "NexOps Platform",
    description: "A purpose-built SaaS platform for tracking projects, vendors, workflows, and relationships across your entire portfolio — built from real client engagements.",
    tag: "2026",
    available: false,
    tagStyle: "platform",
  },
]

export function Services() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
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
    <section ref={sectionRef} id="services" className="py-24 lg:py-32 bg-card/30 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute left-0 top-1/3 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mb-10 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">What we offer</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            Consulting now. Platform in 2026.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every service is built around your actual operations — not a generic implementation.
            Early clients who engage now help shape what the platform becomes.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc, i) => (
            <div
              key={svc.name}
              className={`reveal group relative flex flex-col p-6 rounded-2xl border transition-all duration-300 cursor-default bg-card border-border/40 hover-glow ${
                hoveredCard === svc.name ? "translate-y-[-2px]" : ""
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
              onMouseEnter={() => setHoveredCard(svc.name)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Tag badge */}
              <span
                className={`absolute top-4 right-4 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded ${
                  svc.tagStyle === "platform"
                    ? "text-violet-400 bg-violet-400/10 border border-violet-400/20"
                    : "text-primary bg-primary/10 border border-primary/20"
                }`}
              >
                {svc.tag}
              </span>

              {/* Icon */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-primary/10 transition-transform duration-300 ${
                hoveredCard === svc.name ? "scale-110" : ""
              }`}>
                <svc.icon className="h-5 w-5 text-primary" />
              </div>

              <h3 className="text-base font-semibold mb-1.5">{svc.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{svc.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center reveal" style={{ transitionDelay: "500ms" }}>
          <Link
            href="/contact"
            className="btn-shimmer inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Request Early Access
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-sm text-muted-foreground">
            Not sure what you need?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Schedule a call
            </Link>{" "}
            — no obligation, no pressure.
          </p>
        </div>
      </div>
    </section>
  )
}
