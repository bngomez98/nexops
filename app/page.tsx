'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Menu, X, MapPin, ArrowRight, Phone, Mail,
  CheckCircle2, Clock, Shield, Zap, BarChart3,
  Users, Wrench, ChevronRight, Star, TreePine, Hammer,
  Home, Bolt, Droplets, Wind, Fence,
} from 'lucide-react'
import { CONTACT_INFO } from '@/lib/contact-info'

const services = [
  { name: 'Tree Removal',   desc: 'Removal, trimming, stump grinding, and storm damage assessment.',      icon: TreePine },
  { name: 'Concrete Work',  desc: 'Driveways, patios, sidewalks, foundation repair, and decorative concrete.', icon: Hammer },
  { name: 'Roofing',        desc: 'Shingle replacement, metal roofing, leak repair, and storm restoration.', icon: Home },
  { name: 'HVAC',           desc: 'Installation, repair, and maintenance for all heating and cooling systems.', icon: Wind },
  { name: 'Fencing',        desc: 'Wood, vinyl, chain link, and iron fencing installation and repair.',    icon: Fence },
  { name: 'Electrical',     desc: 'Panel upgrades, wiring, outlet installation, lighting, and code compliance.', icon: Bolt },
  { name: 'Plumbing',       desc: 'Water lines, drain services, fixture installation, and emergency repairs.', icon: Droplets },
  { name: 'General Repair', desc: 'Handyman services, minor repairs, and ongoing home maintenance.',       icon: Wrench },
]

const stats = [
  { value: '8',    label: 'Trade categories' },
  { value: '$0',   label: 'Contractor cost' },
  { value: '1',    label: 'Contractor per request' },
  { value: '100%', label: 'Manually reviewed' },
]

const steps = [
  { step: '01', title: 'Submit your request',    desc: 'Describe the work needed, upload photos, and set a budget ceiling. Takes under three minutes.' },
  { step: '02', title: 'We assign a contractor', desc: 'Nexus reviews your request and assigns one verified contractor from our network, matched by trade and location.' },
  { step: '03', title: 'Work gets done',          desc: 'Your contractor contacts you directly, schedules the visit, and completes the project on your timeline.' },
  { step: '04', title: 'Keep a complete record',  desc: 'Every completed project is saved in a permanent record with costs, timelines, photos, and follow-up details.' },
]

