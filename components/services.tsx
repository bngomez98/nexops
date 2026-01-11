import { Search, Package, Clipboard, Wrench, Zap, Users } from "lucide-react"

const services = [
  {
    icon: Search,
    title: "Product Sourcing",
    description:
      "Looking for specialized equipment, bulk materials, or hard-to-find products? We research suppliers, compare options, negotiate pricing, and coordinate delivery. Save hours of hunting and get expert recommendations backed by real research.",
    examples: [
      "Tech equipment for your office",
      "Specialized tools or materials",
      "Bulk purchases with better pricing",
      "Items you can't find on Amazon",
    ],
  },
  {
    icon: Package,
    title: "Resale & Fulfillment",
    description:
      "Need products sourced and delivered with complete transparency? We handle the entire supply chain—from finding quality vendors to coordinating logistics—while showing you exactly what things cost and what you're paying for.",
    examples: [
      "Curated product selection",
      "Quality verification process",
      "Coordinated delivery",
      "Transparent vendor costs",
    ],
  },
  {
    icon: Clipboard,
    title: "Service Coordination",
    description:
      "Tired of getting multiple quotes and playing phone tag with contractors? We find qualified pros, vet them properly, get you competitive quotes, schedule the work, and make sure it's done right. You approve, we coordinate.",
    examples: [
      "Home repairs & renovations",
      "Professional service appointments",
      "Multi-contractor projects",
      "Quality verification & follow-up",
    ],
  },
  {
    icon: Wrench,
    title: "Project Management",
    description:
      "Planning an office move? Setting up tech? Organizing an event? We scope out what needs to happen, coordinate all the vendors, track progress, handle problems, and deliver everything documented. No detail left to chance.",
    examples: [
      "Office or home relocations",
      "Event planning & logistics",
      "Tech installations",
      "Complex vendor coordination",
    ],
  },
  {
    icon: Zap,
    title: "On-Demand Help",
    description:
      "Sometimes you just need someone to handle something—fast. Research a vendor, coordinate a quick task, solve an urgent problem. Flexible hourly support with transparent billing. First hour guaranteed or your money back.",
    examples: [
      "Urgent vendor research",
      "Quick coordination tasks",
      "Administrative support",
      "Rush requests (premium rates)",
    ],
  },
  {
    icon: Users,
    title: "Ongoing Partnership",
    description:
      "Have regular needs? Get a dedicated contact who learns your preferences, handles requests quickly, and prioritizes your work. Mix any services, get faster turnaround, and work with someone who actually knows your situation.",
    examples: ["Your dedicated coordinator", "Priority scheduling", "Custom service packages", "Consistent support"],
  },
]

export function Services() {
  return (
    <section id="services" className="py-32 md:py-40 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px]" />
      </div>
      {/* </CHANGE> */}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Our Services
          </div>
          <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light leading-[0.9] mb-10 max-w-4xl">
            Everything you need.
            <br />
            <span className="text-primary">Nothing you don't.</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            From single purchases to complex multi-vendor projects, we handle the research, negotiation, coordination,
            and quality control so you don't have to.
          </p>
        </div>
        {/* </CHANGE> */}

        <div className="space-y-px">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative bg-card/50 hover:bg-card border-b border-border/30 transition-all duration-300 hover:border-primary/30"
            >
              <div className="flex flex-col lg:flex-row gap-8 p-10 lg:p-12">
                <div className="flex items-start gap-6 lg:w-1/2">
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 group-hover:bg-primary group-hover:border-primary transition-all shrink-0 glow-primary">
                    <service.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-3xl font-light mb-4 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{service.description}</p>
                  </div>
                </div>

                <div className="lg:w-1/2 lg:pl-12 lg:border-l lg:border-border/30">
                  <div className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-6">
                    Common Use Cases
                  </div>
                  <div className="space-y-3">
                    {service.examples.map((example, i) => (
                      <div key={i} className="flex items-start gap-3 text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="leading-relaxed">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* </CHANGE> */}

        <div className="text-center mt-20">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all glow-primary"
          >
            Start Your Project
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
        {/* </CHANGE> */}
      </div>
    </section>
  )
}
