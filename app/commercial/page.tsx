import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CONTACT_INFO } from "@/lib/contact-info"
import Link from "next/link"
import { ArrowRight, Check, Building2, FileText, BarChart3, Shield, Clock, Zap, Phone, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Commercial Property Management | Nexus Operations",
  description:
    "Commercial engagement model for property managers overseeing 100+ units in Topeka, KS. Monthly unified invoicing, SLA-backed coordination, performance reporting, and a dedicated point of contact.",
}

const slaTable = [
  {
    tier: "Routine",
    assignment: "Within 24 hours",
    onSite: "3–5 business days",
    examples: "Scheduled repairs, cosmetic fixes, planned replacements",
    icon: Clock,
  },
  {
    tier: "Urgent",
    assignment: "Within 4 hours",
    onSite: "Next business day",
    examples: "Non-emergency plumbing, HVAC issues in moderate weather, electrical faults",
    icon: Zap,
  },
  {
    tier: "Emergency",
    assignment: "Within 1 hour",
    onSite: "Within 4 hours (24/7)",
    examples: "Burst pipes, gas leaks, HVAC failure in extreme weather, major electrical hazards",
    icon: Shield,
  },
]

const reportingFields = [
  "Total requests submitted, by property and trade category",
  "Assignment time vs. SLA for every job",
  "On-site arrival time vs. SLA for every job",
  "Contractor performance ratings by job",
  "Total spend by property, trade, and urgency tier",
  "Open and unresolved items at month-end",
  "Year-to-date spend comparison",
]

const onboardingSteps = [
  {
    step: "01",
    title: "Portfolio review call",
    desc: "30-minute call to review your property portfolio, typical request volume, trades most frequently needed, and any existing vendor relationships. No commitment required.",
  },
  {
    step: "02",
    title: "Engagement terms",
    desc: "We provide a written commercial engagement agreement covering: service scope, SLA commitments, invoicing schedule, reporting cadence, and escalation procedures.",
  },
  {
    step: "03",
    title: "Portal setup",
    desc: "Your properties are added to the platform. We configure per-property accounts, set urgency defaults, and run a brief walkthrough with your team.",
  },
  {
    step: "04",
    title: "First 30 days",
    desc: "We handle your first month of requests under direct oversight. At 30 days, we review the first performance report together and adjust any defaults.",
  },
]

