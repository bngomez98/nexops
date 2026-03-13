"use client"

// Fixed: Removed orphaned stats bar code
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
              {/* Specialized hero headline */}
              <h1
                className="font-heading text-[56px] font-bold tracking-[-0.02em] leading-[1.0] md:text-[72px] lg:text-[84px] text-balance animate-fade-up"
                style={{ animationDelay: "0.12s" }}
              >
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
                  Get started — it&apos;s free
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

            <div className="space-y-7" data-animate>
              <p className="font-mono-label text-primary">About Nexus Operations</p>
              <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.01em] text-balance">
                Nexus Operations is a property service management company headquartered in Topeka, Kansas.
              </h2>
              <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9]">
                <p>
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
                ["Contractors per project", "One, assigned exclusively"],
                ["Contractor verification", "License · Insurance · Manual review"],
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
          <div className="mb-14" data-animate>
            <p className="font-mono-label text-primary mb-5">Mission &amp; Values</p>
            <h2 className="font-heading text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-2xl text-balance">
              Every homeowner deserves a single, accountable contractor — verified, assigned exclusively, and managed through completion.
            </h2>
          </div>

          <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 border-t border-border pt-12">
            {[
              {
                label: "Fully managed service",
                body:  "Nexus selects the contractor, confirms the consultation, and oversees the project from submission through close. You don't chase anyone down.",
              },
              {
                label: "Exclusive assignment",
                body:  "One contractor per project, claimed first-come and held exclusively. One point of contact, from the first site visit through the final invoice.",
              },
              {
                label: "Verified contractors only",
                body:  "Every contractor in the network holds an active trade license and general liability insurance, confirmed by Nexus staff before their first project.",
              },
              {
                label: "No bidding wars",
                body:  "Submit once. Nexus assigns. Your contractor is not competing with three others — they are focused on your project.",
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
                <strong className="text-foreground">Your request enters the queue after a brief review by Nexus staff.</strong> Before it reaches any contractor, your submission is checked for completeness — photos, scope, and budget. If anything is unclear, we follow up. Once approved, it goes live to the contractor network.
              </p>
              <p>
                <strong className="text-foreground">The first qualified contractor to claim your request holds it exclusively.</strong> Once claimed, your request is removed from all other contractor feeds. You are not competing for attention or waiting on multiple bids — one contractor, your project, exclusively theirs from consultation through close.
              </p>
              <p>
                <strong className="text-foreground">Your assigned contractor contacts you to schedule a consultation within 24 hours.</strong> They arrive with the full project details already in hand — photos, your written scope, and your budget ceiling. From the consultation they provide a written estimate. You review, approve, and work begins.
              </p>
            </div>

            {/* Process steps */}
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">
                What Nexus manages for you
              </p>
              <div className="border-t border-border text-[12.5px]">
                {[
                  ["Request intake",           "Review of photos, scope, and budget before the request enters the contractor queue."],
                  ["Contractor assignment",    "First qualified contractor to claim holds it exclusively — no bidding."],
                  ["Consultation scheduling",  "Confirmed within 24 hours of assignment. Nexus follows up if not confirmed."],
                  ["Estimate review",          "Written estimate from your contractor. You approve before work begins."],
                  ["Project tracking",         "Status updates from submission through completion, accessible in your dashboard."],
                  ["Contractor verification",  "License and insurance confirmed by Nexus staff before any contractor is activated."],
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
              Join the Nexus contractor network. Claim qualified, pre-reviewed project leads in your trade and service area — at no cost.
            </h2>
          </div>

          <div className="grid gap-16 lg:grid-cols-2 items-start">
            <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9]">
              <p>
                The Nexus contractor network is free to join and free to use. There are no subscription fees, no per-claim charges, and no referral percentages. You receive project notifications, you decide which ones to take, and you get paid directly by the property owner. Nexus does not take a cut.
              </p>
              <p>
                Every project you receive through Nexus comes with photographs, a written scope, and the owner&apos;s maximum budget — reviewed and validated by Nexus staff before you receive the notification. You arrive at consultations informed and prepared to provide an estimate.
              </p>
              <p>
                Approval requires a current trade license and active general liability insurance, verified by Nexus staff. Once active, your account runs as long as your credentials remain current. We do not charge for renewals or ongoing participation.
              </p>
              <div className="pt-2">
                <Link
                  href="/auth/sign-up?role=contractor"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-[13px] font-semibold text-primary-foreground transition-all hover:opacity-90"
                >
                  Apply for network access
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
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

      {/* ── CTA ── */}
      <section className="py-28 bg-surface">
        <div className="mx-auto max-w-6xl px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div data-animate>
              <p className="font-mono-label text-primary mb-5">Get started</p>
              <h2 className="font-heading text-[38px] font-bold leading-[1.1] tracking-[-0.015em] text-balance">
                Create an account and submit your first service request.
              </h2>
              <p className="mt-5 text-[14.5px] text-muted-foreground leading-[1.9] max-w-lg">
                Submit a request with photos and a written scope. Nexus reviews it, assigns one verified contractor exclusively, and confirms your consultation within 24 hours. One contractor, fully managed, start to finish.
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
                { href: "/faq",                             label: "Frequently asked questions",     sub: "Platform details, requirements, and policies" },
                { href: "/auth/sign-up?role=contractor",    label: "Contractor network application", sub: "Free to join. Active license and insurance required." },
                { href: "tel:+17854280244",                 label: "(785) 428-0244",                 sub: "Monday – Friday, 8 am – 6 pm CT" },
                { href: "mailto:admin@nexusoperations.org", label: "admin@nexusoperations.org",      sub: "General inquiries and support" },
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
                  (785) 428-0244. Monday through Friday, 8 am to 6 pm CT.
                </a>
                <a
                  href="mailto:admin@nexusoperations.org"
                  className="flex items-center gap-3 text-[13.5px] text-muted-foreground transition hover:text-foreground"
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
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-6">Quick links</p>
              {[
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
                Managed property services for homeowners, landlords, and property managers in Topeka, Kansas.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">Platform</p>
              <ul className="space-y-2.5">
                {[
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
