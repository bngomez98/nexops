import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle, Clock, ShieldCheck, DollarSign, FlaskConical, Activity, FileStack } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "For Property Managers | NexOps",
  description:
    "Outsourced maintenance coordination for multifamily portfolios with verified contractor dispatch and response targets.",
}

const responseTargets = [
  { urgency: "Emergency", assignment: "1 hour", onsite: "4 hours" },
  { urgency: "Urgent", assignment: "4 hours", onsite: "Next business day" },
  { urgency: "Routine", assignment: "24 hours", onsite: "3–5 business days" },
]

const pillars = [
  {
    icon: Activity,
    title: "Dispatch control",
    text: "Assignment rules, urgency routing, and fallback escalation are standardized across your portfolio.",
  },
  {
    icon: ShieldCheck,
    title: "Vendor quality assurance",
    text: "Only credentialed contractors are routed into production workflows.",
  },
  {
    icon: FileStack,
    title: "Reporting and audit trail",
    text: "Status updates and completion documentation are captured in one operating record.",
  },
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
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Clock className="h-4 w-4" /> Pilot program live in Shawnee County
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
                  Verified dispatch.
                  <br />
                  <span className="text-primary">Defined response guarantees.</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
                  NexOps functions as your outsourced maintenance coordination team: intake, assignment, vendor oversight, and execution visibility in one workflow.
                </p>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-8 max-w-2xl">
                  <div className="flex items-start gap-3">
                    <FlaskConical className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      <span className="font-semibold text-foreground">Pilot pricing:</span> for the first 30–60 days, property managers pay a flat <span className="font-semibold text-primary">$50–$100 request fee</span> while workflows are baselined.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">
                    Join the Pilot Program
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/#how-it-works" className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium border border-border/40 rounded-xl">
                    Review Workflow
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card p-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">What pilot partners get</p>
                <ul className="space-y-3 text-sm">
                  {[
                    "Dedicated dispatch coordination",
                    "Single monthly operating report",
                    "Escalation support for urgent requests",
                    "Contractor verification controls",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/85">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card/30 border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <h2 className="text-3xl font-semibold tracking-tight mb-3">Response-time guarantees</h2>
              <p className="text-muted-foreground">Dispatch and arrival targets are aligned to urgency, with automatic reassignment when needed.</p>
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
              <p className="text-primary text-sm font-medium tracking-wide mb-3">Operational pillars</p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-6">Execution standards for portfolio maintenance</h2>
              <div className="space-y-4">
                {pillars.map((pillar) => (
                  <div key={pillar.title} className="p-4 rounded-xl border border-border/40 bg-card/50">
                    <div className="flex items-center gap-2 mb-2">
                      <pillar.icon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold">{pillar.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{pillar.text}</p>
                  </div>
                ))}
              </div>
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
      </main>
      <Footer />
    </div>
  )
}
