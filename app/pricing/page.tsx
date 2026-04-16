import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Headphones,
  Shield,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Section, SectionHeading } from '@/components/section'
import { getPlansByRole, formatPrice, type Plan } from '@/lib/plans'
import { CONTACT_INFO } from '@/lib/contact-info'

export const metadata: Metadata = {
  title: 'Pricing — Simple, Transparent Subscription Plans',
  description:
    'Nexus Operations offers transparent subscription plans for homeowners, property managers, and contractors. Start free. Upgrade when you need unlimited requests. No long-term contracts.',
}

const included = [
  {
    icon: Shield,
    title: 'Verified contractor network',
    desc: 'Every contractor is license- and insurance-verified before joining.',
  },
  {
    icon: Clock,
    title: 'Response-time guarantees',
    desc: 'Urgent assignments under 4 hours, emergencies under 1 hour.',
  },
  {
    icon: FileText,
    title: 'Full job documentation',
    desc: 'Arrival photos, completion photos, and written scope on every job.',
  },
  {
    icon: CreditCard,
    title: 'Unified billing',
    desc: 'One clean invoice consolidates every request across every property.',
  },
  {
    icon: Users,
    title: 'Human review on every request',
    desc: 'Real Nexus staff review every request before dispatch.',
  },
  {
    icon: Headphones,
    title: 'Human support',
    desc: 'Talk to a real person during business hours — phone, email, or portal.',
  },
]

const faqs = [
  {
    q: 'Is there a contract?',
    a: 'No. Every plan is month-to-month (or cancel-anytime annual). Cancel directly from your billing portal — no phone calls and no retention offers required.',
  },
  {
    q: 'What counts as a service request?',
    a: 'A service request is any single job or project submitted through your dashboard — a leaky faucet, a broken light fixture, a turn-over punch list, or an emergency repair. Starter accounts are limited to three per calendar year; Pro subscribers get unlimited requests.',
  },
  {
    q: 'Do you charge per job?',
    a: 'No. Your subscription covers coordination and dispatch. Contractor labor and materials are billed through your unified monthly invoice at the contractor-quoted rate, with full line-item transparency.',
  },
  {
    q: 'Can I switch plans?',
    a: 'Yes — upgrade, downgrade, or change billing cadence at any time from your billing portal. Changes prorate automatically.',
  },
  {
    q: 'Do contractors pay to join?',
    a: 'Contractors can join for free with a starter profile. Pro and Elite tiers add higher project limits, priority routing, and earnings analytics.',
  },
  {
    q: 'What if I only need one project this year?',
    a: 'The free Starter plan covers up to three service requests per year — perfect for occasional needs. No payment method required to sign up.',
  },
]

