"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, ArrowRight, MapPin, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState, useRef } from "react"

const services: Array<{ name: string; desc: string }> = [
  { name: "Roofing",        desc: "Full replacement, storm damage assessment, leak repair, and insurance restoration." },
  { name: "HVAC",           desc: "Central air, heat pumps, ductless mini-splits, furnace replacement, and annual maintenance." },
  { name: "Electrical",     desc: "Panel upgrades, circuit additions, rewiring, subpanel installation, and EV charger rough-in." },
  { name: "Plumbing",       desc: "Water heaters, leak detection, drain clearing, main line repair, and fixture replacement." },
  { name: "Concrete",       desc: "Driveways, patios, sidewalks, foundation repair, and structural flatwork." },
  { name: "Tree Service",   desc: "Removal, crown reduction, stump grinding, and post-storm emergency response." },
  { name: "Fencing",        desc: "Privacy, chain link, vinyl, wood, and commercial perimeter fencing." },
  { name: "General Repair", desc: "Drywall, carpentry, painting, door and window replacement, and interior repairs." },
]

const heroTargets = ["homeowners.", "property managers.", "landlords."]

const navLinks = [
  { href: "#about",       label: "About" },
  { href: "#platform",    label: "Platform" },
  { href: "#services",    label: "Services" },
  { href: "#reporting",   label: "Reporting" },
  { href: "#contractors", label: "Contractors" },
  { href: "#contact",     label: "Contact" },
]

