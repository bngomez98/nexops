import { Check, X } from "lucide-react"

const rows = [
  {
    label: "One project routed to one contractor",
    nexops: true,
    legacy: false,
  },
  {
    label: "Upfront scope + budget before claim",
    nexops: true,
    legacy: false,
  },
  {
    label: "No per-lead bidding race",
    nexops: true,
    legacy: false,
  },
  {
    label: "Performance reporting and SLA tracking",
    nexops: true,
    legacy: false,
  },
]

export function Comparison() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Platform comparison</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            Built for execution, not lead resale.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            NexOps focuses on routing quality work with full context, while legacy marketplaces monetize
            repeated competition for the same request.
          </p>
        </div>

        <div className="rounded-2xl border border-border/40 overflow-hidden bg-card">
          <div className="grid grid-cols-[1.5fr_1fr_1fr] bg-secondary/40 px-6 py-4 text-xs font-semibold uppercase tracking-wider">
            <span>Capability</span>
            <span className="text-center">NexOps</span>
            <span className="text-center">Legacy Lead Sites</span>
          </div>
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[1.5fr_1fr_1fr] px-6 py-4 border-t border-border/30 items-center">
              <p className="text-sm text-foreground/90">{row.label}</p>
              <div className="flex justify-center">{row.nexops ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4 text-muted-foreground" />}</div>
              <div className="flex justify-center">{row.legacy ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4 text-muted-foreground" />}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
