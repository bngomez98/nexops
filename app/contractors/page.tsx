import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock,
  DollarSign,
  Hammer,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Section, SectionHeading } from '@/components/section'
import { CONTACT_INFO } from '@/lib/contact-info'

export const metadata: Metadata = {
  title: 'For Contractors — Join the Nexus Operations Network',
  description:
    'Licensed and insured contractors in Shawnee County: join the Nexus Operations network for pre-qualified, fully documented jobs. Direct payouts, no marketplace fees, no lead costs.',
}

const benefits = [
  {
    icon: DollarSign,
    title: 'Direct payouts, on schedule',
    desc: 'Every job pays you at your full quoted rate. Nexus Operations never holds contractor money or takes a marketplace cut.',
  },
  {
    icon: ClipboardList,
    title: 'Jobs you can actually scope',
    desc: 'Every assignment arrives with photos, scope notes, budget range, property address, and access details — so you walk in ready to work.',
  },
  {
    icon: ShieldCheck,
    title: 'No lead fees, no subscriptions required',
    desc: 'Starter accounts are free, forever. Pro and Elite tiers unlock additional capacity, priority routing, and analytics — but they are optional.',
  },
  {
    icon: BarChart3,
    title: 'Performance-based priority',
    desc: 'Consistent response times, clean documentation, and high ratings earn priority assignment on higher-value work. Reliability compounds.',
  },
  {
    icon: Hammer,
    title: 'Focus on the work, not admin',
    desc: 'Messaging, photo upload, status updates, and invoicing are all built into one contractor dashboard — no more spreadsheet wrangling.',
  },
  {
    icon: Users,
    title: 'A coordinator on your side',
    desc: 'If a homeowner is unreachable, a scope changes, or schedules conflict, Nexus coordinators intervene so you can keep moving.',
    title: "No subscription fees or lead costs",
    description:
      "We never charge contractors to receive work. No subscription fees, no lead fees. You receive your full quoted rate on every job.",
  },
  {
    icon: BarChart3,
    title: "Performance-based priority",
    description:
      "Contractors who consistently meet response times, complete quality documentation, and maintain high ratings get priority assignment on higher-value work. Reliable performance earns more volume.",
  },
]

const requirements = [
  "Valid Kansas business license",
  "Applicable trade licenses for your service categories",
  "General liability insurance ($500K per occurrence minimum)",
  "Workers compensation insurance (if you have employees)",
  "Ability to respond to assignments within defined SLA windows",
  "Willingness to provide photo documentation on every job",
]

const verificationSteps = [
  {
    icon: FileText,
    step: "01",
    title: "Apply online",
    description:
      "Complete the short application with your business info, trade specialties, and service area. Any home service category is welcome.",
  },
  {
    icon: BadgeCheck,
    step: "02",
    title: "We review within 12 hours",
    description:
      "A member of our team reviews every application and follows up at the email you provide — guaranteed within 12 hours.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Credential verification",
    description:
      "We verify licenses against state databases and confirm insurance coverage directly with your provider before approval.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Start receiving work",
    description:
      "Once approved, you're added to the active network and begin receiving assignment notifications matching your trade and availability.",
  },
]

const requirements = [
  'Valid Kansas business license',
  'Applicable trade licenses for your service categories',
  'General liability insurance ($500K per occurrence minimum)',
  'Workers compensation insurance (if you have employees)',
  'Ability to respond to assignments within published SLA windows',
  'Willingness to provide photo documentation on every job',
  'Two professional references or prior client endorsements',
]

const onboarding = [
  { step: '01', title: 'Apply', desc: 'Create a contractor account and submit your trade categories, insurance, and references.' },
  { step: '02', title: 'Verify', desc: 'We confirm license status, insurance certificates, and contact your references within 2–3 business days.' },
  { step: '03', title: 'Onboard', desc: 'One call with a Nexus coordinator to walk through the dashboard, payment setup, and scheduling preferences.' },
  { step: '04', title: 'Activate', desc: 'Your profile goes live in the network and matching jobs begin routing to your dashboard.' },
]

