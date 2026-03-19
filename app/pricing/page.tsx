import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Nexus Operations pricing: cost-plus markup on completed maintenance work. No retainers, no subscriptions. Transparent pricing aligned with service delivery volume.",
}

const tiers = [
  {
    name: "Routine",
    markup: "25%",
    sla: "Assigned within 24 hrs, on-site within 3-5 days",
    description:
      "Standard maintenance requests that are not time-sensitive. Scheduled repairs, cosmetic fixes, planned replacements.",
    features: [
      "Contractor assigned within 24 hours",
      "On-site within 3-5 business days",
      "Photo documentation on every job",
      "Monthly unified invoicing",
      "Quality assurance review",
      "Full request tracking in client portal",
    ],
    highlighted: false,
  },
  {
    name: "Urgent",
    markup: "30%",
    sla: "Assigned within 4 hrs, on-site next business day",
    description:
      "Issues requiring prompt attention. Non-emergency plumbing, electrical issues affecting livability, HVAC in moderate weather.",
    features: [
      "Everything in Routine",
      "Contractor assigned within 4 hours",
      "On-site next business day",
      "Escalation if primary contractor declines",
      "Priority assignment from network",
      "Direct status updates to property manager",
    ],
    highlighted: true,
  },
  {
    name: "Emergency",
    markup: "35%",
    sla: "Assigned within 1 hr, on-site within 4 hrs",
    description:
      "Critical failures requiring immediate response. Burst pipes, gas leaks, electrical hazards, HVAC failure in extreme weather.",
    features: [
      "Everything in Urgent",
      "Contractor assigned within 1 hour",
      "On-site within 4 hours",
      "Automatic backup contractor assignment",
      "24/7 coordination availability",
      "Real-time updates until resolution",
    ],
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
                Pricing
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground mb-6 text-balance">
                Pay for work completed,{" "}
                <span className="font-serif italic font-normal text-primary">
                  not retainers.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Our cost-plus model means you only pay when maintenance work is
                actually performed. No monthly subscriptions, no setup fees, no
                minimum commitments. The markup covers coordination, quality
                assurance, and contractor management.
              </p>
            </div>
          </div>
        </section>

        {/* Tier Cards */}
        <section className="pb-16 lg:pb-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-4">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`p-6 lg:p-8 rounded-xl border flex flex-col ${
                    tier.highlighted
                      ? "bg-primary/5 border-primary/20"
                      : "bg-card border-border"
                  }`}
                >
                  {tier.highlighted && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded self-start mb-4">
                      Most Common
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-semibold text-primary">
                      {tier.markup}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      markup
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {tier.sla}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 mt-3">
                    {tier.description}
                  </p>
                  <ul className="flex flex-col gap-3 mb-8 flex-grow">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm"
                      >
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/70">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-opacity ${
                      tier.highlighted
                        ? "bg-foreground text-background hover:opacity-90"
                        : "bg-secondary text-foreground hover:opacity-80"
                    }`}
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it's calculated */}
        <section className="py-16 lg:py-24 bg-secondary/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-6">
                  How your invoice works.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Every invoice shows the contractor's quoted cost and our
                  coordination markup as separate line items. Full transparency
                  -- you always see exactly what you're paying for.
                </p>

                <div className="rounded-xl bg-card border border-border p-6">
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    Example: Routine plumbing repair
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">
                        Contractor cost
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        $400.00
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">
                        Coordination markup (25%)
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        $100.00
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-semibold text-foreground">
                        Total invoiced
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        $500.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-6">
                  What the markup covers.
                </h2>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      title: "Request intake and classification",
                      desc: "We triage every request by urgency, assign the right trade, and match to the best-available contractor.",
                    },
                    {
                      title: "SLA enforcement and escalation",
                      desc: "Automated monitoring ensures contractors respond and arrive within committed windows. Backup assignment triggers automatically.",
                    },
                    {
                      title: "Quality assurance and documentation",
                      desc: "Every job includes photo documentation and completion verification before the invoice is generated.",
                    },
                    {
                      title: "Unified invoicing and reporting",
                      desc: "Monthly consolidated invoices with full request detail, replacing dozens of separate contractor bills.",
                    },
                    {
                      title: "Contractor management",
                      desc: "Ongoing verification, performance tracking, network expansion, and relationship management across all trades.",
                    },
                  ].map((item) => (
                    <div key={item.title}>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* B2B pricing note */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4">
                  B2B services pricing.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For lead generation, vendor management, consulting, and
                  project support, pricing is scoped per engagement based on
                  the specific deliverables, timeline, and complexity.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We provide a fixed quote before any work begins. No hourly
                  billing surprises, no scope creep charges. If the scope
                  changes, we re-quote before proceeding.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  {
                    service: "Lead Generation",
                    model: "Per-campaign pricing based on target volume and qualification criteria",
                  },
                  {
                    service: "Vendor Management",
                    model: "Monthly retainer based on number of vendors and complexity of operations",
                  },
                  {
                    service: "Consulting",
                    model: "Fixed project fee scoped to specific deliverables and timeline",
                  },
                  {
                    service: "Project Support",
                    model: "Fixed fee per project with clearly defined scope and milestones",
                  },
                ].map((item) => (
                  <div
                    key={item.service}
                    className="p-4 rounded-xl bg-card border border-border"
                  >
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {item.service}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.model}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-secondary/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4 text-balance">
                Let's scope your specific needs.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Every property portfolio has different maintenance volume and
                urgency patterns. Contact us for a customized cost projection
                based on your specific situation.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
