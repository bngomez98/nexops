'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Menu, X } from 'lucide-react'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const BG = '#0a0a0a'
  const CARD = '#111111'
  const CARD2 = '#161616'
  const BORDER = 'rgba(255,255,255,0.08)'
  const GREEN = '#3aad58'
  const GREEN_DIM = 'rgba(58,173,88,0.12)'

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
          </FadeUp>

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
                  <Link href="/auth/sign-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 9999, background: GREEN, color: '#fff', fontSize: 13.5, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >Submit a request <ArrowRight size={14} /></Link>
                </div>
              </FadeUp>
            </div>
          )}

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