export default function CommercialPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
                Commercial accounts
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground mb-6 text-balance">
                Built for property managers overseeing multiple units.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
                Nexus Operations offers a dedicated commercial engagement model for property managers overseeing
                100 or more units. One monthly invoice. SLA-backed coordination across all urgency tiers.
                Monthly performance reporting. A named point of contact.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                >
                  Schedule a call
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  Email us directly
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-16 lg:py-24 bg-secondary/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4">
                What commercial engagement includes.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Commercial accounts are not a subscription tier. They are an operational partnership with defined service levels, reporting obligations, and dedicated support.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: FileText,
                  title: "Monthly unified invoicing",
                  desc: "Every completed job across all your properties consolidated into a single monthly invoice. Line-item detail showing property address, trade, and total. No individual contractor bills to reconcile.",
                },
                {
                  icon: Shield,
                  title: "Written SLA commitments",
                  desc: "Assignment and on-site response times for Routine, Urgent, and Emergency tiers are documented in your engagement agreement. Emergency coverage is 24/7 — including nights, weekends, and holidays.",
                },
                {
                  icon: BarChart3,
                  title: "Monthly performance reports",
                  desc: "A standard report delivered on the 5th of each month covering request volume, SLA adherence rates, contractor ratings, spend by trade category, and open items.",
                },
                {
                  icon: Building2,
                  title: "Multi-property portal",
                  desc: "Submit, track, and review requests across all properties in a single dashboard. Per-property invoice history, request logs, and document storage are available at any time.",
                },
                {
                  icon: Clock,
                  title: "Dedicated coordination contact",
                  desc: "You get a named point of contact at Nexus Operations for escalations, reporting questions, and new property onboarding — not a general support queue.",
                },
                {
                  icon: Check,
                  title: "Contractor credential transparency",
                  desc: "Commercial clients can request the license number and insurance certificate for any active contractor in our network before a job begins. We provide this on request within one business day.",
                },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-xl bg-card border border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary mb-4">
                    <item.icon className="h-5 w-5 text-foreground/60" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLA Table */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Service level commitments
              </p>
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4">
                SLA schedule — what you can hold us to.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These response times are documented in the commercial engagement agreement. SLA adherence is tracked automatically and reported in your monthly report.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/60 border-b border-border">
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tier</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assignment SLA</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">On-site SLA</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Typical use</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {slaTable.map((row) => {
                    const Icon = row.icon
                    return (
                      <tr key={row.tier} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-foreground text-[13px]">{row.tier}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-foreground font-medium">{row.assignment}</td>
                        <td className="px-6 py-4 text-[13px] text-foreground font-medium">{row.onSite}</td>
                        <td className="px-6 py-4 text-[12.5px] text-muted-foreground hidden lg:table-cell max-w-xs">{row.examples}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Emergency callout */}
            <div className="mt-6 p-5 rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Emergency tier is 24/7 — including nights, weekends, and holidays</p>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                    The 1-hour assignment and 4-hour on-site SLAs apply around the clock. A burst pipe at 11 PM on a Saturday is handled the same as one at 10 AM on a Tuesday.
                    For after-hours emergencies, submit through the portal or email{" "}
                    <a href="mailto:emergency@nexusoperations.org" className="text-primary hover:underline font-medium">
                      emergency@nexusoperations.org
                    </a>. Our on-call coordinator responds within 15 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reporting */}
        <section className="py-16 lg:py-24 bg-secondary/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Monthly reporting
                </p>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-6">
                  What your monthly report contains.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Delivered on the 5th of each month. Covers the full prior month of activity across all properties in your portfolio. Exportable as PDF or CSV.
                </p>
                <div className="flex flex-col gap-3">
                  {reportingFields.map((field) => (
                    <div key={field} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/80">{field}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Pricing structure
                </p>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-6">
                  What commercial engagement costs.
                </h2>
                <div className="rounded-xl bg-card border border-border p-6 lg:p-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                      <div>
                        <p className="text-[13.5px] font-semibold text-foreground">Platform access fee</p>
                        <p className="text-[12px] text-muted-foreground">Multi-property portal, monthly reports, document storage, dedicated contact</p>
                      </div>
                      <span className="text-[13px] font-bold text-foreground whitespace-nowrap">By arrangement</span>
                    </div>
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                      <div>
                        <p className="text-[13.5px] font-semibold text-foreground">Per-job: Routine</p>
                        <p className="text-[12px] text-muted-foreground">Assigned within 24 hrs · On-site within 3–5 days</p>
                      </div>
                      <span className="text-[13px] font-bold text-foreground whitespace-nowrap">By arrangement</span>
                    </div>
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                      <div>
                        <p className="text-[13.5px] font-semibold text-foreground">Per-job: Urgent</p>
                        <p className="text-[12px] text-muted-foreground">Assigned within 4 hrs · Next business day on-site</p>
                      </div>
                      <span className="text-[13px] font-bold text-foreground whitespace-nowrap">By arrangement</span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[13.5px] font-semibold text-foreground">Per-job: Emergency</p>
                        <p className="text-[12px] text-muted-foreground">Assigned within 1 hr · On-site within 4 hrs, 24/7</p>
                      </div>
                      <span className="text-[13px] font-bold text-foreground whitespace-nowrap">By arrangement</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-5 border-t border-border">
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      Volume pricing available for large portfolios. Platform access pricing depends on portfolio size and reporting requirements. Discuss your situation with our team.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Onboarding */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Getting started
              </p>
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4">
                How commercial onboarding works.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not require a long-term contract to start. The initial engagement is month-to-month. Most commercial clients are fully onboarded within one week.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {onboardingSteps.map((s) => (
                <div key={s.step} className="p-6 rounded-xl bg-card border border-border">
                  <span className="text-xs font-mono font-bold text-primary mb-4 block">{s.step}</span>
                  <h3 className="text-sm font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-secondary/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4 text-balance">
                Ready to discuss your portfolio?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                The first call is 30 minutes and requires no commitment. We will review your properties,
                request volume, and whether Nexus Operations is the right fit.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                >
                  Schedule a call
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  Email the team
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <a href={CONTACT_INFO.phoneHref} className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Phone className="h-4 w-4" />
                  {CONTACT_INFO.phoneDisplay}
                </a>
                <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Mail className="h-4 w-4" />
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