const trades = [
  'Plumbing',
  'Electrical',
  'HVAC',
  'General carpentry',
  'Drywall & paint',
  'Roofing',
  'Appliances',
  'Flooring',
  'Landscaping',
  'Turnover / make-ready',
  'Handyman services',
  'Snow removal',
]

export default function ContractorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* ── Hero ────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-12 lg:items-center lg:py-24">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                <Sparkles className="h-3 w-3" /> For licensed contractors
              </p>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                Get paid for the work — not the paperwork.
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground mb-6 text-balance">
                Pre-qualified work.{" "}
                <span className="font-serif italic font-normal text-primary">
                  Guaranteed payment within 30 days.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
                Join the Nexus Operations contractor network and receive pre-documented jobs from
                vetted homeowners and property managers in Topeka and Shawnee County. No marketplace
                fees. No lead costs. Direct payouts at your full quoted rate.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/auth/sign-up?role=contractor"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                >
                  Apply to join <ArrowRight className="h-4 w-4" />
                  href="/contractors/apply"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                >
                  Apply to Join — 12-hour review
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-[14px] font-semibold text-foreground hover:border-primary/40 hover:text-primary transition"
                >
                  Ask a question
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-primary" /> Free to join
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-primary" /> Direct payouts
              ))}
            </div>
          </div>
        </section>

        {/* Network at a Glance */}
        <section id="network" className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Contractor network
              </p>
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4">
                Who&apos;s in the network.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every contractor in the network has been manually verified —
                license confirmed against state records, insurance confirmed
                directly with the provider. Below is the current network by
                trade category. Contractor identities are kept confidential
                until a specific job assignment is confirmed.
              </p>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Active contractors", value: "20+" },
                { label: "Trade categories", value: "All trades" },
                { label: "Accepting applications", value: "Open" },
                { label: "Application review time", value: "12 hours" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-5 rounded-xl bg-card border border-border text-center"
                >
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" /> Local dispatch only
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-border bg-card p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Network snapshot
            {/* Network table */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/60 border-b border-border">
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Trade
                      </th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                        Credential required
                      </th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                        Insurance min.
                      </th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Tiers covered
                      </th>
                      <th className="text-center px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Active
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {networkCategories.map((cat) => (
                      <tr key={cat.trade} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{cat.icon}</span>
                            <span className="font-medium text-foreground text-[13px]">
                              {cat.trade}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[12.5px] text-muted-foreground hidden sm:table-cell max-w-[220px]">
                          {cat.credentialRequired}
                        </td>
                        <td className="px-5 py-4 text-[12.5px] text-muted-foreground hidden md:table-cell whitespace-nowrap">
                          {cat.insuranceMin}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {cat.tiers.map((tier) => (
                              <span
                                key={tier}
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium ${tierColors[tier]}`}
                              >
                                {tier}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[12.5px] font-semibold text-foreground">
                              {cat.activeContractors}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3.5 bg-secondary/40 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-[11.5px] text-muted-foreground">
                  Contractor identities are anonymized until job assignment. Verified credentials are available for review upon request before any job begins. All trade categories are open.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-5">
                  {[
                    { value: '20+', label: 'Active contractors' },
                    { value: '$0', label: 'Lead fees' },
                    { value: '100%', label: 'Documented jobs' },
                    { value: '< 4h', label: 'Urgent response' },
                  ].map(({ value, label }) => (
                    <div key={label} className="rounded-xl border border-border bg-background p-4">
                      <p className="text-2xl font-extrabold text-foreground">{value}</p>
                      <p className="mt-1 text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/pricing#contractor-plans"
                  className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:gap-2 transition-all"
                >
                  Contractor plans &amp; tiers <ArrowRight className="h-3.5 w-3.5" />
                  href="/contractors/apply"
                  className="text-[11.5px] font-semibold text-primary hover:underline whitespace-nowrap"
                >
                  Apply to join →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Benefits ──────────────────────────────────── */}
        <Section>
          <SectionHeading
            eyebrow="Why join Nexus"
            title="Six reasons contractors stay on the network."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, desc }) => (
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

        {/* ── Trades wanted ─────────────────────────────── */}
        <Section tone="muted">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Trades we are hiring"
                title="We're actively building out our contractor roster."
                description="Whether you work solo or run a small crew, we want to talk to you."
              />
              <Link
                href="/auth/sign-up?role=contractor"
                className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-primary hover:gap-2 transition-all"
              >
                Submit an application <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="lg:col-span-7">
              <div className="flex flex-wrap gap-2">
                {trades.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-[13px] font-medium text-foreground"
                  >
                    <Wrench className="h-3 w-3 text-primary" /> {t}
                  </span>
                ))}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Requirements
                </p>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-6">
                  What we require to join.
                </h2>
                <div className="rounded-xl bg-card border border-border p-6 lg:p-8">
                  <div className="flex flex-col gap-4">
                    {requirements.map((req) => (
                      <div
                        key={req}
                        className="flex items-start gap-3 text-sm text-foreground/70"
                      >
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {req}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We accept contractors across all home service and trade categories —
                      plumbing, electrical, HVAC, roofing, concrete, landscaping, painting,
                      fencing, appliance repair, and more. If you provide skilled home
                      services, apply.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Requirements ──────────────────────────────── */}
        <Section>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Requirements"
                title="What we look for."
                description="Nexus only onboards contractors who meet or exceed our verification standards. Here's the checklist."
              />
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {requirements.map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-[13.5px] leading-relaxed text-foreground">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* ── Onboarding ────────────────────────────────── */}
        <Section tone="muted">
          <SectionHeading
            eyebrow="Application process"
            title="From application to active in about a week."
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
        {/* CTA */}
        <section className="py-16 lg:py-24 bg-secondary/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4 text-balance">
                Ready to join the network?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                The application takes under five minutes. Every application is reviewed within 12 hours.
                All home service trades are welcome.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/contractors/apply"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                >
                  Apply Now — 12-Hour Review
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  Email with questions
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </Section>

        {/* ── FAQ ───────────────────────────────────────── */}
        <Section>
          <SectionHeading
            eyebrow="Contractor FAQ"
            title="Common questions from applicants."
            align="center"
          />

          <div className="mx-auto mt-12 grid max-w-4xl gap-3">
            {[
              {
                q: 'Does it cost anything to join?',
                a: 'No. Starter contractor accounts are free, forever. You can optionally upgrade to Pro or Elite tiers to unlock additional capacity and priority routing — but it is not required to receive work.',
              },
              {
                q: 'How fast do I get paid?',
                a: 'Nexus Operations pays contractors directly after each completed job, on the schedule configured in your payout settings. We never hold funds or take a percentage of your quoted rate.',
              },
              {
                q: 'Do I have to accept every job?',
                a: 'No. You can decline any assignment for any reason. Consistently meeting SLA on accepted jobs is how contractors earn priority placement.',
              },
              {
                q: 'Can I set my own rates?',
                a: 'Yes. You quote every job at your own rate. Nexus coordinates with the client; your number is the number that gets invoiced.',
              },
              {
                q: 'Do I need employees to join?',
                a: 'No. We work with solo operators and small crews alike. Workers compensation is only required if you have employees.',
              },
              {
                q: 'Do you send work outside Topeka?',
                a: 'No — we only dispatch within Topeka and Shawnee County. You won\'t be asked to drive across the state for a job.',
              },
            ].map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-2xl border border-border bg-card p-5 open:border-primary/40"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-[14.5px] font-semibold text-foreground">
                  {q}
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* ── CTA ───────────────────────────────────────── */}
        <section className="bg-primary">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to join the network?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] text-primary-foreground/80">
              Apply in minutes. A Nexus coordinator will follow up to verify your license, insurance,
              and onboard you to the dashboard.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/sign-up?role=contractor"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-primary shadow-lg hover:opacity-95 transition"
              >
                Submit application <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[14px] font-semibold text-white hover:bg-white/10 transition"
              >
                Email {CONTACT_INFO.email}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