export default function HomePage() {
  const [scrollPct, setScrollPct] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navLinks = [
    { href: '#services',     label: 'Services' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#who-we-serve', label: 'Who We Serve' },
    { href: '#pricing',      label: 'Pricing' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0
      setScrollPct(Math.min(pct, 100))
      setScrolled(window.scrollY > 24)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main id="main-content" className="min-h-screen bg-background font-sans overflow-x-hidden">

      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 z-[60] h-[2px] bg-primary transition-[width] duration-75"
        style={{ width: `${scrollPct}%` }}
        aria-hidden
      />

      {/* Header */}
      <header
        className={`fixed top-[2px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-border/60 bg-background/95 backdrop-blur-xl shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 lg:px-8 h-16">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={120}
              height={40}
              style={{ height: '26px', width: 'auto' }}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground md:block"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-full bg-primary px-4 py-2 text-[12.5px] font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-md shadow-sm"
            >
              Get Started
            </Link>
            <button
              className="md:hidden p-1.5 text-muted-foreground hover:text-foreground transition rounded-md hover:bg-muted/60"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background/98 backdrop-blur-xl animate-fade-in">
            <div className="mx-auto max-w-6xl px-6 py-4 space-y-1">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-[13.5px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition"
                >
                  {label}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-border flex gap-4 px-3">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="text-[13px] font-semibold text-primary hover:underline underline-offset-4"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="hero" className="relative pt-32 pb-24 lg:pt-44 lg:pb-32 overflow-hidden">
        <div className="hero-radial pointer-events-none absolute inset-0" aria-hidden />
        {/* Subtle dot grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, oklch(0.10 0.015 264) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div
            className="inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[11.5px] text-primary font-medium animate-fade-up"
            style={{ animationDelay: '0.05s' }}
          >
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span>{CONTACT_INFO.serviceArea}</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_440px] lg:items-center">
            <div>
              <h1
                className="font-heading text-[52px] font-bold tracking-[-0.025em] leading-[1.05] md:text-[68px] lg:text-[80px] text-balance animate-fade-up"
                style={{ animationDelay: '0.12s' }}
              >
                Property maintenance,{' '}
                <span className="text-gradient">handled</span>{' '}
                from start to finish.
              </h1>

              <div className="mt-7 max-w-xl animate-fade-up" style={{ animationDelay: '0.22s' }}>
                <p className="text-[16px] text-muted-foreground leading-[1.85]">
                  Nexus Operations coordinates maintenance and repair work for property owners and managers in the Topeka area. Submit a request, we assign a verified contractor, manage the project, and give you a permanent record when it&apos;s done.
                </p>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: '0.32s' }}>
                <Link
                  href="/auth/sign-up"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[13.5px] font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-xl shadow-lg shadow-primary/20"
                >
                  Create an account
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/auth/sign-up?role=contractor"
                  className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition hover:text-foreground"
                >
                  Join as a contractor
                  <ChevronRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 animate-fade-up" style={{ animationDelay: '0.42s' }}>
                {[
                  { icon: Shield, text: 'Verified contractors only' },
                  { icon: Zap,    text: 'Same-day contractor assignment' },
                  { icon: Star,   text: 'No fees for contractors to join' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 flex-shrink-0">
                      <Icon className="h-3 w-3 text-primary" />
                    </div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard preview card */}
            <div
              className="hidden lg:block relative rounded-2xl glow-primary shimmer-border overflow-hidden animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-primary/5 border border-border/40" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] font-mono-label text-muted-foreground">Portfolio Overview</p>
                    <h3 className="text-[15px] font-semibold mt-0.5">Maintenance Dashboard</h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-semibold text-primary">Live</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Active projects',   value: '3',   change: '+2 this week',    color: 'text-primary' },
                    { label: 'Completed (30d)',    value: '7',   change: 'up 40% vs prior', color: 'text-emerald-600' },
                    { label: 'Overdue intervals', value: '2',   change: 'HVAC, Plumbing',  color: 'text-amber-600' },
                    { label: 'Cost efficiency',   value: '94%', change: 'vs. regional avg', color: 'text-primary' },
                  ].map(({ label, value, change, color }) => (
                    <div key={label} className="rounded-xl border border-border/60 bg-background/60 p-3">
                      <p className="text-[10px] text-muted-foreground font-medium mb-1">{label}</p>
                      <p className={`text-[20px] font-bold ${color}`}>{value}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">{change}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-border/60 bg-background/60 p-3">
                  <p className="text-[10px] font-mono-label text-muted-foreground mb-3">Recent activity</p>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Roofing inspection', status: 'In Progress', dot: 'bg-primary' },
                      { label: 'HVAC maintenance',   status: 'Assigned',    dot: 'bg-violet-500' },
                      { label: 'Plumbing repair',    status: 'Completed',   dot: 'bg-emerald-500' },
                    ].map(({ label, status, dot }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />
                          <span className="text-[11.5px] text-foreground/80">{label}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/60 rounded-2xl overflow-hidden border border-border/60 animate-fade-up"
            style={{ animationDelay: '0.5s' }}
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-card px-6 py-6 text-center">
                <p className="text-[32px] font-bold text-gradient tracking-tight">{value}</p>
                <p className="text-[12px] text-muted-foreground mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Services */}
      <section id="services" className="py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-14">
            <p className="font-mono-label text-primary mb-4">What we coordinate</p>
            <h2 className="font-heading text-[36px] font-bold leading-[1.15] tracking-[-0.02em] max-w-2xl text-balance">
              Eight trade categories. One platform.
            </h2>
            <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed max-w-xl">
              Every request is reviewed by Nexus before it reaches a contractor. You get one point of contact, not a list of bids.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ name, desc, icon: Icon }) => (
              <div
                key={name}
                className="group rounded-xl border border-border/60 bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 glow-card glow-card-hover"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/8 group-hover:bg-primary/12 transition-colors">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <h3 className="text-[14px] font-semibold text-foreground mb-1.5">{name}</h3>
                <p className="text-[12.5px] text-muted-foreground leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-primary hover:underline underline-offset-4"
            >
              View all services <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* How It Works */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-14">
            <p className="font-mono-label text-primary mb-4">The process</p>
            <h2 className="font-heading text-[36px] font-bold leading-[1.15] tracking-[-0.02em] max-w-2xl text-balance">
              From request to record in four steps.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ step, title, desc }, i) => (
              <div key={step} className="relative bg-card rounded-xl border border-border/60 p-5 glow-card glow-card-hover hover:border-primary/25">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground shrink-0">
                    <span className="text-[12px] font-bold">{step}</span>
                  </div>
                  {i < steps.length - 1 && (
                    /* top aligns to center of the 36px (2.25rem) circle at 20px (1.25rem) card padding */
                    <div className="hidden lg:block absolute top-[calc(1.25rem+1.125rem)] left-[calc(100%-8px)] w-6 h-px bg-primary/20 z-10" />
                  )}
                </div>
                <h3 className="text-[14px] font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-[12.5px] text-muted-foreground leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Who We Serve */}
      <section id="who-we-serve" className="py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="font-mono-label text-primary mb-4">Who we work with</p>
            <h2 className="font-heading text-[36px] font-bold leading-[1.15] tracking-[-0.02em] max-w-2xl mx-auto text-balance">
              One platform for owners, managers, and the contractors who do the work.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: Users,
                title: 'Homeowners',
                body: "Submit a request, approve an estimate, and watch it close. Nexus handles contractor selection, scheduling, and documentation so you don't have to.",
                cta: 'Create account',
                href: '/auth/sign-up',
                accentColor: 'text-sky-600',
                iconBg: 'bg-sky-50 border-sky-200',
                accent: 'hover:border-sky-200/60',
              },
              {
                icon: Wrench,
                title: 'Contractors',
                body: 'Receive project notifications in your trade with scope, photos, and a budget ceiling already attached. Claim what works for you. No fees, no percentages.',
                cta: 'Apply for access',
                href: '/auth/sign-up?role=contractor',
                accentColor: 'text-primary',
                iconBg: 'bg-primary/8 border-primary/20',
                accent: 'hover:border-primary/30',
              },
              {
                icon: BarChart3,
                title: 'Property Managers',
                body: 'Every property you manage lives in one place. Track maintenance spend by address, by trade, and across the whole portfolio with nothing to reconcile manually.',
                cta: 'Create account',
                href: '/auth/sign-up?role=property_manager',
                accentColor: 'text-violet-600',
                iconBg: 'bg-violet-50 border-violet-200',
                accent: 'hover:border-violet-200/60',
              },
            ].map(({ icon: Icon, title, body, cta, href, accentColor, iconBg, accent }) => (
              <Link
                key={title}
                href={href}
                className={`group rounded-2xl border border-border/60 bg-card p-7 transition-all duration-200 ${accent} hover:shadow-lg hover:-translate-y-1 glow-card`}
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border ${iconBg} mb-5`}>
                  <Icon className={`h-5 w-5 ${accentColor}`} />
                </div>
                <h3 className="text-[17px] font-bold text-foreground mb-3">{title}</h3>
                <p className="text-[13.5px] text-muted-foreground leading-[1.75] mb-5">{body}</p>
                <span className={`inline-flex items-center gap-1.5 text-[12.5px] font-semibold ${accentColor} group-hover:gap-2.5 transition-all`}>
                  {cta} <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Reporting */}
      <section id="reporting" className="py-24 lg:py-32 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-mono-label text-primary mb-4">Data-driven reporting</p>
              <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.02em] max-w-xl text-balance mb-6">
                When a project closes, the record stays.
              </h2>
              <div className="space-y-4 text-[14.5px] text-muted-foreground leading-[1.9]">
                <p>
                  <strong className="text-foreground">Every completed project generates a post-project report automatically.</strong>{' '}
                  It covers what was done, what it cost, how long it took, and what should be scheduled next.
                </p>
                <p>
                  <strong className="text-foreground">Reports get more useful the longer you&apos;re on the platform.</strong>{' '}
                  After a few projects, patterns start to emerge — recurring issues, trade categories that run over budget, maintenance intervals you&apos;ve let slide.
                </p>
                <p>
                  <strong className="text-foreground">Your service record is yours to keep and use.</strong>{' '}
                  When it&apos;s time to file an insurance claim, refinance, or prepare for a sale, the Nexus record gives you a timestamped, documented answer.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground hover:opacity-90 transition shadow-sm"
                >
                  Start tracking your property <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden glow-card">
              <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
                <p className="text-[11px] font-mono-label text-muted-foreground">Post-project report contents</p>
              </div>
              <div className="divide-y divide-border/40">
                {[
                  ['Financial summary',      'Total cost, labor vs. materials, variance from budget.'],
                  ['Efficiency metrics',     'Time to completion, contractor response, scheduling.'],
                  ['Historical comparison',  'Cost and timeline vs. prior projects in same trade.'],
                  ['Maintenance intervals',  'Recommended next service date based on property history.'],
                  ['Follow-up items',        'Issues identified during the project needing attention.'],
                  ['Recurring issue flags',  'Patterns detected across multiple projects at same address.'],
                  ['Portfolio benchmarking', 'For managers: performance comparison across addresses.'],
                ].map(([item, detail]) => (
                  <div key={item} className="px-5 py-3.5 flex items-start gap-3">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12.5px] font-semibold text-foreground">{item}</p>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5 leading-relaxed">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Pricing */}
      <section id="pricing" className="py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="font-mono-label text-primary mb-4">Pricing</p>
            <h2 className="font-heading text-[36px] font-bold leading-[1.15] tracking-[-0.02em] max-w-2xl mx-auto text-balance">
              Pay for work completed, not retainers.
            </h2>
            <p className="mt-4 text-[15px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Nexus charges a transparent markup on completed maintenance work. No subscriptions. No hidden fees. Aligned with delivery.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                name: 'Routine',
                markup: '25%',
                sla: 'Assigned within 24 hrs · On-site within 3–5 days',
                desc: 'Standard maintenance that is not time-sensitive. Scheduled repairs, cosmetic fixes, planned replacements.',
                highlighted: false,
              },
              {
                name: 'Urgent',
                markup: '30%',
                sla: 'Assigned within 4 hrs · On-site next business day',
                desc: 'Issues requiring prompt attention — non-emergency plumbing, electrical affecting livability, HVAC in moderate weather.',
                highlighted: true,
              },
              {
                name: 'Emergency',
                markup: '35%',
                sla: 'Assigned within 1 hr · On-site within 4 hrs',
                desc: 'Critical failures requiring immediate response — burst pipes, gas leaks, electrical hazards, HVAC in extreme weather.',
                highlighted: false,
              },
            ].map(({ name, markup, sla, desc, highlighted }) => (
              <div
                key={name}
                className={`rounded-2xl border p-7 transition-all ${
                  highlighted
                    ? 'border-primary/40 bg-gradient-to-b from-primary/8 to-primary/3 shadow-xl shadow-primary/10 ring-1 ring-primary/20 scale-[1.02]'
                    : 'border-border/60 bg-card glow-card'
                }`}
              >
                {highlighted && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold mb-4">
                    <Zap className="h-2.5 w-2.5" /> Most common
                  </div>
                )}
                <h3 className="text-[16px] font-bold text-foreground mb-1">{name}</h3>
                <p className={`text-[34px] font-bold tracking-tight mb-1 ${highlighted ? 'text-gradient' : 'text-primary'}`}>
                  {markup} <span className="text-[14px] font-normal text-muted-foreground">markup</span>
                </p>
                <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">{sla}</p>
                <p className="text-[12.5px] text-muted-foreground leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-primary hover:underline underline-offset-4"
            >
              View full pricing details <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Contractors */}
      <section id="contractors" className="py-24 lg:py-32 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-mono-label text-primary mb-4">For contractors</p>
              <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.02em] max-w-xl text-balance mb-6">
                If you&apos;re a licensed contractor in the Topeka area, the Nexus network is worth a few minutes of your time.
              </h2>
              <div className="space-y-4 text-[14.5px] text-muted-foreground leading-[1.9]">
                <p>
                  There&apos;s no cost to join and no ongoing fee to stay active. When a project comes in that matches your trade and service area, you&apos;re notified. You decide if it works.
                </p>
                <p>
                  Every notification includes the full project file: photos, a written scope, and the owner&apos;s budget ceiling, already reviewed by Nexus before it reaches you.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/auth/sign-up?role=contractor"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground hover:opacity-90 transition shadow-sm"
                >
                  Apply for network access <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/contractors"
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition"
                >
                  Learn more <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { icon: CheckCircle2, title: 'No joining fee',            desc: 'Free to join, free to stay active. No monthly costs.' },
                { icon: Shield,       title: 'Pre-screened projects',     desc: 'Every request is reviewed before it reaches you.' },
                { icon: Clock,        title: 'You control your schedule', desc: 'Claim only the projects that work for your timeline.' },
                { icon: Zap,          title: 'Full project details',      desc: 'Photos, scope, and budget ceiling included in every notification.' },
                { icon: BarChart3,    title: 'Direct payment',            desc: 'You get paid directly by the property owner. Nexus takes no percentage.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 rounded-xl border border-border/60 bg-card p-4 glow-card">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[13.5px] font-semibold text-foreground">{title}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/8 via-card to-primary/3 p-10 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.48_0.155_142_/_0.12),transparent)]" aria-hidden />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_80%_80%,oklch(0.62_0.18_200_/_0.06),transparent)]" aria-hidden />
            <div className="relative">
              <p className="font-mono-label text-primary mb-4">Get started today</p>
              <h2 className="font-heading text-[36px] font-bold leading-[1.15] tracking-[-0.02em] max-w-2xl mx-auto text-balance mb-5">
                Ready to simplify your property maintenance?
              </h2>
              <p className="text-[15px] text-muted-foreground max-w-xl mx-auto mb-9 leading-relaxed">
                Create an account in minutes. Submit your first request the same day. Nexus handles the rest.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[14px] font-semibold text-primary-foreground hover:opacity-90 transition shadow-lg shadow-primary/20 hover:shadow-xl"
                >
                  Create an account <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-sm px-7 py-3.5 text-[14px] font-medium text-foreground hover:border-primary/30 hover:bg-card transition"
                >
                  Contact us
                </Link>
              </div>

              <div className="mt-10 pt-8 border-t border-border/60 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 max-w-3xl mx-auto text-left">
                {[
                  { href: '/auth/sign-up',                       label: 'Homeowner account',        sub: 'Submit requests and track projects.' },
                  { href: '/auth/sign-up?role=property_manager', label: 'Property manager account',  sub: 'Portfolio-level visibility.' },
                  { href: '/auth/sign-up?role=contractor',       label: 'Contractor application',    sub: 'Join the verified contractor network.' },
                  { href: '/faq',                                label: 'FAQ',                       sub: 'Platform details and policies.' },
                ].map(({ href, label, sub }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex items-center justify-between rounded-lg border border-border/60 bg-card/60 px-4 py-3 hover:border-primary/30 hover:bg-card transition-all"
                  >
                    <div>
                      <p className="text-[12.5px] font-semibold text-foreground">{label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-14">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 mb-12">
            <div>
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/nexus-logo.png"
                  alt="Nexus Operations"
                  width={110}
                  height={37}
                  style={{ height: '24px', width: 'auto' }}
                />
              </Link>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">
                Managed property services for homeowners, landlords, and property managers in {CONTACT_INFO.cityState}.
              </p>
              <div className="flex flex-col gap-1.5">
                <a href={CONTACT_INFO.phoneHref} className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition">
                  <Phone className="h-3 w-3" /> {CONTACT_INFO.phoneDisplay}
                </a>
                <a href={`mailto:${CONTACT_INFO.email}`} className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition">
                  <Mail className="h-3 w-3" /> {CONTACT_INFO.email}
                </a>
              </div>
            </div>

            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">Platform</p>
              <ul className="space-y-2.5">
                {[
                  { href: '#services',     label: 'Services' },
                  { href: '#how-it-works', label: 'How It Works' },
                  { href: '#reporting',    label: 'Reporting' },
                  { href: '/pricing',      label: 'Pricing' },
                  { href: '/faq',          label: 'FAQ' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="text-[12px] text-muted-foreground hover:text-foreground transition">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">Accounts</p>
              <ul className="space-y-2.5">
                {[
                  { href: '/auth/sign-up',                       label: 'Homeowner' },
                  { href: '/auth/sign-up?role=property_manager', label: 'Property Manager' },
                  { href: '/auth/sign-up?role=contractor',       label: 'Contractor Application' },
                  { href: '/auth/login',                         label: 'Sign In' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-[12px] text-muted-foreground hover:text-foreground transition">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">Company</p>
              <ul className="space-y-2.5">
                {[
                  { href: '/about',    label: 'About Us' },
                  { href: '/contact',  label: 'Contact' },
                  { href: '/terms',    label: 'Terms of Service' },
                  { href: '/privacy',  label: 'Privacy Policy' },
                  { href: '/site-map', label: 'Sitemap' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-[12px] text-muted-foreground hover:text-foreground transition">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11.5px] text-muted-foreground">
            <p>&copy; 2026 {CONTACT_INFO.companyName}. {CONTACT_INFO.cityState}. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link href="/terms"    className="hover:text-foreground transition">Terms</Link>
              <Link href="/privacy"  className="hover:text-foreground transition">Privacy</Link>
              <Link href="/site-map" className="hover:text-foreground transition">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
