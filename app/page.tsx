import type { Metadata } from 'next'
import Image from 'next/image'
import Link from '@/components/link'
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  FileText,
  Hammer,
  LineChart,
  MessageSquare,
  Search,
  ShieldCheck,
  Star,
  Users,
  Wrench,
  Zap,
  Building2,
  Home,
  HardHat,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Section, SectionHeading } from '@/components/section'
import { ConstructionWorkerIllustration } from '@/components/construction-worker-illustration'
import { CONTACT_INFO } from '@/lib/contact-info'
import { getPlansByRole, formatPrice } from '@/lib/plans'

export const metadata: Metadata = {
  title: 'Nexus Operations — Property Maintenance Coordination in Topeka, KS',
  description:
    'Nexus Operations is a managed maintenance service in Topeka, Kansas. Each request is assigned to one verified, licensed contractor (never sold to multiple bidders), consultation is confirmed within 24 hours, and every step is documented through final invoice.',
}

const stats = [
  { value: '< 2hr', label: 'Emergency Response' },
  { value: '150+', label: 'Vetted Contractors' },
  { value: '500+', label: 'Jobs Completed' },
  { value: '4.9★', label: 'Average Rating' },
]

const serviceCategories = [
  { icon: Wrench, title: 'Plumbing', desc: 'Leaks, fixtures, water heaters, drains' },
  { icon: Zap, title: 'Electrical', desc: 'Panels, outlets, lighting, troubleshooting' },
  { icon: Hammer, title: 'General Repair', desc: 'Drywall, carpentry, doors, hardware' },
  { icon: ShieldCheck, title: 'HVAC', desc: 'Heating, cooling, ventilation service' },
  { icon: ClipboardList, title: 'Make-Ready', desc: 'Unit turnover prep and punch lists' },
  { icon: FileText, title: 'Preventative', desc: 'Seasonal inspections and scheduled care' },
]

const howItWorks = [
  {
    step: '01',
    title: 'Submit your request',
    desc: 'Describe the issue, add photos, set a budget range. Takes under 3 minutes.',
    icon: MessageSquare,
  },
  {
    step: '02',
    title: 'We assign a verified contractor',
    desc: 'Your job is assigned to one licensed, insured contractor. We do not blast your request to a lead marketplace.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Track everything in one place',
    desc: 'Messages, photos, status updates, and scheduling all live in your dashboard.',
    icon: LineChart,
  },
  {
    step: '04',
    title: 'Close out with full records',
    desc: 'Every job ends with photo documentation, a summary, and one clear invoice.',
    icon: CreditCard,
  },
]

const differentiators = [
  {
    icon: ShieldCheck,
    title: 'Verified contractor network',
    desc: 'Every contractor is license-verified, insurance-checked, and performance-reviewed before joining.',
  },
  {
    icon: Clock,
    title: 'Response-time guarantees',
    desc: 'Emergency requests are triaged within 1 hour, and consultation is confirmed within 24 hours for every request.',
  },
  {
    icon: FileText,
    title: 'Complete documentation',
    desc: 'Before/after photos, written scope, and invoices attached to every request.',
  },
  {
    icon: CreditCard,
    title: 'Unified billing',
    desc: 'One monthly invoice consolidates all work across all your properties.',
  },
]

const marketplaceComparison = [
  {
      title: 'Directory marketplaces',
      points: [
        'The same request is sold to multiple contractors at once',
        'You message multiple contractors and chase responses',
        'Scheduling and scope alignment is left to you',
        'Billing arrives from different vendors in different formats',
        'Documentation quality varies job-by-job',
    ],
  },
  {
      title: 'Nexus Operations',
      points: [
        'One request is assigned to one verified contractor',
        'No lead resale or bidding wars between contractors',
        '24-hour consultation confirmation on every request',
        'Dispatch and schedule follow-up are owned by our team',
        'Unified monthly invoice with line-item visibility',
        'Photo-backed records are required on every request',
    ],
  },
]

