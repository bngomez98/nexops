"use client"

import { TreePine, HardHat, Home, Flame, Fence, Zap, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

const categories = [
  {
    icon: TreePine,
    name: "Tree Removal",
    description: "Licensed removal of hazardous and non-hazardous trees, crown reduction, directional felling, stump grinding, and post-storm risk assessment. All contractors hold ISA-certified arborist credentials and adhere to ANSI A300 industry standards.",
    budget: "$500 – $8,000",
    available: true,
  },
  {
    icon: HardHat,
    name: "Concrete Work",
    description: "Residential and commercial flatwork including driveways, patios, walkways, and retaining walls. Structural repair, stamped and exposed aggregate finishes. Mix design, PSI specification, and reinforcement documented before project start.",
    budget: "$1,200 – $15,000",
    available: true,
  },
  {
    icon: Home,
    name: "Roofing",
    description: "Full tear-off and replacement, overlay systems, standing seam metal, TPO and modified bitumen flat roofing, emergency leak mitigation, and insurance-grade storm-damage documentation. All work performed to NRCA installation guidelines.",
    budget: "$300 – $25,000",
    available: true,
  },
  {
    icon: Flame,
    name: "HVAC",
    description: "Central air installation, heat pump and ductless mini-split systems, furnace replacement, ductwork design and air-sealing, and preventive maintenance agreements. All technicians hold EPA 608 certification; equipment selections include ENERGY STAR-rated units.",
    budget: "$3,000 – $20,000",
    available: false,
  },
  {
    icon: Fence,
    name: "Fencing",
    description: "Privacy, semi-privacy, and perimeter fencing in cedar, pressure-treated pine, vinyl, steel chain-link, ornamental iron, and agricultural wire. Posts set to frost-line depth and compliant with local zoning setback and HOA requirements.",
    budget: "$1,500 – $8,000",
    available: false,
  },
  {
    icon: Zap,
    name: "Electrical",
    description: "Service panel upgrades (100A–400A), branch circuit additions, whole-home rewiring, subpanel installation, EV charger rough-in, and permit-ready NEC code compliance inspections. All work performed by licensed master or journeyman electricians.",
    budget: "$500 – $10,000",
    available: false,
  },
]

type Filter = "all" | "available" | "soon"

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Open now", value: "available" },
  { label: "Coming soon", value: "soon" },
]

export function Services() {
  const [filter, setFilter] = useState<Filter>("all")
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
      { threshold: 0.08 }
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
    <section ref={sectionRef} id="services" className="py-24 lg:py-36 relative overflow-hidden">
      <div
        className="absolute left-0 top-1/3 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.025]"
        style={{ background: "radial-gradient(circle, oklch(0.76 0.17 158), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 reveal">
          <div className="max-w-xl">
            <p className="section-overline mb-4">Service categories</p>
            <h2 className="text-3xl lg:text-[2.5rem] font-bold tracking-[-0.02em] leading-[1.12]">
              Three categories open.
              <br />
              <span className="text-muted-foreground font-normal">More launching soon.</span>
            </h2>
          </div>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-sm lg:text-right">
            Every request requires project photos, a written scope, and a defined budget cap
            before we match a contractor — so the first meeting is productive.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 mb-10 reveal" style={{ transitionDelay: "80ms" }}>
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 ${
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              {f.label}
              {f.value === "available" && (
                <span className={`ml-2 text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                  filter === f.value ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"
                }`}>
                  3
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Service rows — editorial list style */}
        <div>
          {filtered.map((cat, i) => (
            <div
              key={cat.name}
              className="reveal group"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div
                className={`flex flex-col sm:flex-row sm:items-start gap-6 py-8 border-t transition-all duration-200 ${
                  cat.available ? "border-border/30 hover:border-border/55 cursor-default" : "border-border/20 opacity-60"
                }`}
              >
                {/* Icon + status */}
                <div className="flex items-center gap-4 sm:w-[200px] shrink-0">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                      cat.available
                        ? "bg-primary/10 border border-primary/20 group-hover:scale-105"
                        : "bg-secondary border border-border/30"
                    }`}
                  >
                    <cat.icon className={`h-4.5 w-4.5 ${cat.available ? "text-primary" : "text-muted-foreground/40"}`} size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{cat.name}</p>
                    {cat.available ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary mt-0.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                        </span>
                        Live
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mt-0.5 block">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="flex-1 text-[14px] text-muted-foreground leading-relaxed">
                  {cat.description}
                </p>

                {/* Budget + CTA */}
                <div className="sm:text-right shrink-0 sm:w-[160px] flex sm:flex-col justify-between items-center sm:items-end gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5 font-medium">Typical range</p>
                    <p className="text-sm font-semibold">{cat.budget}</p>
                  </div>
                  {cat.available && (
                    <Link
                      href="/login?tab=signup"
                      className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Request
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>

              {i === filtered.length - 1 && (
                <div className="border-b border-border/30" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-start reveal" style={{ transitionDelay: "440ms" }}>
          <Link
            href="/login?tab=signup"
            className="btn-shimmer inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] tracking-tight"
          >
            Submit a Request
          </Link>
          <p className="text-[13px] text-muted-foreground self-center">
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
