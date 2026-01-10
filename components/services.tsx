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
    <section id="services" className="py-28 md:py-36 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block text-sm font-semibold tracking-widest text-primary/80 mb-6 uppercase">
            What We Do
          </div>
          <h2 className="font-serif text-5xl md:text-7xl font-light leading-[1.1] mb-8 text-balance">
            Services built for
            <br />
            <span className="text-primary">busy professionals</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            From single purchases to complex multi-vendor projects, we deliver expert coordination with fixed pricing
            and measurable results.
          </p>
        </div>

        <div className="space-y-1">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group relative py-12 px-8 border-b border-border/50 hover:bg-primary/5 transition-all duration-300 ${
                index === 0 ? "border-t" : ""
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex items-start gap-6 lg:w-2/5 shrink-0">
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary group-hover:border-primary transition-colors shrink-0">
                    <service.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                </div>

                <div className="lg:w-3/5 pl-0 lg:pl-8 lg:border-l lg:border-border/50">
                  <div className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-4">
                    Common Requests
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {service.examples.map((example, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-foreground hover:text-primary border-2 border-border hover:border-primary transition-colors rounded-lg"
          >
            Request a Service
          </a>
        </div>
      </div>
    </section>
  )
}
