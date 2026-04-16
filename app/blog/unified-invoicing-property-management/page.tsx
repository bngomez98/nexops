import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "@/components/link"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "The Case for Unified Invoicing in Property Management | Nexus Operations",
  description:
    "When a property management company processes 40 maintenance jobs a month, that's 40 separate contractor invoices. Here is what unified invoicing solves — and what it costs to not have it.",
  keywords: [
    "unified invoicing property management",
    "property maintenance billing",
    "consolidated maintenance invoice",
    "property manager billing software",
    "maintenance invoice management",
  ],
  alternates: { canonical: "https://nexusoperations.org/blog/unified-invoicing-property-management" },
}

export default function BlogPost() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <article className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
            </Link>
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">Billing</span>
              <span className="text-[12px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> 5 min read</span>
              <span className="text-[12px] text-muted-foreground">· January 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-foreground mb-6">
              The Case for Unified Invoicing: Why Dozens of Contractor Bills Are Costing Your Team More Than the Invoices Say
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-primary/30 pl-5">
              When a 200-unit property management company processes 40 maintenance jobs a month, that&apos;s potentially 40 separate contractor invoices — each with different formats, payment terms, and follow-up requirements.
            </p>
            <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-6">
              <h2 className="text-xl font-semibold text-foreground">The actual cost of fragmented invoicing</h2>
              <p>
                The visible cost of a maintenance invoice is the dollar amount on the page. The invisible cost is the time it takes to receive it, validate it, reconcile it against the job record, process payment, and store it correctly. For a portfolio generating 30–50 jobs per month, that administrative overhead can easily represent 5–8 hours of staff time monthly — and that&apos;s assuming everything goes smoothly.
              </p>
              <p>
                When invoices don&apos;t go smoothly — when a contractor invoices a different amount than quoted, sends the invoice to the wrong email, or uses a format that doesn&apos;t match the property management software — the time multiplies. Each exception requires follow-up, documentation, and resolution.
              </p>
              <h2 className="text-xl font-semibold text-foreground">What unified invoicing actually means</h2>
              <p>
                Unified invoicing means one invoice per billing cycle, covering all jobs across all properties. Each line item shows: the property address, the job date, the trade, the urgency tier, the contractor, and the billed amount. The invoice is itemized enough to attribute costs to specific properties and audit any line item, but consolidated enough to process as a single payment.
              </p>
              <p>
                For property management companies that allocate maintenance costs to individual properties or pass repair costs through to owners, line-item detail is essential. Unified invoicing does not sacrifice detail — it consolidates the payment without obscuring the breakdown.
              </p>
              <h2 className="text-xl font-semibold text-foreground">The payment flow under the Nexus model</h2>
              <p>
                Under the Nexus Operations model, the payment flow is: property manager pays Nexus Operations a single monthly invoice, and Nexus Operations pays each contractor directly within 30 days of job completion. The contractor never invoices the property manager directly. The property manager never owes payment to multiple vendors on staggered terms.
              </p>
              <p>
                This also eliminates the friction when a contractor relationship changes — if a contractor leaves the network, the invoicing structure for the property manager does not change at all.
              </p>
              <h2 className="text-xl font-semibold text-foreground">What this requires on the operations side</h2>
              <p>
                Unified invoicing is only possible when the operations team — Nexus Operations in this case — has complete visibility into every job: what was requested, what was quoted, when work was completed, and what was invoiced by the contractor. That requires documentation on every job, which is why photo completion reports and written job summaries are required for every assignment in the network.
              </p>
            </div>
            <div className="mt-12 p-6 rounded-2xl border border-primary/20 bg-primary/5">
              <h3 className="text-base font-semibold text-foreground mb-2">See the commercial engagement model</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">The commercial page covers monthly unified invoicing, SLA commitments, and performance reporting in detail.</p>
              <Link href="/commercial" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
                View commercial terms <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 pt-8 border-t border-border">
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to all posts
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
