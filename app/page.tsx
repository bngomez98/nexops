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

          <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
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

              <p className="text-base text-[var(--color-subtle)] leading-relaxed mb-8 max-w-md text-pretty">
                Nexus Operations connects you directly with a licensed, insured contractor and does this while allowing you to have full control. It takes 5 minutes of your time to make a request a reality, and we handle the rest. On your terms only.
              </p>

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

            {/* Hero photo with stats overlay */}
            <div
              ref={statsRef}
              className="hidden lg:block relative h-[560px] overflow-hidden rounded-2xl glow-primary animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Image
                src="/photo-home.jpg"
                alt="Modern property managed by Nexus Operations"
                fill
                className="object-cover object-center"
                priority
              />
              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

              {/* Stats bar overlaid at bottom */}
              <div className="absolute bottom-0 left-0 right-0 grid grid-cols-4 divide-x divide-border/30 bg-background/75 backdrop-blur-md">
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
                  <strong className="text-foreground">We manage property maintenance, repair, and improvement projects on behalf of homeowners and property managers.</strong> Our platform handles the full lifecycle of a service request: intake and documentation review, contractor assignment from a verified network, consultation scheduling, estimate approval, and project tracking.
                </p>
                <p>
                  <strong className="text-foreground">Every contractor in the Nexus network is licensed and insured.</strong> Credentials are verified by Nexus staff prior to network activation. Each project is assigned to a single contractor who holds it exclusively through completion. Property owners receive documented estimates and project updates for every request.
                </p>
                <p>
                  <strong className="text-foreground">Your project history is used to generate maintenance recommendations.</strong> The Nexus reporting system identifies upcoming service intervals, recurring issues by trade category, and deferred maintenance items based on each property's completed projects. Property managers with multiple addresses receive portfolio-level reporting across all managed properties.
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

          <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 border-t border-border pt-12">
            {[
              {
                label: "Fully managed service",
                body:  "Nexus selects the contractor, confirms the appointment, and maintains the project record. Responsibility for the managed portion stays with Nexus throughout.",
              },
              {
                icon: HomeIcon,
                title: "Roofing",
                description: "Full replacements, leak repairs, storm damage assessment, and insurance restoration.",
                range: "$5,000 – $25,000",
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

    </main>
  )
}
