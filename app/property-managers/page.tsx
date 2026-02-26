import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle, Clock } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "For Property Managers",
  description: "Outsourced maintenance coordination with verified contractor routing and SLA-oriented dispatch.",
}

const targets = [
  ["Emergency", "1 hour", "4 hours"],
  ["Urgent", "4 hours", "Next business day"],
  ["Routine", "24 hours", "3–5 business days"],
]

export default function PropertyManagersPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Clock className="h-4 w-4" />
              Pilot program live in Shawnee County
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
              Verified dispatch.
              <br />
              <span className="text-primary">Defined response guarantees.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
              NexOps coordinates intake, assignment, and quality tracking so your property operations team can
              execute faster with less vendor-management overhead.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200">
              Join the pilot
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="py-20 bg-card/30 border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight mb-3">Response-time targets</h2>
            <p className="text-muted-foreground mb-8">Dispatch and arrival goals with automatic reassignment when needed.</p>
            <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-left">
                    <th className="p-4">Urgency</th>
                    <th className="p-4">Assignment</th>
                    <th className="p-4">On-site arrival</th>
                  </tr>
                </thead>
                <tbody>
                  {targets.map(([urgency, assignment, onsite]) => (
                    <tr key={urgency} className="border-b border-border/20 last:border-0">
                      <td className="p-4 font-medium">{urgency}</td>
                      <td className="p-4 text-muted-foreground">{assignment}</td>
                      <td className="p-4 text-muted-foreground">{onsite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="corporate" className="py-24 lg:py-32">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">Reduce coordination overhead in 90 days</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Standardize dispatch and documentation across your portfolio without expanding headcount.
            </p>
            <div className="flex items-center justify-center gap-2 mb-8 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary" />
              Built for firms managing 100–800 units
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
