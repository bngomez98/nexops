'use client'
import { useState, useEffect, useRef } from 'react'
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
    desc: 'Photos, scope, budget, and location are all visible before claiming.',
  },
  {
    icon: Zap,
    title: 'First-come, first-served — no bidding',
    desc: 'Claim the jobs that match your trade and capacity.',
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

const stats = [
  { value: '< 4 hr', label: 'Avg. assignment time' },
  { value: '1',      label: 'Contractor per request' },
  { value: '100%',   label: 'Verified network' },
  { value: '0',      label: 'Hidden fees' },
]

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ef', color: '#111111', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>

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
          {/* Logo */}
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

          {/* Desktop nav */}
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

          {/* CTAs */}
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
import { ArrowRight, Menu, X } from 'lucide-react'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-semibold text-slate-900">Nexus</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm text-slate-600 hover:text-slate-900 transition">Services</a>
            <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition">How It Works</a>
            <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition">Pricing</a>
            <a href="#contact" className="text-sm text-slate-600 hover:text-slate-900 transition">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hidden md:block text-sm text-slate-600 hover:text-slate-900 transition">Sign In</Link>
            <Link href="/auth/sign-up" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition">Get Started</Link>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{ background: '#f5f3ef', borderTop: '1px solid rgba(0,0,0,0.08)', padding: '12px 28px 24px' }}
            className="md:hidden animate-fade-in"
          >
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
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-6 py-4 space-y-3">
              <a href="#services" className="block text-sm text-slate-600 hover:text-slate-900">Services</a>
              <a href="#how-it-works" className="block text-sm text-slate-600 hover:text-slate-900">How It Works</a>
              <a href="#pricing" className="block text-sm text-slate-600 hover:text-slate-900">Pricing</a>
              <a href="#contact" className="block text-sm text-slate-600 hover:text-slate-900">Contact</a>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* Background image with overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="/business-handshake-professional-meeting.jpg"
            alt=""
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(245,243,239,0.98) 0%, rgba(245,243,239,0.95) 40%, rgba(245,243,239,0.7) 68%, rgba(245,243,239,0.2) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '100px 28px 120px' }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(61,122,79,0.08)', border: '1px solid rgba(61,122,79,0.2)', borderRadius: 9999, padding: '6px 14px', marginBottom: 28 }}>
              <MapPin size={13} style={{ color: '#3d7a4f' }} />
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', color: '#3d7a4f' }}>{CONTACT_INFO.serviceArea}</span>
            </div>

            <h1
              className="animate-fade-up"
              style={{
                fontSize: 'clamp(46px, 6.5vw, 80px)',
                fontWeight: 800,
                lineHeight: 1.04,
                letterSpacing: '-0.03em',
                marginBottom: 24,
                color: '#0d0d0d',
              }}
            >
              Property maintenance,{' '}
              <span style={{ color: '#3d7a4f', fontStyle: 'italic', fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400 }}>coordinated</span>
              {' '}start to finish.
            </h1>

            <p
              className="animate-fade-up"
              style={{ animationDelay: '0.1s', fontSize: 18, lineHeight: 1.75, color: '#4a4a4a', maxWidth: 520, marginBottom: 40 }}
            >
              Submit one request. Nexus assigns one verified contractor, handles scheduling, and keeps a complete project record — so you never have to chase anyone.
            </p>

            <div className="animate-fade-up" style={{ animationDelay: '0.2s', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 48 }}>
              <Link
                href="/auth/sign-up"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 30px', borderRadius: 9999,
                  background: '#111', color: '#fff',
                  fontSize: 14.5, fontWeight: 700, textDecoration: 'none',
                  transition: 'opacity 0.15s',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Submit a request <ArrowRight size={15} />
              </Link>
              <Link
                href="#process"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px', borderRadius: 9999,
                  border: '1.5px solid rgba(0,0,0,0.18)', background: 'rgba(255,255,255,0.7)',
                  color: '#333', fontSize: 14.5, fontWeight: 600, textDecoration: 'none',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.background = 'rgba(255,255,255,0.9)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.18)'; e.currentTarget.style.background = 'rgba(255,255,255,0.7)' }}
              >
                See how it works
              </Link>
            </div>

            {/* Trust badges */}
            <div className="animate-fade-up" style={{ animationDelay: '0.3s', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {[
                { icon: Shield,       text: 'Verified contractors only' },
                { icon: Zap,          text: 'Same-day assignment' },
                { icon: CheckCircle2, text: 'Manually reviewed' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 500, color: '#555' }}>
                  <Icon size={14} style={{ color: '#3d7a4f', flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div style={{ background: '#111', color: '#fff', padding: '0 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          {stats.map(({ value, label }) => (
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

            {/* Text side */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3d7a4f', marginBottom: 16 }}>
                For homeowners &amp; landlords
              </p>
              <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 20, color: '#111' }}>
                One request.<br />One contractor.<br />Zero coordination work.
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

            {/* Image side */}
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

            {/* Image side (first on mobile, second on desktop visually via CSS order) */}
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
              {/* Floating card */}
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
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 1 }}>Pre-qualified jobs only</p>
                  <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>Budget &amp; scope visible upfront</p>
                </div>
              </div>
            </div>

            {/* Text side */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6ee7a0', marginBottom: 16 }}>
                For contractors
              </p>
              <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 20, color: '#fff' }}>
                Stop paying for leads that go nowhere.
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 36, maxWidth: 440 }}>
                Nexus delivers pre-qualified, exclusive requests with full scope visible before you commit. No competing quotes, no blind visits.
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
                <Link
                  href="#pricing"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
                >
                  View pricing <ExternalLink size={13} style={{ opacity: 0.6 }} />
                </Link>
              </div>
            </div>
      {/* Hero Section */}
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-32 px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-up">
              <p className="text-sm font-mono text-blue-600 mb-4 uppercase tracking-wide">Property Maintenance Platform</p>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 text-slate-900">
                Coordinate maintenance{' '}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">from start to finish</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                Submit a request, we assign a verified contractor, manage the project, and give you a permanent record. One platform. One point of contact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/sign-up" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition">
                  Create Account <ArrowRight size={18} />
                </Link>
                <Link href="/auth/sign-up?role=contractor" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition">
                  Join as Contractor <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-2xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Active Projects</p>
                      <p className="text-3xl font-bold text-slate-900 mt-1">3</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {['Roofing Inspection', 'HVAC Maintenance', 'Plumbing Repair'].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                        <span className="text-sm text-slate-700">{item}</span>
                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {[
              { value: '8', label: 'Trade Categories' },
              { value: '$0', label: 'Contractor Cost' },
              { value: '100%', label: 'Manually Reviewed' },
              { value: '1', label: 'Contractor Match' },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 text-center">
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-600 uppercase tracking-wide font-semibold mt-2">{stat.label}</p>
              </div>
            ))}
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
      {/* Services Section */}
      <section id="services" className="py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-sm font-mono text-blue-600 uppercase tracking-wide mb-4">What We Coordinate</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Eight trades. One platform.</h2>
            <p className="text-lg text-slate-600 max-w-2xl">Every request is reviewed by Nexus before it reaches a contractor. You get one point of contact, not a bidding war.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Tree Removal', 'Concrete Work', 'Roofing', 'HVAC', 'Fencing', 'Electrical', 'Plumbing', 'General Repair'].map((service, i) => (
              <div key={i} className="group p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold mb-4 group-hover:scale-110 transition">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{service}</h3>
                <p className="text-sm text-slate-600">Professional {service.toLowerCase()} services for residential and commercial properties.</p>
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
              Pay for work completed, not retainers.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
              A transparent markup on completed work. No subscriptions, no monthly fees, no surprises.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 36 }}>
            {pricingTiers.map(({ name, markup, sla, desc, featured }) => (
              <div
                key={name}
                style={{
                  background: featured ? '#fff' : 'rgba(255,255,255,0.04)',
                  border: featured ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  color: featured ? '#111' : '#fff',
                  borderRadius: 20,
                  padding: '36px 32px',
                  position: 'relative',
                  transition: 'transform 0.2s',
                }}
              >
                {featured && (
                  <span style={{
                    position: 'absolute', top: 20, right: 20,
                    fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: 9999,
                    background: '#3d7a4f', color: '#fff',
                  }}>
                    Most common
                  </span>
                )}
                <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, color: featured ? '#666' : 'rgba(255,255,255,0.4)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: featured ? '#3d7a4f' : '#4ade80' }}>{markup}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: featured ? '#888' : 'rgba(255,255,255,0.4)' }}>markup</span>
                </div>
                <p style={{ fontSize: 12, marginBottom: 20, color: featured ? '#888' : 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{sla}</p>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: featured ? '#444' : 'rgba(255,255,255,0.6)' }}>{desc}</p>
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

      {/* ── Social proof / About ── */}
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
              {/* Stats overlay card */}
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
      {/* How It Works */}
      <section id="how-it-works" className="py-24 lg:py-32 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-sm font-mono text-blue-600 uppercase tracking-wide mb-4">The Process</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">From request to record in four steps.</h2>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Submit Your Request',
                desc: 'Describe the work needed, upload photos, and set a budget ceiling. Takes under three minutes.'
              },
              {
                step: '02',
                title: 'We Assign a Contractor',
                desc: 'Nexus reviews your request and assigns one verified contractor matched by trade and location.'
              },
              {
                step: '03',
                title: 'Work Gets Done',
                desc: 'Your contractor contacts you directly, schedules the visit, and completes the project on time.'
              },
              {
                step: '04',
                title: 'Record Kept Forever',
                desc: 'Every completed project generates a permanent record including cost, timeline, photos, and follow-ups.'
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold lg:block hidden">
                  {i + 1}
                </div>
                <div className="p-6 rounded-xl border border-slate-200 bg-white h-full">
                  <p className="text-3xl font-bold text-slate-300 mb-2">{item.step}</p>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-24 lg:py-32 px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to simplify maintenance?</h2>
          <p className="text-lg text-blue-50 mb-8">Join homeowners and contractors already using Nexus to streamline property maintenance.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up" className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition">Create Account</Link>
            <Link href="/auth/sign-up?role=contractor" className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition">Join as Contractor</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#0a0a0a', color: 'rgba(255,255,255,0.5)', padding: '72px 28px 48px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 48, marginBottom: 56 }}>
            {/* Brand */}
            <div style={{ gridColumn: 'span 1' }}>
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

            {/* Platform */}
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
                  <li key={href}><a href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.15s' }}>{label}</a></li>
                ))}
              </ul>
            </div>

            {/* Accounts */}
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

            {/* Company */}
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
      {/* Footer */}
      <footer id="contact" className="py-16 px-6 lg:px-8 bg-slate-900 text-slate-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg" />
                <span className="font-semibold text-white">Nexus</span>
              </Link>
              <p className="text-sm">Property maintenance coordination platform for homeowners and contractors.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Status'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Compliance'] },
            ].map((col, i) => (
              <div key={i}>
                <h3 className="font-semibold text-white mb-4">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" className="text-sm hover:text-white transition">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 28, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 12 }}>
            <p>&copy; {new Date().getFullYear()} {CONTACT_INFO.companyName}. {CONTACT_INFO.cityState}. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/terms"    style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Terms</Link>
              <Link href="/privacy"  style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Privacy</Link>
              <Link href="/site-map" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Sitemap</Link>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; 2026 Nexus Operations. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social, i) => (
                <a key={i} href="#" className="text-sm hover:text-white transition">{social}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </main>
  )
}
