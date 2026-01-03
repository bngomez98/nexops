import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, DollarSign, Sparkles } from "lucide-react"

const pricingTiers = [
  {
    name: "Quick Sourcing",
    price: "$99",
    period: "per request",
    description: "Perfect for single purchases and simple tasks",
    features: [
      "Research 2-3 best-fit options",
      "Price and quality comparison report",
      "Complete purchase and delivery coordination",
      "Real-time tracking and updates",
      "5-10% success fee on items over $150",
    ],
  },
  {
    name: "Project Coordination",
    price: "From $149",
    period: "per project",
    description: "End-to-end management for bigger tasks",
    features: [
      "Multiple vendor quotes and comparison",
      "Full scheduling and appointment coordination",
      "Progress updates and status reports",
      "Documentation and receipt management",
      "Post-project follow-up and support",
    ],
    highlighted: true,
  },
  {
    name: "Hourly Support",
    price: "$49",
    period: "per hour",
    description: "Flexible help when you need it",
    features: [
      "Standard rate: $49/hour",
      "Rush service: $79/hour (same-day)",
      "30-minute minimum billing increment",
      "First-hour satisfaction guarantee",
      "No monthly minimums or contracts",
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-28 md:py-36 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full text-sm font-bold tracking-wider text-accent mb-6 uppercase border border-accent/20">
            <DollarSign className="h-4 w-4" />
            Transparent Pricing
          </div>
          {/* </CHANGE> */}
          <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8">
            Simple, <span className="text-accent">honest</span> pricing
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            No hidden fees or surprise charges. Every engagement starts with a clear estimate and our first-hour
            satisfaction guarantee.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`p-10 flex flex-col relative overflow-hidden transition-all duration-300 ${
                tier.highlighted
                  ? "ring-2 ring-primary shadow-2xl scale-[1.05] bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-3xl"
                  : "bg-card hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-bold tracking-wider uppercase px-6 py-2 rounded-bl-2xl shadow-lg">
                  <Sparkles className="inline h-3 w-3 mr-1" />
                  Most Popular
                </div>
              )}
              <div className="text-center mb-10 mt-6">
                <h3 className="text-2xl font-serif font-bold mb-4 text-foreground">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-2 mb-3">
                  <span className="text-6xl font-serif font-bold text-primary">{tier.price}</span>
                  <span className="text-sm text-muted-foreground font-medium">{tier.period}</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div
                      className={`p-1 rounded-full ${tier.highlighted ? "bg-primary/10" : "bg-muted"} shrink-0 mt-0.5`}
                    >
                      <Check className={`h-4 w-4 ${tier.highlighted ? "text-primary" : "text-foreground"}`} />
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                size="lg"
                variant={tier.highlighted ? "default" : "outline"}
              >
                {tier.highlighted ? "Get Started Now" : "Choose Plan"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
        {/* </CHANGE> */}

        <div className="bg-gradient-to-br from-card to-secondary/50 rounded-3xl p-12 max-w-5xl mx-auto border-2 border-primary/20 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-bold tracking-wider text-primary mb-4 uppercase border border-primary/20">
              <Sparkles className="h-4 w-4" />
              The Nexus Promise
            </div>
            <h3 className="font-serif text-4xl font-bold text-foreground">Guaranteed satisfaction, every time</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4 bg-background/50 p-6 rounded-2xl border border-border/50">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-foreground">Same-Day Response</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All requests answered within business hours, most within 2 hours
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-background/50 p-6 rounded-2xl border border-border/50">
              <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 shrink-0">
                <Check className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-foreground">Upfront Estimates</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Clear cost breakdown before any work begins
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-background/50 p-6 rounded-2xl border border-border/50">
              <div className="p-3 rounded-xl bg-chart-3/10 border border-chart-3/20 shrink-0">
                <Check className="h-6 w-6 text-chart-3" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-foreground">Quality Guarantee</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If items or services aren't as promised, we handle corrections
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-background/50 p-6 rounded-2xl border border-border/50">
              <div className="p-3 rounded-xl bg-chart-5/10 border border-chart-5/20 shrink-0">
                <Check className="h-6 w-6 text-chart-5" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-foreground">Transparent Margins</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All vendor fees and success fees disclosed upfront
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* </CHANGE> */}
      </div>
    </section>
  )
}
