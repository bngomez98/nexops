import { ShieldCheck, Clock, Receipt, Users } from "lucide-react"

const values = [
  {
    icon: ShieldCheck,
    title: "Verified Contractor Network",
    description:
      "Every contractor in our network holds a current Kansas business license, carries minimum $500K/$1M liability coverage, and passes background screening. We reverify annually.",
    accent: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-100",
  },
  {
    icon: Clock,
    title: "Guaranteed Response Times",
    description:
      "Contractual response commitments by urgency: emergency assignments within 1 hour, urgent within 4, routine within 24. If a contractor declines, backup assignment is automatic.",
    accent: "text-amber-600",
    bg: "bg-amber-50 border-amber-100",
  },
  {
    icon: Receipt,
    title: "Unified monthly invoicing",
    description:
      "One consolidated invoice per billing cycle covering every job across every property, with line-item detail by trade, urgency, and contractor. No separate paperwork to track down.",
    title: "Transparent Pricing",
    description:
      "No retainers, no hidden fees. Simple subscription plans for homeowners and contractors. One invoice per billing cycle covering all coordinated work.",
    accent: "text-primary",
    bg: "bg-primary/8 border-primary/15",
  },
  {
    icon: Users,
    title: "One Point of Contact",
    description:
      "Instead of managing 15 separate vendor relationships, submit one request. Nexus Operations handles trade matching, scheduling, quality assurance, and payment coordination, with a single monthly invoice.",
    accent: "text-violet-600",
    bg: "bg-violet-50 border-violet-100",
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
            A single coordinator for
            <br className="hidden sm:block" />
            every property maintenance request.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Property managers spend 8-15 hours per week contacting contractors,
            confirming arrivals, and following up on incomplete work. Nexus
            Operations handles those tasks instead.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="group p-6 lg:p-8 rounded-xl bg-card border border-border hover:border-primary/20 transition-all duration-200 hover:shadow-md"
            >
              <div className={`flex items-center justify-center w-11 h-11 rounded-xl border ${v.bg} mb-5`}>
                <v.icon className={`h-5 w-5 ${v.accent}`} />
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
