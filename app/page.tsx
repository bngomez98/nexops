'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Menu, X, ArrowRight, ExternalLink,
  Camera, CalendarDays, MessageSquare,
  Eye, Zap, CreditCard,
  CheckCircle2, Shield, MapPin, Phone, Mail, ChevronRight,
  Star, Clock, FileText,
} from 'lucide-react'
import { CONTACT_INFO } from '@/lib/contact-info'

const navLinks = [
  { href: '#homeowners',   label: 'Homeowners' },
  { href: '#contractors',  label: 'Contractors' },
  { href: '#process',      label: 'How It Works' },
  { href: '#pricing',      label: 'Pricing' },
  { href: '/contact',      label: 'Contact' },
]

const homeownerFeatures = [
  {
    icon: Camera,
    title: 'Upload photos & set a budget cap',
    desc: 'Show contractors exactly what you need — no calls, no guesswork.',
  },
  {
    icon: CalendarDays,
    title: 'Choose your availability',
    desc: 'Pick consultation windows that fit your schedule.',
  },
  {
    icon: MessageSquare,
    title: 'Track everything in one place',
    desc: 'Status updates, invoices, and project history — always accessible.',
  },
]

const contractorFeatures = [
  {
    icon: Eye,
    title: 'Full project visibility before you commit',
    desc: 'Photos, scope, budget, and location are all provided upfront so you arrive prepared.',
  },
  {
    icon: Zap,
    title: 'Matched by trade and location',
    desc: 'Accept requests that fit your specialty and schedule at your own pace.',
  },
  {
    icon: CreditCard,
    title: 'Faster, unified payouts',
    desc: 'Invoicing, approval, and payment through a single workflow.',
  },
]

const pricingTiers = [
  {
    name: 'Routine',
    markup: '25%',
    sla: 'Assigned within 24 hrs · On-site within 3–5 days',
    desc: 'Scheduled repairs, cosmetic fixes, and planned replacements that are not time-sensitive.',
    featured: false,
  },
  {
    name: 'Urgent',
    markup: '30%',
    sla: 'Assigned within 4 hrs · On-site next business day',
    desc: 'Issues requiring prompt attention — non-emergency plumbing, electrical affecting livability, HVAC in moderate weather.',
    featured: true,
  },
  {
    name: 'Emergency',
    markup: '35%',
    sla: 'Assigned within 1 hr · On-site within 4 hrs',
    desc: 'Critical failures — burst pipes, gas leaks, electrical hazards, HVAC failure in extreme weather.',
    featured: false,
  },
]

const steps = [
  { n: '01', title: 'Submit your request',    desc: 'Describe the work, upload photos, and set a budget. Under three minutes.' },
  { n: '02', title: 'We assign a contractor', desc: 'Nexus reviews your request and assigns one verified contractor matched by trade and location.' },
  { n: '03', title: 'Work gets done',          desc: 'Your contractor contacts you, schedules the visit, and completes the project.' },
  { n: '04', title: 'Complete record kept',    desc: 'Costs, photos, timelines, and follow-up details are saved automatically.' },
]

const statsData = [
  { value: '< 4 hr', label: 'Avg. assignment time' },
  { value: '1',      label: 'Contractor per request' },
  { value: '100%',   label: 'Verified network' },
  { value: '0',      label: 'Hidden fees' },
]

