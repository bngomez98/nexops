import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Why Property Managers in Topeka Spend 10+ Hours a Week on Maintenance Management | Nexus Operations",
  description:
    "The average property manager overseeing 150–200 units in Topeka spends 10–15 hours weekly on maintenance management. Here is where that time goes — and what a structured operations model looks like.",
  keywords: [
    "property management Topeka Kansas",
    "property maintenance management",
    "property manager time management",
    "property maintenance Topeka KS",
    "outsource property maintenance",
    "managed maintenance Topeka",
  ],
  alternates: { canonical: "https://nexusoperations.org/blog/property-manager-maintenance-coordination-topeka" },
  openGraph: {
    title: "Why Property Managers in Topeka Spend 10+ Hours a Week on Maintenance Management",
    description: "Where the time actually goes — and what a structured operations model looks like instead.",
    url: "https://nexusoperations.org/blog/property-manager-maintenance-coordination-topeka",
    type: "article",
  },
}

export default function BlogPost() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <article className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to blog
            </Link>

            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
                Operations
              </span>
              <span className="text-[12px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> 6 min read
              </span>
              <span className="text-[12px] text-muted-foreground">· March 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-foreground mb-6">
              Why Property Managers in Topeka Spend 10+ Hours a Week on Maintenance Management (and How to Stop)
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-primary/30 pl-5">
              The average property manager overseeing 150–200 units in Topeka spends between 10 and 15 hours a
              week on maintenance management — not on maintenance itself, but on the calls, follow-ups, and
              invoice reconciliation that surround it. Here is where that time actually goes.
            </p>

            <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-6">
              <h2 className="text-xl font-semibold text-foreground">The hidden cost of decentralized maintenance</h2>
              <p>
                When a tenant reports a plumbing issue, the typical workflow for a property manager without a
                structured maintenance system looks like this: receive the call or text, determine whether it&apos;s
                urgent, think through which plumber they know who might be available, call that plumber, wait for
                a callback, relay the tenant&apos;s information, confirm access arrangements, follow up to verify the
                appointment was kept, wait for the invoice, reconcile the invoice against what was discussed, and
                then process payment.
              </p>
              <p>
                For a single job, that is 45 minutes to two hours of calendar time — even if the total active
                minutes are only 20. For a portfolio generating 15–25 maintenance requests per month, this
                adds up to a part-time job that never appears on an org chart.
              </p>

              <h2 className="text-xl font-semibold text-foreground">Where the hours actually go</h2>
              <p>Based on patterns common to property managers in the Topeka market, here is a breakdown of where maintenance management time concentrates:</p>
              <ul className="space-y-3 list-none pl-0">
                {[
                  { label: "Initial triage and contractor sourcing", time: "2–4 hrs/week", desc: "Determining urgency, identifying which trade is needed, and finding a contractor who is available and willing to take the job." },
                  { label: "Scheduling and access management", time: "1–2 hrs/week", desc: "Confirming times with both the tenant and the contractor, handling rescheduling when either side changes availability." },
                  { label: "Status follow-up", time: "1–3 hrs/week", desc: "Checking whether the contractor actually showed up, what was found, whether the job is complete, and whether a follow-up visit is needed." },
                  { label: "Invoice reconciliation", time: "1–2 hrs/week", desc: "Receiving invoices in various formats, cross-referencing against what was quoted or discussed, flagging discrepancies, and processing payments across multiple vendors." },
                  { label: "Documentation", time: "1–2 hrs/week", desc: "Logging job completion, storing documentation, and maintaining a record of what was done at each property — often manually, since contractors rarely provide consistent documentation." },
                ].map((item) => (
                  <li key={item.label} className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-baseline justify-between gap-3 mb-1">
                      <span className="text-sm font-semibold text-foreground">{item.label}</span>
                      <span className="text-xs font-bold text-primary whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-[12.5px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </li>
                ))}
              </ul>

              <h2 className="text-xl font-semibold text-foreground">Why hiring in-house rarely solves it</h2>
              <p>
                The instinct for growing portfolios is to hire a maintenance coordinator or a maintenance technician.
                For some portfolios, this makes sense. But properties under 200 units often cannot justify the
                $3,500–$4,500 monthly cost of a full-time employee — especially one who still relies on a network
                of external contractors for licensed trade work.
              </p>
              <p>
                The other problem with in-house staff is single-point-of-failure risk. A coordinator who is on
                vacation, sick, or has left the job creates an immediate gap. An emergency HVAC call at 11 PM on
                a Friday becomes a crisis if the one person who knows all the contractors is unavailable.
              </p>

              <h2 className="text-xl font-semibold text-foreground">What a structured operations model looks like</h2>
              <p>
                A managed operations model separates the operational work of maintenance — sourcing, dispatching,
                tracking, invoicing — from the property management work of leases, tenant relations, and financial
                reporting. In a well-structured model:
              </p>
              <ul className="space-y-2 pl-4">
                <li>Requests are submitted through a single portal with a defined format (scope, photos, urgency)</li>
                <li>A contractor is assigned within a defined window — not &quot;when someone is available&quot;</li>
                <li>SLA compliance is tracked automatically, not via phone follow-up</li>
                <li>Every job generates photo documentation and a written completion record</li>
                <li>Invoicing is consolidated — one bill per month across all jobs, not 15 separate contractor invoices</li>
              </ul>
              <p>
                The property manager interacts with the system to submit requests and review completion records.
                The operational work happens outside their calendar.
              </p>

              <h2 className="text-xl font-semibold text-foreground">What this looks like for a Topeka portfolio</h2>
              <p>
                Nexus Operations was built specifically for the Topeka property management market. We coordinate
                maintenance across verified contractors in Shawnee County, handle dispatch from intake to invoice,
                and provide monthly performance reporting. Property managers submit requests through a portal
                and receive consolidated invoices. The operational work — contractor sourcing, scheduling,
                documentation, follow-up — is handled on our end.
              </p>
            </div>

            <div className="mt-12 p-6 rounded-2xl border border-primary/20 bg-primary/5">
              <h3 className="text-base font-semibold text-foreground mb-2">Relevant for your portfolio?</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
                Commercial engagement starts with a 30-minute call — no commitment required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                >
                  Schedule a call
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/commercial"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-card border border-border text-foreground rounded-xl hover:bg-secondary/60 transition-colors"
                >
                  View commercial terms
                </Link>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-border">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to all posts
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
