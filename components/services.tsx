"use client"

import {
  Siren,
  Axe,
  Layers,
  Home,
  Thermometer,
  Fence,
  Zap,
  Droplets,
  Shovel,
  Droplet,
  Wrench,
  Users,
  Network,
  FileText,
  Monitor,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

const serviceCategories = [
  {
    icon: Siren,
    name: "Emergency Response",
    description: "Priority routing for urgent situations — burst pipes, storm damage, electrical hazards, and other time-sensitive emergencies. Contractors dispatched immediately.",
    tag: "Live",
    tagStyle: "emergency",
  },
  {
    icon: Axe,
    name: "Tree Removal",
    description: "Licensed removal of hazardous, diseased, and storm-damaged trees. Stump grinding and debris cleanup included.",
    tag: "Live",
    tagStyle: "live",
  },
  {
    icon: Layers,
    name: "Concrete Work",
    description: "Driveway repaving, patio slabs, sidewalk replacement, foundation crack repair, and waterproofing.",
    tag: "Live",
    tagStyle: "live",
  },
  {
    icon: Home,
    name: "Roofing",
    description: "Full roof replacements, storm damage repair, leak remediation, and inspection services.",
    tag: "Live",
    tagStyle: "live",
  },
  {
    icon: Droplet,
    name: "Water Damage / Remediation",
    description: "Water damage assessment, moisture remediation, mold prevention, and structural drying after flooding or pipe failures.",
    tag: "Live",
    tagStyle: "live",
  },
  {
    icon: Thermometer,
    name: "HVAC",
    description: "Heating, cooling, and ventilation installation, repair, and seasonal maintenance.",
    tag: "Launching Q3",
    tagStyle: "soon",
  },
  {
    icon: Fence,
    name: "Fencing",
    description: "Privacy fences, security fencing, gate installation, and fence repair across all material types.",
    tag: "Launching Q3",
    tagStyle: "soon",
  },
  {
    icon: Zap,
    name: "Electrical",
    description: "Panel upgrades, outlet and fixture installation, safety inspections, and code compliance work.",
    tag: "Launching Q4",
    tagStyle: "soon",
  },
  {
    icon: Droplets,
    name: "Plumbing",
    description: "Pipe repair and replacement, fixture installation, drain cleaning, and water heater service.",
    tag: "Launching Q4",
    tagStyle: "soon",
  },
  {
    icon: Shovel,
    name: "Excavation",
    description: "Site grading, trenching, land clearing, and preparation for construction or landscaping projects.",
    tag: "2026",
    tagStyle: "platform",
  },
  {
    icon: Wrench,
    name: "General Maintenance",
    description: "Scheduled preventive maintenance, minor repairs, and property upkeep coordinated through your NexOps partner.",
    tag: "Live",
    tagStyle: "live",
  },
]

const consultingServices = [
  {
    icon: Users,
    name: "Operations Consulting",
    description: "We analyze your current workflows, vendor relationships, and coordination processes — and deliver a documented operations framework tailored to your portfolio.",
    tag: "Available Now",
    tagStyle: "consulting",
  },
  {
    icon: Network,
    name: "Workflow Coordination",
    description: "A dedicated coordination layer between your team and your vendors. Scheduling, scope documentation, and follow-through managed by your NexOps partner.",
    tag: "Available Now",
    tagStyle: "consulting",
  },
  {
    icon: FileText,
    name: "Vendor Relationship Management",
    description: "We build, maintain, and coordinate your vendor network on your behalf — from onboarding to ongoing relationship management.",
    tag: "Available Now",
    tagStyle: "consulting",
  },
  {
    icon: Monitor,
    name: "NexOps Platform",
    description: "A purpose-built SaaS platform for tracking projects, vendors, workflows, and relationships across your entire portfolio — built from real client engagements.",
    tag: "Launching 2026",
    tagStyle: "platform",
  },
]

const tagStyles: Record<string, string> = {
  live: "text-primary bg-primary/10 border border-primary/20",
  emergency: "text-red-400 bg-red-500/10 border border-red-500/20",
  soon: "text-amber-400 bg-amber-400/10 border border-amber-400/20",
  platform: "text-violet-400 bg-violet-400/10 border border-violet-400/20",
  consulting: "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20",
}

export function Services() {
  const [tab, setTab] = useState<"services" | "consulting">("services")
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

  const displayedServices = tab === "services" ? serviceCategories : consultingServices

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
            Full-service maintenance, remediation, and emergency response.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every project is coordinated end-to-end — from the moment you submit a request to the
            Post Implementation Review after completion. Emergency or planned, we manage it.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex items-center gap-1 mb-8 reveal" style={{ transitionDelay: "50ms" }}>
          <div className="inline-flex rounded-xl border border-border/40 bg-secondary/30 p-1 gap-1">
            <button
              type="button"
              onClick={() => setTab("services")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                tab === "services"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Contractor Services
            </button>
            <button
              type="button"
              onClick={() => setTab("consulting")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                tab === "consulting"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Consulting &amp; Platform
            </button>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedServices.map((svc, i) => (
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
                  tagStyles[svc.tagStyle] ?? tagStyles.soon
                }`}
              >
                {svc.tag}
              </span>

              {/* Icon */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                svc.tagStyle === "emergency" ? "bg-red-500/10" : "bg-primary/10"
              } transition-transform duration-300 ${
                hoveredCard === svc.name ? "scale-110" : ""
              }`}>
                <svc.icon className={`h-5 w-5 ${svc.tagStyle === "emergency" ? "text-red-400" : "text-primary"}`} />
              </div>

              <h3 className="text-base font-semibold mb-1.5">{svc.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{svc.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center reveal" style={{ transitionDelay: "500ms" }}>
          <Link
            href="/login"
            className="btn-shimmer inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Submit a Request
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-sm text-muted-foreground">
            Property managers?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Schedule a consultation
            </Link>{" "}
            to discuss your portfolio needs.
          </p>
        </div>
      </div>
    </section>
  )
}
