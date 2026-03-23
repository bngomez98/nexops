'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Menu, X, ArrowRight, ExternalLink,
  Camera, CalendarDays, MessageSquare,
  Eye, Zap, CreditCard,
  CheckCircle2, Shield, MapPin, Phone, Mail, ChevronRight,
} from 'lucide-react'
import { CONTACT_INFO } from '@/lib/contact-info'

const navLinks = [
  { href: '#homeowners',   label: 'Homeowners' },
  { href: '#contractors',  label: 'Contractors' },
  { href: '#pricing',      label: 'Pricing' },
  { href: '/contact',      label: 'Contact' },
]

const homeownerFeatures = [
  {
    icon: Camera,
    title: 'Upload photos & set a budget cap',
    desc: 'Show contractors exactly what you need',
  },
  {
    icon: CalendarDays,
    title: 'Pick consultation windows',
    desc: 'Choose times that work for your schedule',
  },
  {
    icon: MessageSquare,
    title: 'Track status in one place',
    desc: 'Stay updated throughout the process',
  },
]

const contractorFeatures = [
  {
    icon: Eye,
    title: 'See everything before claiming',
    desc: 'Photos, budget, and scope upfront',
  },
  {
    icon: Zap,
    title: 'First-come, first-served',
    desc: 'No bidding wars, no competing quotes',
  },
  {
    icon: CreditCard,
    title: 'Get paid faster',
    desc: 'Unified invoicing and quick payouts',
  },
]

const pricingTiers = [
  {
    name: 'Routine',
    markup: '25%',
    sla: 'Assigned within 24 hrs · On-site within 3–5 days',
    desc: 'Standard maintenance that is not time-sensitive. Scheduled repairs, cosmetic fixes, planned replacements.',
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
    desc: 'Critical failures requiring immediate response — burst pipes, gas leaks, electrical hazards, HVAC in extreme weather.',
    featured: false,
  },
]

