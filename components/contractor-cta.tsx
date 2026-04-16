import Link from "@/components/link"
import { ArrowRight, FileText, Clock, DollarSign } from "lucide-react"

const benefits = [
  {
    icon: FileText,
    title: "Full project visibility before you commit",
    description: "Scope, photos, budget, and owner-confirmed availability are all provided upfront. You know exactly what the job entails before accepting.",
  },
  {
    icon: Clock,
    title: "One contractor per request",
    description: "Nexus assigns a single qualified contractor per request, matched by trade and location. Review at your own pace and accept when ready.",
  },
  {
    icon: DollarSign,
    title: "Flat monthly membership",
    description: "One subscription covers access to available requests in your area. No commissions, no per-job fees — your earnings stay yours.",
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
              Every request fully documented before you arrive
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Licensed, insured contractors in Topeka and surrounding areas get matched with
              property owners who have documented their project in full — scope, photos, budget,
              and scheduling all provided before you commit.
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
