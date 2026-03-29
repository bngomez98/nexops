'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  CalendarCheck2,
  ChevronDown,
  Clock3,
  CreditCard,
  Eye,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { CONTACT_INFO } from '@/lib/contact-info'

type Audience = 'homeowner' | 'contractor'

const nav = [
  { href: '#home', label: 'Home' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#process', label: 'Process' },
  { href: '#pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
]

const copy = {
  homeowner: {
    badge: 'Homeowners & Property Managers',
    title: 'Maintenance operations without follow-up chaos.',
    subtitle:
      'Submit one request with photos and budget. Nexus assigns qualified contractors, tracks progress, and keeps every update in one timeline.',
    image: '/business-handshake-professional-meeting.jpg',
    ctaPrimary: { href: '/auth/sign-up', label: 'Submit request' },
    ctaSecondary: { href: '/dashboard/homeowner', label: 'Homeowner dashboard' },
    bullets: [
      { icon: CalendarCheck2, text: 'Availability-based scheduling' },
      { icon: ShieldCheck, text: 'Verified and insured network' },
      { icon: CreditCard, text: 'Clean invoices and records' },
    ],
  },
  contractor: {
    badge: 'Contractor Network',
    title: 'Claim better-fit jobs with full context upfront.',
    subtitle:
      'See scope, budget, photos, and location before you accept. Use one workspace for dispatch, updates, and payout visibility.',
    image: '/business-analytics-data-visualization.jpg',
    ctaPrimary: { href: '/auth/sign-up?role=contractor', label: 'Join network' },
    ctaSecondary: { href: '/dashboard/contractor', label: 'Contractor dashboard' },
    bullets: [
      { icon: Eye, text: 'Scope and photos visible first' },
      { icon: Clock3, text: 'Faster assignment cycles' },
      { icon: CreditCard, text: 'Streamlined payment flow' },
    ],
  },
} as const

const process = [
  ['01', 'Submit request', 'Describe issue, upload photos, set budget range.'],
  ['02', 'Dispatch review', 'Nexus routes the request to one matched contractor.'],
  ['03', 'Track and close', 'Timeline, messages, and invoice stay synchronized.'],
] as const

const pricing = [
  ['Routine', '25%', 'Assigned < 24h · On-site in 3–5 days'],
  ['Urgent', '30%', 'Assigned < 4h · Next business day on-site'],
  ['Emergency', '35%', 'Assigned < 1h · On-site within 4 hours'],
] as const

const faqs = [
  ['How fast are urgent requests assigned?', 'Most urgent requests are assigned within 4 hours.'],
  ['Is everything visible in one place?', 'Yes. Requests, messages, documents, and invoices stay in one dashboard timeline.'],
  ['How are contractors vetted?', 'Trade fit, insurance, and service reliability are verified before approval.'],
] as const

export default function HomePage() {
  const [audience, setAudience] = useState<Audience>('homeowner')
  const [faqIndex, setFaqIndex] = useState<number | null>(0)
  const hero = useMemo(() => copy[audience], [audience])

  return (
    <div id="home" className="min-h-screen bg-[#f5f3ef] text-slate-900">
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-2 text-center text-xs text-white/80">
        Serving Topeka & Shawnee County · <a className="text-emerald-300" href={CONTACT_INFO.phoneHref}>{CONTACT_INFO.phoneDisplay}</a>
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#f5f3ef]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/">
            <Image src="/nexus-logo.png" alt="Nexus Operations" width={130} height={40} className="h-7 w-auto" priority />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden text-sm font-medium text-slate-600 md:inline">Sign in</Link>
            <Link href="/auth/sign-up" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4">
        <section className="grid gap-8 pb-14 pt-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" /> {hero.badge}
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{hero.title}</h1>
            <p className="mt-4 max-w-2xl text-base text-slate-600">{hero.subtitle}</p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href={hero.ctaPrimary.href} className="text-sm font-semibold text-slate-900 underline underline-offset-4">
                {hero.ctaPrimary.label}
              </Link>
              <Link href={hero.ctaSecondary.href} className="text-sm font-semibold text-slate-600 underline underline-offset-4">
                {hero.ctaSecondary.label}
              </Link>
            </div>

            <div className="mt-8 flex gap-2 border-y border-slate-200 py-3">
              <button
                onClick={() => setAudience('homeowner')}
                className={`px-3 py-1 text-sm font-semibold ${audience === 'homeowner' ? 'text-slate-900' : 'text-slate-500'}`}
              >
                Homeowner
              </button>
              <span className="text-slate-300">/</span>
              <button
                onClick={() => setAudience('contractor')}
                className={`px-3 py-1 text-sm font-semibold ${audience === 'contractor' ? 'text-slate-900' : 'text-slate-500'}`}
              >
                Contractor
              </button>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {hero.bullets.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-emerald-700" /> {text}
                </li>
              ))}
            </ul>
          </div>

          <Image src={hero.image} alt="Nexus workflow" width={1200} height={700} className="h-full w-full object-cover" />
        </section>

        <section id="solutions" className="border-t border-slate-200 py-12">
          <h2 className="text-2xl font-bold">Built for daily operations, not one-off tickets</h2>
          <div className="mt-6 space-y-5 text-sm text-slate-700">
            <p className="border-b border-slate-200 pb-4"><strong className="text-slate-900">Single timeline:</strong> request updates, documents, and payment history stay connected.</p>
            <p className="border-b border-slate-200 pb-4"><strong className="text-slate-900">Structured dispatch:</strong> assignment is based on trade, location, and urgency.</p>
            <p><strong className="text-slate-900">Professional communication:</strong> centralized updates reduce missed calls and vague status checks.</p>
          </div>
        </section>

        <section id="process" className="border-t border-slate-200 py-12">
          <h2 className="text-2xl font-bold">How it works</h2>
          <ol className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            {process.map(([step, title, detail]) => (
              <li key={step} className="grid gap-3 py-4 md:grid-cols-[80px_1fr]">
                <span className="text-sm font-semibold text-emerald-700">{step}</span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-slate-600">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="pricing" className="border-t border-slate-200 py-12">
          <h2 className="text-2xl font-bold">Pricing tiers</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500">
                  <th className="py-2 font-semibold">Tier</th>
                  <th className="py-2 font-semibold">Markup</th>
                  <th className="py-2 font-semibold">SLA</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map(([tier, rate, sla]) => (
                  <tr key={tier} className="border-b border-slate-200">
                    <td className="py-3 font-semibold">{tier}</td>
                    <td className="py-3">{rate}</td>
                    <td className="py-3 text-slate-600">{sla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border-t border-slate-200 py-12">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map(([q, a], i) => (
              <div key={q}>
                <button
                  onClick={() => setFaqIndex(faqIndex === i ? null : i)}
                  className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold"
                >
                  {q}
                  <ChevronDown className={`h-4 w-4 transition ${faqIndex === i ? 'rotate-180' : ''}`} />
                </button>
                {faqIndex === i && <p className="pb-3 text-sm text-slate-600">{a}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
