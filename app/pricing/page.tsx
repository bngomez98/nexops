import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Contractor Pricing | Subscription Tiers",
  description:
    "Monthly subscription pricing for contractors. Basic, Premium, and Elite tiers. No per-lead fees, no annual contracts. Exclusive leads for licensed, insured contractors.",
}

const tiers = [
  {
    name: "Basic",
    price: "$200-$300",
    period: "/month",
    description: "Standard FCFS access to all leads in your category and coverage area.",
    features: [
      "All requests in your service category",
      "Real-time notifications when posted",
      "Unlimited claims per month",
      "Standard FCFS visibility",
      "Basic account dashboard",
      "Email and SMS notifications",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$350-$450",
    period: "/month",
    description: "60-second advance notification and performance analytics.",
    features: [
      "Everything in Basic",
      "60-second advance notification window",
      "Priority visibility on high-value requests",
      "Performance analytics dashboard",
      "Conversion metrics and benchmarking",
      "Custom notification preferences",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Elite",
    price: "$550-$700",
    period: "/month",
    description: "5-minute exclusive window on top 20% requests, plus dedicated support.",
    features: [
      "Everything in Premium",
      "5-minute exclusive window on top 20% requests",
      "Dedicated account manager",
      "Custom service area configuration",
      "Custom budget threshold settings",
      "Priority support line",
    ],
    cta: "Contact Us",
    highlighted: false,
  },
]

const categories = [
  { name: "Tree Removal", basic: "$300", premium: "$400", elite: "$600" },
  { name: "Concrete Work", basic: "$300", premium: "$400", elite: "$600" },
  { name: "Roofing", basic: "$350", premium: "$450", elite: "$650" },
  { name: "HVAC", basic: "$350", premium: "$450", elite: "$650" },
  { name: "Fencing", basic: "$250", premium: "$350", elite: "$550" },
  { name: "Electrical", basic: "$300", premium: "$400", elite: "$600" },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-primary text-sm font-medium tracking-wide mb-4">Pricing</p>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight mb-4">
                Simple monthly subscription
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                No per-lead fees. No annual contracts. Choose a tier, pick your category,
                and start claiming exclusive leads. Pricing varies by service category value.
              </p>
            </div>
          </div>
        </section>

        {/* Tier Cards */}
        <section className="pb-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`p-8 rounded-xl border flex flex-col ${
                    tier.highlighted
                      ? "bg-primary/5 border-primary/30"
                      : "bg-card border-border/40"
                  }`}
                >
                  {tier.highlighted && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded self-start mb-4">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-semibold text-primary">{tier.price}</span>
                    <span className="text-sm text-muted-foreground">{tier.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>
                  <ul className="flex flex-col gap-3 mb-8 flex-grow">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-opacity ${
                      tier.highlighted
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "bg-secondary text-secondary-foreground hover:opacity-80"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category Pricing Table */}
        <section className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight mb-8">Pricing by service category</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left py-3 pr-6 font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Basic</th>
                    <th className="text-left py-3 px-4 font-medium text-primary">Premium</th>
                    <th className="text-left py-3 pl-4 font-medium text-muted-foreground">Elite</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.name} className="border-b border-border/20">
                      <td className="py-3 pr-6 text-foreground">{cat.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{cat.basic}/mo</td>
                      <td className="py-3 px-4 text-foreground font-medium">{cat.premium}/mo</td>
                      <td className="py-3 pl-4 text-muted-foreground">{cat.elite}/mo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              Commercial service access adds a 50% premium on top of residential pricing.
              All prices in USD. No setup fees.
            </p>
          </div>
        </section>

        {/* Free for homeowners */}
        <section className="py-24 lg:py-32">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Free for homeowners</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Property owners never pay to submit a request. Our service is funded entirely by
              contractor subscriptions. Submit your project, get matched, and schedule a
              consultation at no cost.
            </p>
            <Link
              href="/#submit"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Submit a Request
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
