import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Clock3,
  CreditCard,
  FileText,
  Hammer,
  LineChart,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Section, SectionHeading } from '@/components/section'
import { CONTACT_INFO } from '@/lib/contact-info'
import { getPlansByRole, formatPrice } from '@/lib/plans'

export const metadata: Metadata = {
  title: 'Nexus Operations — Property Maintenance Coordination in Topeka, KS',
  description:
    'Nexus Operations coordinates verified, insured contractors for homeowners, landlords, and property managers in Topeka and Shawnee County. One request, full documentation, unified billing.',
}

const stats = [
  { value: '20+', label: 'Verified contractors in network' },
  { value: '< 4h', label: 'Urgent assignment response' },
  { value: '100%', label: 'Jobs photo-documented' },
  { value: '15+', label: 'Trade categories covered' },
]

const serviceAreas = [
  { icon: Wrench, title: 'Plumbing', desc: 'Leaks, fixtures, supply lines, water heaters, drains.' },
  { icon: Zap, title: 'Electrical', desc: 'Outlets, lighting, panels, breakers, troubleshooting.' },
  { icon: Hammer, title: 'General repair', desc: 'Drywall, carpentry, doors, windows, locks, hardware.' },
  { icon: ShieldCheck, title: 'HVAC', desc: 'Furnace, A/C, ventilation diagnostics and repair.' },
  { icon: ClipboardList, title: 'Turnover & make-ready', desc: 'Unit resets between tenants — cleaning, paint, punch lists.' },
  { icon: FileText, title: 'Preventative maintenance', desc: 'Seasonal inspections, filter changes, scheduled service.' },
]

const howItWorks = [
  {
    step: '01',
    title: 'Submit a request',
    desc: 'Describe the issue, add photos, and set a budget range. Takes under three minutes.',
    icon: MessageSquare,
  },
  {
    step: '02',
    title: 'We dispatch a verified contractor',
    desc: 'Our coordinators review the request, match trade and availability, and assign a licensed, insured contractor.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Track progress in one timeline',
    desc: 'Messages, arrival photos, completion photos, and status updates all live in one place.',
    icon: LineChart,
  },
  {
    step: '04',
    title: 'Close out with clean records',
    desc: 'Every job finishes with photo documentation, a written summary, and a unified invoice.',
    icon: CreditCard,
  },
]

const differentiators = [
  {
    icon: ShieldCheck,
    title: 'A verified, insured network',
    desc: 'Every contractor in the Nexus network is license-verified, insurance-checked, and performance-reviewed before they receive a single assignment.',
  },
  {
    icon: Clock3,
    title: 'Response-time guarantees',
    desc: 'We commit to assigned timelines based on urgency. Emergencies are triaged in under an hour; routine work is scheduled within 3–5 business days.',
  },
  {
    icon: FileText,
    title: 'Full documentation on every job',
    desc: 'Arrival photos, completion photos, written scope, and invoices are attached to every request — ready for insurance claims, owner reporting, or resale records.',
  },
  {
    icon: CreditCard,
    title: 'Unified, transparent billing',
    desc: 'One monthly invoice consolidates every request across every property. No surprise bills, no chasing contractors for paperwork.',
  },
]

const audienceCards = [
  {
    title: 'Homeowners',
    desc: 'Submit a request with photos and budget. We coordinate a verified contractor and manage the job through completion.',
    cta: 'Create a homeowner account',
    href: '/auth/sign-up',
    icon: Users,
  },
  {
    title: 'Property managers',
    desc: 'Manage an entire portfolio from one dashboard. Track spend by property, trade, and aggregate across every managed address.',
    cta: 'Set up a portfolio account',
    href: '/auth/sign-up?role=property_manager',
    icon: ClipboardList,
  },
  {
    title: 'Contractors',
    desc: 'Receive pre-documented projects in your trade. Claim what fits your schedule and get paid directly — no marketplace fees.',
    cta: 'Apply to the network',
    href: '/auth/sign-up?role=contractor',
    icon: Hammer,
  },
]

const testimonials = [
  {
    quote:
      'Nexus has become our one point of contact for every unit. Submitting a request is faster than emailing a contractor directly, and we finally have photo records on every job.',
    name: 'Erin M.',
    role: 'Property manager · 12 units',
  },
  {
    quote:
      "I had a burst pipe at 11 PM. By 1 AM a contractor was on site. I can't overstate how much stress Nexus removed from that night.",
    name: 'Mark R.',
    role: 'Homeowner · Topeka',
  },
  {
    quote:
      'The job board sends me work that actually fits my trade, and I get paid on schedule. It replaced three different contractor apps for me.',
    name: 'Dave K.',
    role: 'Licensed electrician',
  },
]

