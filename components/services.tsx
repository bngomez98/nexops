"use client"

import { TreePine, Hammer, Home, Wind, Fence, Zap, ArrowRight, Clock3, Droplets, Flame, AlertTriangle, Wrench } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

const services = [
  {
    icon: TreePine,
    name: "Tree Removal",
    description: "Removal, trimming coordination, and stump grinding for hazardous or overgrown trees.",
    range: "$500 – $8,000",
    timeline: "2–7 days typical scheduling",
    status: "Available",
  },
  {
    icon: Hammer,
    name: "Concrete Work",
    description: "Driveways, patios, walkways, retaining walls, and structural concrete repair scopes.",
    range: "$1,200 – $15,000",
    timeline: "3–10 days based on curing windows",
    status: "Available",
  },
  {
    icon: Home,
    name: "Roofing",
    description: "Leak mitigation, repair scopes, and full replacement projects by licensed roofers.",
    range: "$300 – $25,000",
    timeline: "Emergency tarping same day when needed",
    status: "Available",
  },
  {
    icon: Wind,
    name: "HVAC",
    description: "System replacement, major repairs, and installation work handled by EPA-certified technicians.",
    range: "$3,000 – $20,000",
    timeline: "Priority dispatch for heating/cooling outages",
    status: "Available",
  },
  {
    icon: Fence,
    name: "Fencing",
    description: "Privacy, perimeter, and decorative fence installation with repair options.",
    range: "$1,500 – $8,000",
    timeline: "Material-dependent lead times",
    status: "Available",
  },
  {
    icon: Zap,
    name: "Electrical",
    description: "Panel upgrades, code-compliant wiring, and EV charger installations.",
    range: "$500 – $10,000",
    timeline: "Permit and inspection support included",
    status: "Available",
  },
  {
    icon: Wrench,
    name: "Plumbing",
    description: "Pipe repair, fixture installation, water heater replacement, and drainage solutions.",
    range: "$200 – $12,000",
    timeline: "Emergency service available",
    status: "Available",
  },
  {
    icon: Droplets,
    name: "Water Damage Restoration",
    description: "Water extraction, structural drying, mold prevention, and damage assessment coordination.",
    range: "$1,000 – $15,000",
    timeline: "Emergency response within hours",
    status: "Available",
  },
  {
    icon: Flame,
    name: "Fire & Smoke Remediation",
    description: "Smoke damage assessment, odor removal, structural cleaning, and restoration coordination.",
    range: "$2,000 – $30,000",
    timeline: "Assessment within 24 hours",
    status: "Available",
  },
  {
    icon: AlertTriangle,
    name: "Emergency Response",
    description: "After-hours and emergency coordination for urgent property damage requiring immediate contractor dispatch.",
    range: "Varies by scope",
    timeline: "1-hour assignment target",
    status: "Available",
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
      <div
        className="absolute left-0 top-1/3 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-10 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Service categories</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            Maintenance, restoration, and remediation services
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nexus coordinates residential and commercial property needs across a growing range of trade
            categories. Each request requires project photos, a written scope, and a budget ceiling before
            dispatch, so contractors arrive prepared and property owners get a predictable project experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc, i) => (
            <div
              key={svc.name}
              className={`reveal group relative flex flex-col p-6 rounded-2xl border transition-all duration-300 bg-card border-border/40 hover-glow ${
                hoveredCard === svc.name ? "translate-y-[-2px]" : ""
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
              onMouseEnter={() => setHoveredCard(svc.name)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <span className="absolute top-4 right-4 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded text-primary bg-primary/10 border border-primary/20">
                {svc.status}
              </span>

              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-primary/10 transition-transform duration-300 ${
                  hoveredCard === svc.name ? "scale-110" : ""
                }`}
              >
                <svc.icon className="h-5 w-5 text-primary" />
              </div>

              <h3 className="text-base font-semibold mb-1.5">{svc.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{svc.description}</p>

              <div className="rounded-lg border border-border/40 bg-secondary/40 px-3 py-2 mb-4">
                <p className="text-xs text-muted-foreground">Typical range: {svc.range}</p>
                <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1.5">
                  <Clock3 className="h-3 w-3" />
                  {svc.timeline}
                </p>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-border/30">
                <Link
                  href="/dashboard/homeowner/new"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Request service
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 rounded-xl border border-border/40 bg-card/50 reveal" style={{ transitionDelay: "500ms" }}>
          <p className="text-sm text-muted-foreground text-center">
            Need a category that is not listed? Share the project details through our{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contact workflow
            </Link>
            , and we will use your request data to prioritize expansion.
          </p>
        </div>
      </div>
    </section>
  )
}
