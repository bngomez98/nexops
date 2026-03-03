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
            setTimeout(() => node.classList.add("in-view"), i * 80)
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
    <section ref={sectionRef} id="services" className="py-24 lg:py-32 border-b-2 border-foreground bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-12 reveal">
          <div className="construct-label mb-4">Service categories</div>
          <h2 className="text-4xl lg:text-5xl font-display uppercase mb-4">
            Maintenance, restoration, and remediation services
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nexus coordinates residential and commercial property needs across a growing range of trade
            categories. Each request requires project photos, a written scope, and a budget ceiling before
            dispatch, so contractors arrive prepared and property owners get a predictable project experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/15">
          {services.map((svc, i) => (
            <div
              key={svc.name}
              className={`reveal group relative flex flex-col p-6 bg-secondary border-0 transition-all duration-200 ${
                hoveredCard === svc.name ? "bg-card" : "bg-secondary"
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
              onMouseEnter={() => setHoveredCard(svc.name)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Left accent on hover */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-primary transition-opacity duration-200 ${
                hoveredCard === svc.name ? "opacity-100" : "opacity-0"
              }`} />

              <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border-2 border-primary text-primary bg-transparent">
                {svc.status}
              </span>

              <div className="flex items-center justify-center w-11 h-11 mb-5 bg-primary text-primary-foreground border-2 border-foreground">
                <svc.icon className="h-5 w-5" />
              </div>

              <h3 className="text-base font-black mb-2 uppercase tracking-tight">{svc.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{svc.description}</p>

              <div className="border-2 border-foreground/20 bg-background px-3 py-2 mb-4">
                <p className="text-xs text-muted-foreground font-bold">Typical range: <span className="text-foreground">{svc.range}</span></p>
                <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1.5 font-medium">
                  <Clock3 className="h-3 w-3 text-primary" />
                  {svc.timeline}
                </p>
              </div>

              <div className="flex items-center justify-end pt-2 border-t-2 border-foreground/10">
                <Link
                  href="/dashboard/homeowner/new"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline uppercase tracking-wide"
                >
                  Request service
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-0 p-5 border-2 border-foreground/20 bg-background reveal" style={{ transitionDelay: "500ms" }}>
          <p className="text-sm text-muted-foreground text-center">
            Need a category that is not listed? Share the project details through our{" "}
            <Link href="/contact" className="text-primary hover:underline font-bold">
              contact workflow
            </Link>
            , and we will use your request data to prioritize expansion.
          </p>
        </div>
      </div>
    </section>
  )
}
