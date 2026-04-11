import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Mail,
  Phone,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Section, SectionHeading } from '@/components/section'
import { CONTACT_INFO } from '@/lib/contact-info'

export const metadata: Metadata = {
  title: 'Commercial & Portfolio Property Management',
  description:
    'Nexus Operations commercial engagement model for property managers overseeing multi-unit portfolios in Topeka, KS. Named account representative, SLA-backed response, consolidated monthly invoicing, and portfolio-wide reporting.',
}

const portfolioBenefits = [
  {
    icon: Users,
    title: 'Named account representative',
    desc: 'A named Nexus team member acts as your single point of contact for every request across your portfolio.',
  },
  {
    icon: ClipboardList,
    title: 'Portfolio-wide dashboard',
    desc: 'See every active request across every property, tagged by building, trade, and urgency.',
  },
  {
    icon: BarChart3,
    title: 'Monthly reporting',
    desc: 'Detailed maintenance reports by property, trade, urgency tier, and contractor — delivered monthly.',
  },
  {
    icon: FileText,
    title: 'Consolidated billing',
    desc: 'One unified monthly invoice for every unit, every trade, every job — with full line-item detail.',
  },
  {
    icon: Shield,
    title: 'Response-time SLAs',
    desc: 'Published assignment and on-site SLAs by urgency tier, tracked and reported in your monthly rollup.',
  },
  {
    icon: Building2,
    title: 'Multi-property workflows',
    desc: 'Assign access notes, preferred contractors, and per-building budget caps once and re-use them everywhere.',
  },
]

const slaTable = [
  {
    tier: 'Routine',
    assignment: 'Assigned within 24 hours',
    onSite: 'On-site in 3–5 business days',
    examples: 'Scheduled repairs, cosmetic fixes, planned replacements, preventative maintenance',
    icon: Clock,
  },
  {
    tier: 'Urgent',
    assignment: 'Assigned within 4 hours',
    onSite: 'On-site next business day',
    examples: 'Non-emergency plumbing, HVAC issues in moderate weather, electrical faults',
    icon: Sparkles,
  },
  {
    tier: 'Emergency',
    assignment: 'Assigned within 1 hour',
    onSite: 'On-site within 4 hours (24/7)',
    examples: 'Burst pipes, gas leaks, HVAC failure in extreme weather, safety hazards',
    icon: Shield,
  },
]

const reportingFields = [
  'Total requests submitted, by property and trade category',
  'Assignment time vs. SLA for every job',
  'On-site arrival time vs. SLA for every job',
  'Contractor performance ratings by job',
  'Total spend by property, trade, and urgency tier',
  'Open and unresolved items at month-end',
  'Year-to-date spend comparison',
]

const onboarding = [
  { step: '01', title: 'Discovery call', desc: 'Tell us about your portfolio — unit count, geography, preferred workflow, pain points.' },
  { step: '02', title: 'Proposal', desc: 'We put together a pricing proposal and scope of work within 48 business hours.' },
  { step: '03', title: 'Onboarding', desc: 'We load your properties, contacts, preferred contractors, and access notes into the dashboard.' },
  { step: '04', title: 'Go live', desc: 'Your team submits requests through Nexus; your named Nexus representative manages day-to-day operations.' },
]

