import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Sparkles } from "lucide-react"

const packages = [
  {
    name: "Starter Package",
    price: "$299",
    period: "per month",
    description: "Perfect for occasional sourcing and light coordination needs",
    features: [
      "Up to 3 sourcing requests per month",
      "Basic vendor research and comparison",
      "Purchase coordination and tracking",
      "Email support with same-day response",
      "Monthly summary report",
    ],
    cta: "Start Starter Plan",
  },
  {
    name: "Growth Package",
    price: "$649",
    period: "per month",
    description: "Ideal for regular operational support and project management",
    features: [
      "Up to 8 requests per month (any service type)",
      "Priority research and vendor negotiation",
      "Full project coordination and scheduling",
      "Dedicated account manager",
      "Weekly progress updates and monthly reports",
      "10% discount on hourly overflow work",
    ],
    highlighted: true,
    cta: "Choose Growth Plan",
  },
  {
    name: "Enterprise Package",
    price: "Custom",
    period: "tailored pricing",
    description: "Comprehensive operational support with unlimited access",
    features: [
      "Unlimited requests across all service categories",
      "Strategic vendor relationships and contracts",
      "Multi-project management and coordination",
      "Dedicated team and priority access",
      "Real-time updates and custom reporting",
      "Quarterly business reviews and optimization",
    ],
    cta: "Contact for Enterprise",
  },
]

export function ServicePackages() {
  return (
    <section id="packages" className="py-28 md:py-36 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full text-sm font-bold tracking-wider text-accent mb-6 uppercase border border-accent/20">
            <Sparkles className="h-4 w-4" />
            Service Packages
          </div>
          <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8">
            Predictable support, <span className="text-accent">predictable costs</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Choose a monthly package for recurring needs, or pay per-project for one-time tasks. No contracts required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg) => (
            <Card
              key={pkg.name}
              className={`p-10 flex flex-col relative overflow-hidden transition-all duration-300 ${
                pkg.highlighted
                  ? "ring-2 ring-primary shadow-2xl scale-[1.05] bg-gradient-to-br from-primary/5 to-accent/5"
                  : "bg-card hover:shadow-xl"
              }`}
            >
              {pkg.highlighted && (
                <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-bold tracking-wider uppercase px-6 py-2 rounded-bl-2xl shadow-lg">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-8 mt-6">
                <h3 className="text-2xl font-serif font-bold mb-4 text-foreground">{pkg.name}</h3>
                <div className="flex items-baseline justify-center gap-2 mb-3">
                  <span className="text-6xl font-serif font-bold text-primary">{pkg.price}</span>
                  <span className="text-sm text-muted-foreground font-medium">{pkg.period}</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">{pkg.description}</p>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div
                      className={`p-1 rounded-full ${pkg.highlighted ? "bg-primary/10" : "bg-muted"} shrink-0 mt-0.5`}
                    >
                      <Check className={`h-4 w-4 ${pkg.highlighted ? "text-primary" : "text-foreground"}`} />
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                size="lg"
                variant={pkg.highlighted ? "default" : "outline"}
              >
                {pkg.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Prefer to pay per project? Our{" "}
            <a href="#pricing" className="text-primary font-semibold hover:underline">
              per-request pricing
            </a>{" "}
            is still available for one-time tasks.
          </p>
        </div>
      </div>
    </section>
  )
}
