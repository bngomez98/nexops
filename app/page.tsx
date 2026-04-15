import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
import { CONTACT_INFO } from '@/lib/contact-info'
import { getPlansByRole, formatPrice } from '@/lib/plans'

export const metadata: Metadata = {
  title: 'Nexus Operations — Property Maintenance Coordination in Topeka, KS',
  description:
    'Nexus Operations is a managed maintenance coordination service for homeowners, landlords, and property managers in Topeka and Shawnee County. Submit one request; Nexus triages scope, dispatches verified contractors, and delivers unified billing with photo documentation.',
}

const stats = [
  { value: '20+', label: 'Verified Contractors' },
  { value: '< 4h', label: 'Emergency Response' },
  { value: '100%', label: 'Photo Documented' },
  { value: '15+', label: 'Trade Categories' },
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
    desc: 'Nexus reviews your request and dispatches a licensed, insured professional.',
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
    desc: 'Emergencies triaged within an hour. Routine work scheduled in 3-5 business days.',
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

const audienceCards = [
  {
    title: 'Homeowners',
    desc: 'Submit a request with photos and a budget. We coordinate a verified contractor and manage everything through completion.',
    cta: 'Create homeowner account',
    href: '/auth/sign-up',
    icon: Home,
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Property Managers',
    desc: 'Manage your entire portfolio from one dashboard. Track spend by property and get consolidated monthly invoices.',
    cta: 'Set up portfolio account',
    href: '/auth/sign-up?role=property_manager',
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
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-50" />
          
          <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24">
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
                  Nexus Operations is a managed service — not a contractor directory. Submit a request 
                  once; we triage scope, dispatch licensed contractors, manage updates, and deliver 
                  photo-documented work with unified billing.
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
                    <span>Managed service, not a marketplace</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Dispatch owned by Nexus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>One monthly invoice</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="relative overflow-hidden rounded-2xl border border-border shadow-2xl">
                    <Image
                      src="/business-handshake-professional-meeting.jpg"
                      alt="Nexus Operations coordinator meeting with a property manager"
                      width={800}
                      height={600}
                      priority
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                  
                  <div className="absolute -bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs">
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

        {/* ── Who We Serve ────────────────────────────────────── */}
        <Section id="who-we-serve">
          <SectionHeading
            eyebrow="Who we serve"
            title="Built for everyone who owns, manages, or services property."
            description="Nexus Operations is a single point of contact connecting homeowners, property managers, and licensed contractors within one coordinated workflow."
            align="center"
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {audienceCards.map(({ title, desc, cta, href, icon: Icon, color }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 card-elevated card-elevated-hover"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
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
                <div className="overflow-hidden rounded-2xl border border-border shadow-xl">
                  <Image
                    src="/business-analytics-data-visualization.jpg"
                    alt="Maintenance analytics dashboard"
                    width={800}
                    height={600}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <div className="absolute -right-4 -top-4 hidden rounded-xl border border-border bg-card p-4 shadow-lg sm:block">
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
                description="Marketplaces give you a list of names and step away. Nexus stays involved from submission to invoice — reviewing scope, coordinating schedules, verifying work, and publishing documentation."
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
                  a: 'Homeowners, landlords, and property managers anywhere in Topeka / Shawnee County who need a single, reliable partner to coordinate property maintenance.',
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
        <section className="relative overflow-hidden bg-primary">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />
          
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
