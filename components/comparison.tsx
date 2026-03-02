import { Check, X } from "lucide-react"

const comparisonRows = [
  {
    topic: "Lead distribution",
    old: "Same request sold to multiple contractors.",
    modern: "One request assigned to one verified contractor.",
  },
  {
    topic: "Owner experience",
    old: "High call volume and inconsistent follow-up.",
    modern: "Single point of contact with scheduled consultation.",
  },
  {
    topic: "Project data quality",
    old: "Limited context before first call.",
    modern: "Photos, scope, urgency, and budget submitted up front.",
  },
  {
    topic: "Operational accountability",
    old: "Minimal dispatch transparency.",
    modern: "Tracked assignment, status milestones, and closeout records.",
  },
]

export function Comparison() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Platform comparison</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">Traditional lead platforms vs. NexOps operations model</h2>
          <p className="text-muted-foreground leading-relaxed">
            The difference is not cosmetic. It changes response speed, communication quality, and execution control across your maintenance pipeline.
          </p>
        </div>

        <div className="rounded-2xl border border-border/40 overflow-hidden bg-card">
          <div className="grid grid-cols-[1.2fr_1fr_1fr] text-sm">
            <div className="p-4 border-b border-border/40 font-semibold">Capability</div>
            <div className="p-4 border-b border-border/40 font-semibold text-muted-foreground">Traditional platforms</div>
            <div className="p-4 border-b border-border/40 font-semibold text-primary">NexOps</div>

            {comparisonRows.map((row) => (
              <div key={row.topic} className="contents">
                <div key={`${row.topic}-topic`} className="p-4 border-b border-border/20 font-medium">{row.topic}</div>
                <div key={`${row.topic}-old`} className="p-4 border-b border-border/20 text-muted-foreground flex gap-2">
                  <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{row.old}</span>
                </div>
                <div key={`${row.topic}-modern`} className="p-4 border-b border-border/20 flex gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{row.modern}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
