"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, ArrowRight, MapPin, Menu, X, Shield, FileCheck, Users, CheckCircle, Zap, Clock, Star } from "lucide-react"
import { ArrowRight, BadgeCheck, Menu, Phone, ShieldCheck, Sparkles, Users, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#contractors", label: "Contractors" },
  { href: "#contact", label: "Contact" },
]

const services = [
  "Roofing",
  "HVAC",
  "Electrical",
  "Plumbing",
  "Concrete",
  "Tree Removal",
  "Fencing",
  "General Repair",
]

const processSteps = [
  {
    title: "Submit once",
    body: "Add photos, scope, and your budget ceiling. Our team reviews every request before assignment.",
  },
  {
    title: "Get one verified match",
    body: "Nexus assigns one licensed and insured contractor with the right trade fit and service area.",
  },
  {
    title: "Start in 24 hours",
    body: "Your contractor reaches out for scheduling, then manages your project from estimate to closeout.",
  },
]

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [scrollPct, setScrollPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const maxScroll = Math.max(scrollHeight - clientHeight, 1)
      setScrollPct((scrollTop / maxScroll) * 100)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const ids = navLinks.map((item) => item.href.replace("#", ""))
    const observers: IntersectionObserver[] = []

    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.25, rootMargin: "-80px 0px -60% 0px" },
      )
      observer.observe(el)
      observers.push(observer)
    }

    return () => observers.forEach((observer) => observer.disconnect())
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed left-0 top-0 z-[70] h-0.5 bg-primary transition-[width] duration-75" style={{ width: `${scrollPct}%` }} />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-8">
          <Link href="/" aria-label="Nexus Operations home">
            <Image src="/nexus-logo.png" alt="Nexus Operations" width={148} height={30} className="h-7 w-auto" priority />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {navLinks.map(({ href, label }) => {
              const active = activeSection === href.replace("#", "")
              return (
                <a
                  key={href}
                  href={href}
                  className={`rounded-full px-3 py-1.5 text-xs transition ${
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/login" className="hidden text-sm text-muted-foreground hover:text-foreground md:block">
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              className="hidden rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 sm:inline-flex"
            >
              Submit project
            </Link>
            <button
              type="button"
              className="p-1.5 text-muted-foreground transition hover:text-foreground md:hidden"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-background md:hidden">
            <div className="space-y-1 px-6 py-4">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {label}
                </a>
              ))}
              <Link
                href="/auth/sign-up"
                onClick={() => setMobileOpen(false)}
                className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                Submit project
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section id="hero" className="relative pt-36 pb-28 overflow-hidden">
        <div className="hero-radial pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-8">
          {/* Location + trust badges */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-10 animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground font-mono">
              <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
              Topeka, Kansas — Shawnee County
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
              Licensed &amp; insured contractors only
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3 text-primary flex-shrink-0" />
              Consultation within 24 hours
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_480px] lg:items-center">
            <div>
              <h1
                className="font-heading text-[52px] font-bold tracking-[-0.02em] leading-[1.05] md:text-[68px] lg:text-[76px] text-balance animate-fade-up"
                style={{ animationDelay: "0.12s" }}
              >
                Property services<br />
                done right — <span className="text-primary">one verified</span><br />
                <span className="text-primary">contractor, exclusively yours.</span>
              </h1>

              <div className="mt-8 max-w-xl animate-fade-up" style={{ animationDelay: "0.22s" }}>
                <p className="text-[16px] text-muted-foreground leading-[1.85]">
                  Submit your project once. Nexus reviews it, assigns one licensed, insured contractor from our verified network, and confirms your consultation within 24 hours. No bidding wars. No cold calls. Fully managed from submission through completion.
                </p>
              </div>

              {/* Platform stats strip */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 animate-fade-up" style={{ animationDelay: "0.28s" }}>
                {[
                  { n: "8",     label: "Trade categories" },
                  { n: "1",     label: "Contractor per project" },
                  { n: "24hr",  label: "Consultation target" },
                  { n: "$0",    label: "Platform fee to owners" },
                ].map(({ n, label }) => (
                  <div key={label} className="rounded-xl border border-border/50 bg-card/60 px-3 py-3 text-center">
                    <p className="font-heading text-[22px] font-bold text-primary leading-none">{n}</p>
                    <p className="mt-1 text-[10.5px] text-muted-foreground leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: "0.34s" }}>
                <Link
                  href="/auth/sign-up"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-[13.5px] font-semibold text-primary-foreground transition-all hover:opacity-90 shadow-sm"
                >
                  Submit your project
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="tel:+17854280244"
                  className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition hover:text-foreground"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  (785) 428-0244
                </a>
              </div>
            </div>

            {/* Hero panel: How it works */}
            <div
              ref={heroRef}
              className="hidden lg:flex flex-col relative overflow-hidden rounded-2xl border border-border/40 bg-card glow-primary animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-border/40 px-8 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  How it works
                </p>
                <span className="flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                  <Zap className="h-2.5 w-2.5" />
                  Automated platform
                </span>
              </div>

              <div className="flex-1 px-8 py-6 space-y-0">
                {[
                  {
                    icon:  Star,
                    title: "Submit your project",
                    body:  "Add photos, scope, and a budget ceiling. Reviewed by Nexus staff before entering the contractor queue.",
                  },
                  {
                    icon:  Shield,
                    title: "Nexus reviews and assigns",
                    body:  "One licensed, insured contractor is matched exclusively to your project. No auction. No bidding.",
                  },
                  {
                    icon:  Clock,
                    title: "Consultation within 24 hours",
                    body:  "Your contractor reaches out to confirm a site visit. One professional, one project.",
                  },
                  {
                    icon:  CheckCircle,
                    title: "Work tracked through close",
                    body:  "Every stage is tracked on your dashboard and archived permanently on your account.",
                  },
                ].map(({ icon: Icon, title, body }, i, arr) => (
                  <div
                    key={title}
                    className={`flex gap-4 py-5 ${i < arr.length - 1 ? "border-b border-border/40" : ""}`}
                  >
                    <div className="flex-shrink-0 mt-0.5 h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[12.5px] font-semibold text-foreground mb-1">{title}</p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/40 px-8 py-5">
                <Link
                  href="/auth/sign-up"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-[12.5px] font-semibold text-primary-foreground transition-all hover:opacity-90"
                >
                  Submit your project
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Who We Serve ── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-16 text-center" data-animate>
            <p className="font-mono-label text-primary mb-4">Who We Serve</p>
            <h2 className="font-heading text-[42px] font-bold leading-[1.2] tracking-[-0.01em] max-w-2xl mx-auto text-balance">
              Built for homeowners, contractors, and property managers.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon:   Users,
                title:  "Homeowners",
                body:   "Submit your project once with photos and scope. Nexus assigns a verified contractor, schedules the consultation, and manages the job through completion.",
                pills:  ["Full project tracking", "Permanent records", "No contractor search"],
                cta:    "Submit your project",
                href:   "/auth/sign-up",
              },
              {
                icon:   FileCheck,
                title:  "Property Managers",
                body:   "One account covers your entire portfolio. Track maintenance spend by property and trade category. Identify recurring issues across all managed addresses.",
                pills:  ["Portfolio dashboard", "Spend by category", "Multi-property support"],
                cta:    "Create an account",
                href:   "/auth/sign-up?role=property_manager",
              },
              {
                icon:   Shield,
                title:  "Contractors",
                body:   "Receive pre-documented project requests in your trade and service area. Review scope, photos, and budget before deciding to claim. Direct payment — no referral cuts.",
                pills:  ["Flat membership", "Direct payment", "Exclusive claims"],
                cta:    "Apply for network access",
                href:   "/auth/sign-up?role=contractor",
              },
            ].map(({ icon: Icon, title, body, pills, cta, href }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col rounded-2xl border border-border/50 bg-muted/20 p-8 transition-all hover:border-primary/40 hover:bg-muted/40 hover:shadow-sm"
                data-animate
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-[17px] font-bold text-foreground mb-3">{title}</h3>
                <p className="text-[13.5px] text-muted-foreground leading-[1.75] mb-5 flex-1">{body}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {pills.map((p) => (
                    <span key={p} className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-[11px] text-muted-foreground">
                      {p}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary group-hover:gap-2.5 transition-all">
                  {cta} <ArrowRight className="h-3 w-3" />
                </span>
      <section className="relative overflow-hidden border-b border-border py-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.17),transparent_45%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-8">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Topeka-first property operations platform
            </p>
            <h1 className="font-heading text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              A real operations layer for home and property service work.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Stop chasing five bids and repeating scope over and over. Nexus routes every request through one verified contractor,
              with full request history, status updates, and post-project records in one dashboard.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Submit your project
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:+17854280244" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Phone className="h-4 w-4 text-primary" />
                (785) 428-0244
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">What makes this different</h2>
            <div className="mt-5 space-y-5">
              {[
                "One contractor per request — no bidding wars.",
                "Manual contractor verification: license + insurance + review.",
                "Timeline tracking, documents, and status updates in-app.",
                "Permanent service records for insurance, resale, and maintenance planning.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Trust Pillars ── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-10 text-center" data-animate>
            <p className="font-mono-label text-primary mb-3">Why Nexus</p>
            <h2 className="font-heading text-[30px] font-bold leading-[1.2] tracking-[-0.01em] text-balance">
              Built on verified contractors, complete documentation, and exclusive assignment.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon:  Shield,
                title: "Verified network only",
                body:  "Every contractor holds a current trade license and active general liability insurance, confirmed by Nexus staff before network activation. No automated approvals.",
                stat:  "100% manual review",
              },
              {
                icon:  FileCheck,
                title: "Every project documented",
                body:  "Scope, photos, estimates, and completion records are stored permanently on your account — a verified asset for insurance, refinancing, and resale.",
                stat:  "Permanent records",
              },
              {
                icon:  Users,
                title: "Exclusive assignment",
                body:  "When a contractor claims your project, it is removed from all other feeds instantly. One contractor. One consultation. No competing contact.",
                stat:  "1 contractor per project",
              },
            ].map(({ icon: Icon, title, body, stat }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-7" data-animate>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                    {stat}
                  </span>
                </div>
                <h3 className="text-[15px] font-semibold text-foreground mb-3">{title}</h3>
                <p className="text-[13px] text-muted-foreground leading-[1.8]">{body}</p>
              </div>
      <section id="about" className="border-b border-border py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Verified network",
                body: "Every contractor is reviewed before activation. No instant approvals and no unverified listings.",
              },
              {
                icon: Users,
                title: "Exclusive assignment",
                body: "Once assigned, your request leaves the public feed and stays with one contractor from start to finish.",
              },
              {
                icon: BadgeCheck,
                title: "Operational clarity",
                body: "Scope, estimates, approvals, and final documentation are recorded in a single timeline.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <article key={title} className="rounded-xl border border-border/70 bg-card p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="border-b border-border py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Process</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">How work moves through Nexus</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <article key={step.title} className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-semibold text-primary">0{index + 1}</p>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="border-b border-border py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Services</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Trade categories actively supported</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div key={service} className="rounded-xl border border-border/70 bg-muted/20 p-5 text-sm font-medium">
                {service}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contractors" className="border-b border-border py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">For contractors</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Claim qualified local projects without referral-fee games.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Receive complete request packets with photos and scope details, then claim work where your team has capacity. Direct
              owner payments. Clear records. Repeatable operations.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="/auth/sign-up?role=contractor"
                className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground"
              >
                Apply for contractor access
              </Link>
              <Link href="/faq" className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-xs font-semibold">
                Read contractor FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="rounded-2xl bg-primary px-8 py-12 text-primary-foreground md:flex md:items-center md:justify-between md:px-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready for a serious redesign of how service work gets done?</h2>
              <p className="mt-3 max-w-xl text-sm/relaxed text-primary-foreground/90">
                Start with one request. We&apos;ll route it, assign it, and keep everything organized from first message to closeout.
              </p>
            </div>
            <Link
              href="/auth/sign-up"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground md:mt-0"
            >
              Start now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
