'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Menu, X, ArrowRight, ExternalLink,
  Camera, CalendarDays, MessageSquare,
  Eye, Zap, CreditCard,
  CheckCircle2, Shield, MapPin, Phone, Mail, ChevronRight,
  Star, Clock, BarChart3, Users, Sparkles, Lock, Activity,
} from 'lucide-react'
import { CONTACT_INFO } from '@/lib/contact-info'

/* ─── Data ─────────────────────────────────────────────────────────── */
const navLinks = [
  { href: '#homeowners',   label: 'Homeowners' },
  { href: '#contractors',  label: 'Contractors' },
  { href: '#pricing',      label: 'Pricing' },
  { href: '/contact',      label: 'Contact' },
]

const homeownerFeatures = [
  { icon: Camera,        title: 'Upload photos & set a budget cap',   desc: 'Show contractors exactly what you need' },
  { icon: CalendarDays,  title: 'Pick consultation windows',          desc: 'Choose times that work for your schedule' },
  { icon: MessageSquare, title: 'Track status in one place',          desc: 'Stay updated throughout the entire process' },
]

const contractorFeatures = [
  { icon: Eye,       title: 'See everything before claiming', desc: 'Photos, budget, and scope shown upfront' },
  { icon: Zap,       title: 'First-come, first-served',       desc: 'No bidding wars, no competing quotes' },
  { icon: CreditCard,title: 'Get paid faster',                desc: 'Unified invoicing and quick payouts' },
]

const pricingTiers = [
  {
    name: 'Routine',     markup: '25%',
    sla: 'Assigned within 24 hrs · On-site within 3–5 days',
    desc: 'Standard maintenance that is not time-sensitive. Scheduled repairs, cosmetic fixes, planned replacements.',
    featured: false,
  },
  {
    name: 'Urgent',      markup: '30%',
    sla: 'Assigned within 4 hrs · On-site next business day',
    desc: 'Issues requiring prompt attention — non-emergency plumbing, electrical affecting livability, HVAC in moderate weather.',
    featured: true,
  },
  {
    name: 'Emergency',   markup: '35%',
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

const trustStats = [
  { value: 98,   suffix: '%', label: 'Satisfaction rate',     icon: Star },
  { value: 1,    suffix: ' hr', label: 'Emergency response',  icon: Clock },
  { value: 500,  suffix: '+', label: 'Projects completed',    icon: BarChart3 },
  { value: 150,  suffix: '+', label: 'Verified contractors',  icon: Users },
]

/* ─── Animated counter hook ──────────────────────────────────────── */
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf: number
    const startTime = performance.now()
    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, start])
  return count
}

/* ─── Intersection observer hook ─────────────────────────────────── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ─── Stat counter component ─────────────────────────────────────── */
function StatCounter({ value, suffix, label, icon: Icon }: { value: number; suffix: string; label: string; icon: React.ElementType }) {
  const { ref, inView } = useInView(0.3)
  const count = useCounter(value, 1800, inView)
  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
        <Icon size={18} style={{ color: '#3aad58' }} />
      </div>
      <div style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', marginTop: 6, fontWeight: 500, letterSpacing: '0.03em' }}>
        {label}
      </div>
    </div>
  )
}

/* ─── Fade-up section wrapper ─────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/* ─── Nexus orbital icon (inline SVG) ───────────────────────────── */
function NexusIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(-42 60 60)" stroke="#3aad58" strokeWidth="5.5" strokeLinecap="round"/>
      <ellipse cx="60" cy="60" rx="52" ry="22" transform="rotate(42 60 60)" stroke="#3aad58" strokeWidth="5.5" strokeLinecap="round"/>
      <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(-42 60 60)" stroke="#3aad58" strokeWidth="4" strokeLinecap="round" opacity="0.85"/>
      <ellipse cx="60" cy="60" rx="28" ry="12" transform="rotate(42 60 60)" stroke="#3aad58" strokeWidth="4" strokeLinecap="round" opacity="0.85"/>
      <line x1="60" y1="47" x2="60" y2="73" stroke="#3aad58" strokeWidth="5" strokeLinecap="round"/>
      <line x1="47" y1="60" x2="73" y2="60" stroke="#3aad58" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  )
}

