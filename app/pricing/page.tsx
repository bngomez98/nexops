import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Check, Zap, Shield, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing — Subscription Plans & Per-Job Coordination Markup",
  description:
    "Nexus Operations pricing: Starter plan included, Pro plans from $59/month billed annually. Per-job coordination markup by urgency tier — 25% routine, 30% urgent, 35% emergency. Serving Topeka and Shawnee County, KS.",
}

const subscriptionPlans = [
  {
    name: "Starter",
    price: { monthly: "Starter", annual: "Starter" },
    billingNote: { monthly: "", annual: "" },
    description: "Ideal for occasional service requests with full platform access.",
    features: [
      "Up to 3 service requests per year",
      "Verified contractor assignment",
      "Real-time project tracking",
      "Digital project history",
      "Email support",
    ],
    cta: "Get Started",
    ctaHref: "/auth/sign-up",
    highlighted: false,
  },
  {
    name: "Pro Annual",
    price: { monthly: "$59", annual: "$59" },
    billingNote: { monthly: "per month, billed annually ($708/yr)", annual: "per month, billed annually ($708/yr)" },
    description: "Our most popular plan — full access at the best rate.",
    features: [
      "Unlimited service requests",
      "Priority contractor matching",
      "Maintenance schedule & reminders",
      "Spend analytics & reporting",
      "Invoice & document storage",
      "Priority phone & email support",
      "Insurance-ready project reports",
      "Save $240/yr vs monthly",
    ],
    cta: "Start Annual Plan",
    ctaHref: "/auth/sign-up",
    highlighted: true,
    badge: "Best Value",
  },
  {
    name: "Pro Monthly",
    price: { monthly: "$79", annual: "$79" },
    billingNote: { monthly: "per month, cancel anytime", annual: "per month, cancel anytime" },
    description: "Full access to all features with monthly flexibility.",
    features: [
      "Unlimited service requests",
      "Priority contractor matching",
      "Maintenance schedule & reminders",
      "Spend analytics & reporting",
      "Invoice & document storage",
      "Priority phone & email support",
      "Insurance-ready project reports",
    ],
    cta: "Start Monthly Plan",
    ctaHref: "/auth/sign-up",
    highlighted: false,
  },
]

