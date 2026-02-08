import Link from "next/link"
import { ArrowRight, ShieldCheck, Clock, DollarSign } from "lucide-react"

const benefits = [
  {
    icon: ShieldCheck,
    title: "Exclusive leads",
    description: "Every lead you claim is yours alone. No competing with 5 other contractors for the same job.",
  },
  {
    icon: Clock,
    title: "Pre-qualified requests",
    description: "Photos, specs, budget cap, and consultation times are provided before you claim. No wasted estimate visits.",
  },
  {
    icon: DollarSign,
    title: "Predictable cost",
    description: "Monthly subscription from $200-$400. No per-lead fees, no surprise charges, cancel anytime.",
  },
]

export function ContractorCTA() {
  return (
    <section className="py-24 lg:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-primary text-sm font-medium tracking-wide mb-3">For contractors</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
              Stop wasting time on shared leads
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              If you are a licensed, insured contractor in Topeka and surrounding areas,
              Nexus Operations sends you exclusive leads with full project documentation.
              First-come, first-served. No bidding wars.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contractors"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Join the Network
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                View Pricing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border/40">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
