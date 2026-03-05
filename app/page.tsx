import Link from 'next/link'
import Image from 'next/image'
import { HeroTypewriter } from '@/components/hero-typewriter'
import { ProjectCard } from '@/components/project-card'

const services = [
  'Tree Removal',
  'Concrete Work',
  'Roofing',
  'HVAC',
  'Fencing',
  'Electrical',
  'Plumbing',
  'Excavation',
]

const trustBadges = [
  {
    icon: (
      <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    text: 'Your project is never sold or shared with a list',
  },
  {
    icon: (
      <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    text: 'Every contractor is licensed, insured, and verified',
  },
  {
    icon: (
      <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    text: 'Consultation confirmed within 24 hours — on your schedule',
  },
]

const steps = [
  {
    step: '1',
    title: 'Submit Your Project',
    body: 'Describe your project with photos, a written scope, and a maximum budget. No bidding, no guesswork.',
  },
  {
    step: '2',
    title: 'One Contractor Claims It',
    body: 'A single licensed, insured contractor claims your project exclusively. Once claimed, it disappears from all other feeds.',
  },
  {
    step: '3',
    title: 'Work Gets Done',
    body: 'Direct communication from day one. They arrive at your consultation already knowing the full scope.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-md flex items-center justify-center flex-shrink-0">
              <span className="text-[var(--color-background)] font-black text-sm">N</span>
            </div>
            <div className="leading-none">
              <div className="text-sm font-bold text-[var(--color-foreground)] tracking-wide">Nexus</div>
              <div className="text-[10px] font-semibold text-[var(--color-subtle)] tracking-widest uppercase">Operations</div>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-sm text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">How It Works</Link>
            <Link href="#services" className="text-sm text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">Services</Link>
            <Link href="#contractors" className="text-sm text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">For Contractors</Link>
            <Link href="#property-managers" className="text-sm text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">For Property Managers</Link>
            <Link href="#contact" className="text-sm text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">Contact</Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="#" className="flex items-center gap-1.5 text-sm text-[var(--color-subtle)] hover:text-[var(--color-foreground)] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Log In
            </Link>
            <button className="px-5 py-2 text-sm bg-[var(--color-primary)] text-[var(--color-background)] font-bold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 lg:px-10 pt-16 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-[var(--color-border)] rounded-full px-4 py-1.5 mb-10">
            <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full" />
            <span className="text-sm text-[var(--color-subtle)]">Now serving Topeka, KS — one project, one professional</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
            {/* Left: copy */}
            <div className="flex-1 max-w-xl">
              <h1 className="text-5xl md:text-6xl font-black leading-[1.05] mb-6 tracking-tight">
                <span className="text-[var(--color-foreground)]">One </span>
                <span className="text-[var(--color-foreground)]"><HeroTypewriter /></span>
                <br />
                <span className="text-[var(--color-foreground)]">contractor.</span>
                <br />
                <span className="text-[var(--color-primary)]">Exclusively yours.</span>
                <br />
                <span className="text-[var(--color-subtle)]">{"That's the whole"}</span>
                <br />
                <span className="text-[var(--color-subtle)]">point.</span>
              </h1>

              <p className="text-base text-[var(--color-subtle)] leading-relaxed mb-8 max-w-md text-pretty">
                Nexus Operations connects homeowners directly with one licensed, insured contractor — not a list. You submit your project once with photos, a written scope, and a real budget ceiling. A single professional in your area claims it exclusively before your phone rings.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-5 mb-10">
                <button className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-[var(--color-background)] font-bold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors text-sm">
                  Start Your Project — Free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <Link href="#contractors" className="flex items-center gap-1.5 text-sm text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors font-medium">
                  {"I'm a contractor"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-col gap-3">
                {trustBadges.map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    {icon}
                    <span className="text-sm text-[var(--color-subtle)]">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: project card */}
            <div className="flex-shrink-0 flex justify-center lg:justify-end">
              <ProjectCard />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 lg:px-10 bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-3 text-center tracking-tight">How It Works</h2>
          <p className="text-center text-[var(--color-subtle)] mb-16 max-w-lg mx-auto leading-relaxed text-sm">
            Fast, direct, and transparent — from first submission to completed work
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map(({ step, title, body }) => (
              <div key={step} className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-2xl p-8">
                <div className="w-11 h-11 bg-[var(--color-primary)] rounded-xl flex items-center justify-center mb-5 font-black text-[var(--color-background)] text-base">
                  {step}
                </div>
                <h3 className="text-base font-bold mb-3">{title}</h3>
                <p className="text-[var(--color-subtle)] leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black mb-3 text-center tracking-tight">Service Categories</h2>
          <p className="text-center text-[var(--color-subtle)] mb-16 max-w-lg mx-auto leading-relaxed text-sm">
            Covering a wide range of home and commercial services across the Topeka region
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service) => (
              <div
                key={service}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-primary)] transition-colors cursor-default"
              >
                <p className="font-semibold text-[var(--color-foreground)] text-sm">{service}</p>
                <p className="text-xs text-[var(--color-primary)] mt-2 font-medium">Available</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Contractors */}
      <section id="contractors" className="py-20 px-6 lg:px-10 bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs text-[var(--color-primary)] font-bold uppercase tracking-widest mb-4">For Contractors</p>
              <h2 className="text-4xl font-black mb-6 tracking-tight leading-tight">
                Stop chasing leads.<br />Let them come to you.
              </h2>
              <p className="text-[var(--color-subtle)] leading-relaxed mb-8 text-sm text-pretty">
                Every project you claim is yours alone. No competing bids, no price wars. Homeowners arrive at the consultation already knowing your scope — all you have to do is show up and close.
              </p>
              <ul className="space-y-4">
                {[
                  'Exclusive claim — no competing contractors',
                  'Full project documentation before you arrive',
                  'Budget ceiling set upfront by the homeowner',
                  'Simple license and insurance verification',
                  'Growing network across the Topeka region',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-[var(--color-primary)] font-bold flex-shrink-0 mt-0.5">&#10003;</span>
                    <span className="text-[var(--color-subtle)] text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-2xl p-8">
              <p className="text-xs text-[var(--color-subtle)] uppercase tracking-widest mb-6">Contractor dashboard preview</p>
              <div className="space-y-3">
                {[
                  { label: 'Open projects near you', value: '14', highlight: true },
                  { label: 'Projects claimed this month', value: '6' },
                  { label: 'Avg. budget ceiling', value: '$6,200' },
                  { label: 'Consultation rate', value: '94%' },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
                    <span className="text-sm text-[var(--color-subtle)]">{label}</span>
                    <span className={`text-sm font-bold ${highlight ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)]'}`}>{value}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-[var(--color-primary)] text-[var(--color-background)] font-bold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors text-sm">
                Apply as a Contractor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* For Property Managers */}
      <section id="property-managers" className="py-20 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-[var(--color-primary)] font-bold uppercase tracking-widest mb-4">For Property Managers</p>
          <h2 className="text-4xl font-black mb-6 tracking-tight">Manage multiple properties.<br />One platform.</h2>
          <p className="text-[var(--color-subtle)] leading-relaxed mb-12 max-w-xl mx-auto text-sm text-pretty">
            Submit projects across your entire portfolio and track each one from claim to completion. Every contractor is verified — so you never have to guess who is showing up.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { title: 'Portfolio-wide submissions', body: 'Submit projects across all your properties from a single account.' },
              { title: 'Verified contractors only', body: 'Every contractor on the platform is licensed and insured — no exceptions.' },
              { title: 'Full project records', body: 'Photos, scopes, budgets, and timelines stored for every completed job.' },
            ].map(({ title, body }) => (
              <div key={title} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-7">
                <h3 className="font-bold mb-3 text-sm">{title}</h3>
                <p className="text-[var(--color-subtle)] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 px-6 lg:px-10 bg-[var(--color-surface)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4 text-balance tracking-tight">Ready to hire with confidence?</h2>
          <p className="text-[var(--color-subtle)] mb-10 leading-relaxed text-sm">
            Join Nexus Operations — submit your first project free and get matched with a verified contractor in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-[var(--color-primary)] text-[var(--color-background)] font-bold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors text-sm">
              Start Your Project — Free
            </button>
            <button className="px-8 py-3 border border-[var(--color-border)] text-[var(--color-foreground)] font-semibold rounded-full hover:bg-[var(--color-surface-raised)] transition-colors text-sm">
              Apply as a Contractor
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-background)] border-t border-[var(--color-border)] py-12 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[var(--color-primary)] rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--color-background)] font-black text-xs">N</span>
                </div>
                <div className="leading-none">
                  <div className="text-xs font-bold text-[var(--color-foreground)] tracking-wide">Nexus</div>
                  <div className="text-[9px] font-semibold text-[var(--color-subtle)] tracking-widest uppercase">Operations</div>
                </div>
              </div>
              <p className="text-xs text-[var(--color-subtle)] leading-relaxed">
                One contractor. Exclusively yours. Topeka, KS.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--color-subtle)] mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-[var(--color-subtle)]">
                <li><Link href="#how-it-works" className="hover:text-[var(--color-foreground)] transition-colors">How It Works</Link></li>
                <li><Link href="#services" className="hover:text-[var(--color-foreground)] transition-colors">Services</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--color-subtle)] mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-[var(--color-subtle)]">
                <li><Link href="#contractors" className="hover:text-[var(--color-foreground)] transition-colors">For Contractors</Link></li>
                <li><Link href="#property-managers" className="hover:text-[var(--color-foreground)] transition-colors">For Property Managers</Link></li>
                <li><Link href="#contact" className="hover:text-[var(--color-foreground)] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-[var(--color-subtle)] mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm text-[var(--color-subtle)]">
                <li><Link href="#" className="hover:text-[var(--color-foreground)] transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-[var(--color-foreground)] transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--color-border)] pt-8 text-center text-xs text-[var(--color-subtle)]">
            &copy; 2026 Nexus Operations. All rights reserved.
          </div>
        </div>
      </footer>

    </main>
  )
}
