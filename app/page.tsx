import type { Metadata } from 'next'
import Image from 'next/image'
import Link from '@/components/link'
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Hammer,
  HardHat,
  MessageSquare,
  ShieldCheck,
  Star,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CONTACT_INFO } from '@/lib/contact-info'
import { getPlansByRole, formatPrice } from '@/lib/plans'

export const metadata: Metadata = {
  title: 'Nexus Operations — Managed Property Maintenance in Topeka, KS',
  description:
    'One request. One verified contractor. Nexus Operations manages property maintenance for homeowners and landlords in Topeka, Kansas. Licensed and insured contractors. Photo documentation on every job.',
}

const stats = [
  { value: '20+', label: 'Verified Contractors' },
  { value: '< 1 hr', label: 'Emergency Assignment' },
  { value: '100%', label: 'Photo Documented' },
  { value: '15+', label: 'Trade Categories' },
]

const howItWorks = [
  {
    step: '01',
    title: 'Submit your request',
    desc: 'Fill out a short form with the issue, photos, and your property address. No phone tag, no callbacks waiting. Under 3 minutes from start to submitted.',
    icon: MessageSquare,
  },
  {
    step: '02',
    title: 'We assign one contractor',
    desc: 'A Nexus team member reads your request and assigns it to one licensed, insured contractor from our Topeka network. Your job is never sent to multiple companies.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Track the job in one place',
    desc: 'Every status update, scheduling message, and photo lives in your dashboard. No hunting across emails and texts to figure out where things stand.',
    icon: ClipboardList,
  },
  {
    step: '04',
    title: 'Close out with full records',
    desc: 'Before-and-after photos, a written job summary, and a clear invoice attach when the work is done — everything you need for property records, insurance, or resale.',
    icon: FileText,
  },
]

const serviceCategories = [
  { icon: Wrench, title: 'Plumbing', desc: 'Leaks, fixtures, water heaters, drains, burst supply lines' },
  { icon: Zap, title: 'Electrical', desc: 'Panels, outlets, lighting, GFCI, ceiling fans, troubleshooting' },
  { icon: Hammer, title: 'General Repair', desc: 'Drywall, carpentry, doors, locks, windows, hardware' },
  { icon: ShieldCheck, title: 'HVAC', desc: 'Heating, cooling, diagnostics, seasonal tune-ups' },
  { icon: ClipboardList, title: 'Make-Ready', desc: 'Full unit turnover prep, punch lists, photo documentation' },
  { icon: FileText, title: 'Preventative', desc: 'Quarterly inspections, filter service, pre-winter checks' },
]

const testimonials = [
  {
    quote:
      'Nexus has become our single point of contact for every unit. Submitting a request is faster than emailing a contractor directly, and we finally have photo records on every job.',
    name: 'Erin M.',
    role: 'Property Manager',
    detail: '12 units in Topeka',
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
      'The job board sends me work that fits my trade, with full details before I show up. It replaced three different contractor apps for me.',
    name: 'Dave K.',
    role: 'Licensed Electrician',
    detail: 'Topeka contractor network',
  },
]

