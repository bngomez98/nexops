import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle, Clock, ShieldCheck, DollarSign } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "For Property Managers | Nexus Operations",
  description:
    "Outsourced maintenance coordination for Topeka multifamily portfolios with verified contractor response SLAs.",
}

const responseTargets = [
  { urgency: "Emergency", assignment: "1 hour", onsite: "4 hours" },
  { urgency: "Urgent", assignment: "4 hours", onsite: "Next business day" },
  { urgency: "Routine", assignment: "24 hours", onsite: "3–5 business days" },
]

const markupBands = [
  { label: "Routine Maintenance", markup: "25%", example: "$300 → $375" },
  { label: "Urgent Repairs", markup: "30%", example: "$500 → $650" },
  { label: "Emergency Response", markup: "35%", example: "$800 → $1,080" },
]

export default function PropertyManagersPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Clock className="h-4 w-4" />
                Shawnee County commercial maintenance coordination
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
                One submission per issue.
                <br />
                <span className="text-primary">One verified contractor assigned.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
                Nexus Operations handles contractor vetting, scheduling, and documentation for property
                managers. Submit photos and a budget cap for any maintenance issue, and a pre-verified
                contractor is assigned and scheduled within 24 hours. No vendor management, no chasing
                estimates, no unvetted operators on your properties.
                Verified dispatch.
                <br />
                <span className="text-primary">Defined response guarantees.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
                Nexus Operations acts as your outsourced maintenance coordination team. We intake requests,
                route verified contractors, enforce backup assignment rules, confirm completion, and send
                transparent monthly billing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200"
                >
                  Request Onboarding
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/#how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/40 rounded-xl hover:border-border/70 hover:bg-secondary/50 transition-all duration-200"
                >
                  View Workflow
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card/30 border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <h2 className="text-3xl font-semibold tracking-tight mb-3">Response-time guarantees</h2>
              <p className="text-muted-foreground">
                Dispatch and arrival targets are based on urgency category, with automatic reassignment when a contractor does not accept in time.
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-left">
                    <th className="p-4">Urgency</th>
                    <th className="p-4">Contractor Assignment</th>
                    <th className="p-4">On-Site Arrival</th>
                  </tr>
                </thead>
                <tbody>
                  {responseTargets.map((target) => (
                    <tr key={target.urgency} className="border-b border-border/20 last:border-0">
                      <td className="p-4 font-medium">{target.urgency}</td>
                      <td className="p-4 text-muted-foreground">{target.assignment}</td>
                      <td className="p-4 text-muted-foreground">{target.onsite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-primary text-sm font-medium tracking-wide mb-3">Contractor network standards</p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                Built on verification, not vendor roulette
              </h2>
              <ul className="space-y-3">
                {[
                  "Kansas business and trade license checks",
                  "General liability and workers comp verification",
                  "Reference checks and annual re-verification",
                  "Performance thresholds for attendance and satisfaction",
                  "Automated backup assignment when primary vendors decline",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border/40">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold">Cost-plus markup model</h3>
              </div>
              <div className="space-y-3">
                {markupBands.map((band) => (
                  <div key={band.label} className="p-4 rounded-lg border border-border/40">
                    <p className="text-sm font-semibold">{band.label}</p>
                    <p className="text-sm text-muted-foreground">Markup: {band.markup}</p>
                    <p className="text-sm text-primary">Example: {band.example}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="corporate" className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
              Reduce maintenance coordination overhead in 90 days
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We partner with Topeka property management teams to implement standardized intake,
              dispatch, QA, and billing workflows across your portfolio.
            </p>
            <div className="flex items-center justify-center gap-2 mb-8 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary" />
              Designed for firms managing 100–800 units in Shawnee County
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200"
            >
              Talk to Nexus Operations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