export default function HomePage() {
  const homeownerPlans = getPlansByRole('homeowner').slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(61,122,79,0.08),transparent_55%)]" />
          <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 sm:pt-20 lg:pt-24 lg:pb-24">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 lg:items-center">
              <div className="lg:col-span-7">
                <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                  <Sparkles className="h-3 w-3" />
                  Property maintenance, coordinated.
                </p>

                <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                  One request. A verified contractor. Every step documented.
                </h1>

                <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
                  Nexus Operations coordinates licensed, insured contractors for homeowners, landlords,
                  and property managers across {CONTACT_INFO.cityState}. Submit a request in minutes —
                  we handle dispatch, scheduling, photos, and unified billing.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/auth/sign-up"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                  >
                    Submit your first request <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-[14px] font-semibold text-foreground hover:border-primary/40 hover:text-primary transition"
                  >
                    See how it works
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 text-primary" /> Licensed &amp; insured network
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4 text-primary" /> Urgent dispatch under 4 hours
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-primary" /> Photo records on every job
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="relative overflow-hidden rounded-3xl border border-border shadow-xl">
                    <Image
                      src="/business-handshake-professional-meeting.jpg"
                      alt="Nexus Operations coordinator meeting with a property manager"
                      width={1200}
                      height={900}
                      priority
                      className="aspect-[4/5] w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-border bg-background p-4 shadow-lg sm:left-6 sm:right-auto sm:w-72">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="mt-2 text-[13px] font-semibold text-foreground">
                      &quot;We finally have one inbox for every maintenance request.&quot;
                    </p>
                    <p className="mt-1 text-[11.5px] text-muted-foreground">
                      Property manager · 12-unit portfolio
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats strip ─────────────────────────────────────── */}
        <section className="border-b border-border bg-[#0a0a0a]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="px-6 py-8 text-center">
                <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {value}
                </p>
                <p className="mt-1 text-[11.5px] font-medium uppercase tracking-[0.08em] text-white/50">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Who we serve ────────────────────────────────────── */}
        <Section id="who-we-serve">
          <SectionHeading
            eyebrow="Who we serve"
            title="Built for everyone who owns, manages, or services property."
            description="Nexus Operations is the single point of contact that ties homeowners, property managers, and licensed contractors together in one coordinated workflow."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {audienceCards.map(({ title, desc, cta, href, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
                  {desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary group-hover:gap-2 transition-all">
                  {cta} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </Section>

        {/* ── Services covered ────────────────────────────────── */}
        <Section tone="muted" id="services">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Services"
                title="Every trade you need. One coordinator."
                description="From a leaking faucet to an HVAC failure on a cold Sunday night, Nexus routes the right licensed contractor and manages the entire job."
              />
              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-primary hover:gap-2 transition-all"
              >
                View all service categories <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {serviceAreas.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-border bg-background p-5"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── How it works ───────────────────────────────────── */}
        <Section id="how-it-works">
          <SectionHeading
            eyebrow="How it works"
            title="From submission to sign-off in four steps."
            description="Every request follows the same documented workflow — no matter the trade, the property, or the urgency tier."
            align="center"
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map(({ step, title, desc, icon: Icon }) => (
              <div
                key={step}
                className="relative rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                    Step {step}
                  </span>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-[17px] font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Why Nexus ──────────────────────────────────────── */}
        <Section tone="muted" id="why-nexus">
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="relative">
                <div className="overflow-hidden rounded-3xl border border-border shadow-xl">
                  <Image
                    src="/business-analytics-data-visualization.jpg"
                    alt="Maintenance analytics dashboard"
                    width={1200}
                    height={900}
                    className="aspect-[5/4] w-full object-cover"
                  />
                </div>
                <div className="absolute -right-4 -top-4 hidden rounded-2xl border border-border bg-background p-4 shadow-lg sm:block">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Founded
                  </p>
                  <p className="mt-0.5 text-2xl font-bold text-foreground">2026</p>
                  <p className="text-[11.5px] text-muted-foreground">Topeka, Kansas</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <SectionHeading
                eyebrow="Why Nexus Operations"
                title="A maintenance coordinator, not a contractor marketplace."
                description="Marketplaces hand you a list of names and walk away. Nexus stays involved from the moment a request is submitted until the invoice is closed — reviewing scope, coordinating schedules, verifying work, and publishing records you can trust."
              />

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {differentiators.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-foreground">{title}</p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-primary hover:gap-2 transition-all"
              >
                Learn more about Nexus <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Section>

        {/* ── Pricing preview ────────────────────────────────── */}
        <Section tone="dark" id="pricing">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple, transparent subscription plans."
            description="Start free, upgrade when you need unlimited requests. No per-job surprise charges. No long-term contracts."
            onDark
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {homeownerPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  plan.highlighted
                    ? 'border-primary/50 bg-primary/10 shadow-2xl shadow-primary/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-primary-foreground">
                    <Star className="h-2.5 w-2.5 fill-current" /> {plan.badge}
                  </span>
                )}
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">
                  {plan.name}
                </p>
                <p className="mt-3 text-3xl font-extrabold text-white">
                  {formatPrice(plan.priceInCents, plan.interval)}
                </p>
                {plan.billingLabel && (
                  <p className="mt-0.5 text-[11.5px] text-white/40">{plan.billingLabel}</p>
                )}
                <p className="mt-3 text-[13px] text-white/65 leading-relaxed">{plan.description}</p>

                <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-[12.5px] text-white/75">
                  {plan.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/sign-up"
                  className={`mt-6 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-semibold transition ${
                    plan.highlighted
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  {plan.priceInCents === 0 ? 'Start free' : 'Choose this plan'}{' '}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-[13px] text-white/60">
            <p>Contractor subscriptions start free with pro tiers from $59/month.</p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 hover:gap-2 transition-all"
            >
              Compare all plans <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Section>

        {/* ── Testimonials ───────────────────────────────────── */}
        <Section id="testimonials">
          <SectionHeading
            eyebrow="What our members say"
            title="Trusted by homeowners and property managers in Topeka."
            align="center"
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map(({ quote, name, role }) => (
              <figure
                key={name}
                className="flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center gap-1 text-amber-500">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed text-foreground">
                  &quot;{quote}&quot;
                </blockquote>
                <figcaption className="mt-5 border-t border-border pt-4">
                  <p className="text-[13px] font-semibold text-foreground">{name}</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">{role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        {/* ── FAQ teaser ─────────────────────────────────────── */}
        <Section tone="muted">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="FAQ"
                title="Answers to common questions."
                description="Still unsure whether Nexus is a fit? Our team is happy to walk through your workflow."
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Full FAQ <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-5 py-2.5 text-[13px] font-semibold text-foreground hover:border-primary/40 transition"
                >
                  Contact us
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-7">
              {[
                {
                  q: 'Who is Nexus Operations for?',
                  a: 'Homeowners, landlords, and property managers anywhere in the Topeka / Shawnee County area who need a single, reliable partner to coordinate property maintenance instead of managing contractors directly.',
                },
                {
                  q: 'How are contractors vetted?',
                  a: 'Every contractor is license-verified, insurance-checked, and performance-reviewed before joining the network. Ongoing jobs are monitored and contractors can be removed for quality issues.',
                },
                {
                  q: 'How does billing work?',
                  a: 'We consolidate every request into a unified monthly invoice. Pro subscribers get unlimited requests; starter accounts cover up to three requests per year.',
                },
                {
                  q: 'What areas do you cover?',
                  a: `Nexus Operations serves ${CONTACT_INFO.serviceArea}. If you own or manage property anywhere in Shawnee County, we can help.`,
                },
              ].map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-2xl border border-border bg-background p-5 open:border-primary/40"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-[14px] font-semibold text-foreground">
                    {q}
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Final CTA ──────────────────────────────────────── */}
        <section className="bg-primary">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-[44px]">
              Ready to hand off your maintenance calendar?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15.5px] leading-relaxed text-primary-foreground/80">
              Create an account in under two minutes and submit your first request today. Our team
              reviews every submission before dispatch — no waiting on a marketplace timer.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-primary shadow-lg hover:opacity-95 transition"
              >
                Create an account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[14px] font-semibold text-white hover:bg-white/10 transition"
              >
                Talk to the team
              </Link>
            </div>
            <p className="mt-8 text-[12.5px] text-primary-foreground/70">
              {CONTACT_INFO.phoneDisplay} · {CONTACT_INFO.email}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