export default function HomePage() {
  const homeownerPlans = getPlansByRole('homeowner')

  return (
    <>
      <Header />
      <main>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="bg-[#111111] min-h-[calc(100vh-64px)] flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Left: copy */}
              <div className="flex flex-col gap-7">
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-white/55 tracking-wide">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Serving {CONTACT_INFO.serviceArea}
                </div>

                <div>
                  <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-white lg:text-6xl xl:text-7xl">
                    Property maintenance,
                    <br className="hidden sm:block" />
                    <span className="text-white/30"> handled by one team.</span>
                  </h1>
                </div>

                <p className="text-lg text-white/55 max-w-xl leading-relaxed">
                  Nexus Operations is Topeka&apos;s managed property maintenance service — not a
                  search directory, not a lead marketplace. Submit a request and we assign one
                  verified, licensed contractor from our network. Our team handles scheduling,
                  updates, and documentation. One invoice at month-end.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/auth/sign-up"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors"
                  >
                    Submit a request <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contractors"
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    <HardHat className="h-4 w-4" /> I&apos;m a contractor
                  </Link>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/35">
                  <span className="flex items-center gap-1.5">
                    <BadgeCheck className="h-3.5 w-3.5" /> No lead resale
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> 24-hour confirmation
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" /> One monthly invoice
                  </span>
                </div>
              </div>

              {/* Right: image */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-lg overflow-hidden rounded-2xl">
                  <Image
                    src="/photo-contractor.jpg"
                    alt="Nexus Operations verified contractor at work in Topeka"
                    width={640}
                    height={480}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute bottom-4 left-4 rounded-xl border border-white/15 bg-black/70 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-0.5 text-yellow-400">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-white">
                      &ldquo;Finally, one inbox for every repair.&rdquo;
                    </p>
                    <p className="mt-0.5 text-xs text-white/50">Property Manager — Topeka, KS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ──────────────────────────────────────────────── */}
        <section className="border-y border-white/10 bg-[#0d0d0d]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
            {stats.map(({ value, label }, i) => (
              <div
                key={label}
                className={`px-6 py-8 text-center ${i < 3 ? 'border-r border-white/10' : ''} ${i < 2 ? 'border-b border-white/10 sm:border-b-0' : ''}`}
              >
                <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl tabular-nums">
                  {value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/40">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
        <section className="bg-[#f0eeeb]">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
            <div className="mb-14 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-[#111111]/40 mb-3">
                How it works
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight text-[#111111] lg:text-5xl">
                From request to closed job — four steps.
              </h2>
              <p className="mt-4 text-base text-[#111111]/55 leading-relaxed">
                Every request at Nexus Operations follows the same documented workflow, regardless
                of trade, urgency, or property type.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map(({ step, title, desc, icon: Icon }, index) => (
                <div
                  key={step}
                  className="relative flex flex-col rounded-2xl border border-black/8 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#111111]/30">
                      {step}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111111]">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[#111111]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#111111]/50">{desc}</p>
                  {index < 3 && (
                    <div className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 lg:block z-10">
                      <ArrowRight className="h-4 w-4 text-[#111111]/25" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOR HOMEOWNERS ───────────────────────────────────────────── */}
        <section className="bg-[#f0eeeb]">
          <div className="mx-auto w-full max-w-7xl px-6 pb-20 lg:pb-28">
            <div className="h-px bg-black/8 mb-20 lg:mb-28" />
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Image */}
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/minimalist-modern-office-workspace-aerial-view.jpg"
                  alt="Nexus Operations homeowner dashboard"
                  width={640}
                  height={480}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Copy */}
              <div className="flex flex-col gap-7">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#111111]/40 mb-2">
                    For homeowners &amp; landlords
                  </p>
                  <h2 className="text-4xl font-extrabold tracking-tight text-[#111111] lg:text-5xl">
                    Stop calling around. Start submitting requests.
                  </h2>
                  <p className="mt-4 text-base text-[#111111]/55 max-w-xl leading-relaxed">
                    Whether it&apos;s a leaking faucet or an after-hours HVAC failure, submit one
                    request through your dashboard. Nexus assigns a licensed contractor in the right
                    trade and runs the job from intake to invoice. You stay informed, not involved.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/70 border border-black/5 p-6 shadow-sm">
                  <p className="mb-5 text-xs font-bold uppercase tracking-widest text-[#111111]/40">
                    What every request includes
                  </p>
                  <div className="flex flex-col gap-4">
                    {[
                      {
                        Icon: Camera,
                        title: 'Photo documentation',
                        desc: 'Before-and-after photos attached to every job before closeout',
                      },
                      {
                        Icon: Calendar,
                        title: 'Scheduled access windows',
                        desc: 'Contractor arrival times confirmed with you and the tenant directly',
                      },
                      {
                        Icon: MessageSquare,
                        title: 'Real-time status updates',
                        desc: 'All messages and job updates in your dashboard — not scattered across texts',
                      },
                      {
                        Icon: CreditCard,
                        title: 'One monthly invoice',
                        desc: 'Every job you submitted that month rolls into a single line-itemized bill',
                      },
                    ].map(({ Icon, title, desc }) => (
                      <div key={title} className="flex items-start gap-4">
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#111111] text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[#111111]">{title}</p>
                          <p className="text-sm text-[#111111]/50">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Link
                    href="/auth/sign-up"
                    className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white hover:bg-black/80 transition-colors"
                  >
                    Create your account <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES OVERVIEW ────────────────────────────────────────── */}
        <section className="bg-[#111111]">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
            <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div className="max-w-xl">
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                  Services
                </p>
                <h2 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
                  Every trade you need. One service.
                </h2>
                <p className="mt-3 text-base text-white/50 leading-relaxed">
                  From a dripping faucet to a full unit turnover, every category below is handled
                  by licensed, insured contractors in our Topeka network.
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 hover:text-white transition-colors flex-shrink-0"
              >
                View all categories <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {serviceCategories.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-white/8 bg-white/5 p-5"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm text-white/50">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOR CONTRACTORS ──────────────────────────────────────────── */}
        <section className="bg-[#f0eeeb]">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Copy */}
              <div className="flex flex-col gap-7">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#111111]/40 mb-2">
                    For licensed contractors
                  </p>
                  <h2 className="text-4xl font-extrabold tracking-tight text-[#111111] lg:text-5xl">
                    Pre-documented jobs. No lead fees.
                  </h2>
                  <p className="mt-4 text-base text-[#111111]/55 max-w-xl leading-relaxed">
                    Nexus is not a shared lead marketplace. You see the full job details — scope,
                    photos, budget context, and property address — before you claim anything. Once
                    assigned, our team handles the scheduling and billing. You focus on the work.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/70 border border-black/5 p-6 shadow-sm">
                  <p className="mb-5 text-xs font-bold uppercase tracking-widest text-[#111111]/40">
                    Contractor experience
                  </p>
                  <div className="flex flex-col gap-4">
                    {[
                      {
                        Icon: Eye,
                        title: 'Full job details before you claim',
                        desc: 'Photos, budget cap, scope notes, and property address visible upfront',
                      },
                      {
                        Icon: Zap,
                        title: 'No bidding wars or competing quotes',
                        desc: 'Jobs go to one contractor — whoever claims it first in their trade category',
                      },
                      {
                        Icon: CreditCard,
                        title: 'Direct payouts at the quoted rate',
                        desc: 'Nexus pays at the rate quoted on submission — no deductions, no delays',
                      },
                      {
                        Icon: BadgeCheck,
                        title: 'Verified badge on your profile',
                        desc: 'Pro and Elite contractors display a license-verified badge on every assignment',
                      },
                    ].map(({ Icon, title, desc }) => (
                      <div key={title} className="flex items-start gap-4">
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#111111] text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[#111111]">{title}</p>
                          <p className="text-sm text-[#111111]/50">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/contractors/apply"
                    className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white hover:bg-black/80 transition-colors"
                  >
                    Apply to the network <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/pricing#contractor-plans"
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/25 px-6 py-3 text-sm font-semibold text-[#111111] hover:bg-black/5 transition-colors"
                  >
                    Contractor pricing
                  </Link>
                </div>
              </div>

              {/* Image */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="overflow-hidden rounded-2xl w-full max-w-lg">
                  <Image
                    src="/business-handshake-professional-meeting.jpg"
                    alt="Nexus Operations team with a licensed contractor"
                    width={640}
                    height={480}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SUBSCRIPTION PLANS ───────────────────────────────────────── */}
        <section className="bg-[#111111]" id="pricing">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
            <div className="mb-12 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                Subscription plans
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
                Start free. Upgrade when you need unlimited.
              </h2>
              <p className="mt-4 text-base text-white/50 leading-relaxed">
                Your subscription covers dispatch, scheduling, and job oversight. Contractor
                labor and materials are billed separately through your unified monthly invoice
                at the quoted rate — full line-item transparency, no markups.
              </p>
            </div>

            {/* Homeowner plans */}
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-white/40">
              Homeowner &amp; landlord plans
            </p>
            <div className="grid gap-5 md:grid-cols-3 mb-10">
              {homeownerPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border p-7 ${
                    plan.highlighted
                      ? 'border-green-500/40 bg-green-950/30'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-black">
                      <Star className="h-2.5 w-2.5 fill-current" /> {plan.badge}
                    </span>
                  )}
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                    {plan.name}
                  </p>
                  <p className="mt-4 text-4xl font-extrabold text-white tabular-nums">
                    {formatPrice(plan.priceInCents, plan.interval)}
                  </p>
                  {plan.billingLabel && (
                    <p className="mt-1 text-xs text-white/35">{plan.billingLabel}</p>
                  )}
                  <p className="mt-3 text-sm text-white/55 leading-relaxed">{plan.description}</p>

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm text-white/70">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/auth/sign-up"
                    className={`mt-7 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold transition ${
                      plan.highlighted
                        ? 'bg-green-500 text-black hover:bg-green-400'
                        : 'border border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    {plan.priceInCents === 0 ? 'Start free' : `Choose ${plan.name}`}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Contractor note */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-7 py-5">
              <div className="flex items-center gap-4">
                <HardHat className="h-5 w-5 text-white/40 flex-shrink-0" />
                <p className="text-sm text-white/60">
                  <span className="font-semibold text-white">Contractor plans</span> start free —
                  Pro from $59/mo, Elite at $199/mo. No per-lead fees.
                </p>
              </div>
              <Link
                href="/pricing#contractor-plans"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-400 hover:text-green-300 transition-colors flex-shrink-0"
              >
                See contractor plans <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <p className="mt-6 text-center text-xs text-white/30">
              No long-term contracts. Cancel from your billing portal at any time.{' '}
              Managing 10 or more units?{' '}
              <Link
                href="/contact"
                className="underline underline-offset-2 hover:text-white/50 transition-colors"
              >
                Contact us for custom pricing.
              </Link>
            </p>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
        <section className="bg-[#f0eeeb]">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
            <div className="mb-12 max-w-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-[#111111]/40 mb-3">
                Testimonials
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight text-[#111111] lg:text-5xl">
                From property owners in Topeka.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map(({ quote, name, role, detail }) => (
                <figure
                  key={name}
                  className="flex flex-col rounded-2xl border border-black/8 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-0.5 text-yellow-500">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-[#111111]/75">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-black/8 pt-4">
                    <p className="font-semibold text-[#111111]">{name}</p>
                    <p className="mt-0.5 text-xs text-[#111111]/45">
                      {role} — {detail}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────── */}
        <section className="bg-[#1a5d2e]">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              One inbox. One invoice. One team.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75">
              Nexus Operations handles intake, assignment, scheduling, status, and documentation
              for every job — with a single invoice at month-end covering everything you submitted.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#1a5d2e] shadow-lg hover:bg-white/95 transition-colors"
              >
                Create your account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Talk to our team
              </Link>
            </div>
            <p className="mt-8 text-sm text-white/50">
              {CONTACT_INFO.phoneDisplay} · {CONTACT_INFO.email}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
