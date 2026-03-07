import Link from 'next/link'
import Image from 'next/image'
import { HeroTypewriter } from '@/components/hero-typewriter'
import { ProjectCard } from '@/components/project-card'
import {
  TreePine,
  Thermometer,
  Zap,
  Home as HomeIcon,
  Hammer,
  Fence,
  CheckCircle,
  ArrowRight,
  Shield,
  FileText,
  BadgeCheck,
  Clock,
  Building2,
  Users,
  Mail,
  Phone,
} from 'lucide-react'

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
                <span className="text-[var(--color-foreground)]">solution.</span>
                <br />
                <span className="text-[var(--color-primary)]">We work for you.</span>
                <br />
                <span className="text-[var(--color-subtle)]">{"That's the whole"}</span>
                <br />
                <span className="text-[var(--color-subtle)]">point.</span>
              </h1>

              <p className="text-base text-[var(--color-subtle)] leading-relaxed mb-8 max-w-md text-pretty">
                Nexus Operations connects you directly with a licensed, insured contractor and does this while allowing you to have full control. It takes 5 minutes of your time to make a request a reality, and we handle the rest. On your terms only.
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
                  { Icon: LockIcon,   text: 'Your project is never sold or shared with a list' },
                  { Icon: ShieldIcon, text: 'Every contractor is licensed, insured, and verified' },
                  { Icon: BoltIcon,   text: 'Consultation confirmed within 24 hours — on your schedule' },
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
      <section id="how-it-works" className="py-20 px-6 lg:px-10 bg-[var(--color-surface)]">
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
      <section id="services" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Service categories</h2>
            <p className="mt-2 text-muted-foreground">
              Every request requires several photos or a video, specifications, scope, and budget before submission. This allows us to provide you with specialized results, from a skilled trade specialist just for you.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: TreePine,
                title: "Tree Removal",
                description: "Licensed removal, crown reduction, stump grinding, and post-storm assessment. ISA-certified arborists.",
                range: "$500 – $8,000",
              },
              {
                icon: Thermometer,
                title: "HVAC",
                description: "Central air, heat pumps, ductless mini-splits, furnace replacement, and maintenance agreements.",
                range: "$3,000 – $20,000",
              },
              {
                icon: Zap,
                title: "Electrical",
                description: "Panel upgrades, circuit additions, rewiring, subpanel installation, and EV charger rough-in.",
                range: "$500 – $10,000",
              },
              {
                icon: HomeIcon,
                title: "Roofing",
                description: "Full replacements, leak repairs, storm damage assessment, and insurance restoration.",
                range: "$5,000 – $25,000",
              },
              {
                icon: Hammer,
                title: "Concrete",
                description: "Driveways, patios, sidewalks, flatwork, and foundation repairs.",
                range: "$2,000 – $15,000",
              },
              {
                icon: Fence,
                title: "Fencing",
                description: "Privacy, chain link, vinyl, wood, and specialty fencing for residential and commercial.",
                range: "$1,500 – $10,000",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="rounded-lg border border-border bg-card p-6 transition hover:border-primary/50"
              >
                <div className="flex items-start justify-between">
                  <service.icon className="h-6 w-6 text-primary" />
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Live
                  </span>
                </div>
                <h3 className="mt-4 font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Typical range: <span className="font-medium text-foreground">{service.range}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {"Don't see your category? "}
              <a href="#start" className="text-primary hover:underline">
                Submit a request
              </a>
              {" — we prioritize expansion based on demand. Tell us where we are needed and what your trade is. We're open to all trades, and dedicated to meeting service demands across Kansas."}
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Nexus ── */}
      <section id="why-nexus" className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Why Nexus Operations</h2>
            <p className="mt-2 text-muted-foreground">Built for outcomes, not volume</p>
          </div>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left font-medium text-muted-foreground">Feature</th>
                  <th className="py-3 text-left font-medium text-primary">Nexus Operations</th>
                  <th className="py-3 text-left font-medium text-muted-foreground">Traditional Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 text-muted-foreground">Contractor assignment</td>
                  <td className="py-3 font-medium">One contractor per request</td>
                  <td className="py-3 text-muted-foreground">3–7 contractors competing</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Cost</td>
                  <td className="py-3 font-medium">No fees or outrageous margins — prices are set by contractors and property owners.</td>
                  <td className="py-3 text-muted-foreground">Hidden fees and inflated margins</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Budget transparency</td>
                  <td className="py-3 font-medium">Set your budget limit in your submission. Contractors see it immediately — saving everyone time.</td>
                  <td className="py-3 text-muted-foreground">Contractor guesses on-site</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Documentation</td>
                  <td className="py-3 font-medium">Required so we can work with efficiency.</td>
                  <td className="py-3 text-muted-foreground">Optional, often absent</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Consultation scheduling</td>
                  <td className="py-3 font-medium">Pre-confirmed at submission, dates pre-set by you.</td>
                  <td className="py-3 text-muted-foreground">Scheduled after multiple calls</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Contractor verification</td>
                  <td className="py-3 font-medium">Licensed, insured, background verified. Trust and safety are top priority.</td>
                  <td className="py-3 text-muted-foreground">Self-reported, or non-existent.</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Ongoing relationships</td>
                  <td className="py-3 font-medium">Your one-stop-shop for all property needs — on demand, at your request.</td>
                  <td className="py-3 text-muted-foreground">5–15 unsolicited calls in the first hour</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
            <h3 className="font-semibold text-foreground">The Nexus Commitment</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              One request. One verified contractor. Zero unsolicited calls. If no qualified contractor is currently available in your area, you are told immediately — no indefinite wait, no ambiguity.
            </p>
          </div>
        </div>
      </section>

      {/* ── For Contractors ── */}
      <section id="contractors" className="py-20 px-6 lg:px-10 bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs text-[var(--color-primary)] font-bold uppercase tracking-widest mb-4">For Contractors</p>
              <h2 className="text-4xl font-black mb-6 tracking-tight leading-tight">
                Stop chasing leads.<br />Let them come to you.
              </h2>
              <p className="text-[var(--color-subtle)] leading-relaxed mb-6 text-sm text-pretty">
                Want to scale, expand, or gain customers without paying for marketing or responding to endless calls and inquiries? We handle all of it. You&apos;ll be notified when a qualified request is available, based on your availability, trade, and preferences. You have full ownership over your business and work. We just make it easier.
              </p>
              <p className="text-[var(--color-subtle)] leading-relaxed mb-8 text-sm text-pretty">
                Nexus Operations works differently. Pay a flat monthly membership. When you claim a project, it is yours. Accepting a job costs you nothing, and your time is just as important to us as it is to you. The property owner is expecting your call and has already shared complete project details.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Charge your own prices for services provided',
                  'Exclusive projects with full scope, specifications, and scheduling — right away',
                  'Track your jobs in the dashboard, with 24/7 support if problems arise',
                  'Budget ceiling is visible upfront — transparency is critical to efficiency',
                  'Not lead generation — automated and managed',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-[var(--color-subtle)]">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Join the Network
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-8">
                <h3 className="font-semibold mb-6">Membership Requirements</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium">Valid state license</p>
                      <p className="text-sm text-muted-foreground">In your trade category</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium">General liability insurance</p>
                      <p className="text-sm text-muted-foreground">$500K minimum coverage</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium">Background check</p>
                      <p className="text-sm text-muted-foreground">Clean record required</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium">24-hour response commitment</p>
                      <p className="text-sm text-muted-foreground">Consultation confirmation</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-2xl p-8">
                <p className="text-xs text-[var(--color-subtle)] uppercase tracking-widest mb-6">Contractor dashboard preview</p>
                <div className="space-y-3">
                  {[
                    { label: 'Open projects near you', value: '14', highlight: true },
                    { label: 'Projects claimed this month', value: '6', highlight: false },
                    { label: 'Avg. budget ceiling', value: '$6,200', highlight: false },
                    { label: 'Consultation rate', value: '94%', highlight: false },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
                      <span className="text-sm text-[var(--color-subtle)]">{label}</span>
                      <span className={`text-sm font-bold ${highlight ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)]'}`}>{value}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 bg-[var(--color-primary)] text-black font-bold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors text-sm">
                  Apply as a Contractor
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who We Serve ── */}
      <section className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Who we serve</h2>
            <p className="mt-2 text-muted-foreground">Property owners and operators who need reliable contractor coordination</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: HomeIcon,  title: "Homeowners",        description: "Remodeling, home projects, restoration, prevention services, upgrades, and repairs." },
              { icon: Building2, title: "Property Managers", description: "Full maintenance lifecycle, turnover, repairs, and emergency maintenance." },
              { icon: Users,     title: "Landlords",         description: "Available 24/7, skilled in all major trades — your on-demand maintenance support." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-background p-6">
                <item.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Property Managers ── */}
      <section id="property-managers" className="py-20 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)] mb-3">For Property Managers</p>
          <h2 className="text-[2rem] font-black tracking-tight mb-5">Manage multiple properties.<br />One place.</h2>
          <p className="text-[var(--color-subtle)] text-[14px] leading-relaxed mb-12 max-w-xl mx-auto">
            Submit projects across your entire portfolio and track each one from claim to completion. Every contractor is verified — so you never have to guess who is showing up.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            {[
              { title: 'Portfolio-wide submissions', body: 'Submit projects across all your properties from a single account.' },
              { title: 'Verified contractors only',  body: 'Every contractor on the platform is licensed and insured — no exceptions.' },
              { title: 'Full project records',       body: 'Photos, scopes, budgets, and timelines stored for every completed job.' },
            ].map(({ title, body }) => (
              <div key={title} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
                <h3 className="font-bold text-[14px] mb-2.5">{title}</h3>
                <p className="text-[var(--color-subtle)] text-[13px] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / Contact ── */}
      <section id="contact" className="py-20 px-6 lg:px-10 bg-[var(--color-surface)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4 text-balance tracking-tight">Ready to hire with confidence?</h2>
          <p className="text-[var(--color-subtle)] mb-10 leading-relaxed text-sm">
            Join Nexus Operations — submit your first project free and get matched with a verified contractor in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <button className="h-11 px-7 bg-[var(--color-primary)] text-black text-[13px] font-bold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors">
              Start Your Project — Free
            </button>
            <button className="h-11 px-7 border border-[var(--color-border)] text-[var(--color-foreground)] text-[13px] font-semibold rounded-full hover:bg-[var(--color-surface-raised)] transition-colors">
              Apply as a Contractor
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:admin@nexusoperations.org"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              <Mail className="h-4 w-4" />
              admin@nexusoperations.org
            </a>
            <a
              href="tel:9139511711"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              <Phone className="h-4 w-4" />
              (913) 951-1711
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Image
                src="/nexus-logo.png"
                alt="Nexus Operations"
                width={140}
                height={47}
                style={{ height: "36px", width: "auto" }}
              />
              <p className="mt-4 text-sm text-muted-foreground">
                The Nexus Promise is that we will always follow our best practices, and yours.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Platform</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
                <li><a href="#services" className="hover:text-foreground">Service Categories</a></li>
                <li><a href="#start" className="hover:text-foreground">Submit a Request</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Contractors</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#contractors" className="hover:text-foreground">Join the Network</a></li>
                <li><a href="#contractors" className="hover:text-foreground">Membership Plans</a></li>
                <li><a href="#contractors" className="hover:text-foreground">Verification Process</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:admin@nexusoperations.org" className="hover:text-foreground">Contact</a></li>
                <li><a href="https://nexusoperations.zendesk.com/hc/en-us" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Help Center</a></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Nexus Operations, LLC. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Serving Topeka, KS and surrounding areas
            </p>
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
