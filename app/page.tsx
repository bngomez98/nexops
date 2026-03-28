'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Briefcase,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  Eye,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react'
import { CONTACT_INFO } from '@/lib/contact-info'

type Audience = 'homeowner' | 'contractor'

const sections = [
  { href: '#home', label: 'Home' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#process', label: 'Process' },
  { href: '#pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
]

const audienceCopy = {
  homeowner: {
    badge: 'For Homeowners & Property Managers',
    title: 'Professional maintenance coordination without the chaos',
    subtitle:
      'Submit one request with photos and budget details. Nexus assigns vetted local pros, tracks status in real time, and keeps your records clean for every property.',
    ctaPrimary: { href: '/auth/sign-up', label: 'Submit a request' },
    ctaSecondary: { href: '/dashboard/homeowner', label: 'View homeowner dashboard' },
    image: '/business-handshake-professional-meeting.jpg',
    points: [
      { icon: CalendarCheck2, text: 'Availability-based scheduling' },
      { icon: ShieldCheck, text: 'Verified and insured contractors' },
      { icon: CreditCard, text: 'Clear invoices and payment trail' },
    ],
  },
  contractor: {
    badge: 'For Contractors',
    title: 'Get better jobs with complete scope before you commit',
    subtitle:
      'Review budget, photos, location, and timeline upfront. Claim jobs that fit your trade and receive streamlined payouts from one operating portal.',
    ctaPrimary: { href: '/auth/sign-up?role=contractor', label: 'Join contractor network' },
    ctaSecondary: { href: '/dashboard/contractor', label: 'View contractor dashboard' },
    image: '/business-analytics-data-visualization.jpg',
    points: [
      { icon: Eye, text: 'Full request visibility' },
      { icon: Briefcase, text: 'Qualified local opportunities' },
      { icon: Clock3, text: 'Faster assignment workflow' },
    ],
  },
} as const

const processSteps = [
  {
    title: 'Create request',
    detail: 'Add issue details, photos, and budget in one guided form.',
  },
  {
    title: 'Nexus reviews + dispatches',
    detail: 'We route the request to one matched contractor by location and trade.',
  },
  {
    title: 'Track completion',
    detail: 'Get status updates, documentation, and billing in the dashboard.',
  },
]

const pricing = [
  { tier: 'Routine', value: '25%', sla: '24h assignment · 3–5 day on-site' },
  { tier: 'Urgent', value: '30%', sla: '4h assignment · next business day on-site' },
  { tier: 'Emergency', value: '35%', sla: '1h assignment · within 4h on-site' },
]

const faqs = [
  {
    q: 'How quickly are requests assigned?',
    a: 'Most urgent requests are assigned in under 4 hours. Emergency requests are prioritized immediately.',
  },
  {
    q: 'Can I track everything in one place?',
    a: 'Yes. Requests, messages, documents, and invoices are centralized in your dashboard.',
  },
  {
    q: 'How are contractors vetted?',
    a: 'Nexus verifies trade fit, insurance, and service reliability before network onboarding.',
  },
]

export default function HomePage() {
  const [audience, setAudience] = useState<Audience>('homeowner')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const hero = useMemo(() => audienceCopy[audience], [audience])

  return (
    <div className="min-h-screen bg-[#f5f3ef] text-slate-900" id="home">
      <div className="bg-slate-900 px-4 py-2 text-center text-xs text-white/80">
        Serving Topeka and Shawnee County · <a className="text-emerald-300" href={CONTACT_INFO.phoneHref}>{CONTACT_INFO.phoneDisplay}</a>
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#f5f3ef]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/nexus-logo.png" alt="Nexus Operations" width={130} height={40} priority className="h-7 w-auto" />
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {sections.map((item) => (
              <a key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-black/5 hover:text-slate-900">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="hidden text-sm font-medium text-slate-600 md:inline">Sign in</Link>
            <Link href="/auth/sign-up" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> {hero.badge}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">{hero.title}</h1>
            <p className="mt-4 max-w-xl text-base text-slate-600">{hero.subtitle}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href={hero.ctaPrimary.href} className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">
                {hero.ctaPrimary.label}
              </Link>
              <Link href={hero.ctaSecondary.href} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700">
                {hero.ctaSecondary.label}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <button
                onClick={() => setAudience('homeowner')}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${audience === 'homeowner' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-300'}`}
              >
                Homeowner view
              </button>
              <button
                onClick={() => setAudience('contractor')}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${audience === 'contractor' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-300'}`}
              >
                Contractor view
              </button>
            </div>

            <ul className="mt-6 space-y-2">
              {hero.points.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-sm text-slate-700">
                  <Icon className="h-4 w-4 text-emerald-700" /> {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <Image src={hero.image} alt="Nexus operations" width={1000} height={700} className="rounded-3xl border border-slate-200 object-cover shadow-lg" />
            <div className="absolute -bottom-4 -left-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
              <p className="text-xs uppercase tracking-wide text-slate-500">Live operations</p>
              <p className="mt-1 text-sm font-semibold">Request flow synced with dashboard updates</p>
            </div>
          </div>
        </section>

        <section id="solutions" className="border-y border-slate-200 bg-white/75 py-14">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-bold">One system for requests, dispatch, and records</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { icon: Building2, title: 'Portfolio-ready records', text: 'Every request includes timestamped updates, notes, and invoices.' },
                { icon: Wrench, title: 'Trade-matched assignment', text: 'Dispatch logic routes each request to the right specialist.' },
                { icon: CheckCircle2, title: 'Professional communication', text: 'Centralized messages reduce missed calls and delays.' },
              ].map((card) => (
                <article key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <card.icon className="h-5 w-5 text-emerald-700" />
                  <h3 className="mt-3 font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl font-bold">How Nexus works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Step {index + 1}</p>
                <h3 className="mt-1 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="border-y border-slate-200 bg-white/80 py-14">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-bold">Transparent service tier pricing</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {pricing.map((tier) => (
                <div key={tier.tier} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-500">{tier.tier}</p>
                  <p className="mt-1 text-3xl font-bold">{tier.value}</p>
                  <p className="mt-3 text-sm text-slate-600">{tier.sla}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((faq, index) => (
              <div key={faq.q} className="rounded-xl border border-slate-200 bg-white">
                <button
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {faq.q}
                  <ChevronDown className={`h-4 w-4 transition ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && <p className="px-4 pb-4 text-sm text-slate-600">{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