export default function HomePage() {
  const [mobileOpen, setMobileOpen]       = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [scrollPct, setScrollPct]         = useState(0)
  const [heroIdx, setHeroIdx]             = useState(0)
  const [heroVisible, setHeroVisible]     = useState(true)
  const [statsTriggered, setStatsTriggered] = useState(false)
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

  /* ── Hero rotating text ── */
  useEffect(() => {
    const t = setInterval(() => {
      setHeroVisible(false)
      setTimeout(() => {
        setHeroIdx(i => (i + 1) % heroTargets.length)
        setHeroVisible(true)
      }, 380)
    }, 2700)
    return () => clearInterval(t)
  }, [])

  /* ── Stats pop animation trigger ── */
  useEffect(() => {
    if (!statsRef.current) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsTriggered(true); io.disconnect() } },
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
                      ? "text-primary bg-primary/8 font-medium"
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
      <section className="relative pt-36 pb-28">
        <div className="hero-radial pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-8">
          {/* Location pill */}
          <div className="flex items-center gap-2 mb-10 animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/6 px-3 py-1.5">
              <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="font-mono-label text-primary/80">
                Topeka, Kansas — Shawnee County
              </span>
            </span>
          </div>

          <div className="grid gap-16 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              {/* Rotating hero headline */}
              <h1
                className="font-heading text-[56px] font-bold tracking-[-0.02em] leading-[1.0] md:text-[72px] lg:text-[84px] text-balance animate-fade-up"
                style={{ animationDelay: "0.12s" }}
              >
                Managed property<br />services for<br />
                <span
                  className="text-primary inline-block"
                  style={{
                    opacity:   heroVisible ? 1 : 0,
                    transform: heroVisible ? "translateY(0)" : "translateY(14px)",
                    transition: "opacity 0.38s cubic-bezier(0.22,1,0.36,1), transform 0.38s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  {heroTargets[heroIdx]}
                </span>
              </h1>

              <div className="mt-8 max-w-2xl animate-fade-up" style={{ animationDelay: "0.22s" }}>
                <p className="text-[16px] text-muted-foreground leading-[1.85]">
                  Nexus Operations gives property owners and managers a single platform to request, assign, document, and track maintenance and repair work — backed by a network of licensed, insured contractors and a permanent service record for every property.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 animate-fade-up" style={{ animationDelay: "0.32s" }}>
                <Link
                  href="/auth/sign-up"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-[13px] font-semibold text-primary-foreground transition-all hover:opacity-90"
                >
                  Get started
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/auth/sign-up?role=contractor"
                  className="group inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition hover:text-foreground"
                >
                  Join the contractor network
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </div>
            </div>

            {/* Stat strip with pop animation */}
            <div
              ref={statsRef}
              className="hidden lg:flex flex-col divide-y divide-border border-t border-b border-border glow-primary rounded-sm animate-fade-up"
              style={{ animationDelay: "0.28s" }}
            >
              {[
                { n: "8",    label: "Trade categories" },
                { n: "1",    label: "Contractor per project" },
                { n: "100%", label: "Manually reviewed" },
                { n: "∞",    label: "Permanent records" },
              ].map(({ n, label }, i) => (
                <div key={label} className="py-5 px-4">
                  <p
                    className="font-heading text-2xl font-bold tracking-tight text-foreground"
                    style={statsTriggered ? {
                      animation: `stat-pop 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.09}s both`,
                    } : { opacity: 0 }}
                  >
                    {n}
                  </p>
                  <p className="font-mono-label text-muted-foreground mt-1 normal-case tracking-normal text-[11px]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Photo Banner: Three user types ── */}
      <section className="overflow-hidden border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            {
              src:     "/photo-homeowner.jpg",
              label:   "Homeowners",
              caption: "Submit, track, and document every repair — from first request to permanent record.",
              href:    "/auth/sign-up",
              cta:     "Create account",
            },
            {
              src:     "/photo-manager.jpg",
              label:   "Property Managers",
              caption: "Manage your entire portfolio from a single dashboard with full reporting.",
              href:    "/auth/sign-up?role=property_manager",
              cta:     "Create account",
            },
            {
              src:     "/photo-contractor.jpg",
              label:   "Contractors",
              caption: "Receive pre-documented project notifications. No fees, no cuts, no bidding wars.",
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

            <div className="space-y-7" data-animate>
              <p className="font-mono-label text-primary">About Nexus Operations</p>
              <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.01em] text-balance">
                Nexus Operations is a property service management company headquartered in Topeka, Kansas.
              </h2>
              <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9]">
                <p>
                  <strong className="text-foreground">We manage property maintenance, repair, and improvement projects on behalf of homeowners and property managers.</strong> Our platform handles the full lifecycle of a service request: intake and documentation review, contractor assignment from a verified network, consultation scheduling, estimate approval, project tracking, and permanent record storage.
                </p>
                <p>
                  <strong className="text-foreground">Every contractor in the Nexus network is licensed and insured.</strong> Credentials are verified by Nexus staff prior to network activation. Each project is assigned to a single contractor who holds it exclusively through completion. Property owners receive documented estimates, project updates, and a permanent service record for every request.
                </p>
                <p>
                  <strong className="text-foreground">Service history is stored on the platform indefinitely and used to generate maintenance recommendations.</strong> The Nexus reporting system identifies upcoming service intervals, recurring issues by trade category, and deferred maintenance items based on each property's actual records. Property managers with multiple addresses receive portfolio-level reporting across all managed properties.
                </p>
                <p>
                  <strong className="text-foreground">For licensed contractors, the Nexus network provides a direct channel to pre-documented, pre-validated projects.</strong> Contractors receive notifications when requests are submitted in their trade and service area. Claimed projects include photographs, scope descriptions, and budget ceilings. There is no fee to join or participate in the network.
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
                ["Contractors per project", "One, assigned exclusively"],
                ["Contractor verification", "License · Insurance · Manual review"],
                ["Post-project reporting",  "Included with every account"],
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
      <section id="mission" className="py-28 bg-muted/30">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-14" data-animate>
            <p className="font-mono-label text-primary mb-5">Mission &amp; Values</p>
            <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-2xl text-balance">
              Every property owner deserves a complete, verified record of what has been maintained, when, and at what cost.
            </h2>
          </div>

          <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 border-t border-border pt-12">
            {[
              {
                label: "Fully managed service",
                body:  "Nexus selects the contractor, confirms the appointment, and maintains the project record. Responsibility for the managed portion stays with Nexus throughout.",
              },
              {
                label: "Exclusive assignment",
                body:  "One contractor per project, claimed first-come and held exclusively. The property owner works with a single contractor for each request, from consultation through completion.",
              },
              {
                label: "Permanent service record",
                body:  "Every project — scope, cost, contractor, photos, outcome — is stored on the platform and retrievable indefinitely. The record belongs to the property.",
              },
              {
                label: "Property-specific intelligence",
                body:  "Over time, your service history tells Nexus what your property needs and when. Recommendations are generated from your actual project records and maintenance intervals.",
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

      {/* ── Platform ── */}
      <section id="platform" className="py-28">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-16" data-animate>
            <p className="font-mono-label text-primary mb-5">The platform</p>
            <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-xl text-balance">
              Three account types — homeowners, property managers, and contractors — each with dedicated tools and capabilities.
            </h2>
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
                body: "A single account covers your entire portfolio. Each property has its own request history, cost record, and service documentation. Portfolio-level reporting shows maintenance spend by address and by trade category, flags overdue service intervals, and identifies recurring issues — so you can manage a portfolio's maintenance obligations without reconstructing records from scattered sources.",
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
              All requests must include photographs, a written scope, and a maximum budget before the project enters the contractor queue. The network expands as additional contractors are reviewed and approved.
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

      {/* ── Reporting ── */}
      <section id="reporting" className="py-28">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-14" data-animate>
            <p className="font-mono-label text-primary mb-5">Data-driven reporting</p>
            <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-2xl text-balance">
              Every closed project generates a post-project report. Over time, that data builds a complete property service record.
            </h2>
          </div>

          <div className="grid gap-20 lg:grid-cols-[1fr_360px] items-start">
            <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9]">
              <p>
                <strong className="text-foreground">Post-project reports are generated after every completed project.</strong> Each report covers three categories: financial data (total cost, cost breakdown by labor and materials, comparison to budget ceiling), efficiency metrics (time from submission to completion, contractor response time, consultation-to-estimate interval), and recommendations (follow-up items identified during the project, suggested maintenance intervals, related services to consider).
              </p>
              <p>
                <strong className="text-foreground">Reports draw on historical, current, and cross-property data.</strong> Historical data includes all prior projects at the same address and within the same trade category. Current data covers the project just completed. Cross-property data, available to property managers, benchmarks performance and spend against other properties in the same portfolio and service area.
              </p>
              <p>
                <strong className="text-foreground">The accumulated service record is a verified ownership asset.</strong> For insurance claims, sale documentation, refinancing, or due diligence, the Nexus service record provides a complete, timestamped history of what has been maintained, when, by whom, and at what cost. Property managers receive portfolio-level aggregation: spend by address, spend by trade, outstanding intervals, and recurring issue flags across all managed properties.
              </p>
            </div>

            {/* Report categories */}
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">
                Post-project report contents
              </p>
              <div className="border-t border-border text-[12.5px]">
                {[
                  ["Financial summary",       "Total cost, labor vs. materials breakdown, variance from budget ceiling."],
                  ["Efficiency metrics",      "Time to completion, contractor response time, scheduling turnaround."],
                  ["Historical comparison",   "Cost and timeline compared to prior projects in the same trade category."],
                  ["Maintenance intervals",   "Recommended next service date based on trade standards and property history."],
                  ["Follow-up items",         "Issues identified during the project that require separate attention."],
                  ["Recurring issue flags",   "Patterns detected across multiple projects at the same address or trade."],
                  ["Portfolio benchmarking",  "For property managers: performance comparison across managed addresses."],
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
          <div className="mb-14" data-animate>
            <p className="font-mono-label text-primary mb-5">For contractors</p>
            <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-xl text-balance">
              Join the Nexus contractor network. Receive pre-documented project notifications in your trade and service area.
            </h2>
          </div>

          <div className="grid gap-20 lg:grid-cols-2 items-start">
            <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9]">
              <p>
                The Nexus contractor network is free to join and free to use. There are no subscription fees, no per-claim charges, and no referral percentages. You receive project notifications, you decide which ones to take, and you get paid directly by the property owner. Nexus does not take a cut.
              </p>
              <p>
                Every project you receive through Nexus comes with photographs, a written scope, and the owner's maximum budget — reviewed and validated by Nexus staff before you receive the notification. You arrive at consultations informed and prepared to provide an estimate.
              </p>
              <p>
                Approval requires a current trade license and active general liability insurance, verified by Nexus staff. Once active, your account runs as long as your credentials remain current. We do not charge for renewals or ongoing participation.
              </p>
              <div className="pt-4">
                <Link
                  href="/auth/sign-up?role=contractor"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-[13px] font-semibold text-primary-foreground transition-all hover:opacity-90"
                >
                  Apply for network access
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
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

      {/* ── CTA ── */}
      <section className="py-28 bg-muted/30">
        <div className="mx-auto max-w-6xl px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div data-animate>
              <p className="font-mono-label text-primary mb-5">Get started</p>
              <h2 className="font-heading text-[38px] font-bold leading-[1.1] tracking-[-0.015em] text-balance">
                Create an account and submit your first service request.
              </h2>
              <p className="mt-5 text-[14.5px] text-muted-foreground leading-[1.9] max-w-lg">
                From the first project, Nexus assigns a verified contractor, schedules the consultation, manages estimate approval, and documents the completed work. Every project adds to your property's permanent service record.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/auth/sign-up"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-[13px] font-semibold text-primary-foreground transition-all hover:opacity-90"
                >
                  Create a homeowner account
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/auth/sign-up?role=property_manager"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-[13px] font-medium text-foreground transition hover:border-foreground/30"
                >
                  Property manager account
                </Link>
              </div>
            </div>
            <div className="divide-y divide-border border-t border-b border-border">
              {[
                { href: "/faq",                            label: "Frequently asked questions",      sub: "Platform details, requirements, and policies" },
                { href: "/auth/sign-up?role=contractor",   label: "Contractor network application",  sub: "Free to join. Active license and insurance required." },
                { href: "tel:+17854280244",                label: "(785) 428-0244",                  sub: "Monday – Friday, 8 am – 6 pm CT" },
                { href: "mailto:admin@nexusoperations.org",label: "admin@nexusoperations.org",       sub: "General inquiries and support" },
              ].map(({ href, label, sub }) => (
                <a
                  key={href}
                  href={href}
                  className="group flex items-center justify-between py-4 transition-colors hover:border-primary/40"
                >
                  <div>
                    <p className="text-[13.5px] font-medium text-foreground">{label}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{sub}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary flex-shrink-0" />
                </a>
              ))}
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
              <p className="font-mono-label text-primary mb-5">Contact</p>
              <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-sm text-balance mb-10">
                Headquarters: Topeka, Kansas. Serving Shawnee County and adjacent areas.
              </h2>
              <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9] mb-10">
                <p>
                  Nexus Operations is headquartered in Topeka, Kansas and currently serves Shawnee County and adjacent areas. As more contractors are approved, coverage expands outward.
                </p>
                <p>
                  Outside our current service area? Contact us to be added to the geographic waitlist. We notify you when coverage reaches your location.
                </p>
              </div>
              <div className="space-y-4">
                <a
                  href="tel:+17854280244"
                  className="flex items-center gap-3 text-[13.5px] text-muted-foreground transition hover:text-foreground"
                >
                  <Phone className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  (785) 428-0244 — Monday through Friday, 8 am to 6 pm CT
                </a>
                <a
                  href="mailto:admin@nexusoperations.org"
                  className="flex items-center gap-3 text-[13.5px] text-muted-foreground transition hover:text-foreground"
                >
                  <Mail className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  admin@nexusoperations.org
                </a>
                <p className="text-[12px] text-muted-foreground pt-1 pl-[1.375rem]">
                  Nexus Operations, LLC — Topeka, KS 66606
                </p>
              </div>
            </div>

            <div className="pt-2 lg:pt-16">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-6">Quick links</p>
              {[
                { href: "/auth/sign-up",                       label: "Homeowner account",          sub: "Submit and manage service requests" },
                { href: "/auth/sign-up?role=property_manager", label: "Property manager account",   sub: "Portfolio-level request management and reporting" },
                { href: "/auth/sign-up?role=contractor",       label: "Contractor application",     sub: "Join the verified contractor network — no fees" },
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
                Managed property services for homeowners, landlords, and property managers in Topeka, Kansas.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">Platform</p>
              <ul className="space-y-2.5">
                {[
                  { href: "#about",      label: "About Nexus" },
                  { href: "#platform",   label: "Platform" },
                  { href: "#services",   label: "Services" },
                  { href: "#reporting",  label: "Reporting & Advisory" },
                  { href: "/faq",        label: "FAQ" },
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">Accounts</p>
              <ul className="space-y-2.5">
                {[
                  { href: "/auth/sign-up",                       label: "Homeowner" },
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