const heroContent = {
  homeowner: {
    badge: 'For Homeowners & Landlords',
    heading: <>Property maintenance, handled end to end.</>,
    subheading: 'Describe the work, upload photos, and set a budget cap. Nexus assigns a verified contractor, handles scheduling, and keeps a complete project record — so you never have to chase anyone.',
    primaryCta: { href: '/auth/sign-up', label: 'Submit a request' },
    secondaryCta: { href: '#process', label: 'See how it works' },
    badges: [
      { icon: Shield, text: 'Verified contractors only' },
      { icon: Zap, text: 'Same-day assignment' },
      { icon: CheckCircle2, text: 'Manually reviewed' },
    ],
    image: '/business-handshake-professional-meeting.jpg',
    floatingCard: { icon: Clock, title: '3 min avg. submit time', subtitle: 'Photos, scope, budget in one form' },
  },
  contractor: {
    badge: 'For Contractors',
    heading: <>Pre-qualified jobs.<br />No bidding wars.<br />Faster&nbsp;payouts.</>,
    subheading: 'Access exclusive service requests with photos, scope, and budget visible before you commit. Claim jobs that match your trade, get paid faster through unified invoicing.',
    primaryCta: { href: '/auth/sign-up?role=contractor', label: 'Join the network' },
    secondaryCta: { href: '#pricing', label: 'View pricing' },
    badges: [
      { icon: Eye, text: 'Full scope before committing' },
      { icon: CreditCard, text: 'Unified payout workflow' },
      { icon: CheckCircle2, text: 'No competing quotes' },
    ],
    image: '/business-analytics-data-visualization.jpg',
    floatingCard: { icon: FileText, title: 'Pre-qualified only', subtitle: 'Budget & scope visible upfront' },
  },
} as const

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ef', color: '#111111' }}>

      {/* ── Announcement bar ── */}
      <div style={{ background: '#111', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 500, textAlign: 'center', padding: '8px 24px', letterSpacing: '0.01em' }}>
        Now serving Topeka, KS and surrounding Shawnee County.&nbsp;
        <a href={CONTACT_INFO.phoneHref} style={{ color: '#6ee7a0', textDecoration: 'none' }}>{CONTACT_INFO.phoneDisplay}</a>
      </div>

      {/* ── Header ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: scrolled ? 'rgba(245,243,239,0.97)' : '#f5f3ef',
          backdropFilter: scrolled ? 'blur(16px)' : undefined,
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.06)',
          transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 28px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={130}
              height={44}
              style={{ height: 26, width: 'auto' }}
              priority
            />
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden md:flex">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                style={{
                  padding: '7px 15px',
                  borderRadius: 9999,
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: '#555',
                  transition: 'color 0.15s, background 0.15s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#111'; (e.target as HTMLElement).style.background = 'rgba(0,0,0,0.05)' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#555'; (e.target as HTMLElement).style.background = 'transparent' }}
              >
                {label}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              href="/auth/login"
              className="hidden md:block"
              style={{ fontSize: 13.5, fontWeight: 500, color: '#666', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = '#111')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = '#666')}
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 20px',
                borderRadius: 9999,
                background: '#111',
                fontSize: 13.5,
                fontWeight: 600,
                color: '#fff',
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget).style.opacity = '0.85' }}
              onMouseLeave={e => { (e.currentTarget).style.opacity = '1' }}
            >
              Get started <ArrowRight size={14} />
            </Link>
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
              style={{ padding: 6, color: '#555', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div style={{ background: '#f5f3ef', borderTop: '1px solid rgba(0,0,0,0.08)', padding: '12px 28px 24px' }} className="md:hidden">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '12px 8px', fontSize: 15, fontWeight: 500, color: '#444', textDecoration: 'none', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
              >
                {label}
              </a>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <Link href="/auth/login" style={{ flex: 1, textAlign: 'center', padding: '12px', fontSize: 14, fontWeight: 500, color: '#555', textDecoration: 'none', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10 }} onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link href="/auth/sign-up" style={{ flex: 1, textAlign: 'center', padding: '12px', fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', background: '#111', borderRadius: 10 }} onClick={() => setMobileOpen(false)}>Get started</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="/business-handshake-professional-meeting.jpg"
            alt=""
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(245,243,239,0.98) 0%, rgba(245,243,239,0.96) 44%, rgba(245,243,239,0.72) 68%, rgba(245,243,239,0.18) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '80px 28px 96px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(61,122,79,0.08)', border: '1px solid rgba(61,122,79,0.2)', borderRadius: 9999, padding: '5px 13px', marginBottom: 20 }}>
            <MapPin size={12} style={{ color: '#3d7a4f' }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.04em', color: '#3d7a4f' }}>{CONTACT_INFO.serviceArea}</span>
          </div>

          <div style={{ maxWidth: 620 }}>
            <h1
              style={{
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                marginBottom: 20,
                color: '#0d0d0d',
              }}
            >
              Property maintenance,{' '}
              <span style={{ color: '#3d7a4f', fontStyle: 'italic' }}>end to end.</span>
            </h1>

            <p style={{ fontSize: 16.5, lineHeight: 1.72, color: '#4a4a4a', maxWidth: 500, marginBottom: 32 }}>
              Describe the work, upload photos, and set a budget cap. Nexus assigns a verified contractor, handles scheduling, and keeps a complete project record — so you never have to chase anyone.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 36 }}>
              <Link
                href="/auth/sign-up"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '12px 26px', borderRadius: 9999,
                  background: '#111', color: '#fff',
                  fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  transition: 'opacity 0.15s',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Submit a request <ArrowRight size={14} />
              </Link>
              <a
                href="#process"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '12px 24px', borderRadius: 9999,
                  border: '1.5px solid rgba(0,0,0,0.18)', background: 'rgba(255,255,255,0.7)',
                  color: '#333', fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.background = 'rgba(255,255,255,0.9)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.18)'; e.currentTarget.style.background = 'rgba(255,255,255,0.7)' }}
              >
                See how it works
              </a>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              {[
                { icon: Shield, text: 'Verified contractors only' },
                { icon: Zap, text: 'Same-day assignment' },
                { icon: CheckCircle2, text: 'Manually reviewed' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: '#555' }}>
                  <Icon size={13} style={{ color: '#3d7a4f', flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── WHO WE SERVE: Three columns with icons/labels ── */}
      <section id="who-we-serve" className="py-24">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-16 text-center" data-animate>
            <p className="font-mono-label text-primary mb-4">Solutions</p>
            <h2 className="font-heading text-[42px] font-bold leading-[1.2] tracking-[-0.01em] max-w-2xl mx-auto text-balance">
              Built for homeowners, contractors, and property managers.
            </h2>
          </div>

          <div className="grid gap-12 sm:grid-cols-3">
            {[
              {
                title: "Homeowners",
                body: "Submit a service request and get matched with one verified contractor. Track everything from submission to completion.",
                cta: "Create account",
                href: "/auth/sign-up",
              },
              {
                title: "Contractors",
                body: "Receive pre-documented project notifications in your trade. Claim what fits your schedule. Get paid directly by property owners.",
                cta: "Apply for access",
                href: "/auth/sign-up?role=contractor",
              },
              {
                title: "Property Managers",
                body: "Manage your entire portfolio from one dashboard. Track spend by property, by trade category, and in aggregate across all your managed addresses.",
                cta: "Create account",
                href: "/auth/sign-up?role=property_manager",
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

      <div className="border-t border-border" />

      {/* ── Photo Banner: Three user types (visual reference) ── */}
      <section className="overflow-hidden border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/30">
          {[
            {
              src:     "/photo-homeowner.jpg",
              label:   "For Homeowners",
              caption: "One verified contractor. No bidding. No surprises.",
            },
            {
              src:     "/photo-manager.jpg",
              label:   "For Managers",
              caption: "Portfolio-level tracking. Spend visibility across all properties.",
            },
            {
              src:     "/photo-contractor.jpg",
              label:   "For Contractors",
              caption: "Documented project requests. No fees. Direct payment from owners.",
            },
          ].map(({ src, label, caption }) => (
            <div
              key={label}
              className="photo-card group relative block h-64 md:h-72 overflow-hidden bg-muted"
            >
              <div className="photo-card-inner absolute inset-0">
                <Image src={src} alt={label} fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">{label}</p>
                <p className="text-[13px] font-medium text-white leading-snug">{caption}</p>
              </div>
            </div>
          ))}
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
                Stop chasing contractors.<br />Start getting results.
              </h2>
              <p style={{ fontSize: 16, color: '#555', lineHeight: 1.75, marginBottom: 36, maxWidth: 440 }}>
                Submit your request in under three minutes. We handle contractor selection, scheduling, and documentation from start to finish.
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
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 1 }}>3 min avg. submit time</p>
                  <p style={{ fontSize: 11.5, color: '#888' }}>Photos, scope, budget in one form</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── For Contractors ── */}
      <section id="contractors" style={{ padding: '112px 28px', background: '#111' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'center' }}>
            <div style={{ position: 'relative', order: 0 }} className="lg:order-last">
              <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
                <Image
                  src="/business-handshake-professional-meeting.jpg"
                  alt="Professional contractor handshake"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.4) 100%)' }} />
              </div>
              <div style={{
                position: 'absolute', bottom: -20, right: -20,
                background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '16px 20px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', gap: 12,
                minWidth: 220,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(110,231,160,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={18} style={{ color: '#6ee7a0' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 1 }}>Full documentation included</p>
                  <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>Budget &amp; scope visible upfront</p>
                </div>
              </div>
            </div>

            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6ee7a0', marginBottom: 16 }}>
                For contractors
              </p>
              <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 20, color: '#fff' }}>
                Every request fully documented before you arrive.
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 36, maxWidth: 440 }}>
                Licensed, insured contractors in Topeka and surrounding areas get matched with property owners who have documented their project in full — scope, photos, budget, and scheduling all provided upfront.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginBottom: 40 }}>
                {contractorFeatures.map(({ icon: Icon, title, desc }) => (
                  <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(110,231,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} style={{ color: '#6ee7a0' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, color: '#fff' }}>{title}</p>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  href="/auth/sign-up?role=contractor"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 9999, background: '#fff', color: '#111', fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Join the network <ArrowRight size={14} />
                </Link>
                <a
                  href="#pricing"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
                >
                  View pricing <ExternalLink size={13} style={{ opacity: 0.6 }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="process" style={{ padding: '112px 28px', background: '#f5f3ef' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ maxWidth: 560, marginBottom: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3d7a4f', marginBottom: 16 }}>
              The process
            </p>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, color: '#111', marginBottom: 16 }}>
              Request to record in four steps.
            </h2>
            <p style={{ fontSize: 16, color: '#666', lineHeight: 1.7 }}>
              Every request follows the same clear path — no ambiguity, no dropped balls.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 1, background: 'rgba(0,0,0,0.08)', borderRadius: 20, overflow: 'hidden' }}>
            {steps.map(({ n, title, desc }, i) => (
              <div
                key={n}
                style={{
                  background: i === 1 ? '#3d7a4f' : '#f5f3ef',
                  padding: '40px 32px',
                  position: 'relative',
                }}
              >
                <span style={{
                  display: 'inline-block',
                  fontSize: 11, fontWeight: 800, letterSpacing: '0.12em',
                  color: i === 1 ? 'rgba(255,255,255,0.5)' : '#3d7a4f',
                  marginBottom: 20,
                }}>
                  {n}
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: i === 1 ? '#fff' : '#111', lineHeight: 1.3 }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: i === 1 ? 'rgba(255,255,255,0.65)' : '#666', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
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
              Simple plans. Transparent per-job markup.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
              A transparent markup on completed work. Pro plans from{' '}
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
            Per-job coordination markup
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
                Not a marketplace.<br />An operational partner.
              </h2>
              <p style={{ fontSize: 15.5, color: '#555', lineHeight: 1.75, marginBottom: 28 }}>
                We don&apos;t just connect you and walk away. Nexus stays in the loop from intake to invoice — quality-checking, tracking contractor performance, and providing monthly reporting on every request.
              </p>
              <p style={{ fontSize: 15.5, color: '#555', lineHeight: 1.75, marginBottom: 36 }}>
                Founded in Topeka, Kansas in 2026, Nexus Operations was built specifically to serve property managers and owners who needed a coordination partner, not another vendor to manage.
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
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 4 }}>Verified &amp; insured contractors</p>
                <p style={{ fontSize: 12, color: '#888' }}>Shawnee County network</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div style={{ marginTop: 64, paddingTop: 64, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#999', marginBottom: 24 }}>Quick links</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 0, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              {[
                { href: '/auth/sign-up',                       label: 'Homeowner account',          sub: 'Submit and manage service requests' },
                { href: '/auth/sign-up?role=property_manager', label: 'Property manager account',   sub: 'Portfolio-level request management and reporting' },
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
            Ready to simplify property maintenance?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 40 }}>
            Create an account in minutes. Submit your first request the same day. Nexus handles the rest.
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
                  { href: '/auth/sign-up?role=property_manager', label: 'Property Manager' },
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
    </div>
  )
}
