import { ShieldCheck, Clock, Receipt, Users } from "lucide-react"

const values = [
  {
    icon: ShieldCheck,
    title: "Verified Contractor Network",
    description:
      "Every contractor in our network holds a current Kansas business license, carries minimum $500K/$1M liability coverage, and passes background screening. We reverify annually.",
  },
  {
    icon: Clock,
    title: "Guaranteed Response Times",
    description:
      "Contractual response commitments by urgency: emergency assignments within 1 hour, urgent within 4, routine within 24. If a contractor declines, backup assignment is automatic.",
  },
  {
    icon: Receipt,
    title: "Transparent Cost-Plus Pricing",
    description:
      "No retainers, no subscription fees. You pay the contractor's quoted rate plus a transparent 25-35% coordination markup based on urgency. One invoice per billing cycle.",
  },
  {
    icon: Users,
    title: "One Point of Contact",
    description:
      "Stop managing 15 vendor relationships. Submit a request, we handle trade matching, scheduling, quality assurance, and payment coordination with a single monthly invoice.",
  },
]

export function ValueProposition() {
  return (
    <section className="py-24 lg:py-32 bg-secondary/50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Why Nexus Operations
          </p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-4 text-balance">
            The coordination layer your
            <br className="hidden sm:block" />
            properties have been missing.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Property managers spend 8-15 hours per week chasing contractors,
            confirming arrivals, and following up on incomplete work. We
            eliminate that burden entirely.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="p-6 lg:p-8 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary mb-5">
                <v.icon className="h-5 w-5 text-foreground/70" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
