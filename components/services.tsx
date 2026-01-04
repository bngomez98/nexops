import { Search, Package, Clipboard, Wrench, Zap, Users } from "lucide-react"

const services = [
  {
    icon: Search,
    title: "Product Sourcing",
    description:
      "We research suppliers, compare pricing and quality, negotiate when possible, and coordinate the entire purchase through delivery. You get options, recommendations, and full documentation—without spending hours hunting.",
    examples: ["Electronics & tech equipment", "Furniture & home goods", "Specialized materials", "Bulk purchases"],
  },
  {
    icon: Package,
    title: "Resale & Fulfillment",
    description:
      "Curated products delivered with transparent vendor costs and service fees. We handle sourcing, quality checks, and logistics—you get reliable fulfillment with complete visibility into margins.",
    examples: ["Curated product selection", "Quality verification", "White-glove delivery", "Full cost transparency"],
  },
  {
    icon: Clipboard,
    title: "Service Coordination",
    description:
      "From home repairs to professional appointments, we find qualified providers, gather quotes, schedule work, and ensure completion. Full vendor vetting, timeline management, and quality follow-up.",
    examples: ["Home services & repairs", "Professional services", "Appointment scheduling", "Multi-vendor projects"],
  },
  {
    icon: Wrench,
    title: "Project Support",
    description:
      "One-time tasks like relocations, event planning, or tech installations handled end-to-end. We scope requirements, coordinate vendors, track progress, and deliver complete documentation.",
    examples: ["Office/home moves", "Event logistics", "Tech setup", "Vendor management"],
  },
  {
    icon: Zap,
    title: "On-Demand Support",
    description:
      "Flexible hourly assistance for tasks that don't fit standard categories. Standard or rush rates available, transparent billing, and first-hour satisfaction guarantee on all work.",
    examples: ["Research tasks", "Administrative support", "Quick coordination", "Urgent requests"],
  },
  {
    icon: Users,
    title: "Personal Concierge",
    description:
      "Your dedicated point of contact for ongoing needs. Mix and match services with priority access, personalized attention, and consistent support from someone who knows your preferences.",
    examples: ["Dedicated support", "Priority handling", "Custom packages", "Long-term partnership"],
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
