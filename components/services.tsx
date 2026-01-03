import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Clipboard, Package, Wrench, Zap, ArrowRight } from "lucide-react"

const services = [
  {
    icon: Search,
    title: "Product Acquisition",
    description:
      "End-to-end procurement including vendor evaluation, price negotiation, purchase execution, and delivery coordination.",
  },
  {
    icon: Package,
    title: "Resale Operations",
    description:
      "Product sourcing with transparent margin disclosure, quality assurance, logistics management, and warranty documentation.",
  },
  {
    icon: Clipboard,
    title: "Service Coordination",
    description:
      "Contractor sourcing, proposal evaluation, scheduling management, and quality oversight for professional services.",
  },
  {
    icon: Wrench,
    title: "Project Execution",
    description:
      "Multi-phase project management including planning, vendor coordination, timeline tracking, and completion verification.",
  },
  {
    icon: Zap,
    title: "On-Demand Support",
    description:
      "Flexible assistance for complex tasks, administrative coordination, and specialized research with hourly billing.",
  },
]

export function Services() {
  return (
    <section id="services" className="py-28 md:py-36 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-24 max-w-3xl">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Core capabilities</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Professional support services designed for clarity and measurable outcomes. Each engagement includes
            detailed documentation and transparent pricing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-card border-border/50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8" />
              <div className="relative flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 shadow-lg group-hover:scale-110 transition-transform">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className="text-5xl font-serif font-light text-muted-foreground/10">{index + 1}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-balance group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{service.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-20">
          <Button
            size="lg"
            className="text-lg px-10 h-14 shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-primary hover:bg-primary/90 font-semibold"
          >
            Request Service
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
