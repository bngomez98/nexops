'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Clock3,
  CreditCard,
  Eye,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
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
    badge: 'For Homeowners & Landlords',
    heading: <>Property maintenance, handled end to end.</>,
    subheading: 'Describe the work, upload photos, and set a budget cap. Nexus assigns a verified contractor, handles scheduling, and keeps a complete project record — so you never have to chase anyone.',
    primaryCta: { href: '/auth/sign-up', label: 'Submit a request' },
    secondaryCta: { href: '#process', label: 'See how it works' },
    badges: [
      { icon: Shield, text: 'Licensed & insured contractors' },
      { icon: Zap, text: 'Assignment within 4 hours' },
      { icon: CheckCircle2, text: 'Every request reviewed' },
    ],
    badge: 'Homeowners & Property Managers',
    title: 'Property maintenance, handled end to end.',
    subtitle:
      'Submit one request with photos and budget. Nexus assigns qualified contractors, tracks progress, and keeps every update in one timeline.',
    image: '/business-handshake-professional-meeting.jpg',
    ctaPrimary: { href: '/auth/sign-up', label: 'Submit request' },
    ctaSecondary: { href: '/dashboard/homeowner', label: 'Homeowner dashboard' },
    bullets: [
      { icon: CalendarCheck2, text: 'Contractors are matched based on availability and trade fit.' },
      { icon: ShieldCheck, text: 'Every contractor in our network is verified and insured.' },
      { icon: CreditCard, text: 'Every completed job includes clean invoices and full records.' },
      { icon: CalendarCheck2, text: 'We schedule jobs around contractor availability.' },
      { icon: ShieldCheck, text: 'Every contractor is verified and carries insurance.' },
      { icon: CreditCard, text: 'You receive clean invoices and complete records.' },
    ],
  },
  contractor: {
    badge: 'Contractor Network',
    title: 'Claim better-fit jobs with full context upfront.',
    subtitle:
      'See scope, budget, photos, and location before you accept. Use one workspace for dispatch, updates, and payout visibility.',
    image: '/photo-contractor.jpg',
    ctaPrimary: { href: '/auth/sign-up?role=contractor', label: 'Join network' },
    ctaSecondary: { href: '/dashboard/contractor', label: 'Contractor dashboard' },
    bullets: [
      { icon: Eye, text: 'Review the scope and photos before accepting any job.' },
      { icon: Clock3, text: 'Jobs are routed quickly so you spend less time waiting.' },
      { icon: CreditCard, text: 'Payments are tracked and processed through one workflow.' },
      { icon: Eye, text: 'You see scope and photos before you accept a job.' },
      { icon: Clock3, text: 'Jobs move through faster assignment cycles.' },
      { icon: CreditCard, text: 'Payments are processed through a streamlined flow.' },
    ],
  },
} as const

const process = [
  ['01', 'Submit request', 'Describe the issue, upload photos, and set a budget range.'],
  ['01', 'Submit request', 'Describe the issue, upload photos, and set your budget range.'],
  ['02', 'Dispatch review', 'Nexus routes the request to one matched contractor.'],
  ['03', 'Track and close', 'The timeline, messages, and invoice all stay synchronized.'],
] as const

const pricing = [
  ['Routine', '25%', 'Assigned < 24h · On-site in 3–5 days'],
  ['Urgent', '30%', 'Assigned < 4h · Next business day on-site'],
  ['Emergency', '35%', 'Assigned < 1h · On-site within 4 hours'],
] as const

const faqs = [
  ['How fast are urgent requests assigned?', 'Most urgent requests are assigned within 4 hours.'],
  ['Is everything visible in one place?', 'Yes — requests, messages, documents, and invoices stay in one dashboard timeline.'],
  ['How are contractors vetted?', 'Trade fit, insurance, and service reliability are verified before approval.'],
] as const

const statsData = [
  { value: '20+', label: 'Verified contractors' },
  { value: '< 4h', label: 'Urgent assignment' },
  { value: '100%', label: 'Documented jobs' },
  { value: '30d', label: 'Payment guarantee' },
]