const audienceCards = [
  {
    title: 'Homeowners',
    desc: 'Submit a request with photos and a budget. We assign a verified contractor and manage everything through completion.',
    cta: 'Create homeowner account',
    href: '/auth/sign-up',
    icon: Home,
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Property Managers',
    desc: 'Manage your entire portfolio from one dashboard. Track spend by property and get consolidated monthly invoices.',
    cta: 'Set up portfolio account',
    href: '/auth/sign-up?role=property-manager',
    icon: Building2,
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    title: 'Contractors',
    desc: 'Receive pre-documented projects in your trade. Claim jobs that fit your schedule, get paid directly.',
    cta: 'Apply to the network',
    href: '/auth/sign-up?role=contractor',
    icon: HardHat,
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
]

const testimonials = [
  {
    quote:
      'Nexus has become our single point of contact for every unit. Submitting a request is faster than emailing a contractor directly, and we finally have photo records on every job.',
    name: 'Erin M.',
    role: 'Property Manager',
    detail: '12-unit portfolio',
  },
  {
    quote:
      "I had a burst pipe at 11 PM. By 1 AM a contractor was on site. I can't overstate how much stress Nexus removed from that night.",
    name: 'Mark R.',
    role: 'Homeowner',
    detail: 'Topeka, KS',
  },
  {
    quote:
      'The job board sends me work that fits my trade, and I get paid on schedule. It replaced three different contractor apps for me.',
    name: 'Dave K.',
    role: 'Contractor',
    detail: 'Licensed Electrician',
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
          <div className="pointer-events-none absolute inset-0 hero-gradient" />
          <div className="pointer-events-none absolute inset-0 hero-home-pattern opacity-60" />
          <div className="pointer-events-none absolute inset-0 property-grid-pattern opacity-30" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 lg:items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
                  Managed maintenance for {CONTACT_INFO.cityState}
                </div>

                <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.08] text-balance">
                  Property maintenance,{' '}
                  <span className="text-primary">handled by one accountable team.</span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  Nexus Operations is a managed service in Topeka, Kansas — not a lead marketplace.
                  Submit one request and we assign it to one verified contractor, confirm consultation
                  within 24 hours, manage scheduling and updates, and close the job with photo
                  documentation and one invoice.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/auth/sign-up"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md btn-primary-glow hover:opacity-95 transition-all"
                  >
                    Submit a maintenance request
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-muted/50 transition-all"
                  >
                    See how it works
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-primary" />
                    <span>No lead resale to multiple contractors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Consultation confirmed within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>One monthly invoice</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative">
                  {/* Contractor hero photo */}
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <Image
                      src="/photo-contractor.jpg"
                      alt="Licensed contractor on a Nexus Operations job site"
                      width={800}
                      height={1000}
                      className="h-[420px] w-full object-cover object-top sm:h-[480px]"
                      priority
                    />
                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Overlay live operations card */}
                    <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                      <div className="rounded-xl border border-white/10 bg-black/50 p-4 backdrop-blur-md">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                            Live operations
                          </p>
                          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-white/70">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
                            Coordinated by Nexus
                          </span>
                        </div>
                        <div className="space-y-2">
                          {[
                            { label: 'Emergency plumbing', status: 'Assigned in 13 min' },
                            { label: 'HVAC no-cool call', status: 'Technician en route' },
                            { label: 'Make-ready punch list', status: 'Documented + invoiced' },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2"
                            >
                              <p className="text-xs font-medium text-white">{item.label}</p>
                              <p className="text-[10px] font-semibold text-emerald-400">{item.status}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating testimonial card */}
                  <div className="absolute -bottom-6 -left-4 z-10 max-w-xs sm:-left-6">
                    <div className="rounded-xl border border-border bg-card p-4 shadow-xl card-elevated">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="mt-2 text-sm font-medium text-foreground">
                        &quot;We finally have one inbox for every maintenance request.&quot;
                      </p>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Property Manager — 12-unit portfolio
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Strip ─────────────────────────────────────── */}
        <section className="section-dark border-b border-white/10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
            {stats.map(({ value, label }, i) => (
              <div 
                key={label} 
                className={`px-6 py-8 text-center ${i < 3 ? 'border-r border-white/10' : ''} ${i < 2 ? 'border-b border-white/10 sm:border-b-0' : ''}`}
              >
                <p className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl tabular-nums">
                  {value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/60">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Photo Trust Banner ──────────────────────────────── */}
        <section className="relative overflow-hidden">
          <Image
            src="/business-growth-success-strategy.jpg"
            alt="Business growth and property strategy"
            width={1024}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70" />
          <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="text-center sm:text-left">
                <p className="font-display text-3xl font-bold text-white sm:text-4xl">150+</p>
                <p className="mt-1 text-sm font-medium text-white/80">Vetted contractors in the network</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-display text-3xl font-bold text-white sm:text-4xl">24hr</p>
                <p className="mt-1 text-sm font-medium text-white/80">Consultation confirmed on every request</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-display text-3xl font-bold text-white sm:text-4xl">4.9★</p>
                <p className="mt-1 text-sm font-medium text-white/80">Average rating across all completed jobs</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Who We Serve ────────────────────────────────────── */}
        <Section id="who-we-serve">
          <SectionHeading
            eyebrow="Who we serve"
            title="Built for everyone who owns, manages, or services property."
            description="Nexus Operations is a single point of contact connecting homeowners, property managers, and licensed contractors within one connected workflow."
            align="center"
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {audienceCards.map(({ title, desc, cta, href, icon: Icon, color }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col rounded-2xl border border-border/80 bg-card/90 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
                  {cta}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </Section>

        {/* ── Services Covered ────────────────────────────────── */}
        <Section tone="muted" id="services">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Services"
                title="Every trade you need. One service."
                description="Whether it's a leaking faucet or an after-hours HVAC failure, Nexus assigns a licensed contractor in the right trade and manages the job end-to-end."
              />
              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                View all service categories
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Construction worker illustration */}
              <div className="mt-8 hidden lg:block">
                <ConstructionWorkerIllustration size={220} className="rounded-xl opacity-90" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {serviceCategories.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-xl border border-border bg-card p-5 card-elevated"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── How It Works ───────────────────────────────────── */}
        <Section id="how-it-works">
          <SectionHeading
            eyebrow="How it works"
            title="From submission to sign-off in four steps."
            description="Every request follows the same documented workflow — no matter the trade, property, or urgency."
            align="center"
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map(({ step, title, desc, icon: Icon }, index) => (
              <div
                key={step}
                className="relative rounded-xl border border-border bg-card p-6 card-elevated"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">
                    Step {step}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                
                {index < 3 && (
                  <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block">
                    <ArrowRight className="h-5 w-5 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* ── Why Nexus ──────────────────────────────────────── */}
        <Section tone="muted" id="why-nexus">
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="relative">
                {/* Office workspace photo with overlay card */}
                <div className="overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src="/minimalist-modern-office-workspace-aerial-view.jpg"
                    alt="Nexus Operations coordination workspace"
                    width={1024}
                    height={1024}
                    className="h-[400px] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
                </div>

                {/* Overlay workflow card */}
                <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                  <div className="rounded-xl border border-white/10 bg-black/50 p-5 backdrop-blur-md">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400 mb-3">
                      Coordinator-led workflow
                    </p>
                    <div className="space-y-2.5">
                      {[
                        'Human triage on every request before dispatch',
                        'Contractor matched by trade, urgency, and availability',
                        'Job updates captured in one shared timeline',
                        'Completion photos and notes required before closeout',
                      ].map((line) => (
                        <div key={line} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <p className="text-xs text-white/90">{line}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Founded badge */}
                <div className="absolute -right-3 -top-3 hidden rounded-xl border border-border bg-card p-4 shadow-lg sm:block">
                  <p className="font-mono-label text-muted-foreground">Founded</p>
                  <p className="mt-1 font-display text-2xl font-bold text-foreground">2026</p>
                  <p className="text-sm text-muted-foreground">Topeka, Kansas</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <SectionHeading
                eyebrow="Why Nexus"
                title="A managed service, not a contractor marketplace."
                description="Typical platforms sell one request to many contractors. Nexus assigns each request to one verified contractor, coordinates the work directly, and stays accountable through documentation and billing."
              />

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {differentiators.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                Learn more about Nexus
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Section>

        {/* ── Marketplace Comparison ─────────────────────────── */}
        <Section id="comparison">
          <SectionHeading
            eyebrow="Why owners switch"
            title="A better model than Angi-style contractor directories."
            description="Instead of selling your request as shared leads, Nexus assigns one verified contractor and runs the job from intake to final invoice."
            align="center"
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {marketplaceComparison.map(({ title, points }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-6 card-elevated">
                <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
                <ul className="mt-5 space-y-3">
                  {points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Pricing Preview ────────────────────────────────── */}
        <Section tone="dark" id="pricing">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple, transparent subscription plans."
            description="Start free, upgrade when you need unlimited requests. No per-job surprises. No long-term contracts."
            onDark
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {homeownerPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl border p-6 ${
                  plan.highlighted
                    ? 'border-primary/50 bg-primary/10 shadow-2xl shadow-primary/20'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    <Star className="h-3 w-3 fill-current" /> {plan.badge}
                  </span>
                )}
                <p className="font-mono-label text-white/50">{plan.name}</p>
                <p className="mt-4 font-display text-4xl font-bold text-white tabular-nums">
                  {formatPrice(plan.priceInCents, plan.interval)}
                </p>
                {plan.billingLabel && (
                  <p className="mt-1 text-xs text-white/40">{plan.billingLabel}</p>
                )}
                <p className="mt-4 text-sm leading-relaxed text-white/70">{plan.description}</p>

                <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-white/80">
                  {plan.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/sign-up"
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-primary text-primary-foreground shadow-lg hover:opacity-95'
                      : 'border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  {plan.priceInCents === 0 ? 'Start free' : 'Choose this plan'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm text-white/60">
            <p>Contractor plans start free with Pro tiers from $59/month.</p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 font-semibold text-emerald-400 hover:gap-3 transition-all"
            >
              Compare all plans
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Section>

        {/* ── Search Bar ─────────────────────────────────────── */}
        <Section id="find">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading
              eyebrow="Find what you need"
              title="Search requests, properties, and contractors."
              description="Already on the platform? Log in and search for open service requests, available properties, or licensed contractors in your area."
              align="center"
            />
            <div className="mt-8 flex gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 pl-11 pr-4 h-12 w-full rounded-xl border border-border bg-background text-sm text-muted-foreground hover:border-primary/40 hover:bg-muted/30 transition"
                >
                  Search the platform…
                </Link>
              </div>
              <Link
                href="/auth/sign-up"
                className="h-12 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition flex items-center gap-2 whitespace-nowrap"
              >
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Section>

        {/* ── Testimonials ───────────────────────────────────── */}
        <Section id="testimonials">
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by homeowners and property managers in Topeka."
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map(({ quote, name, role, detail }) => (
              <figure
                key={name}
                className="flex flex-col rounded-xl border border-border bg-card p-6 card-elevated"
              >
                <div className="flex items-center gap-1 text-amber-500">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                  &quot;{quote}&quot;
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {role} — {detail}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        {/* ── FAQ Teaser ─────────────────────────────────────── */}
        <Section tone="muted">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="FAQ"
                title="Questions? We have answers."
                description="Still unsure if Nexus is the right fit? Our team is happy to walk through your specific needs."
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm btn-primary-glow hover:opacity-95 transition-all"
                >
                  View full FAQ
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors"
                >
                  Contact us
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-7">
              {[
                {
                  q: 'Who is Nexus Operations for?',
                  a: 'Homeowners, landlords, and property managers anywhere in Topeka / Shawnee County who need a single, reliable partner to manage property maintenance.',
                },
                {
                  q: 'How are contractors vetted?',
                  a: 'Every contractor is license-verified, insurance-checked, and performance-reviewed before joining. Ongoing jobs are monitored and contractors can be removed for quality issues.',
                },
                {
                  q: 'How does billing work?',
                  a: 'We consolidate every request into one unified monthly invoice. Pro subscribers get unlimited requests; starter accounts cover up to three requests per year.',
                },
                {
                  q: 'What areas do you cover?',
                  a: `Nexus Operations serves ${CONTACT_INFO.serviceArea}. If you own or manage property anywhere in Shawnee County, we can help.`,
                },
              ].map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-xl border border-border bg-card p-5 open:border-primary/30 transition-colors"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-foreground">
                    {q}
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Final CTA ──────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <Image
            src="/business-analytics-data-visualization.jpg"
            alt="Data-driven property maintenance operations"
            width={1024}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,rgba(255,255,255,0.15),transparent_60%)]" />
          
          <div className="relative mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl text-balance">
              Ready for one team to run your maintenance?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/80">
              Nexus Operations handles intake, dispatch, scheduling, updates, and documentation 
              for every job — with one consolidated invoice at month-end.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Talk with a coordinator
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-lg hover:bg-white/95 transition-colors"
              >
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-8 text-sm text-primary-foreground/70">
              {CONTACT_INFO.phoneDisplay} — {CONTACT_INFO.email}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
