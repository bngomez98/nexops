"use client"

import { TreePine, Hammer, Home, Wind, Fence, Zap, ArrowRight, Clock3, Droplets, Flame, AlertTriangle, Wrench } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

const services = [
  { icon: TreePine, name: "Tree Removal", description: "Removal, trimming coordination, and stump grinding for hazardous or overgrown trees.", range: "$500 - $8,000", timeline: "2-7 days typical scheduling" },
  { icon: Hammer, name: "Concrete Work", description: "Driveways, patios, walkways, retaining walls, and structural concrete repair.", range: "$1,200 - $15,000", timeline: "3-10 days based on curing" },
  { icon: Home, name: "Roofing", description: "Leak mitigation, repair scopes, and full replacement by licensed roofers.", range: "$300 - $25,000", timeline: "Emergency tarping same day" },
  { icon: Wind, name: "HVAC", description: "System replacement, major repairs, and installation by EPA-certified technicians.", range: "$3,000 - $20,000", timeline: "Priority dispatch available" },
  { icon: Fence, name: "Fencing", description: "Privacy, perimeter, and decorative fence installation with repair options.", range: "$1,500 - $8,000", timeline: "Material-dependent lead times" },
  { icon: Zap, name: "Electrical", description: "Panel upgrades, code-compliant wiring, and EV charger installations.", range: "$500 - $10,000", timeline: "Permit and inspection support" },
  { icon: Wrench, name: "Plumbing", description: "Pipe repair, fixture installation, water heater replacement, and drainage.", range: "$200 - $12,000", timeline: "Emergency service available" },
  { icon: Droplets, name: "Water Damage Restoration", description: "Water extraction, structural drying, mold prevention, and damage assessment.", range: "$1,000 - $15,000", timeline: "Emergency response within hours" },
  { icon: Flame, name: "Fire & Smoke Remediation", description: "Smoke damage assessment, odor removal, structural cleaning, and restoration.", range: "$2,000 - $30,000", timeline: "Assessment within 24 hours" },
  { icon: AlertTriangle, name: "Emergency Response", description: "After-hours and emergency coordination for urgent property damage.", range: "Varies by scope", timeline: "1-hour assignment target" },
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
            setTimeout(() => node.classList.add("in-view"), i * 60)
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
    <section ref={sectionRef} id="services" className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-12 reveal">
          <p className="section-label mb-4">Service categories</p>
          <h2 className="text-4xl lg:text-5xl font-display mb-4">
            Maintenance, restoration, and remediation services
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nexus coordinates residential and commercial property needs across a growing range of trade
            categories. Each request requires project photos, a written scope, and a budget ceiling before dispatch.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc, i) => (
            <div
              key={svc.name}
              className={`reveal group relative flex flex-col p-5 rounded-xl border border-border bg-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5`}
              style={{ transitionDelay: `${i * 50}ms` }}
              onMouseEnter={() => setHoveredCard(svc.name)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-center w-10 h-10 mb-4 rounded-lg bg-primary/10">
                <svc.icon className="h-5 w-5 text-primary" />
              </div>

              <h3 className="text-base font-semibold mb-1.5">{svc.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{svc.description}</p>

              <div className="rounded-lg bg-secondary border border-border px-3 py-2 mb-4">
                <p className="text-xs text-muted-foreground">Typical range: <span className="font-semibold text-foreground">{svc.range}</span></p>
                <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1.5">
                  <Clock3 className="h-3 w-3 text-primary" />
                  {svc.timeline}
                </p>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-border">
                <Link
                  href="/dashboard/homeowner/new"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Request service
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-5 rounded-xl border border-border bg-card text-center reveal" style={{ transitionDelay: "400ms" }}>
          <p className="text-sm text-muted-foreground">
            Need a category that is not listed? Share the project details through our{" "}
            <Link href="/contact" className="text-primary hover:underline font-medium">
              contact workflow
            </Link>
            , and we will use your request data to prioritize expansion.
          </p>
        </div>
      </div>
    </section>
  )
}
