"use client"

// Fixed: Removed orphaned stats bar code
import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, ArrowRight, MapPin, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState, useRef } from "react"

const services: Array<{ name: string; desc: string }> = [
  { name: "Roofing",        desc: "Full replacements, storm damage assessment, leak repairs, and insurance restoration work." },
  { name: "HVAC",           desc: "Central air, heat pumps, ductless mini-splits, furnace replacement, and annual maintenance." },
  { name: "Electrical",     desc: "Panel upgrades, circuit additions, rewiring, subpanel installation, and EV charger rough-in." },
  { name: "Plumbing",       desc: "Water heaters, leak detection, drain clearing, main line repair, and fixture replacement." },
  { name: "Concrete",       desc: "Driveways, patios, sidewalks, foundation repair, and structural flatwork." },
  { name: "Tree Removal",   desc: "Removal, crown reduction, stump grinding, and post-storm emergency response." },
  { name: "Fencing",        desc: "Privacy, chain link, vinyl, wood, and commercial perimeter fencing." },
  { name: "General Repair", desc: "Drywall, carpentry, painting, door and window replacement, and interior repairs." },
]

const navLinks = [
  { href: "#about",       label: "About" },
  { href: "#platform",    label: "Platform" },
  { href: "#services",    label: "Services" },
  { href: "#process",     label: "Process" },
  { href: "#contractors", label: "Contractors" },
  { href: "#contact",     label: "Contact" },
]

