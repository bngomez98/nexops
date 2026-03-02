import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

const contractorPoints = [
  "Exclusive assignment once claimed",
  "Scope + budget visibility before first contact",
  "No per-lead charges",
  "Performance analytics in contractor dashboard",
]

export function ContractorCTA() {
  return (
    <section className="py-24 lg:py-32 bg-card/30 border-y border-border/40">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="rounded-3xl border border-border/40 bg-card p-10 lg:p-14">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div>
              <p className="text-primary text-sm font-medium tracking-wide mb-3">For contractors</p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                Predictable pipeline access.
                <br />
                <span className="gradient-text">Built for licensed trade businesses.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-7">
                NexOps membership is designed to reduce lead waste and improve project conversion by assigning one contractor per request.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">
                  View Membership Plans
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-border/40 rounded-xl">
                  Apply to Join
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-4">Membership includes</p>
              <ul className="space-y-3 text-sm">
                {contractorPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/85">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
