"use client"

import { TreePine, Hammer, Home, Wind, Fence, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

const services = [
  {
    icon: TreePine,
    name: "Tree Removal",
    description: "This category covers tree removal and stump grinding services. Contractors are licensed professionals with the required certifications.",
    range: "$500 – $8,000",
    available: true,
  },
  {
    icon: Hammer,
    name: "Concrete Work",
    description: "This includes installation and repair of driveways, patios, walkways, and retaining walls, as well as structural repairs and custom finishes.",
    range: "$1,200 – $15,000",
    available: true,
  },
  {
    icon: Home,
    name: "Roofing",
    description: "Services encompass full roof replacements, repairs, and emergency measures to address leaks. All contractors are licensed and insured.",
    range: "$300 – $25,000",
    available: true,
  },
  {
    icon: Wind,
    name: "HVAC",
    description: "This category involves the installation and replacement of heating and cooling systems. Technicians are licensed and hold EPA certification.",
    range: "$3,000 – $20,000",
    available: true,
  },
  {
    icon: Fence,
    name: "Fencing",
    description: "Services include the installation of privacy fencing, perimeter fencing, and decorative fencing options.",
    range: "$1,500 – $8,000",
    available: true,
  },
  {
    icon: Zap,
    name: "Electrical",
    description: "This covers panel upgrades, wiring installations, and EV charger setups. A licensed electrician is assigned to each project.",
    range: "$500 – $10,000",
    available: true,
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
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Service categories</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            All services available now in Topeka.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Six service categories are currently available. Every project request must include
            photographs, a written scope of work, and a defined maximum budget before a contractor
            is assigned. The platform expands categories based on demand.
          </p>
        </div>

        {/* Cards grid */}
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
              {/* Available badge */}
              <span className="absolute top-4 right-4 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded text-primary bg-primary/10 border border-primary/20">
                Available
              </span>

              {/* Icon */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-primary/10 transition-transform duration-300 ${
                hoveredCard === svc.name ? "scale-110" : ""
              }`}>
                <svc.icon className="h-5 w-5 text-primary" />
              </div>

              <h3 className="text-base font-semibold mb-1.5">{svc.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{svc.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <span className="text-xs text-muted-foreground">Typical range: {svc.range}</span>
                <Link
                  href="/dashboard/homeowner/new"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Request
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 rounded-xl border border-border/40 bg-card/50 reveal" style={{ transitionDelay: "500ms" }}>
          <p className="text-sm text-muted-foreground text-center">
            If the required category is not listed, property owners can{" "}
            <Link href="/contact" className="text-primary hover:underline">
              submit details about their needs
            </Link>
            . The platform uses this information to prioritize future expansions.
          </p>
        </div>
      </div>
    </section>
  )
}