const homeownerFeatures = [
  { icon: Shield, title: 'All contractors are licensed and insured.', desc: 'Every contractor in the network carries verified insurance and trade licensing.' },
  { icon: Zap, title: 'Contractors are assigned within four hours.', desc: 'Urgent requests are routed to an available contractor in under four hours.' },
  { icon: CheckCircle2, title: 'Every request is reviewed before dispatch.', desc: 'Nexus staff review each request before dispatch to ensure accuracy.' },
]

const pricingTiers = [
  { name: 'Routine', markup: '25%', sla: 'Assigned < 24h · On-site in 3–5 days', desc: 'Standard maintenance work with flexible scheduling.', featured: false },
  { name: 'Urgent', markup: '30%', sla: 'Assigned < 4h · Next business day on-site', desc: 'Time-sensitive repairs that require rapid contractor response.', featured: true },
  { name: 'Emergency', markup: '35%', sla: 'Assigned < 1h · On-site within 4 hours', desc: 'Around-the-clock emergency response for critical property issues.', featured: false },
  { name: 'Routine', markup: '25%', sla: 'Assigned < 24h · On-site in 3–5 days', desc: 'Nexus handles standard maintenance work with flexible scheduling.', featured: false },
  { name: 'Urgent', markup: '30%', sla: 'Assigned < 4h · Next business day on-site', desc: 'Nexus manages time-sensitive repairs that require rapid contractor response.', featured: true },
  { name: 'Emergency', markup: '35%', sla: 'Assigned < 1h · On-site within 4 hours', desc: 'Nexus provides 24/7 emergency response for critical property issues.', featured: false },
]

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

      <section className="border-t border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 sm:grid-cols-3">
            {[
              {
                title: "Homeowners",
                body: "Submit a request, get matched with one verified contractor, and track everything from submission to completion.",
                cta: "Create account",
                href: "/auth/sign-up",
              },
              {
                title: "Contractors",
                body: "Receive pre-documented project notifications in your trade, claim what fits your schedule, and get paid directly by property owners.",
                cta: "Apply for access",
                href: "/auth/sign-up?role=contractor",
              },
              {
                title: "Property Managers",
                body: "Manage your entire portfolio from one dashboard. Track spend by property, by trade category, and in aggregate across all your managed addresses.",
                cta: "Create account",
                href: "/auth/sign-up?role=property-manager",
              },
            ].map(({ title, body, cta, href }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-xl border border-border/50 bg-muted/20 p-8 transition-all hover:border-primary/40 hover:bg-muted/40"
                data-animate
              >
                <h3 className="text-[18px] font-bold text-foreground mb-4">{title}</h3>
                <p className="text-[14px] text-muted-foreground leading-[1.75] mb-6">{body}</p>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary group-hover:gap-2.5 transition-all">
                  {cta} <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div style={{ background: '#111', color: '#fff', padding: '0 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          {statsData.map(({ value, label }) => (
            <div key={label} style={{ padding: '28px 24px', borderRight: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 4 }}>{value}</p>
              <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── For Homeowners ── */}
      <section id="homeowners" style={{ padding: '112px 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3d7a4f', marginBottom: 16 }}>
                For homeowners &amp; landlords
              </p>
              <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 20, color: '#111' }}>
                How Homeowners Use Nexus Operations
              </h2>
              <p style={{ fontSize: 16, color: '#555', lineHeight: 1.75, marginBottom: 36, maxWidth: 440 }}>
                Submit a maintenance request in under three minutes. Nexus reviews and assigns a verified contractor, coordinates scheduling, and documents the completed work.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginBottom: 40 }}>
                {homeownerFeatures.map(({ icon: Icon, title, desc }) => (
                  <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(61,122,79,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} style={{ color: '#3d7a4f' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, color: '#111' }}>{title}</p>
                      <p style={{ fontSize: 13, color: '#666', lineHeight: 1.55 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/auth/sign-up"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 9999, background: '#111', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Submit a request <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
                <Image
                  src="/minimalist-modern-office-workspace-aerial-view.jpg"
                  alt="Clean modern workspace"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              {/* Floating card */}
              <div style={{
                position: 'absolute', bottom: -20, left: -20,
                background: '#fff', borderRadius: 16, padding: '16px 20px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                display: 'flex', alignItems: 'center', gap: 12,
                minWidth: 220,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#3d7a4f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={18} style={{ color: '#fff' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 1 }}>Average submit time is under 3 minutes.</p>
                  <p style={{ fontSize: 11.5, color: '#888' }}>Include photos, scope, and budget in one form.</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 1 }}>Average submit time is 3 minutes.</p>
                  <p style={{ fontSize: 11.5, color: '#888' }}>Submit photos, scope, and budget in one form.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: '112px 28px', background: '#0d0d0d', color: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ maxWidth: 600, marginBottom: 64 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6ee7a0', marginBottom: 16 }}>
              Pricing
            </p>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, color: '#fff', marginBottom: 16 }}>
              Choose a subscription plan or pay a markup per job.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
              We charge a transparent markup on completed work. Pro plans start at{' '}
              <strong style={{ color: 'rgba(255,255,255,0.8)' }}>$59/mo</strong> — plus a straightforward markup on completed work, billed separately.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 48 }}>
            {[
              { label: 'Free', note: 'Up to 3 requests/yr', role: 'Homeowners & Contractors', accent: false },
              { label: '$59/mo', note: `Billed annually ($${59 * 12}/yr)`, role: 'Pro — best value', accent: true },
              { label: '$79/mo', note: 'Billed monthly', role: 'Pro — full flexibility', accent: false },
            ].map(({ label, note, role, accent }) => (
              <div
                key={label}
                style={{
                  background: accent ? 'rgba(61,122,79,0.15)' : 'rgba(255,255,255,0.04)',
                  border: accent ? '1px solid rgba(61,122,79,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '24px',
                }}
              >
                <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent ? '#6ee7a0' : 'rgba(255,255,255,0.35)', marginBottom: 8 }}>{role}</p>
                <p style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', color: accent ? '#6ee7a0' : '#fff', marginBottom: 4 }}>{label}</p>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)' }}>{note}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>
            These markup rates apply per coordinated job.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 36 }}>
            {pricingTiers.map(({ name, markup, sla, desc, featured }) => (
              <div
                key={name}
                style={{
                  background: featured ? '#fff' : 'rgba(255,255,255,0.04)',
                  border: featured ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  color: featured ? '#111' : '#fff',
                  borderRadius: 20,
                  padding: '28px',
                  position: 'relative',
                }}
              >
                {featured && (
                  <span style={{
                    position: 'absolute', top: 18, right: 18,
                    fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: 9999,
                    background: '#3d7a4f', color: '#fff',
                  }}>
                    Most common
                  </span>
                )}
                <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: featured ? '#666' : 'rgba(255,255,255,0.4)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: featured ? '#3d7a4f' : '#4ade80' }}>{markup}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: featured ? '#888' : 'rgba(255,255,255,0.4)' }}>markup</span>
                </div>
                <p style={{ fontSize: 12, marginBottom: 16, color: featured ? '#888' : 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{sla}</p>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: featured ? '#444' : 'rgba(255,255,255,0.6)' }}>{desc}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            <Link href="/pricing" style={{ color: '#6ee7a0', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              View full pricing details <ChevronRight size={14} />
            </Link>
          </p>
        </div>
      </section>

      {/* ── Why Nexus ── */}
      <section style={{ padding: '112px 28px', background: '#f5f3ef' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3d7a4f', marginBottom: 16 }}>
                Why Nexus
              </p>
              <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.12, color: '#111', marginBottom: 20 }}>
                Nexus Provides Maintenance Coordination, Not a Contractor Marketplace.
              </h2>
              <p style={{ fontSize: 15.5, color: '#555', lineHeight: 1.75, marginBottom: 28 }}>
                Nexus Operations stays involved from intake to invoice — reviewing contractor performance, enforcing response-time guarantees, and providing monthly reporting on every request handled.
              </p>
              <p style={{ fontSize: 15.5, color: '#555', lineHeight: 1.75, marginBottom: 36 }}>
                Founded in Topeka, Kansas in 2026, Nexus Operations was built to serve property managers and homeowners who need a coordination partner that manages the full maintenance workflow.
              </p>
              <Link
                href="/about"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: '#3d7a4f', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                About Nexus <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
                <Image
                  src="/business-analytics-data-visualization.jpg"
                  alt="Property analytics and data"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{
                position: 'absolute', top: -20, right: -20,
                background: '#fff', borderRadius: 16, padding: '20px 24px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
              }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />)}
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 4 }}>All contractors are verified and insured.</p>
                <p style={{ fontSize: 12, color: '#888' }}>We serve the Shawnee County network.</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div style={{ marginTop: 64, paddingTop: 64, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#999', marginBottom: 24 }}>Quick links</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 0, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              {[
                { href: '/auth/sign-up',                       label: 'Homeowner account',          sub: 'Submit and manage service requests' },
                { href: '/auth/sign-up?role=property-manager', label: 'Property manager account',   sub: 'Portfolio-level request management and reporting' },
                { href: '/auth/sign-up?role=contractor',       label: 'Contractor application',     sub: 'Join the verified contractor network. No fees.' },
                { href: '/faq',                                label: 'FAQ',                        sub: 'Platform details, requirements, and policies' },
              ].map(({ href, label, sub }) => (
                <Link
                  key={href}
                  href={href}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: '#111' }}>{label}</p>
                    <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{sub}</p>
                  </div>
                  <ArrowRight size={14} style={{ color: '#aaa', flexShrink: 0, marginLeft: 16 }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ── CTA band ── */}
      <section style={{ background: '#3d7a4f', padding: '96px 28px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 16 }}>
            Create an Account and Submit Your First Request
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 40 }}>
            Sign up in minutes and describe the maintenance work you need. Nexus assigns a verified contractor and manages the project through completion.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link
              href="/auth/sign-up"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 9999, background: '#fff', color: '#111', fontSize: 15, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.15s', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Create an account <ArrowRight size={15} />
            </Link>
            <Link
              href="/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 9999, border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.9)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)')}
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#0a0a0a', color: 'rgba(255,255,255,0.5)', padding: '72px 28px 48px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 48, marginBottom: 56 }}>
            <div>
              <Link href="/" style={{ display: 'inline-block', marginBottom: 16 }}>
                <Image src="/nexus-logo.png" alt="Nexus Operations" width={120} height={40} style={{ height: 26, width: 'auto', filter: 'brightness(0) invert(1) opacity(0.85)' }} />
              </Link>
              <p style={{ fontSize: 13, lineHeight: 1.75, marginBottom: 20, maxWidth: 260 }}>
                Managed property maintenance for homeowners, landlords, and property managers in {CONTACT_INFO.cityState}.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href={CONTACT_INFO.phoneHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
                  <Phone size={13} /> {CONTACT_INFO.phoneDisplay}
                </a>
                <a href={`mailto:${CONTACT_INFO.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
                  <Mail size={13} /> {CONTACT_INFO.email}
                </a>
                <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 7, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                  <MapPin size={13} style={{ marginTop: 2, flexShrink: 0 }} /> {CONTACT_INFO.addressLine1}, {CONTACT_INFO.cityStateZip}
                </span>
              </div>
            </div>

            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>Platform</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { href: '#homeowners',   label: 'For Homeowners' },
                  { href: '#contractors',  label: 'For Contractors' },
                  { href: '#process',      label: 'How It Works' },
                  { href: '#pricing',      label: 'Pricing' },
                  { href: '/faq',          label: 'FAQ' },
                ].map(({ href, label }) => (
                  <li key={href}><a href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{label}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>Accounts</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { href: '/auth/sign-up',                       label: 'Homeowner' },
                  { href: '/auth/sign-up?role=property-manager', label: 'Property Manager' },
                  { href: '/auth/sign-up?role=contractor',       label: 'Contractor' },
                  { href: '/auth/login',                         label: 'Sign In' },
                ].map(({ href, label }) => (
                  <li key={href}><Link href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>Company</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { href: '/about',   label: 'About Us' },
                  { href: '/contact', label: 'Contact' },
                  { href: '/terms',   label: 'Terms of Service' },
                  { href: '/privacy', label: 'Privacy Policy' },
                ].map(({ href, label }) => (
                  <li key={href}><Link href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 28, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 12 }}>
            <p>&copy; {new Date().getFullYear()} {CONTACT_INFO.companyName}. {CONTACT_INFO.cityState}. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/terms"    style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Terms</Link>
              <Link href="/privacy"  style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Privacy</Link>
              <Link href="/site-map" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
      </main>
    </div>
  )
}
