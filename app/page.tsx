import Link from 'next/link'
import Image from 'next/image'
import { HeroTypewriter } from '@/components/hero-typewriter'
import { ProjectCard } from '@/components/project-card'

const services = [
  { name: 'Tree Removal', icon: '🌲' },
  { name: 'Concrete Work', icon: '🧱' },
  { name: 'Roofing', icon: '🏠' },
  { name: 'HVAC', icon: '❄️' },
  { name: 'Fencing', icon: '🔩' },
  { name: 'Electrical', icon: '⚡' },
  { name: 'Plumbing', icon: '🔧' },
  { name: 'Excavation', icon: '🚜' },
]

const steps = [
  {
    step: '01',
    title: 'Submit Your Project',
    body: 'Describe your project with photos, a written scope, and a real budget ceiling. No bids, no guesswork.',
  },
  {
    step: '02',
    title: 'One Contractor Claims It',
    body: 'A single licensed, insured contractor claims your project exclusively. Once claimed, it disappears from all other feeds.',
  },
  {
    step: '03',
    title: 'Work Gets Done',
    body: 'Direct communication from day one. They arrive at your consultation already knowing the full scope.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-[6px] flex items-center justify-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nexus%20official%20logo%20small-Isfi4ffPq4jpg0F0ALxirkL1wVWk3u.png"
                alt="Nexus Operations"
                width={22}
                height={22}
                className="object-contain"
              />
            </div>
            <div className="leading-[1.1]">
              <p className="text-[13px] font-bold text-[var(--color-foreground)] tracking-wide">Nexus</p>
              <p className="text-[9px] font-semibold text-[var(--color-subtle)] tracking-[0.18em] uppercase">Operations</p>
            </div>
          </Link>

          {/* Center nav */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
            <Link href="#how-it-works" className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">How It Works</Link>
            <Link href="#services"     className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">Services</Link>
            <Link href="#contractors"  className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">For Contractors</Link>
            <Link href="#property-managers" className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">For Property Managers</Link>
            <Link href="#contact"      className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">Contact</Link>
          </nav>

          {/* Right auth */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link href="#" className="flex items-center gap-1.5 text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Log In
            </Link>
            <button className="h-8 px-4 text-[13px] font-semibold bg-[var(--color-primary)] text-black rounded-full hover:bg-[var(--color-primary-hover)] transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="px-5 sm:px-8 pt-14 pb-20 md:pt-16 md:pb-28">
        <div className="max-w-7xl mx-auto">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 border border-[var(--color-border)] rounded-full px-3.5 py-1 mb-10">
            <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse" aria-hidden="true" />
            <span className="text-xs text-[var(--color-subtle)]">Now serving Topeka, KS — one project, one professional</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-14">

            {/* Left copy */}
            <div className="flex-1 max-w-[560px]">
              <h1 className="font-black tracking-tight leading-[1.04] mb-7" style={{ fontSize: 'clamp(2.6rem, 5vw, 3.75rem)' }}>
                <span className="text-[var(--color-foreground)]">One <HeroTypewriter /></span>
                <br />
                <span className="text-[var(--color-foreground)]">contractor.</span>
                <br />
                <span className="text-[var(--color-primary)]">Exclusively yours.</span>
                <br />
                <span className="text-[var(--color-subtle)]">{"That's the whole"}</span>
                <br />
                <span className="text-[var(--color-subtle)]">point.</span>
              </h1>

              <p className="text-[15px] text-[var(--color-subtle)] leading-[1.65] mb-9 max-w-[460px]">
                Nexus Operations connects homeowners directly with one licensed, insured contractor — not a list. You submit your project once with photos, a written scope, and a real budget ceiling. A single professional in your area claims it exclusively before your phone rings. They arrive at your consultation already knowing the scope. You already know who&apos;s coming. That&apos;s what it means to hire with confidence.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-5 mb-10">
                <button className="flex items-center gap-2 h-11 px-6 bg-[var(--color-primary)] text-black text-[13px] font-bold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors">
                  Start Your Project — Free
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <Link href="#contractors" className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">
                  {"I'm a contractor"}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Trust row */}
              <ul className="flex flex-col gap-2.5">
                {[
                  { Icon: LockIcon,    text: 'Your project is never sold or shared with a list' },
                  { Icon: ShieldIcon,  text: 'Every contractor is licensed, insured, and verified' },
                  { Icon: BoltIcon,    text: 'Consultation confirmed within 24 hours — on your schedule' },
                ].map(({ Icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                    <span className="text-[13px] text-[var(--color-subtle)]">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right card */}
            <div className="flex-shrink-0 flex justify-center lg:justify-end lg:pt-4">
              <ProjectCard />
            </div>

          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 px-5 sm:px-8 bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)] text-center mb-3">Process</p>
          <h2 className="text-[2rem] font-black tracking-tight text-center mb-3">How It Works</h2>
          <p className="text-center text-[var(--color-subtle)] mb-14 max-w-md mx-auto text-[14px] leading-relaxed">
            Fast, direct, and transparent — from first submission to completed work
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {steps.map(({ step, title, body }) => (
              <div key={step} className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-2xl p-7">
                <p className="text-[var(--color-primary)] text-xs font-bold tracking-widest mb-4">{step}</p>
                <h3 className="text-[15px] font-bold mb-2.5">{title}</h3>
                <p className="text-[var(--color-subtle)] text-[13px] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)] text-center mb-3">Coverage</p>
          <h2 className="text-[2rem] font-black tracking-tight text-center mb-3">Service Categories</h2>
          <p className="text-center text-[var(--color-subtle)] mb-14 max-w-md mx-auto text-[14px] leading-relaxed">
            Home and commercial services across the Topeka region — with more added regularly
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {services.map(({ name }) => (
              <div
                key={name}
                className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[var(--color-primary)] transition-colors"
              >
                <p className="font-semibold text-[var(--color-foreground)] text-[13px] mb-1.5">{name}</p>
                <p className="text-[11px] text-[var(--color-primary)] font-medium uppercase tracking-wide">Available</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Contractors ── */}
      <section id="contractors" className="py-20 px-5 sm:px-8 bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-start">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)] mb-3">For Contractors</p>
            <h2 className="text-[2rem] font-black tracking-tight leading-tight mb-5">
              Stop chasing leads.<br />Let them come to you.
            </h2>
            <p className="text-[var(--color-subtle)] text-[14px] leading-relaxed mb-8">
              Every project you claim is yours alone. No competing bids, no price wars. Homeowners arrive at the consultation already knowing your scope — all you have to do is show up and close.
            </p>
            <ul className="space-y-3.5">
              {[
                'Exclusive claim — no competing contractors',
                'Full project documentation before you arrive',
                'Budget ceiling set upfront by the homeowner',
                'Simple license and insurance verification',
                'Growing network across the Topeka region',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[var(--color-primary)] font-bold flex-shrink-0 leading-5">&#10003;</span>
                  <span className="text-[var(--color-subtle)] text-[13px] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-2xl p-7">
            <p className="text-[11px] text-[var(--color-subtle)] uppercase tracking-[0.15em] mb-6">Contractor dashboard preview</p>
            <div className="divide-y divide-[var(--color-border)]">
              {[
                { label: 'Open projects near you',     value: '14',    green: true  },
                { label: 'Projects claimed this month', value: '6'                  },
                { label: 'Avg. budget ceiling',         value: '$6,200'             },
                { label: 'Consultation rate',           value: '94%'                },
              ].map(({ label, value, green }) => (
                <div key={label} className="flex items-center justify-between py-3.5">
                  <span className="text-[13px] text-[var(--color-subtle)]">{label}</span>
                  <span className={`text-[13px] font-bold ${green ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)]'}`}>{value}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 h-10 bg-[var(--color-primary)] text-black text-[13px] font-bold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors">
              Apply as a Contractor
            </button>
          </div>
        </div>
      </section>

      {/* ── For Property Managers ── */}
      <section id="property-managers" className="py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)] mb-3">For Property Managers</p>
          <h2 className="text-[2rem] font-black tracking-tight mb-5">Manage multiple properties.<br />One place.</h2>
          <p className="text-[var(--color-subtle)] text-[14px] leading-relaxed mb-12 max-w-xl mx-auto">
            Submit projects across your entire portfolio and track each one from claim to completion. Every contractor is verified — so you never have to guess who is showing up.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            {[
              { title: 'Portfolio-wide submissions',  body: 'Submit projects across all your properties from a single account.' },
              { title: 'Verified contractors only',   body: 'Every contractor on the platform is licensed and insured — no exceptions.' },
              { title: 'Full project records',        body: 'Photos, scopes, budgets, and timelines stored for every completed job.' },
            ].map(({ title, body }) => (
              <div key={title} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
                <h3 className="font-bold text-[14px] mb-2.5">{title}</h3>
                <p className="text-[var(--color-subtle)] text-[13px] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-20 px-5 sm:px-8 bg-[var(--color-surface)]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-[2rem] font-black tracking-tight mb-4">Ready to hire with confidence?</h2>
          <p className="text-[var(--color-subtle)] text-[14px] leading-relaxed mb-8">
            Submit your first project free and get matched with a verified contractor in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="h-11 px-7 bg-[var(--color-primary)] text-black text-[13px] font-bold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors">
              Start Your Project — Free
            </button>
            <button className="h-11 px-7 border border-[var(--color-border)] text-[var(--color-foreground)] text-[13px] font-semibold rounded-full hover:bg-[var(--color-surface-raised)] transition-colors">
              Apply as a Contractor
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[var(--color-background)] border-t border-[var(--color-border)] py-12 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-[var(--color-primary)] rounded-[5px] flex items-center justify-center flex-shrink-0">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nexus%20official%20logo%20small-Isfi4ffPq4jpg0F0ALxirkL1wVWk3u.png"
                    alt="Nexus Operations"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </div>
                <div className="leading-[1.1]">
                  <p className="text-[12px] font-bold text-[var(--color-foreground)]">Nexus</p>
                  <p className="text-[9px] font-semibold text-[var(--color-subtle)] tracking-[0.18em] uppercase">Operations</p>
                </div>
              </div>
              <p className="text-[12px] text-[var(--color-subtle)] leading-relaxed max-w-[200px]">
                One contractor. Exclusively yours.<br />Topeka, KS.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-subtle)] mb-4">Product</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'How It Works', href: '#how-it-works' },
                  { label: 'Services',     href: '#services' },
                ].map(({ label, href }) => (
                  <li key={label}><Link href={href} className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-subtle)] mb-4">Company</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'For Contractors',      href: '#contractors' },
                  { label: 'For Property Managers', href: '#property-managers' },
                  { label: 'Contact',              href: '#contact' },
                  { label: 'Help Center',          href: 'https://nexusoperations.zendesk.com/hc/en-us', external: true },
                ].map(({ label, href, external }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-subtle)] mb-4">Legal</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'Privacy', href: '#' },
                  { label: 'Terms',   href: '#' },
                ].map(({ label, href }) => (
                  <li key={label}><Link href={href} className="text-[13px] text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>

          </div>
          <div className="border-t border-[var(--color-border)] pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[var(--color-subtle)]">
            <p>&copy; 2026 Nexus Operations. All rights reserved.</p>
            <Link
              href="https://nexusoperations.zendesk.com/hc/en-us"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-foreground)] transition-colors"
            >
              Help Center
            </Link>
          </div>
        </div>
      </footer>

    </main>
  )
}

/* ── Inline icon components ── */
function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}
function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}