export default function CommercialPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-24">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              <Building2 className="h-3 w-3" /> Commercial &amp; portfolio
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Built for property managers running 10+ units.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              Nexus Operations offers a dedicated engagement model for multi-property portfolios —
              with a named Nexus representative, custom workflows, monthly performance reports, and
              consolidated billing across every unit you manage.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              >
                Request a proposal <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={CONTACT_INFO.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-[14px] font-semibold text-foreground hover:border-primary/40 hover:text-primary transition"
              >
                <Phone className="h-4 w-4" /> {CONTACT_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </section>

        {/* ── Benefits ─────────────────────────────────── */}
        <Section>
          <SectionHeading
            eyebrow="Portfolio benefits"
            title="What a commercial engagement includes."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {portfolioBenefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-border bg-card p-6">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-foreground">{title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SLA table ────────────────────────────────── */}
        <Section tone="muted">
          <SectionHeading
            eyebrow="Service level agreements"
            title="Published response commitments by urgency."
            description="Every commercial engagement is backed by published assignment and on-site SLAs, tracked in your monthly performance report."
          />

          <div className="mt-12 overflow-x-auto rounded-2xl border border-border">
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

          <div className="mt-6 p-5 rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Emergency tier is 24/7 — including nights, weekends, and holidays</p>
                <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                  The 1-hour assignment and 4-hour on-site SLAs apply around the clock. A burst pipe
                  at 11 PM on a Saturday is handled the same as one at 10 AM on a Tuesday.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {slaTable.map(({ tier, assignment, onSite, examples, icon: Icon }) => (
              <div
                key={tier}
                className="flex flex-col rounded-2xl border border-border bg-background p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                    {tier}
                  </p>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-4 text-[14px] font-semibold text-foreground">{assignment}</p>
                <p className="text-[13px] text-muted-foreground">{onSite}</p>
                <p className="mt-5 border-t border-border pt-4 text-[12.5px] leading-relaxed text-muted-foreground">
                  {examples}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
              <div>
                <p className="text-[14px] font-bold text-foreground">
                  Emergency tier is 24/7 — including nights, weekends, and holidays.
                </p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                  The 1-hour assignment and 4-hour on-site SLAs apply around the clock. For
                  after-hours emergencies, submit through the portal or email{' '}
                  <a
                    href={`mailto:emergency@${CONTACT_INFO.email.split('@')[1] ?? 'nexusoperations.org'}`}
                    className="font-semibold text-destructive hover:underline"
                  >
                    emergency@{CONTACT_INFO.email.split('@')[1] ?? 'nexusoperations.org'}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Reporting ────────────────────────────────── */}
        <Section>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Portfolio reporting"
                title="Visibility into every property, every month."
                description="Your named Nexus representative delivers a monthly performance report with aggregated metrics, spend breakdowns, and trend data."
              />
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-primary hover:gap-2 transition-all"
              >
                Request a sample report <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {reportingFields.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-[13.5px] leading-relaxed text-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* ── Onboarding ───────────────────────────────── */}
        <Section tone="muted">
          <SectionHeading
            eyebrow="Getting started"
            title="From discovery call to go-live in under two weeks."
            align="center"
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {onboarding.map(({ step, title, desc }) => (
              <div
                key={step}
                className="relative flex flex-col rounded-2xl border border-border bg-background p-6"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Step {step}
                </span>
                <p className="mt-3 text-[17px] font-bold text-foreground">{title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Who it's for ─────────────────────────────── */}
        <Section>
          <div className="grid gap-10 rounded-3xl border border-border bg-card p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                Commercial engagement is designed for
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Property managers, landlords, and REITs running multi-unit portfolios.
              </h3>
              <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
                If you manage 10 or more units — including small multi-family, scattered-site
                rentals, or commercial real estate — a Nexus commercial engagement can reduce the
                hours your team spends coordinating contractors and tracking invoices.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {[
                '10+ unit rental portfolios',
                'Multi-family residential buildings',
                'Scattered-site single-family rentals',
                'Mixed-use commercial properties',
                'Small office & retail portfolios',
                'Institutional & non-profit real estate',
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-3 text-[14px] font-medium text-foreground"
                >
                  <BadgeCheck className="h-5 w-5 flex-shrink-0 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* ── CTA ──────────────────────────────────────── */}
        <section className="bg-primary">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-[44px]">
              Ready to simplify your portfolio maintenance?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15.5px] leading-relaxed text-primary-foreground/80">
              Schedule a discovery call and we&apos;ll put together a custom proposal for your portfolio
              within two business days.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-primary shadow-lg hover:opacity-95 transition"
              >
                Request a proposal <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[14px] font-semibold text-white hover:bg-white/10 transition"
              >
                <Mail className="h-4 w-4" /> {CONTACT_INFO.email}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
