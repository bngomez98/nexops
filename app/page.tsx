"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, ArrowRight, MapPin, ArrowUpRight, Target, Shield, Users, TrendingUp, CheckCircle2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const services = [
  { name: "Roofing",        desc: "Full replacement, storm damage assessment, leak repair, and insurance restoration coordination." },
  { name: "HVAC",           desc: "Central air, heat pumps, ductless mini-splits, furnace replacement, and annual maintenance." },
  { name: "Electrical",     desc: "Panel upgrades, circuit additions, rewiring, subpanel installation, and EV charger prep." },
  { name: "Plumbing",       desc: "Water heaters, leak detection, drain clearing, main line repair, and fixture replacement." },
  { name: "Concrete",       desc: "Driveways, patios, sidewalks, foundation repair, and structural flatwork." },
  { name: "Tree Service",   desc: "Removal, crown reduction, stump grinding, and post-storm emergency response." },
  { name: "Fencing",        desc: "Privacy, chain link, vinyl, wood, and commercial perimeter fencing." },
  { name: "General Repair", desc: "Drywall, carpentry, painting, door and window replacement, and interior repairs." },
]

const values = [
  {
    icon: Target,
    title: "Operational Precision",
    desc: "Every request follows a documented sequence. No step is skipped, no detail is lost. We build systems that produce consistent outcomes.",
  },
  {
    icon: Shield,
    title: "Verified Quality",
    desc: "Our contractor network is curated, not crowded. Every contractor is licensed, insured, and manually reviewed before receiving access.",
  },
  {
    icon: Users,
    title: "Single-Point Accountability",
    desc: "One contractor per request. No auctions, no competing bids, no confusion. The contractor you work with has exclusive access to your project.",
  },
  {
    icon: TrendingUp,
    title: "Data-Driven Decisions",
    desc: "We don't just coordinate work — we track it. Service history becomes intelligence that informs future maintenance decisions.",
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background font-sans">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 h-14">
          <Link href="/" className="flex-shrink-0">
            <Image src="/nexus-logo.png" alt="Nexus Operations" width={150} height={50}
              style={{ height: "26px", width: "auto" }} priority />
          </Link>

          <nav className="hidden items-center lg:flex" aria-label="Main navigation">
            {[
              { href: "#mission",     label: "Mission" },
              { href: "#about",       label: "About" },
              { href: "#who-we-serve",label: "Who We Serve" },
              { href: "#pricing",     label: "Pricing" },
              { href: "#services",    label: "Services" },
              { href: "#process",     label: "Process" },
              { href: "#contractors", label: "Contractors" },
            ].map(({ href, label }) => (
              <a key={href} href={href}
                className="px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/login"
              className="hidden text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground md:block px-3 py-1.5">
              Sign In
            </Link>
            <Link href="/auth/sign-up"
              className="rounded bg-primary px-4 py-2 text-[11.5px] font-semibold text-primary-foreground transition hover:opacity-90">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1fr_400px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] text-primary font-medium tracking-wide">
                  Now serving Shawnee County, Kansas
                </span>
              </div>

              <h1 className="text-[52px] sm:text-[64px] lg:text-[76px] font-bold tracking-[-0.035em] leading-[0.95] text-foreground text-balance">
                Property service<br />
                <span className="text-primary">management.</span>
              </h1>
              
              <p className="mt-8 text-[17px] text-muted-foreground leading-[1.75] max-w-xl">
                Nexus Operations coordinates maintenance, repair, and improvement projects for property owners and managers in Topeka, Kansas. We handle contractor assignment, documentation, and reporting — so you have a clear record of every project and the data to make informed decisions about your property.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/auth/sign-up"
                  className="inline-flex items-center gap-2.5 rounded bg-primary px-6 py-3 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90">
                  Open an Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#about" className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground transition hover:text-foreground px-4 py-3">
                  Learn how it works <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Stats card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-2xl" />
              <div className="relative border border-border bg-card rounded-xl overflow-hidden">
                <div className="border-b border-border px-6 py-4 bg-muted/50">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Platform overview</p>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { stat: "8",    label: "Trade categories in network" },
                    { stat: "1",    label: "Contractor per request" },
                    { stat: "100%", label: "Verified, licensed network" },
                    { stat: "24hr", label: "Typical assignment time" },
                  ].map(({ stat, label }) => (
                    <div key={label} className="flex items-center justify-between px-6 py-4">
                      <span className="text-[13px] text-muted-foreground">{label}</span>
                      <span className="text-[20px] font-bold tabular-nums text-foreground">{stat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Mission & Values ── */}
      <section id="mission" className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 noise-overlay pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mb-20">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-6">Our mission</p>
            <h2 className="text-[36px] sm:text-[44px] font-bold leading-[1.1] tracking-tight mb-8 text-balance">
              We believe property maintenance should be systematic, documented, and informed by data — not guesswork.
            </h2>
            <p className="text-[16px] text-muted-foreground leading-[1.8]">
              Nexus Operations exists because finding reliable contractors is frustrating, coordinating maintenance is time-consuming, and most property owners have no organized record of what work has been done to their property. We solve all three. Our platform connects you with verified contractors, manages the entire engagement process, and maintains a permanent, structured record that turns service history into actionable intelligence.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group relative border border-border bg-card rounded-lg p-6 transition-all hover:border-primary/30 hover:bg-card/80">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-5 transition-colors group-hover:bg-primary/15">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-[14px] font-semibold mb-2">{title}</h3>
                <p className="text-[13px] text-muted-foreground leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── About ── */}
      <section id="about" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1fr_380px] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-6">What we do</p>
              <h2 className="text-[36px] sm:text-[40px] font-bold leading-[1.1] tracking-tight mb-8 max-w-lg text-balance">
                End-to-end property service management.
              </h2>
              <div className="space-y-5 text-[15px] text-muted-foreground leading-[1.85]">
                <p>
                  Nexus Operations manages the full lifecycle of property service work — from the moment a request is submitted through job completion and beyond. We are not a referral service and not a directory. We are an operations company. When you work with Nexus, we are actively involved: reviewing project documentation, coordinating the contractor assignment, confirming the consultation, and maintaining a permanent record of every action taken.
                </p>
                <p>
                  Every project that moves through the platform generates structured data: trade category, property address, timeline, scope, cost, and outcome. We organize that data into readable service reports and use it to deliver specific, evidence-based maintenance recommendations for each property we manage. The result is an ownership and management experience built on information rather than guesswork.
                </p>
                <p>
                  Our contractor network is maintained manually. Every contractor is licensed for their trade, carries general liability insurance, and has been individually reviewed before receiving access to any project. These requirements are ongoing — not a one-time checkbox at signup.
                </p>
              </div>
            </div>

            {/* Fact sheet */}
            <div className="border border-border rounded-lg overflow-hidden text-[13px]">
              <div className="border-b border-border px-5 py-4 bg-muted/50">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Company facts</p>
              </div>
              {[
                ["Founded",                 "2025"],
                ["Headquarters",            "Topeka, KS 66606"],
                ["Service area",            "Shawnee County + surrounding"],
                ["Phone",                   "(785) 428-0244"],
                ["Email",                   "admin@nexusoperations.org"],
                ["Contractors per request", "One — exclusively assigned"],
                ["Network requirements",    "License · Insurance · Manual review"],
                ["Post-project reporting",  "Included with all accounts"],
              ].map(([label, value], i, arr) => (
                <div key={label}
                  className={`flex justify-between gap-4 px-5 py-3.5 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                  <span className="text-muted-foreground shrink-0">{label}</span>
                  <span className="text-right font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Who We Serve ── */}
      <section id="who-we-serve" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-6">Who we serve</p>
            <h2 className="text-[36px] sm:text-[40px] font-bold leading-[1.1] tracking-tight text-balance">
              Three account types. One managed network.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                tag:   "Property Owners",
                role:  "Residential homeowners",
                body:  "Homeowners in the Topeka metro area use Nexus to coordinate maintenance and repair projects. Submit a request with photographs, a scope description, and a budget ceiling — Nexus handles contractor assignment through consultation confirmation. One contractor, fully prepared, exclusively assigned to your project.",
                link:  "/auth/sign-up",
                cta:   "Open homeowner account",
                highlight: false,
              },
              {
                tag:   "Property Managers",
                role:  "Landlords and multi-property managers",
                body:  "Property management accounts are built for professionals managing maintenance across multiple addresses. Every request, estimate, and completion record is organized by property. Portfolio reports break down maintenance spend, surface deferred work, and flag approaching service intervals.",
                link:  "/auth/sign-up?role=property_manager",
                cta:   "Open manager account",
                highlight: false,
              },
              {
                tag:   "Contractors",
                role:  "Licensed tradespeople",
                body:  "Contractors apply for network access and are reviewed individually. Approved contractors receive notifications for requests in their trade and service area. Each notification includes project type, location, and budget ceiling. Claim a request for exclusive access — no auction, no competing bids.",
                link:  "/auth/sign-up?role=contractor",
                cta:   "Apply for access",
                highlight: true,
              },
            ].map(({ tag, role, body, link, cta, highlight }) => (
              <div key={tag} className={`relative border rounded-lg p-6 transition-all ${highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card hover:border-primary/20"}`}>
                {highlight && (
                  <div className="absolute -top-3 left-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground">
                      <CheckCircle2 className="h-3 w-3" />
                      Free for contractors
                    </span>
                  </div>
                )}
                <div className={highlight ? "mt-2" : ""}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{tag}</p>
                  <p className="mt-2 text-[15px] font-semibold">{role}</p>
                  <p className="mt-4 text-[13px] text-muted-foreground leading-[1.8]">{body}</p>
                  <Link href={link}
                    className={`mt-6 inline-flex items-center gap-1.5 text-[12px] font-semibold transition ${highlight ? "text-primary hover:opacity-80" : "text-primary hover:opacity-80"}`}>
                    {cta} <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 gradient-mesh pointer-events-none opacity-50" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-6">Pricing</p>
            <h2 className="text-[36px] sm:text-[40px] font-bold leading-[1.1] tracking-tight mb-4">
              Simple, transparent pricing.
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-xl mx-auto">
              No hidden fees. No subscription traps. Pay only when you submit a service request.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
            {/* Homeowner */}
            <div className="border border-border bg-card rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-2">Homeowner</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[36px] font-bold">$25</span>
                  <span className="text-muted-foreground text-[14px]">/ request</span>
                </div>
                <p className="mt-3 text-[13px] text-muted-foreground">Per service request submitted through the platform.</p>
              </div>
              <div className="p-6 space-y-3">
                {[
                  "Verified contractor assignment",
                  "Full project documentation",
                  "Consultation coordination",
                  "Permanent service record",
                  "Maintenance advisory included",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-[13px] text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 pt-0">
                <Link href="/auth/sign-up"
                  className="flex w-full items-center justify-center gap-2 rounded bg-secondary px-4 py-2.5 text-[12px] font-semibold text-secondary-foreground transition hover:opacity-90">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Property Manager */}
            <div className="border-2 border-primary bg-card rounded-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              <div className="p-6 border-b border-border">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-2">Property Manager</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[36px] font-bold">$20</span>
                  <span className="text-muted-foreground text-[14px]">/ request</span>
                </div>
                <p className="mt-3 text-[13px] text-muted-foreground">Volume pricing for property management professionals.</p>
              </div>
              <div className="p-6 space-y-3">
                {[
                  "Everything in Homeowner",
                  "Multi-property organization",
                  "Portfolio-level reporting",
                  "Spend breakdown by address",
                  "Deferred maintenance tracking",
                  "Priority support",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-[13px] text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 pt-0">
                <Link href="/auth/sign-up?role=property_manager"
                  className="flex w-full items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-[12px] font-semibold text-primary-foreground transition hover:opacity-90">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Contractor */}
            <div className="border border-primary/40 bg-primary/5 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-primary/20">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-2">Contractor</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[36px] font-bold">$0</span>
                  <span className="text-muted-foreground text-[14px]">/ always</span>
                </div>
                <p className="mt-3 text-[13px] text-muted-foreground">Free access to the Nexus contractor network.</p>
              </div>
              <div className="p-6 space-y-3">
                {[
                  "Receive project notifications",
                  "Exclusive claim system",
                  "Full project documentation",
                  "No bidding or auctions",
                  "No referral fees",
                  "No subscription fees",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-[13px] text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 pt-0">
                <Link href="/auth/sign-up?role=contractor"
                  className="flex w-full items-center justify-center gap-2 rounded border border-primary bg-transparent px-4 py-2.5 text-[12px] font-semibold text-primary transition hover:bg-primary/10">
                  Apply for Access
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-[12px] text-muted-foreground mt-10">
            Fees are charged when a service request is submitted. No monthly subscriptions. No hidden charges.
          </p>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Services ── */}
      <section id="services" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[400px_1fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-6">Service categories</p>
              <h2 className="text-[36px] sm:text-[40px] font-bold leading-[1.1] tracking-tight mb-6 text-balance">
                Trades in the Nexus network.
              </h2>
              <p className="text-[15px] text-muted-foreground leading-[1.85]">
                Each trade listed has verified contractors available in Shawnee County. Every submission requires photographs, a written scope, and a budget ceiling before entering the contractor queue.
              </p>
              <p className="mt-4 text-[13px] text-muted-foreground">
                Need a trade not listed? <a href="mailto:admin@nexusoperations.org" className="text-primary hover:underline">Contact us</a> — the network expands as additional contractors are approved.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <div key={s.name} className="border border-border bg-card rounded-lg p-5 transition-colors hover:border-primary/20">
                  <p className="text-[14px] font-semibold mb-2">{s.name}</p>
                  <p className="text-[12.5px] text-muted-foreground leading-[1.7]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Process ── */}
      <section id="process" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-6">How it works</p>
            <h2 className="text-[36px] sm:text-[40px] font-bold leading-[1.1] tracking-tight mb-4 text-balance">
              The complete sequence.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-[1.85]">
              Every service request follows this sequence. Nothing is skipped and no step is automated without human review.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {[
              {
                n: "01",
                title: "Submit your request",
                body: "Create a request with 2–10 photographs, a written scope, maximum budget, and preferred consultation windows. No contractor contact occurs at this stage.",
              },
              {
                n: "02",
                title: "Nexus reviews the submission",
                body: "Before entering the queue, Nexus staff review for completeness. If photos are insufficient or scope needs clarification, you'll be contacted.",
              },
              {
                n: "03",
                title: "A contractor claims the request",
                body: "Contractors in the applicable trade receive notifications. The first to claim has exclusive access — the listing is immediately removed from others.",
              },
              {
                n: "04",
                title: "Consultation is confirmed",
                body: "Nexus confirms the appointment with both parties. The contractor receives all documentation: photographs, scope, and budget ceiling.",
              },
              {
                n: "05",
                title: "On-site visit and estimate",
                body: "The contractor arrives prepared, assesses the work, and provides a written estimate. You decide whether to proceed — no obligation to accept.",
              },
              {
                n: "06",
                title: "Completion and documentation",
                body: "When work proceeds, the contractor updates the record with completion status and final cost. Nexus maintains the complete record permanently.",
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-5 border border-border bg-card rounded-lg p-6 transition-colors hover:border-primary/20">
                <span className="text-[32px] font-bold text-primary/20 leading-none select-none tabular-nums">{n}</span>
                <div>
                  <p className="text-[14px] font-semibold mb-2">{title}</p>
                  <p className="text-[13px] text-muted-foreground leading-[1.75]">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Contractors ── */}
      <section id="contractors" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-6">For contractors</p>
              <h2 className="text-[36px] sm:text-[40px] font-bold leading-[1.1] tracking-tight mb-8 max-w-md text-balance">
                Join the Nexus network. Free.
              </h2>
              <div className="space-y-5 text-[15px] text-muted-foreground leading-[1.85]">
                <p>
                  Contractors apply through the platform and are reviewed individually before any account is activated. Approval requires a current contractor license and proof of general liability insurance. All applications are reviewed by Nexus staff — approval is not automatic.
                </p>
                <p>
                  <strong className="text-foreground">There is no fee to join the Nexus contractor network.</strong> No subscription, no referral fees, no per-lead charges. You receive notifications, claim requests that fit your schedule, and work directly with property owners.
                </p>
                <p>
                  When you claim a request, it belongs exclusively to you. No other contractor sees it. The full project documentation — photographs, written scope, and budget — is available immediately. You arrive at the consultation with complete context.
                </p>
              </div>
              <div className="mt-10">
                <Link href="/auth/sign-up?role=contractor"
                  className="inline-flex items-center gap-2.5 rounded bg-primary px-6 py-3 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90">
                  Apply for contractor access
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="border-b border-border px-6 py-4 bg-muted/50">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Application requirements
                </p>
              </div>
              <div className="divide-y divide-border">
                {[
                  ["Active contractor license",    "Required for each applied trade. Must be current and maintained."],
                  ["General liability insurance",  "Certificate of insurance required. Policy must remain active."],
                  ["Shawnee County service area",  "Primary coverage required. Adjacent counties may be approved."],
                  ["Manual review by Nexus staff", "All applications are reviewed individually."],
                  ["Ongoing compliance",           "Documentation is periodically reverified."],
                ].map(([req, detail]) => (
                  <div key={req} className="px-6 py-4">
                    <p className="text-[13px] font-semibold mb-1">{req}</p>
                    <p className="text-[12.5px] text-muted-foreground leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Contact ── */}
      <section id="contact" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-6">Contact</p>
              <h2 className="text-[36px] sm:text-[40px] font-bold leading-[1.1] tracking-tight mb-8 max-w-md text-balance">
                Service area and direct contact.
              </h2>
              <div className="text-[15px] text-muted-foreground leading-[1.85] mb-10">
                <p>
                  Nexus Operations is based in Topeka, Kansas and serves Shawnee County and adjacent areas. The service area expands as additional contractors are approved. If you're outside current coverage, contact us — we maintain a geographic waitlist.
                </p>
              </div>
              <div className="space-y-4">
                <a href="tel:+17854280244"
                  className="flex items-center gap-3 text-[14px] text-muted-foreground transition hover:text-foreground">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">(785) 428-0244</p>
                    <p className="text-[12px]">Monday – Friday, 8am – 6pm CT</p>
                  </div>
                </a>
                <a href="mailto:admin@nexusoperations.org"
                  className="flex items-center gap-3 text-[14px] text-muted-foreground transition hover:text-foreground">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">admin@nexusoperations.org</p>
                    <p className="text-[12px]">We respond within 24 hours</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 text-[14px] text-muted-foreground">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Topeka, KS 66606</p>
                    <p className="text-[12px]">Nexus Operations, LLC</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="border-b border-border px-6 py-4 bg-muted/50">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Quick links</p>
              </div>
              {[
                { href: "/auth/sign-up",                       label: "Homeowner account",         sub: "Submit and track service requests" },
                { href: "/auth/sign-up?role=property_manager", label: "Property manager account",  sub: "Multi-property coordination and reporting" },
                { href: "/auth/sign-up?role=contractor",       label: "Contractor application",    sub: "Free access to the verified network" },
                { href: "/faq",                                label: "Frequently asked questions", sub: "Process, pricing, policies" },
                { href: "/auth/login",                         label: "Sign in",                   sub: "Access your existing account" },
              ].map(({ href, label, sub }) => (
                <Link key={href} href={href}
                  className="group flex items-center justify-between px-6 py-4 border-b border-border last:border-b-0 transition hover:bg-muted/50">
                  <div>
                    <p className="text-[14px] font-medium">{label}</p>
                    <p className="text-[12px] text-muted-foreground">{sub}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-16 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-16">
            <div>
              <Link href="/">
                <Image src="/nexus-logo.png" alt="Nexus Operations" width={110} height={37}
                  style={{ height: "22px", width: "auto" }} />
              </Link>
              <p className="mt-5 text-[12px] text-muted-foreground leading-relaxed max-w-[200px]">
                Property service management for Topeka, Kansas — coordination, documentation, and advisory.
              </p>
              <div className="mt-6 space-y-2">
                <a href="tel:+17854280244" className="block text-[11.5px] text-muted-foreground hover:text-foreground transition">(785) 428-0244</a>
                <a href="mailto:admin@nexusoperations.org" className="block text-[11.5px] text-muted-foreground hover:text-foreground transition">admin@nexusoperations.org</a>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">Platform</p>
              <ul className="space-y-3">
                {[
                  { href: "#mission",     label: "Our Mission" },
                  { href: "#about",       label: "About Nexus" },
                  { href: "#who-we-serve",label: "Who We Serve" },
                  { href: "#pricing",     label: "Pricing" },
                  { href: "#services",    label: "Services" },
                  { href: "/faq",         label: "FAQ" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="text-[12px] text-muted-foreground transition hover:text-foreground">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">Accounts</p>
              <ul className="space-y-3">
                {[
                  { href: "/auth/sign-up",                       label: "Homeowner" },
                  { href: "/auth/sign-up?role=property_manager", label: "Property Manager" },
                  { href: "/auth/sign-up?role=contractor",       label: "Contractor" },
                  { href: "/auth/login",                         label: "Sign In" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-[12px] text-muted-foreground transition hover:text-foreground">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">Legal</p>
              <ul className="space-y-3">
                {[
                  { href: "/terms",   label: "Terms of Service" },
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/sitemap", label: "Sitemap" },
                  { href: "https://nexusoperations.zendesk.com/hc/en-us", label: "Help Center" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="text-[12px] text-muted-foreground transition hover:text-foreground">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground">&copy; 2026 Nexus Operations, LLC. Topeka, Kansas.</p>
            <div className="flex items-center gap-6">
              <Link href="/terms"   className="text-[11px] text-muted-foreground hover:text-foreground transition">Terms</Link>
              <Link href="/privacy" className="text-[11px] text-muted-foreground hover:text-foreground transition">Privacy</Link>
              <Link href="/sitemap" className="text-[11px] text-muted-foreground hover:text-foreground transition">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}