const steps = [
  { n: '01', title: 'Submit your request',    desc: 'Describe the work needed, upload photos, and set a budget. Takes under three minutes.' },
  { n: '02', title: 'We assign a contractor', desc: 'Nexus reviews your request and assigns one verified contractor matched by trade and location.' },
  { n: '03', title: 'Work gets done',          desc: 'Your contractor contacts you, schedules the visit, and completes the project on your timeline.' },
  { n: '04', title: 'Keep a complete record',  desc: 'Every project is saved with costs, timelines, photos, and follow-up details.' },
]

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#f0eeea', color: '#111111' }}>

      {/* ── Header ── */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: scrolled ? 'rgba(10,10,10,0.97)' : '#0a0a0a',
          backdropFilter: scrolled ? 'blur(12px)' : undefined,
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          transition: 'border-color 0.3s, background 0.3s',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={130}
              height={44}
              style={{ height: 28, width: 'auto' }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden md:flex">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                style={{
                  padding: '6px 14px',
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.65)',
                  transition: 'color 0.15s, background 0.15s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#fff'; (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.65)'; (e.target as HTMLElement).style.background = 'transparent' }}
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
              style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = '#fff')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.6)')}
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                borderRadius: 9999,
                border: '1px solid rgba(255,255,255,0.3)',
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
                textDecoration: 'none',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget).style.borderColor = '#fff'; (e.currentTarget).style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.3)'; (e.currentTarget).style.background = 'transparent' }}
            >
              Get started
            </Link>
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
              style={{ padding: 6, color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{
              background: '#0a0a0a',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              padding: '12px 24px 20px',
            }}
            className="md:hidden animate-fade-in"
          >
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  padding: '11px 8px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {label}
              </a>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Link href="/auth/login" style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link href="/auth/sign-up" style={{ fontSize: 13, fontWeight: 600, color: '#4ade80', textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>Create account</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section
        id="hero"
        style={{
          paddingTop: 140,
          paddingBottom: 80,
          maxWidth: 1200,
          margin: '0 auto',
          padding: '140px 24px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <MapPin size={14} style={{ color: '#4ade80', flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#555' }}>
            {CONTACT_INFO.serviceArea}
          </span>
        </div>

        <h1
          className="animate-fade-up"
          style={{
            fontSize: 'clamp(44px, 7vw, 88px)',
            fontWeight: 800,
            lineHeight: 1.03,
            letterSpacing: '-0.03em',
            maxWidth: 820,
            marginBottom: 28,
          }}
        >
          Property maintenance,{' '}
          <span style={{ color: '#3d7a4f' }}>handled</span>{' '}
          from start to finish.
        </h1>

        <p
          className="animate-fade-up"
          style={{ animationDelay: '0.12s', fontSize: 17, lineHeight: 1.75, color: '#555', maxWidth: 560, marginBottom: 40 }}
        >
          Nexus Operations coordinates maintenance and repair work for property owners and managers
          in the Topeka area. Submit once — we handle contractor selection, scheduling, and documentation.
        </p>

        <div className="animate-fade-up" style={{ animationDelay: '0.22s', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <Link
            href="/auth/sign-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 28px',
              borderRadius: 9999,
              background: '#111111',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Submit a request <ArrowRight size={15} />
          </Link>
          <Link
            href="/auth/sign-up?role=contractor"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 28px',
              borderRadius: 9999,
              border: '1.5px solid #c8c4be',
              background: 'transparent',
              color: '#111',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#888')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#c8c4be')}
          >
            Join as a contractor <ExternalLink size={14} style={{ opacity: 0.6 }} />
          </Link>
        </div>

        {/* trust badges */}
        <div className="animate-fade-up" style={{ animationDelay: '0.32s', display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 44 }}>
          {[
            { icon: Shield, text: 'Verified contractors only' },
            { icon: Zap,    text: 'Same-day assignment' },
            { icon: CheckCircle2, text: 'Manually reviewed requests' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: '#666' }}>
              <Icon size={14} style={{ color: '#3d7a4f' }} />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* ── For Homeowners ── */}
      <section
        id="homeowners"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '96px 0' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {/* Section heading */}
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 54px)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 12 }}>
            For homeowners
          </h2>
          <p style={{ fontSize: 16, color: '#555', maxWidth: 560, lineHeight: 1.7, marginBottom: 52 }}>
            Submit once. Get matched with one verified contractor. No phone tag, no surprise visits.
          </p>

          {/* Two-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'start' }}>

            {/* Image */}
            <div style={{ borderRadius: 20, overflow: 'hidden', lineHeight: 0 }}>
              <Image
                src="/photo-home.jpg"
                alt="Modern home interior"
                width={720}
                height={520}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Feature panel */}
            <div
              style={{
                background: '#e5e2dd',
                borderRadius: 20,
                padding: 36,
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#777', marginBottom: 28 }}>
                Homeowner experience
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 36 }}>
                {homeownerFeatures.map(({ icon: Icon, title, desc }) => (
                  <div key={title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: '#d4d0ca',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} style={{ color: '#444' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, color: '#111' }}>{title}</p>
                      <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/auth/sign-up"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 28px',
                  borderRadius: 9999,
                  background: '#111111',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none',
                  width: 'fit-content',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Submit a request <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── For Contractors ── */}
      <section
        id="contractors"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '96px 0' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 54px)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 12 }}>
            For contractors
          </h2>
          <p style={{ fontSize: 16, color: '#555', maxWidth: 600, lineHeight: 1.7, marginBottom: 52 }}>
            Stop paying for shared leads. Claim exclusive, pre-qualified requests and show up
            with everything you need.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'start' }}>

            {/* Feature panel */}
            <div
              style={{
                background: '#e5e2dd',
                borderRadius: 20,
                padding: 36,
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#777', marginBottom: 28 }}>
                Contractor experience
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 36 }}>
                {contractorFeatures.map(({ icon: Icon, title, desc }) => (
                  <div key={title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: '#d4d0ca',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} style={{ color: '#444' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, color: '#111' }}>{title}</p>
                      <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  href="/auth/sign-up?role=contractor"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '14px 24px',
                    borderRadius: 9999,
                    background: '#111111',
                    color: '#fff',
                    fontSize: 13.5,
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Join the network <ArrowRight size={14} />
                </Link>
                <Link
                  href="#pricing"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '14px 24px',
                    borderRadius: 9999,
                    border: '1.5px solid rgba(0,0,0,0.2)',
                    background: 'transparent',
                    color: '#111',
                    fontSize: 13.5,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#444')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)')}
                >
                  View pricing <ExternalLink size={14} style={{ opacity: 0.6 }} />
                </Link>
              </div>
            </div>

            {/* Image */}
            <div style={{ borderRadius: 20, overflow: 'hidden', lineHeight: 0 }}>
              <Image
                src="/photo-contractor.jpg"
                alt="Contractor working on a property"
                width={720}
                height={520}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        id="how-it-works"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '96px 0', background: 'rgba(0,0,0,0.02)' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#666', marginBottom: 16 }}>
            The process
          </p>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-0.025em', maxWidth: 560, marginBottom: 60 }}>
            From request to record in four steps.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0 }}>
            {steps.map(({ n, title, desc }, i) => (
              <div
                key={n}
                style={{
                  padding: '32px 28px',
                  borderLeft: i === 0 ? '1px solid rgba(0,0,0,0.1)' : undefined,
                  borderRight: '1px solid rgba(0,0,0,0.1)',
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                  marginLeft: i === 0 ? 0 : -1,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: '#3d7a4f',
                    marginBottom: 16,
                  }}
                >
                  {n}
                </span>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: '#111' }}>{title}</h3>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section
        id="pricing"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '96px 0' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#666', marginBottom: 16 }}>
            Pricing
          </p>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-0.025em', maxWidth: 540, marginBottom: 16 }}>
            Pay for work completed, not retainers.
          </h2>
          <p style={{ fontSize: 15, color: '#555', maxWidth: 480, lineHeight: 1.7, marginBottom: 56 }}>
            Nexus charges a transparent markup on completed work. No subscriptions, no hidden fees.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {pricingTiers.map(({ name, markup, sla, desc, featured }) => (
              <div
                key={name}
                style={{
                  background: featured ? '#111111' : '#e5e2dd',
                  color: featured ? '#fff' : '#111',
                  borderRadius: 20,
                  padding: 36,
                  position: 'relative',
                  ...(featured ? { boxShadow: '0 24px 60px rgba(0,0,0,0.18)' } : {}),
                }}
              >
                {featured && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: 9999,
                      background: '#3d7a4f',
                      color: '#fff',
                    }}
                  >
                    Most common
                  </span>
                )}
                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: featured ? 'rgba(255,255,255,0.55)' : '#777' }}>{name}</p>
                <p
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    marginBottom: 4,
                    color: featured ? '#4ade80' : '#3d7a4f',
                  }}
                >
                  {markup}
                  <span style={{ fontSize: 15, fontWeight: 500, color: featured ? 'rgba(255,255,255,0.5)' : '#888', marginLeft: 6 }}>markup</span>
                </p>
                <p style={{ fontSize: 11.5, marginBottom: 20, color: featured ? 'rgba(255,255,255,0.5)' : '#888', lineHeight: 1.5 }}>{sla}</p>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: featured ? 'rgba(255,255,255,0.7)' : '#555' }}>{desc}</p>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 28, fontSize: 13, color: '#666' }}>
            <Link href="/pricing" style={{ color: '#3d7a4f', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              View full pricing details <ChevronRight size={14} />
            </Link>
          </p>
        </div>
      </section>

      {/* ── CTA band ── */}
      <section
        style={{
          background: '#111111',
          padding: '80px 24px',
          textAlign: 'center',
          marginTop: 0,
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Ready to simplify your property maintenance?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 36 }}>
            Create an account in minutes. Submit your first request the same day. Nexus handles the rest.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link
              href="/auth/sign-up"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 30px',
                borderRadius: 9999,
                background: '#fff',
                color: '#111',
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Create an account <ArrowRight size={15} />
            </Link>
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 30px',
                borderRadius: 9999,
                border: '1.5px solid rgba(255,255,255,0.25)',
                color: 'rgba(255,255,255,0.85)',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#0a0a0a', color: 'rgba(255,255,255,0.5)', padding: '64px 24px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 52 }}>
            {/* Brand */}
            <div>
              <Link href="/" style={{ display: 'inline-block', marginBottom: 16 }}>
                <Image
                  src="/nexus-logo.png"
                  alt="Nexus Operations"
                  width={120}
                  height={40}
                  style={{ height: 26, width: 'auto' }}
                />
              </Link>
              <p style={{ fontSize: 12.5, lineHeight: 1.75, marginBottom: 16 }}>
                Managed property services for homeowners, landlords, and property managers in {CONTACT_INFO.cityState}.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href={CONTACT_INFO.phoneHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
                  <Phone size={12} /> {CONTACT_INFO.phoneDisplay}
                </a>
                <a href={`mailto:${CONTACT_INFO.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
                  <Mail size={12} /> {CONTACT_INFO.email}
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Platform</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { href: '#homeowners',   label: 'For Homeowners' },
                  { href: '#contractors',  label: 'For Contractors' },
                  { href: '#how-it-works', label: 'How It Works' },
                  { href: '#pricing',      label: 'Pricing' },
                  { href: '/faq',          label: 'FAQ' },
                ].map(({ href, label }) => (
                  <li key={href}><a href={href} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{label}</a></li>
                ))}
              </ul>
            </div>

            {/* Accounts */}
            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Accounts</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { href: '/auth/sign-up',                       label: 'Homeowner' },
                  { href: '/auth/sign-up?role=property_manager', label: 'Property Manager' },
                  { href: '/auth/sign-up?role=contractor',       label: 'Contractor' },
                  { href: '/auth/login',                         label: 'Sign In' },
                ].map(({ href, label }) => (
                  <li key={href}><Link href={href} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Company</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { href: '/about',   label: 'About Us' },
                  { href: '/contact', label: 'Contact' },
                  { href: '/terms',   label: 'Terms of Service' },
                  { href: '/privacy', label: 'Privacy Policy' },
                ].map(({ href, label }) => (
                  <li key={href}><Link href={href} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.07)',
              paddingTop: 24,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              fontSize: 11.5,
            }}
          >
            <p>&copy; 2026 {CONTACT_INFO.companyName}. {CONTACT_INFO.cityState}. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/terms"    style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Terms</Link>
              <Link href="/privacy"  style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Privacy</Link>
              <Link href="/site-map" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