export default function HomePage() {
  const [mobileOpen, setMobileOpen]       = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [scrollPct, setScrollPct]         = useState(0)
  const statsRef = useRef<HTMLDivElement>(null)

  /* ── Scroll progress bar ── */
  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      setScrollPct((scrollTop / (scrollHeight - clientHeight)) * 100)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* ── Active nav section ── */
  useEffect(() => {
    const ids = navLinks.map(l => l.href.replace("#", ""))
    const observers: IntersectionObserver[] = []
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id) },
        { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
      )
      io.observe(el)
      observers.push(io)
    })
    return () => observers.forEach(io => io.disconnect())
  }, [])

  /* ── Scroll-triggered fade animations ── */
  useEffect(() => {
    const els = document.querySelectorAll("[data-animate]")
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  /* ── Stats pop animation trigger ── */
  useEffect(() => {
    if (!statsRef.current) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { io.disconnect() } },
      { threshold: 0.5 }
    )
    io.observe(statsRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <main className="min-h-screen bg-background font-sans overflow-x-hidden">

      {/* ── Scroll progress bar ── */}
      <div
        className="fixed top-0 left-0 z-[60] h-[2px] bg-primary transition-[width] duration-75"
        style={{ width: `${scrollPct}%` }}
        aria-hidden
      />

      {/* ── Header ── */}
      <header className="fixed top-[2px] left-0 right-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 h-14">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={150}
              height={50}
              style={{ height: "28px", width: "auto" }}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {[
              { href: "#about",        label: "About" },
              { href: "#mission",      label: "Mission" },
              { href: "#who-we-serve", label: "Who We Serve" },
              { href: "#services",     label: "Services" },
              { href: "#process",      label: "Process" },
              { href: "#reporting",    label: "Reporting" },
              { href: "#contractors",  label: "Contractors" },
              { href: "#contact",      label: "Contact" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="px-3.5 py-1 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main">
            {navLinks.map(({ href, label }) => {
              const id = href.replace("#", "")
              const active = activeSection === id
              return (
                <a
                  key={href}
                  href={href}
                  className={`px-3.5 py-1.5 text-[12.5px] rounded-full transition-all duration-200 ${
                    active
                      ? "text-primary bg-primary/10 font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/auth/login"
              className="hidden text-[12.5px] text-muted-foreground transition-colors hover:text-foreground md:block"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-full bg-primary px-4 py-1.5 text-[12px] font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Create Account
            </Link>
            <button
              className="md:hidden p-1.5 text-muted-foreground hover:text-foreground transition"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-slide-down">
            <div className="px-8 py-5 space-y-1">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-[13px] text-muted-foreground hover:text-foreground transition"
                >
                  {label}
                </a>
              ))}
              <div className="pt-4 mt-3 border-t border-border flex gap-5">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-[13px] text-muted-foreground hover:text-foreground transition"
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

      {/* ── Hero ── */}
      <section id="hero" className="relative pt-36 pb-28 overflow-hidden">
        <div className="hero-radial pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-8">
          <div className="flex items-center gap-2 mb-12 animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
            <span className="text-[12px] text-muted-foreground font-mono">
              Topeka, Kansas — Shawnee County and surrounding areas
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_480px] lg:items-center">
            <div>
              <h1 className="text-[56px] font-bold tracking-[-0.02em] leading-[1.0] md:text-[72px] lg:text-[84px] text-balance">
                Property service<br />management for<br />
                <span className="text-muted-foreground/40">Topeka, Kansas.</span>
              </h1>

              <div className="mt-8 space-y-4 max-w-2xl">
                <p className="text-[15px] text-muted-foreground leading-[1.85]">
                  Nexus Operations is a property service management company based in Topeka, Kansas. We receive service requests from homeowners and property managers, assign a single verified contractor per project, and document every stage — from the initial submission through the final cost record.
                </p>
                <p className="text-[15px] text-muted-foreground leading-[1.85]">
                  Every contractor in the network is licensed, insured, and approved by Nexus staff before receiving any project. Service history is stored permanently and used to generate property-specific maintenance reports and recommendations.
                {/* Hero headline */}
              <h1
                className="font-heading text-[52px] font-bold tracking-[-0.02em] leading-[1.05] md:text-[68px] lg:text-[78px] text-balance animate-fade-up"
                style={{ animationDelay: "0.12s" }}
              >
                Managed property services<br />
                for Topeka, Kansas.<br />
                <span className="text-primary inline-block">One verified contractor,</span><br />
                <span className="text-primary inline-block">exclusively yours.</span>
              </h1>

              <div className="mt-8 max-w-xl space-y-4 animate-fade-up" style={{ animationDelay: "0.22s" }}>
                <p className="text-[15px] text-muted-foreground leading-[1.8]">
                  Submit your service request once. Nexus assigns a licensed, insured contractor from our verified network — one contractor per project, held exclusively through completion. No bidding, no cold calls, no ambiguity.
                </p>
                <p className="text-[13.5px] text-muted-foreground/70 leading-[1.75]">
                  Every project is documented and stored permanently on your account. Over time, your service history becomes a verified asset for insurance claims, refinancing, and resale — and a single source of truth for property managers tracking spend across an entire portfolio.
                One verified contractor.<br />
                <span className="text-primary inline-block">Exclusively yours.</span>
              </h1>

              <div className="mt-8 max-w-xl space-y-4 animate-fade-up" style={{ animationDelay: "0.22s" }}>
                <p className="text-[16px] text-muted-foreground leading-[1.85]">
                  Nexus Operations connects homeowners and property managers in Topeka, Kansas with licensed, insured contractors — one per request, assigned exclusively. No bidding wars. No cold calls. Fully managed from submission through completion.
                </p>
                <p className="text-[14px] text-muted-foreground/70 leading-[1.7]">
                  Submit a request with photos and scope. Nexus reviews it, assigns one verified contractor, and confirms your consultation within 24 hours. Your contractor holds the project exclusively from start to finish.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 animate-fade-up" style={{ animationDelay: "0.32s" }}>
                <Link
                  href="/auth/sign-up"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-[13px] font-semibold text-primary-foreground transition-all hover:opacity-90"
                >
                  Submit a service request
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href="tel:+17854280244"
                  className="text-[13px] text-muted-foreground transition hover:text-foreground"
                >
                  (785) 428-0244
                </a>
              </div>
            </div>

            {/* Vertical stat strip */}
            <div className="hidden lg:flex flex-col divide-y divide-border border-t border-b border-border">
              {[
                { n: "8",    label: "Trade categories" },
                { n: "1",    label: "Contractor per project" },
                { n: "100%", label: "Manual review" },
                { n: "∞",    label: "Permanent records" },
              ].map(({ n, label }) => (
                <div key={label} className="py-5 px-1">
                  <p className="text-2xl font-bold tracking-tight text-foreground">{n}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
                  Create your account
                  Get started — it&apos;s free
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/auth/sign-up?role=contractor"
                  className="group inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition hover:text-foreground"
                >
                  Apply to the contractor network
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </div>
            </div>

            {/* Hero panel: How it works */}
            <div
              ref={statsRef}
              className="hidden lg:block relative overflow-hidden rounded-2xl border border-border/40 bg-card glow-primary animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-8">
                  How it works
                </p>

                <div className="space-y-0">
                  {[
                    {
                      n: "01",
                      title: "Submit your request",
                      body: "Add photos, describe the work needed, and set a budget. Free for homeowners.",
                    },
                    {
                      n: "02",
                      title: "Nexus reviews and assigns",
                      body: "Our team reviews your request and assigns one licensed, insured contractor from the verified network.",
                    },
                    {
                      n: "03",
                      title: "Consultation within 24 hours",
                      body: "Your assigned contractor contacts you to schedule a site visit. No bidding. No competition.",
                    },
                    {
                      n: "04",
                      title: "One contractor, start to finish",
                      body: "Your contractor holds the project exclusively through estimate approval and completion.",
                    },
                  ].map(({ n, title, body }, i, arr) => (
                    <div
                      key={n}
                      className={`flex gap-5 py-6 ${i < arr.length - 1 ? "border-b border-border/40" : ""}`}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary">{n}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-foreground mb-1">{title}</p>
                        <p className="text-[12.5px] text-muted-foreground leading-relaxed">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border/40">
                  <Link
                    href="/auth/sign-up"
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-[12.5px] font-semibold text-primary-foreground transition-all hover:opacity-90"
                  >
                    Submit a request — it&apos;s free
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
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
                body: "Submit your project once with photos and scope. Nexus assigns a verified contractor, schedules the consultation, and manages the job through completion. Your service history is stored permanently.",
                cta: "Create an account",
                href: "/auth/sign-up",
              },
              {
                title: "Contractors",
                body: "Receive pre-documented project notifications in your trade and service area. Review scope, photos, and budget before you decide to claim. Get paid directly — no platform fees or referral cuts.",
                cta: "Apply for network access",
                href: "/auth/sign-up?role=contractor",
              },
              {
                title: "Property Managers",
                body: "One account covers your entire portfolio. Track maintenance spend by property and by trade category. Identify recurring issues and overdue service intervals across all managed addresses.",
                cta: "Create an account",
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
              caption: "One verified, insured contractor. No bidding wars. No cold calls.",
            },
            {
              src:     "/photo-manager.jpg",
              label:   "For Property Managers",
              caption: "Portfolio-level spend tracking across every managed address.",
            },
            {
              src:     "/photo-contractor.jpg",
              label:   "For Contractors",
              caption: "Pre-validated project leads. No platform fees. Direct payment.",
      {/* ── Photo Banner: Three user types ── */}
      <section className="overflow-hidden border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            {
              src:     "/photo-homeowner.jpg",
              label:   "Homeowners",
              caption: "Submit a request with photos and scope. Nexus assigns one verified contractor, exclusively.",
              href:    "/auth/sign-up",
              cta:     "Create account",
            },
            {
              src:     "/photo-manager.jpg",
              label:   "Property Managers",
              caption: "Submit and track service requests across all your properties from one dashboard.",
              href:    "/auth/sign-up?role=property_manager",
              cta:     "Create account",
            },
            {
              src:     "/photo-contractor.jpg",
              label:   "Contractors",
              caption: "Claim qualified project leads in your trade and service area. No fees, no bidding, no cuts.",
              href:    "/auth/sign-up?role=contractor",
              cta:     "Apply for access",
            },
          ].map(({ src, label, caption, href, cta }) => (
            <Link
              key={label}
              href={href}
              className="photo-card group relative block h-72 md:h-80 overflow-hidden bg-muted"
            >
              <div className="photo-card-inner absolute inset-0">
                <Image
                  src={src}
                  alt={label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/88 via-background/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-mono-label text-primary mb-1.5">{label}</p>
                <p className="text-[13px] text-foreground/90 leading-relaxed mb-3">{caption}</p>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-primary transition-all group-hover:gap-2.5">
                  {cta} <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── About ── */}
      <section id="about" className="py-28">
        <div className="mx-auto max-w-6xl px-8">
          <div className="grid gap-20 lg:grid-cols-[1fr_380px] lg:items-start">

            <div className="space-y-7">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary">About Nexus Operations</p>
              <h2 className="text-[34px] font-bold leading-[1.15] tracking-[-0.01em] text-balance">
                We exist to bring accountability and documentation to property maintenance — a space where both have historically been absent.
              </h2>
              <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9]">
                <p>
                  Our mission is to give property owners a reliable, documented record of every maintenance and repair decision made on their property — and to give licensed contractors a direct pipeline to pre-qualified projects without the overhead of marketing or competitive bidding.
                </p>
                <p>
                  Most property maintenance is transactional and undocumented. Work is sourced informally, estimates are verbal, and once a project closes, the details disappear. Nexus is built around the premise that documented service history has real value — for owners managing costs, for managers overseeing portfolios, and for properties at the point of sale or refinance.
                </p>
                <p>
                  We operate in Topeka, Kansas. Every contractor in the network holds a current trade license and active general liability insurance, verified by Nexus staff before activation. Every project generates a permanent, retrievable record.
            <div className="space-y-7" data-animate>
              <p className="font-mono-label text-primary">About Nexus Operations</p>
              <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.01em] text-balance">
                Nexus Operations is a managed property service platform headquartered in Topeka, Kansas.
              </h2>
              <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9]">
                <p>
                  <strong className="text-foreground">We manage the full lifecycle of property maintenance, repair, and improvement projects.</strong> From initial intake and documentation review through contractor assignment, consultation scheduling, estimate approval, and final completion — every step is handled on the platform and recorded permanently.
                </p>
                <p>
                  <strong className="text-foreground">Every contractor in the Nexus network is licensed, insured, and individually reviewed by Nexus staff.</strong> No account is activated automatically. Each project is assigned to one contractor, who holds it exclusively from claim through completion. Property owners receive documented estimates, real-time status updates, and a permanent service record for every project.
                </p>
                <p>
                  <strong className="text-foreground">Your service history is stored indefinitely and used to generate actionable maintenance recommendations.</strong> The Nexus reporting system flags upcoming service intervals, identifies recurring issues by trade category, and surfaces deferred maintenance items based on your property's actual records. Property managers receive portfolio-level reporting across all managed addresses.
                </p>
                <p>
                  <strong className="text-foreground">For licensed contractors, Nexus provides direct access to pre-documented, pre-validated project leads.</strong> Claimed projects include photographs, written scope, and the owner's budget ceiling — all reviewed by Nexus staff before the notification reaches you. There is no fee to join or participate in the contractor network.
                  <strong className="text-foreground">We manage property maintenance, repair, and improvement projects on behalf of homeowners and property managers in Topeka, Kansas.</strong> Our platform handles the full lifecycle of a service request: intake review, contractor assignment from a verified network, consultation scheduling, estimate approval, and project tracking from start to close.
                </p>
                <p>
                  <strong className="text-foreground">Every contractor in the Nexus network is licensed and insured.</strong> Credentials are verified by Nexus staff before network activation. Each project is assigned to a single contractor who holds it exclusively through completion — one point of contact, no competing bids, no cold calls.
                </p>
                <p>
                  <strong className="text-foreground">For licensed contractors, the Nexus network provides direct access to reviewed, ready-to-claim projects.</strong> Contractors receive notifications when requests are submitted in their trade and service area. Each claimed project includes photographs, a written scope, and the owner&apos;s budget ceiling. There is no fee to join or participate in the network.
                </p>
              </div>
            </div>

            {/* Sidebar facts */}
            <div className="text-[12.5px] border-t border-border">
              {[
                ["Founded",                 "2025"],
                ["Headquarters",            "Topeka, KS 66606"],
                ["Service area",            "Shawnee County + surrounding"],
                ["Phone",                   "(785) 428-0244"],
                ["Email",                   "admin@nexusoperations.org"],
                ["Contractors per request", "One, assigned exclusively"],
                ["Contractor verification", "License · Insurance · Manual review"],
                ["Post-project reporting",  "Included — service history, spend, maintenance advisory"],
                ["Project tracking",        "Dashboard access for all active requests"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-6 py-3.5 border-b border-border"
                >
                  <span className="text-muted-foreground shrink-0">{label}</span>
                  <span className="text-right font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Mission & Values ── */}
      <section id="mission" className="py-28 bg-surface">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-14">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary mb-5">Mission &amp; Values</p>
            <h2 className="text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-2xl text-balance">
              Property maintenance should be documented, accountable, and managed — not improvised.
          <div className="mb-14" data-animate>
            <p className="font-mono-label text-primary mb-5">Mission &amp; Values</p>
            <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-2xl text-balance">
              Every homeowner deserves a single, accountable contractor — verified, assigned exclusively, and managed through completion.
            </h2>
          </div>

          <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 border-t border-border pt-12">
            {[
              {

              },
            ].map(({ label, body }, i) => (
              <div
                key={label}
                className="value-card rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-sm"
                data-animate
                data-delay={String(i + 1)}
              >
                <p className="text-[13px] font-semibold text-foreground mb-3">{label}</p>
                <p className="text-[13px] text-muted-foreground leading-[1.8]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Who We Serve ── */}
      <section id="who-we-serve" className="py-28">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-16" data-animate>
            <p className="font-mono-label text-primary mb-5">The platform</p>
            <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-xl text-balance">
              Three account types — homeowners, property managers, and contractors — each with dedicated tools and capabilities.
            </h2>
            <p className="mt-5 text-[14.5px] text-muted-foreground leading-[1.9] max-w-2xl">
              Each account type has a distinct role and a separate set of tools. Property owners submit and track requests. Property managers do the same across multiple addresses with portfolio-level reporting. Contractors receive project notifications, claim work, and update records.
            </p>
          </div>

          <div className="divide-y divide-border border-t border-b border-border">
            {[
              {
                role: "Homeowners",
                sub:  "Single-property owners",
                body: "Your account is a service management dashboard for your property. Submit requests with photos and scope, track active projects in real time, review and approve contractor estimates, and access the complete history of everything Nexus has managed for you. Contractor selection, scheduling, and verification are handled by Nexus.",
                href: "/auth/sign-up",
                cta:  "Create account",
              },
              {
                role: "Property Managers",
                sub:  "Multi-property operators",
                body: "A single account covers your entire portfolio. Submit and track requests across all managed properties from one dashboard. Each property has its own request history. Contractor selection, scheduling, and oversight are handled by Nexus — so you manage the outcome, not the logistics.",
                href: "/auth/sign-up?role=property_manager",
                cta:  "Create account",
              },
              {
                role: "Contractors",
                sub:  "Licensed tradespeople",
                body: "Your account is a project feed. When a request is submitted in your trade and service area, you receive a notification. You decide whether to claim it. If you do, it is yours exclusively. You arrive at the job site with the full project file already in hand. There is no fee to join or participate in the network.",
                href: "/auth/sign-up?role=contractor",
                cta:  "Apply for access",
              },
            ].map(({ role, sub, body, href, cta }) => (
              <div key={role} className="grid gap-8 py-10 lg:grid-cols-[200px_1fr_180px] lg:items-start">
                <div>
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{role}</p>
                  <p className="mt-2 text-[13.5px] font-semibold text-foreground">{sub}</p>
                </div>
                <div className="space-y-3 text-[14px] text-muted-foreground leading-[1.9] max-w-xl">
                  <p>{body}</p>
                </div>
                <div className="lg:text-right">
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary hover:underline underline-offset-4"
                  >
                    {cta} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Services ── */}
      <section id="services" className="py-28">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-14" data-animate>
            <p className="font-mono-label text-primary mb-5">Trade categories</p>
            <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-xl text-balance">
              Eight trade categories with licensed, insured contractors active in each.
            </h2>
            <p className="mt-5 text-[14.5px] text-muted-foreground leading-[1.9] max-w-2xl">
              Requests require photographs, a written scope, and a maximum budget before entering the contractor queue. The network expands as additional licensed contractors are approved.
            </p>
          </div>

          <div className="grid gap-x-16 sm:grid-cols-2 border-t border-border">
            {services.map((s, i) => (
              <div
                key={s.name}
                className={`service-card py-6 border-b border-border ${i % 2 === 1 ? "sm:border-l sm:pl-12 pl-offset" : ""}`}
                data-animate
                data-delay={String((i % 4) + 1)}
              >
                <p className="text-[13px] font-semibold mb-2 text-foreground">{s.name}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[12px] text-muted-foreground">
            Need a trade not listed?{" "}
            <a href="mailto:admin@nexusoperations.org" className="text-primary hover:underline underline-offset-4">
              Contact us directly.
            </a>
          </p>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Process ── */}
      <section id="process" className="py-28">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-14" data-animate>
            <p className="font-mono-label text-primary mb-5">The process</p>
            <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-2xl text-balance">
              Submit once. Nexus handles the rest — contractor assignment, scheduling, and project management through close.
            </h2>
          </div>

          <div className="grid gap-20 lg:grid-cols-[1fr_360px] items-start">
            <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9]">
              <p>
 </p>
            </div>

            {/* Process steps */}
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">
                ].map(([item, detail]) => (
                  <div key={item} className="py-4 border-b border-border">
                    <p className="font-semibold mb-1 text-foreground">{item}</p>
                    <p className="text-muted-foreground leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Contractors ── */}
      <section id="contractors" className="py-28">
        <div className="mx-auto max-w-6xl px-8">

            </h2>
          </div>

          <div className="grid gap-16 lg:grid-cols-2 items-start">
            <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9]">
              <p>

              </p>
              <div className="pt-2">
                <Link
                  href="/auth/sign-up?role=contractor"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-[13px] font-semibold text-primary-foreground transition-all hover:opacity-90"
                >

                </Link>
              </div>

              {/* Editorial photo */}
              <div className="relative mt-6 h-52 overflow-hidden rounded-xl">
                <Image
                  src="/photo-work.jpg"
                  alt="Contractor documenting project scope on site"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">
                Application requirements
              </p>
              <div className="border-t border-border text-[12.5px]">
                {[
                  ["Active contractor license",    "Required for each applied trade. Must be current at application and maintained on renewal."],
                  ["General liability insurance",  "Certificate of insurance required. Minimum coverage limits apply. Policy must remain active."],
                  ["Shawnee County service area",  "Primary coverage required. Adjacent county coverage may be approved separately."],
                  ["Manual review by Nexus staff", "All applications are reviewed individually. No account is activated automatically."],
                ].map(([req, detail]) => (
                  <div key={req} className="py-4 border-b border-border">
                    <p className="font-semibold mb-1 text-foreground">{req}</p>
                    <p className="text-muted-foreground leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Contact ── */}
      <section id="contact" className="py-28">
        <div className="mx-auto max-w-6xl px-8">
          <div className="grid gap-20 lg:grid-cols-2 items-start">
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary mb-5">Contact</p>
              <h2 className="text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-sm text-balance mb-10">
                Current service area and contact information.
              <p className="font-mono-label text-primary mb-5">Contact</p>
              <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-sm text-balance mb-10">
                Headquarters: Topeka, Kansas. Serving Shawnee County and surrounding areas.
              </h2>
              <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9] mb-10">
                <p>
                  Nexus Operations is based in Topeka, Kansas and currently serves Shawnee County and immediately adjacent areas. Service area expansion is ongoing as additional verified contractors are approved.
                </p>
                <p>
                  Submitting from outside the current service area? Contact us directly — we maintain a geographic waitlist and notify when coverage reaches your location.
                </p>
              </div>
              <div className="space-y-4">
                <a
                  href="tel:+17854280244"
                  className="flex items-center gap-3 text-[13.5px] text-muted-foreground transition hover:text-foreground group"
                >
                  <Phone className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  (785) 428-0244. Monday through Friday, 8 am to 6 pm CT.
                </a>
                <a
                  href="mailto:admin@nexusoperations.org"
                  className="flex items-center gap-3 text-[13.5px] text-muted-foreground transition hover:text-foreground group"
                >
                  <Mail className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  admin@nexusoperations.org
                </a>
                <p className="text-[12px] text-muted-foreground pt-1 pl-[1.375rem]">
                  Nexus Operations, LLC. Topeka, KS 66606
                </p>
              </div>
            </div>

            <div className="pt-2 lg:pt-16">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-6">Get started</p>
              {[
                { href: "/auth/sign-up",                       label: "Homeowner account",          sub: "Submit and track service requests for your property" },
                { href: "/auth/sign-up?role=property_manager", label: "Property manager account",   sub: "Manage requests and records across multiple properties" },
                { href: "/auth/sign-up?role=contractor",       label: "Contractor application",     sub: "Apply to join the verified contractor network" },
                { href: "/faq",                                label: "Frequently asked questions", sub: "Platform process, verification requirements, and policies" },
                { href: "/auth/sign-up",                       label: "Homeowner account",          sub: "Submit and manage service requests" },
                { href: "/auth/sign-up?role=property_manager", label: "Property manager account",   sub: "Portfolio-level request management and reporting" },
                { href: "/auth/sign-up?role=contractor",       label: "Contractor application",     sub: "Join the verified contractor network. No fees." },
                { href: "/faq",                                label: "FAQ",                        sub: "Platform details, requirements, and policies" },
              ].map(({ href, label, sub }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center justify-between border-b border-border py-4 transition-colors hover:border-primary/40"
                >
                  <div>
                    <p className="text-[13.5px] font-medium text-foreground">{label}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{sub}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-16">
        <div className="mx-auto max-w-6xl px-8">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 mb-14">
            <div>
              <Link href="/">
                <Image
                  src="/nexus-logo.png"
                  alt="Nexus Operations"
                  width={110}
                  height={37}
                  style={{ height: "24px", width: "auto" }}
                />
              </Link>
              <p className="mt-5 text-[11.5px] text-muted-foreground leading-relaxed">
                Property service coordination for homeowners, landlords, and property managers in Topeka, Kansas.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">Platform</p>
              <ul className="space-y-2.5">
                {[
                  { href: "#about",        label: "About Nexus" },
                  { href: "#mission",      label: "Mission &amp; Values" },
                  { href: "#who-we-serve", label: "Who We Serve" },
                  { href: "#services",     label: "Services" },
                  { href: "#process",      label: "Process" },
                  { href: "#reporting",    label: "Reporting & Advisory" },
                  { href: "/faq",          label: "FAQ" },
                  { href: "#about",     label: "About Nexus" },
                  { href: "#platform",  label: "Platform" },
                  { href: "#services",  label: "Services" },
                  { href: "#process",   label: "The Process" },
                  { href: "/faq",       label: "FAQ" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="text-[11.5px] text-muted-foreground transition hover:text-foreground">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">Portals</p>
              <ul className="space-y-2.5">
                {[
                  { href: "/auth/sign-up",                       label: "Homeowner Account" },
                  { href: "/auth/sign-up?role=property_manager", label: "Property Manager" },
                  { href: "/auth/sign-up?role=contractor",       label: "Contractor Application" },
                  { href: "/auth/login",                         label: "Sign In" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-[11.5px] text-muted-foreground transition hover:text-foreground">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">Legal</p>
              <ul className="space-y-2.5">
                {[
                  { href: "/terms",   label: "Terms of Service" },
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/sitemap", label: "Sitemap" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-[11.5px] text-muted-foreground transition hover:text-foreground">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <p>&copy; 2026 Nexus Operations, LLC. Topeka, Kansas. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link href="/terms"   className="hover:text-foreground transition">Terms</Link>
              <Link href="/privacy" className="hover:text-foreground transition">Privacy</Link>
              <Link href="/sitemap" className="hover:text-foreground transition">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}
