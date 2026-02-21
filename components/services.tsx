"use client"

import { TreePine, HardHat, Home, Flame, Fence, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

const categories = [
  {
    icon: TreePine,
    name: "Tree Removal",
    description: "Licensed removal of hazardous and non-hazardous trees, crown reduction, directional felling, stump grinding, and post-storm risk assessment. All contractors hold ISA-certified arborist credentials and adhere to ANSI A300 industry standards.",
    budget: "$500 – $8,000",
    available: true,
    tag: "Available",
  },
  {
    icon: HardHat,
    name: "Concrete Work",
    description: "Residential and commercial flatwork including driveways, patios, walkways, and retaining walls. Structural repair, stamped and exposed aggregate finishes. Mix design, PSI specification, and reinforcement documented before project start.",
    budget: "$1,200 – $15,000",
    available: true,
    tag: "Available",
  },
  {
    icon: Home,
    name: "Roofing",
    description: "Full tear-off and replacement, overlay systems, standing seam metal, TPO and modified bitumen flat roofing, emergency leak mitigation, and insurance-grade storm-damage documentation. All work performed to NRCA installation guidelines.",
    budget: "$300 – $25,000",
    available: true,
    tag: "Available",
  },
  {
    icon: Flame,
    name: "HVAC",
    description: "Central air installation, heat pump and ductless mini-split systems, furnace replacement, ductwork design and air-sealing, and preventive maintenance agreements. All technicians hold EPA 608 certification; equipment selections include ENERGY STAR-rated units.",
    budget: "$3,000 – $20,000",
    available: false,
    tag: "Coming Soon",
  },
  {
    icon: Fence,
    name: "Fencing",
    description: "Privacy, semi-privacy, and perimeter fencing in cedar, pressure-treated pine, vinyl, steel chain-link, ornamental iron, and agricultural wire. Posts set to frost-line depth and compliant with local zoning setback and HOA requirements.",
    budget: "$1,500 – $8,000",
    available: false,
    tag: "Coming Soon",
  },
  {
    icon: Zap,
    name: "Electrical",
    description: "Service panel upgrades (100A–400A), branch circuit additions, whole-home rewiring, subpanel installation, EV charger rough-in, and permit-ready NEC code compliance inspections. All work performed by licensed master or journeyman electricians.",
    budget: "$500 – $10,000",
    available: false,
    tag: "Coming Soon",
  },
]

type Filter = "all" | "available" | "soon"

const filters: { label: string; value: Filter }[] = [
  { label: "All Services", value: "all" },
  { label: "Available Now", value: "available" },
  { label: "Coming Soon", value: "soon" },
]

export function Services() {
  const [filter, setFilter] = useState<Filter>("all")
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

  const filtered = categories.filter((c) => {
    if (filter === "available") return c.available
    if (filter === "soon") return !c.available
    return true
  })

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
            Residential trade categories in the Topeka area
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We add categories only when there are enough verified contractors in the area to maintain
            response time and quality standards. Every request requires photos, a written scope, and a defined
            budget cap before a contractor is matched.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-8 reveal" style={{ transitionDelay: "100ms" }}>
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === f.value
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {f.label}
              {f.value === "available" && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${filter === f.value ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"}`}>
                  3
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cat, i) => (
            <div
              key={cat.name}
              className={`reveal group relative flex flex-col p-6 rounded-2xl border transition-all duration-300 cursor-default ${
                cat.available
                  ? "bg-card border-border/40 hover-glow"
                  : "bg-secondary/20 border-border/20"
              } ${hoveredCard === cat.name ? "translate-y-[-2px]" : ""}`}
              style={{ transitionDelay: `${i * 80}ms` }}
              onMouseEnter={() => setHoveredCard(cat.name)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Available badge */}
              {cat.available ? (
                <span className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                  </span>
                  Live
                </span>
              ) : (
                <span className="absolute top-4 right-4 text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  Coming Soon
                </span>
              )}

              {/* Icon */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-transform duration-300 ${
                cat.available ? "bg-primary/10" : "bg-secondary"
              } ${hoveredCard === cat.name && cat.available ? "scale-110" : ""}`}>
                <cat.icon className={`h-5 w-5 ${cat.available ? "text-primary" : "text-muted-foreground"}`} />
              </div>

              <h3 className="text-base font-semibold mb-1.5">{cat.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{cat.description}</p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Typical range</p>
                  <p className="text-sm font-semibold text-foreground">{cat.budget}</p>
                </div>
                {cat.available && (
                  <Link
                    href="/login?tab=signup"
                    className={`inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-all duration-200 ${hoveredCard === cat.name ? "translate-x-1" : ""}`}
                  >
                    Request <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center reveal" style={{ transitionDelay: "500ms" }}>
          <Link
            href="/login?tab=signup"
            className="btn-shimmer inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Submit a Request
          </Link>
          <p className="text-sm text-muted-foreground">
            Don&apos;t see your category?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Tell us about it
            </Link>{" "}
            — we prioritize expansion based on demand.
          </p>
        </div>
      </div>
    </section>
  )
}