/* ─── Main ────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState<'homeowner' | 'contractor'>('homeowner')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const BG = '#0a0a0a'
  const CARD = '#111111'
  const CARD2 = '#161616'
  const BORDER = 'rgba(255,255,255,0.08)'
  const GREEN = '#3aad58'
  const GREEN_DIM = 'rgba(58,173,88,0.12)'

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Header ────────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(10,10,10,0.96)' : '#0a0a0a',
        backdropFilter: scrolled ? 'blur(16px)' : undefined,
        borderBottom: `1px solid ${scrolled ? BORDER : 'transparent'}`,
        transition: 'border-color 0.3s, background 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <NexusIcon size={34} />
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>NEXUS</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: GREEN, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 1 }}>OPERATIONS</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden md:flex">
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href} style={{ padding: '6px 14px', borderRadius: 9999, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.15s, background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'transparent' }}
              >{label}</a>
            ))}
          </nav>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/auth/login" className="hidden md:block" style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
            >Sign in</Link>
            <Link href="/auth/sign-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 9999, background: GREEN, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.15s, transform 0.15s', boxShadow: '0 0 24px rgba(58,173,88,0.35)' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.02)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
            >Get started <ArrowRight size={13} /></Link>
            <button className="md:hidden" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu"
              style={{ padding: 6, color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer' }}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: '#0a0a0a', borderTop: `1px solid ${BORDER}`, padding: '12px 24px 20px' }} className="md:hidden animate-fade-in">
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '11px 8px', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', borderBottom: `1px solid ${BORDER}` }}>{label}</a>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Link href="/auth/login" style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link href="/auth/sign-up" style={{ fontSize: 13, fontWeight: 700, color: GREEN, textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>Create account</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 160, paddingBottom: 100 }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(58,173,88,0.18) 0%, transparent 65%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 10%, black, transparent)' }} />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          {/* Location badge */}
          <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: GREEN_DIM, border: `1px solid rgba(58,173,88,0.25)`, borderRadius: 9999, padding: '5px 14px', marginBottom: 28 }}>
            <MapPin size={12} style={{ color: GREEN }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: GREEN, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{CONTACT_INFO.serviceArea}</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up" style={{ animationDelay: '0.05s', fontSize: 'clamp(42px, 6.5vw, 88px)', fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.035em', maxWidth: 860, marginBottom: 28 }}>
            Property maintenance,{' '}
            <span style={{ color: GREEN }}>handled</span>{' '}
            from start to finish.
          </h1>

          {/* Subline */}
          <p className="animate-fade-up" style={{ animationDelay: '0.12s', fontSize: 18, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', maxWidth: 560, marginBottom: 44 }}>
            Nexus Operations coordinates maintenance and repair work for property owners in the Topeka area.
            Submit once — we handle contractor selection, scheduling, and documentation.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up" style={{ animationDelay: '0.2s', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <Link href="/auth/sign-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 30px', borderRadius: 9999, background: GREEN, color: '#fff', fontSize: 14.5, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.15s, transform 0.15s, box-shadow 0.15s', boxShadow: '0 0 32px rgba(58,173,88,0.4)' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 40px rgba(58,173,88,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(58,173,88,0.4)' }}
            >Submit a request <ArrowRight size={15} /></Link>
            <Link href="/auth/sign-up?role=contractor" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 30px', borderRadius: 9999, border: `1.5px solid rgba(255,255,255,0.18)`, background: 'transparent', color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'border-color 0.15s, background 0.15s, transform 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
            >Join as a contractor <ExternalLink size={14} style={{ opacity: 0.6 }} /></Link>
          </div>

          {/* Trust badges */}
          <div className="animate-fade-up" style={{ animationDelay: '0.3s', display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 48 }}>
            {[
              { icon: Shield,        text: 'Verified contractors only' },
              { icon: Zap,           text: 'Same-day assignment' },
              { icon: CheckCircle2,  text: 'Manually reviewed requests' },
              { icon: Lock,          text: 'Secure project records' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                <Icon size={14} style={{ color: GREEN }} />{text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats band ────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {trustStats.map(s => <StatCounter key={s.label} {...s} />)}
        </div>
      </section>

      {/* ── Features tabs (Homeowners / Contractors) ──────────────── */}
      <section id="homeowners" style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <FadeUp>
            <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, width: 'fit-content', marginBottom: 52 }}>
              {(['homeowner', 'contractor'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: '9px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: activeTab === tab ? GREEN : 'transparent', color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>
                  {tab === 'homeowner' ? 'For Homeowners' : 'For Contractors'}
                </button>
              ))}
            </div>
          </FadeUp>

          {activeTab === 'homeowner' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28, alignItems: 'start' }}>
              <FadeUp>
                <div style={{ borderRadius: 20, overflow: 'hidden', lineHeight: 0 }}>
                  <Image src="/photo-home.jpg" alt="Modern home interior" width={720} height={520} style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }} />
                </div>
              </FadeUp>
              <FadeUp delay={0.1}>
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 36 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GREEN, marginBottom: 8 }}>Homeowner experience</p>
                  <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 28, lineHeight: 1.15 }}>
                    Submit once.<br/>We handle the rest.
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 }}>
                    {homeownerFeatures.map(({ icon: Icon, title, desc }) => (
                      <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: GREEN_DIM, border: `1px solid rgba(58,173,88,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={17} style={{ color: GREEN }} />
                        </div>
                        <div>
                          <p style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 2 }}>{title}</p>
                          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/auth/sign-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 9999, background: GREEN, color: '#fff', fontSize: 13.5, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >Submit a request <ArrowRight size={14} /></Link>
                </div>
              </FadeUp>
            </div>
          )}

          {activeTab === 'contractor' && (
            <div id="contractors" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28, alignItems: 'start' }}>
              <FadeUp>
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 36 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GREEN, marginBottom: 8 }}>Contractor experience</p>
                  <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 28, lineHeight: 1.15 }}>
                    Stop chasing leads.<br/>Claim exclusive jobs.
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 }}>
                    {contractorFeatures.map(({ icon: Icon, title, desc }) => (
                      <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: GREEN_DIM, border: `1px solid rgba(58,173,88,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={17} style={{ color: GREEN }} />
                        </div>
                        <div>
                          <p style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 2 }}>{title}</p>
                          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <Link href="/auth/sign-up?role=contractor" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 9999, background: GREEN, color: '#fff', fontSize: 13.5, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >Join the network <ArrowRight size={14} /></Link>
                    <Link href="#pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 9999, border: `1.5px solid rgba(255,255,255,0.15)`, color: 'rgba(255,255,255,0.75)', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', transition: 'border-color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                    >View pricing</Link>
                  </div>
                </div>
              </FadeUp>
              <FadeUp delay={0.1}>
                <div style={{ borderRadius: 20, overflow: 'hidden', lineHeight: 0 }}>
                  <Image src="/photo-contractor.jpg" alt="Contractor working on a property" width={720} height={520} style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }} />
                </div>
              </FadeUp>
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 0', borderTop: `1px solid ${BORDER}`, background: '#0d0d0d' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <FadeUp>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GREEN, marginBottom: 14 }}>The process</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 900, letterSpacing: '-0.03em', maxWidth: 560, marginBottom: 60, lineHeight: 1.1 }}>
              From request to record<br/>in four steps.
            </h2>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0 }}>
            {steps.map(({ n, title, desc }, i) => (
              <FadeUp key={n} delay={i * 0.08}>
                <div style={{ padding: '32px 28px', borderLeft: i === 0 ? `1px solid ${BORDER}` : undefined, borderRight: `1px solid ${BORDER}`, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, marginLeft: i === 0 ? 0 : -1, position: 'relative', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(58,173,88,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 900, letterSpacing: '0.12em', color: GREEN, marginBottom: 16, fontVariantNumeric: 'tabular-nums' }}>{n}</span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '100px 0', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <FadeUp>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GREEN, marginBottom: 14 }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 900, letterSpacing: '-0.03em', maxWidth: 540, marginBottom: 14, lineHeight: 1.1 }}>Pay for work completed,<br/>not retainers.</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: 480, lineHeight: 1.7, marginBottom: 56 }}>
              Nexus charges a transparent markup on completed work. No subscriptions, no hidden fees.
            </p>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {pricingTiers.map(({ name, markup, sla, desc, featured }, i) => (
              <FadeUp key={name} delay={i * 0.08}>
                <div style={{ background: featured ? CARD2 : CARD, border: featured ? `1px solid rgba(58,173,88,0.35)` : `1px solid ${BORDER}`, borderRadius: 20, padding: 36, position: 'relative', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: featured ? '0 0 40px rgba(58,173,88,0.12)' : 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = featured ? '0 8px 60px rgba(58,173,88,0.2)' : '0 8px 40px rgba(0,0,0,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = featured ? '0 0 40px rgba(58,173,88,0.12)' : 'none' }}
                >
                  {featured && (
                    <span style={{ position: 'absolute', top: 20, right: 20, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 9999, background: GREEN, color: '#fff' }}>Most common</span>
                  )}
                  <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'rgba(255,255,255,0.45)' }}>{name}</p>
                  <p style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 4, color: GREEN }}>{markup}
                    <span style={{ fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.35)', marginLeft: 6 }}>markup</span>
                  </p>
                  <p style={{ fontSize: 11.5, marginBottom: 20, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{sla}</p>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,0.6)' }}>{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <p style={{ marginTop: 28, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            <Link href="/pricing" style={{ color: GREEN, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              View full pricing details <ChevronRight size={14} />
            </Link>
          </p>
        </div>
      </section>

      {/* ── Platform callout band ──────────────────────────────────── */}
      <section style={{ padding: '80px 24px', borderTop: `1px solid ${BORDER}`, background: '#0d0d0d' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            { icon: Activity,  title: 'Live project tracking',  desc: 'See real-time status updates for every active request.' },
            { icon: Shield,    title: 'Verified professionals', desc: 'Every contractor is vetted before joining the network.' },
            { icon: Sparkles,  title: 'AI-powered insights',    desc: 'Smart recommendations and automated project summaries.' },
            { icon: Lock,      title: 'Secure records',         desc: 'Every invoice, photo, and note is archived for you.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <FadeUp key={title} delay={i * 0.07}>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '24px 22px', transition: 'border-color 0.2s, background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(58,173,88,0.3)'; e.currentTarget.style.background = '#161616' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = CARD }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: GREEN_DIM, border: `1px solid rgba(58,173,88,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={17} style={{ color: GREEN }} />
                </div>
                <p style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 6 }}>{title}</p>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── CTA band ──────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', textAlign: 'center', borderTop: `1px solid ${BORDER}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(58,173,88,0.08) 0%, transparent 65%)' }} />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
          <FadeUp>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: GREEN_DIM, border: `1px solid rgba(58,173,88,0.25)`, borderRadius: 9999, padding: '5px 14px', marginBottom: 24 }}>
              <Sparkles size={12} style={{ color: GREEN }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: GREEN, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Ready to get started?</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: 18 }}>
              Simplify your property maintenance today.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 40 }}>
              Create an account in minutes. Submit your first request the same day. Nexus handles the rest.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              <Link href="/auth/sign-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 32px', borderRadius: 9999, background: GREEN, color: '#fff', fontSize: 14.5, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.15s, transform 0.15s', boxShadow: '0 0 36px rgba(58,173,88,0.4)' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
              >Create an account <ArrowRight size={15} /></Link>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 32px', borderRadius: 9999, border: `1.5px solid rgba(255,255,255,0.18)`, color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'border-color 0.15s, transform 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >Contact us</Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer style={{ background: '#080808', color: 'rgba(255,255,255,0.45)', padding: '72px 24px 40px', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 44, marginBottom: 56 }}>
            {/* Brand */}
            <div>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
                <NexusIcon size={28} />
                <div style={{ lineHeight: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>NEXUS</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: GREEN, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 1 }}>OPERATIONS</div>
                </div>
              </Link>
              <p style={{ fontSize: 12.5, lineHeight: 1.75, marginBottom: 16 }}>
                Managed property services for homeowners, landlords, and property managers in {CONTACT_INFO.cityState}.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href={CONTACT_INFO.phoneHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                ><Phone size={12} /> {CONTACT_INFO.phoneDisplay}</a>
                <a href={`mailto:${CONTACT_INFO.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                ><Mail size={12} /> {CONTACT_INFO.email}</a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>Platform</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { href: '#homeowners',   label: 'For Homeowners' },
                  { href: '#contractors',  label: 'For Contractors' },
                  { href: '#how-it-works', label: 'How It Works' },
                  { href: '#pricing',      label: 'Pricing' },
                  { href: '/faq',          label: 'FAQ' },
                ].map(({ href, label }) => (
                  <li key={href}><a href={href} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                  >{label}</a></li>
                ))}
              </ul>
            </div>

            {/* Accounts */}
            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>Accounts</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { href: '/auth/sign-up',                       label: 'Homeowner' },
                  { href: '/auth/sign-up?role=property_manager', label: 'Property Manager' },
                  { href: '/auth/sign-up?role=contractor',       label: 'Contractor' },
                  { href: '/auth/login',                         label: 'Sign In' },
                ].map(({ href, label }) => (
                  <li key={href}><Link href={href} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                  >{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>Company</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { href: '/about',   label: 'About Us' },
                  { href: '/contact', label: 'Contact' },
                  { href: '/terms',   label: 'Terms of Service' },
                  { href: '/privacy', label: 'Privacy Policy' },
                ].map(({ href, label }) => (
                  <li key={href}><Link href={href} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                  >{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ borderTop: `1px solid rgba(255,255,255,0.07)`, paddingTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 11.5 }}>
            <p>&copy; 2026 {CONTACT_INFO.companyName}. {CONTACT_INFO.cityState}. All rights reserved.</p>
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