function PlanCard({
  plan,
  featured = false,
}: {
  plan: Plan
  featured?: boolean
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-7 ${
        featured
          ? 'border-primary/50 bg-primary/5 shadow-xl shadow-primary/10'
          : 'border-border bg-card'
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-primary-foreground">
          <Star className="h-2.5 w-2.5 fill-current" /> {plan.badge}
        </span>
      )}

      <h3 className="text-[18px] font-bold text-foreground">{plan.name}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{plan.description}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-4xl font-extrabold tracking-tight text-foreground">
          {formatPrice(plan.priceInCents, plan.interval)}
        </span>
        {plan.priceInCents > 0 && <span className="text-[13px] text-muted-foreground">USD</span>}
      </div>
      {plan.billingLabel && (
        <p className="mt-1 text-[12px] text-muted-foreground">{plan.billingLabel}</p>
      )}

      <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-[13px] text-muted-foreground">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/auth/sign-up"
        className={`mt-7 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-[13px] font-semibold transition ${
          featured
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'border border-border bg-background text-foreground hover:border-primary/40 hover:text-primary'
        }`}
      >
        {plan.priceInCents === 0 ? 'Start free' : `Choose ${plan.name}`}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

export default function PricingPage() {
  const homeownerPlans = getPlansByRole('homeowner')
  const contractorPlans = getPlansByRole('contractor')

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="border-b border-border bg-background relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 hero-gradient" />
          <div className="pointer-events-none absolute inset-0 hero-home-pattern opacity-50" />
          <div className="relative mx-auto max-w-5xl px-6 py-24 text-center sm:py-28">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              <Sparkles className="h-3 w-3" /> Pricing
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Simple, transparent pricing.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              Start free. Upgrade when you need unlimited requests. Every plan includes our verified
              contractor network, response-time guarantees, and full job documentation — no hidden
              per-job fees, no long-term contracts.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              >
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-[14px] font-semibold text-foreground hover:border-primary/40 hover:text-primary transition"
              >
                Talk to sales
              </Link>
            </div>
          </div>
        </section>

        {/* ── Homeowner plans ───────────────────────────────── */}
        <Section id="homeowner-plans">
          <SectionHeading
            eyebrow="For homeowners & landlords"
            title="Plans for anyone who owns a property."
            description="Whether you own a single home or rent out a few units, start with the plan that fits your volume. Upgrade or cancel anytime."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {homeownerPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} featured={!!plan.highlighted} />
            ))}
          </div>
        </Section>

        {/* ── Contractor plans ──────────────────────────────── */}
        <Section tone="muted" id="contractor-plans">
          <SectionHeading
            eyebrow="For licensed contractors"
            title="Pre-documented jobs. Direct payouts. No lead fees."
            description="Join for free. Upgrade for higher project limits, priority routing, and earnings analytics. No marketplace fees — ever."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contractorPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} featured={!!plan.highlighted} />
            ))}
          </div>

          <p className="mt-8 text-center text-[13px] text-muted-foreground">
            Contractors are paid directly after completed jobs — Nexus never holds your money.{' '}
            <Link href="/contractors" className="font-semibold text-primary hover:underline">
              Contractor details →
            </Link>
          </p>
        </Section>

        {/* ── What's included ───────────────────────────────── */}
        <Section>
          <SectionHeading
            eyebrow="Included in every plan"
            title="Every plan includes the same coordination features from day one."
            align="center"
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {included.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-border bg-card p-6">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[14.5px] font-semibold text-foreground">{title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Commercial callout ────────────────────────────── */}
        <Section tone="muted">
          <div className="grid gap-8 rounded-3xl border border-border bg-background p-8 sm:p-10 lg:grid-cols-3 lg:items-center">
            <div className="lg:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                Managing 10+ units?
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Commercial &amp; portfolio pricing available.
              </h3>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
                Multi-property portfolios, multi-family buildings, and commercial real estate get
                custom pricing, a named Nexus representative, and portfolio-level reporting. Tell us about
                your operation and we&apos;ll put a quote together.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/commercial"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Commercial details <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-5 py-2.5 text-[13px] font-semibold text-foreground hover:border-primary/40 transition"
              >
                Request a quote
              </Link>
            </div>
          </div>
        </Section>

        {/* ── FAQ ───────────────────────────────────────────── */}
        <Section id="faq">
          <SectionHeading
            eyebrow="Pricing FAQ"
            title="Answers before you sign up."
            align="center"
          />

          <div className="mx-auto mt-12 grid max-w-4xl gap-3">
            {faqs.map(({ q, a }) => (
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

          <p className="mt-10 text-center text-[13px] text-muted-foreground">
            Still have questions? Call {CONTACT_INFO.phoneDisplay} or email{' '}
            <a href={`mailto:${CONTACT_INFO.email}`} className="font-semibold text-primary hover:underline">
              {CONTACT_INFO.email}
            </a>
          </p>
        </Section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="bg-primary">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to simplify maintenance?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] text-primary-foreground/80">
              Create an account and submit your first request in under two minutes. No credit card
              required for the free plan.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-primary shadow-lg hover:opacity-95 transition"
              >
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[14px] font-semibold text-white hover:bg-white/10 transition"
              >
                Talk to the team
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