const serviceTiers = [
  {
    name: "Routine",
    markup: "25%",
    sla: "Assigned within 24 hrs · On-site within 3–5 days",
    description:
      "Standard maintenance requests. Scheduled repairs, cosmetic fixes, planned replacements.",
    features: [
      "Contractor assigned within 24 hours",
      "On-site within 3–5 business days",
      "Photo documentation on every job",
      "Monthly unified invoicing",
      "Quality assurance review",
      "Full request tracking in portal",
    ],
    highlighted: false,
    icon: Clock,
  },
  {
    name: "Urgent",
    markup: "30%",
    sla: "Assigned within 4 hrs · On-site next business day",
    description:
      "Issues requiring prompt attention. Non-emergency plumbing, electrical, HVAC in moderate weather.",
    features: [
      "Everything in Routine",
      "Contractor assigned within 4 hours",
      "On-site next business day",
      "Escalation if primary contractor declines",
      "Priority assignment from network",
      "Direct status updates",
    ],
    highlighted: true,
    icon: Zap,
  },
  {
    name: "Emergency",
    markup: "35%",
    sla: "Assigned within 1 hr · On-site within 4 hrs",
    description:
      "Critical failures requiring immediate response. Burst pipes, gas leaks, HVAC failure in extreme weather.",
    features: [
      "Everything in Urgent",
      "Contractor assigned within 1 hour",
      "On-site within 4 hours",
      "Automatic backup contractor",
      "24/7 coordination availability",
      "Real-time updates until resolution",
    ],
    highlighted: false,
    icon: Shield,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
                Pricing
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground mb-6 text-balance">
                Simple pricing,{" "}
                <span className="font-serif italic font-normal text-primary">
                  no surprises.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Plans for homeowners and contractors. Annual subscribers save 25% — just{" "}
                <strong className="text-foreground">$59/month</strong> vs{" "}
                <strong className="text-foreground">$79/month</strong> on our flexible monthly plan.
              </p>
            </div>
          </div>
        </section>

        {/* Subscription Plans */}
        <section className="pb-20 lg:pb-28">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-5">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border p-7 transition-shadow ${
                    plan.highlighted
                      ? "bg-primary/5 border-primary/30 shadow-xl shadow-primary/10"
                      : "bg-card border-border"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] font-bold px-3.5 py-1 rounded-full tracking-widest uppercase">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <h3 className="text-base font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed mb-5">{plan.description}</p>

                  <div className="mb-1">
                    <span className="text-4xl font-bold text-foreground tracking-tight">
                      {plan.price.monthly}
                    </span>
                    {plan.price.monthly !== "Starter" && (
                      <span className="text-sm text-muted-foreground ml-1">/mo</span>
                    )}
                  </div>
                  {plan.billingNote.monthly && (
                    <p className="text-[11.5px] text-muted-foreground mb-6">{plan.billingNote.monthly}</p>
                  )}

                  <ul className="flex flex-col gap-3 mb-8 flex-grow mt-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px]">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/75">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.ctaHref}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-all ${
                      plan.highlighted
                        ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Savings callout */}
            <div className="mt-8 p-5 rounded-2xl bg-primary/5 border border-primary/15 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold text-foreground">Annual plan saves you $240 per year</p>
                  <p className="text-[12px] text-muted-foreground">$59/mo × 12 = $708/yr vs $79/mo × 12 = $948/yr</p>
                </div>
              </div>
              <Link
                href="/auth/sign-up"
                className="text-[12.5px] font-semibold text-primary hover:underline whitespace-nowrap"
              >
                Start annual plan →
              </Link>
            </div>
          </div>
        </section>

        {/* Service Tier Pricing */}
        <section className="py-16 lg:py-24 bg-secondary/40">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Per-Job Pricing
              </p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-4">
                Cost-plus markup by urgency.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Beyond your subscription, individual jobs are invoiced at cost plus a coordination markup based on urgency. You always see both line items — full transparency.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {serviceTiers.map((tier) => {
                const Icon = tier.icon
                return (
                  <div
                    key={tier.name}
                    className={`p-7 rounded-2xl border flex flex-col ${
                      tier.highlighted
                        ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/10"
                        : "bg-card border-border"
                    }`}
                  >
                    {tier.highlighted && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full self-start mb-4">
                        Most Common
                      </span>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tier.highlighted ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-base font-bold text-foreground">{tier.name}</h3>
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-3xl font-bold text-primary">{tier.markup}</span>
                      <span className="text-sm text-muted-foreground">markup</span>
                    </div>
                    <p className="text-[11.5px] text-muted-foreground mb-2 font-medium">{tier.sla}</p>
                    <p className="text-[12.5px] text-muted-foreground leading-relaxed mb-6 mt-2">
                      {tier.description}
                    </p>
                    <ul className="flex flex-col gap-3 flex-grow">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[12.5px]">
                          <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="text-foreground/70">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            {/* Invoice example */}
            <div className="mt-12 grid lg:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">How your invoice works.</h3>
                <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-6">
                  Every invoice shows the contractor&apos;s quoted cost and our coordination markup as separate line items. You always see exactly what you&apos;re paying for.
                </p>
                <div className="rounded-2xl bg-card border border-border p-6">
                  <p className="text-[12px] font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Example: Routine plumbing repair</p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-[13px] text-muted-foreground">Contractor cost</span>
                      <span className="text-[13px] font-semibold text-foreground">$400.00</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-[13px] text-muted-foreground">Coordination markup (25%)</span>
                      <span className="text-[13px] font-semibold text-foreground">$100.00</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-[13px] font-bold text-foreground">Total invoiced</span>
                      <span className="text-[13px] font-bold text-primary">$500.00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">What the markup covers.</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { title: "Request intake & classification", desc: "We triage every request, assign the right trade, and match to the best-available contractor." },
                    { title: "SLA enforcement & escalation", desc: "Automated monitoring ensures contractors respond and arrive within committed windows." },
                    { title: "Quality assurance & documentation", desc: "Every job includes photo documentation and completion verification before invoicing." },
                    { title: "Unified invoicing & reporting", desc: "Monthly consolidated invoices replace dozens of separate contractor bills." },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                      <div>
                        <p className="text-[13px] font-semibold text-foreground mb-0.5">{item.title}</p>
                        <p className="text-[12.5px] text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commercial B2B Engagement */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Commercial Accounts
              </p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-4">
                Managing 100+ units? Here is how commercial engagement works.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Property managers overseeing large portfolios get a dedicated engagement model — not a subscription tier. Volume pricing, monthly unified invoicing across all properties, and a defined SLA structure for every urgency level.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 mb-12">
              {/* What's included */}
              <div className="rounded-2xl border border-border bg-card p-7">
                <h3 className="text-lg font-semibold text-foreground mb-6">What commercial clients receive</h3>
                <div className="flex flex-col gap-5">
                  {[
                    {
                      title: "Monthly unified invoicing",
                      desc: "Every job across all properties consolidated into a single monthly invoice. Line-item detail for each request: property address, trade, contractor cost, and coordination markup. No individual contractor bills to reconcile.",
                    },
                    {
                      title: "SLA enforcement across all tiers",
                      desc: "Routine (24-hr assignment, 3–5 day on-site), Urgent (4-hr assignment, next business day), Emergency (1-hr assignment, 4-hr on-site). SLA performance is tracked per property and reported monthly.",
                    },
                    {
                      title: "Monthly performance reporting",
                      desc: "A standard monthly report covering: total requests by property, resolution times vs. SLA, contractor performance ratings, spend by trade category, and any open items.",
                    },
                    {
                      title: "Dedicated coordination contact",
                      desc: "Commercial accounts get a named point of contact at Nexus Operations for escalations, reporting questions, and new property onboarding.",
                    },
                    {
                      title: "Multi-property portal access",
                      desc: "Submit and track requests across all properties in a single dashboard. Per-property request history, invoice records, and document storage.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[13.5px] font-semibold text-foreground mb-0.5">{item.title}</p>
                        <p className="text-[12.5px] text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing structure */}
              <div className="flex flex-col gap-5">
                <div className="rounded-2xl border border-border bg-card p-7">
                  <h3 className="text-base font-semibold text-foreground mb-4">Commercial pricing structure</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4 py-3 border-b border-border">
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">Platform access</p>
                        <p className="text-[12px] text-muted-foreground">Multi-property portal, reporting, document storage</p>
                      </div>
                      <span className="text-[13px] font-bold text-foreground whitespace-nowrap">Contact for quote</span>
                    </div>
                    <div className="flex items-start justify-between gap-4 py-3 border-b border-border">
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">Routine jobs</p>
                        <p className="text-[12px] text-muted-foreground">Contractor cost + coordination markup</p>
                      </div>
                      <span className="text-[13px] font-bold text-primary whitespace-nowrap">25% markup</span>
                    </div>
                    <div className="flex items-start justify-between gap-4 py-3 border-b border-border">
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">Urgent jobs</p>
                        <p className="text-[12px] text-muted-foreground">4-hr assignment, next business day on-site</p>
                      </div>
                      <span className="text-[13px] font-bold text-primary whitespace-nowrap">30% markup</span>
                    </div>
                    <div className="flex items-start justify-between gap-4 py-3">
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">Emergency jobs</p>
                        <p className="text-[12px] text-muted-foreground">1-hr assignment, 4-hr on-site, 24/7</p>
                      </div>
                      <span className="text-[13px] font-bold text-primary whitespace-nowrap">35% markup</span>
                    </div>
                  </div>
                  <div className="mt-5 pt-5 border-t border-border">
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      Volume discounts available for portfolios exceeding 200 units or 50+ jobs per month. Discuss your portfolio with our team.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-7">
                  <h3 className="text-base font-semibold text-foreground mb-2">Considering commercial engagement?</h3>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed mb-5">
                    Commercial onboarding starts with a 30-minute call to review your portfolio, property types, typical request volume, and any existing vendor relationships. No commitment required.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/commercial"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                    >
                      View commercial terms
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-card border border-border text-foreground rounded-xl hover:bg-secondary/60 transition-colors"
                    >
                      Schedule a call
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-secondary/40">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4 text-balance">
                Create an account and choose your plan.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Homeowners and property managers across Topeka use Nexus Operations for coordinated, documented maintenance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
