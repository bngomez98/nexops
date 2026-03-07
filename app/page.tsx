"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, MapPin, ArrowRight, ArrowUpRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const services: { name: string; desc: string }[] = [
  { name: "Roofing",        desc: "Full replacement, storm damage assessment, leak repair, and insurance restoration coordination." },
  { name: "HVAC",           desc: "Central air, heat pumps, ductless mini-splits, furnace replacement, and annual maintenance." },
  { name: "Electrical",     desc: "Panel upgrades, circuit additions, rewiring, subpanel installation, and EV charger prep." },
  { name: "Plumbing",       desc: "Water heaters, leak detection, drain clearing, main line repair, and fixture replacement." },
  { name: "Concrete",       desc: "Driveways, patios, sidewalks, foundation repair, and structural flatwork." },
  { name: "Tree Service",   desc: "Removal, crown reduction, stump grinding, and post-storm emergency response." },
  { name: "Fencing",        desc: "Privacy, chain link, vinyl, wood, and commercial perimeter fencing." },
  { name: "General Repair", desc: "Drywall, carpentry, painting, door and window replacement, and interior repairs." },
]

const process = [
  { n: "01", title: "Submit your request", body: "Create a request with photographs, a written scope, budget ceiling, and preferred consultation windows. No contractor contact occurs at this stage." },
  { n: "02", title: "Nexus reviews your submission", body: "Staff review for completeness before it enters the queue. If photos are insufficient or scope needs clarification, we contact you directly." },
  { n: "03", title: "A contractor claims the request", body: "Contractors in the applicable trade receive a notification. The first to claim has exclusive access — the request is immediately removed from all others." },
  { n: "04", title: "Consultation confirmed", body: "Nexus confirms the appointment with both parties. The contractor receives all documentation: photographs, scope, and budget ceiling." },
  { n: "05", title: "On-site visit and estimate", body: "The contractor arrives prepared and provides a written itemized estimate. You decide whether to proceed — there is no obligation to accept." },
  { n: "06", title: "Completion and permanent record", body: "When work proceeds, the contractor updates the record with completion status and final cost. Nexus maintains the full record permanently." },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background font-sans">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10 h-[52px]">
          <Link href="/" className="flex-shrink-0">
            <Image src="/nexus-logo.png" alt="Nexus Operations" width={140} height={46}
              style={{ height: "24px", width: "auto" }} priority />
          </Link>

          <nav className="hidden items-center lg:flex" aria-label="Main navigation">
            {[
              { href: "#about",       label: "About" },
              { href: "#mission",     label: "Mission" },
              { href: "#who-we-serve",label: "Who We Serve" },
              { href: "#pricing",     label: "Pricing" },
              { href: "#services",    label: "Services" },
              { href: "#process",     label: "Process" },
              { href: "#contractors", label: "Contractors" },
            ].map(({ href, label }) => (
              <a key={href} href={href}
                className="px-3.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground tracking-wide">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/auth/login"
              className="hidden text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground md:block px-3 py-1.5">
              Sign In
            </Link>
            <Link href="/auth/sign-up"
              className="rounded-sm bg-primary px-4 py-2 text-[11.5px] font-semibold text-primary-foreground transition hover:opacity-90">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-40 pb-28 lg:pt-52 lg:pb-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex items-center gap-2.5 mb-10">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-medium text-primary tracking-[0.14em] uppercase">
              Topeka, Kansas — Shawnee County
            </span>
          </div>

          <h1 className="text-[56px] sm:text-[72px] lg:text-[96px] xl:text-[112px] font-bold tracking-[-0.04em] leading-[0.92] text-foreground max-w-4xl text-balance">
            Property service<br />
            <span className="text-primary">management.</span>
          </h1>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <p className="text-[17px] lg:text-[18px] text-muted-foreground leading-[1.8] max-w-xl">
              Nexus Operations coordinates maintenance, repair, and improvement projects for property owners and managers in Topeka, Kansas — from submission through completion, with full documentation, structured reporting, and evidence-based maintenance advisory built in.
            </p>

            <div className="flex items-center gap-6 lg:justify-end">
              <Link href="/auth/sign-up"
                className="inline-flex items-center gap-2.5 bg-primary px-6 py-3 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90 rounded-sm">
                Open an Account <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#about"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition hover:text-foreground">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="border-y border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {[
              { stat: "8",     label: "Trade categories" },
              { stat: "1",     label: "Contractor per request" },
              { stat: "100%",  label: "Verified, licensed network" },
              { stat: "24 hr", label: "Typical assignment" },
            ].map(({ stat, label }) => (
              <div key={label} className="py-8 px-8 first:pl-0 last:pr-0">
                <p className="text-[36px] font-bold tabular-nums leading-none text-foreground">{stat}</p>
                <p className="mt-2 text-[12px] text-muted-foreground tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── About ── */}
      <section id="about" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[1fr_520px] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">What Nexus is</p>
              <h2 className="text-[38px] lg:text-[48px] font-bold leading-[1.05] tracking-tight mb-10 text-balance max-w-xl">
                An operations company, not a referral service.
              </h2>
              <div className="space-y-6 text-[15px] lg:text-[16px] text-muted-foreground leading-[1.85]">
                <p>
                  Nexus Operations manages the full lifecycle of property service work. We are not a directory. We are not a marketplace. We are an operations company actively involved in every project — from reviewing submissions to coordinating contractor assignments to maintaining permanent records of every action taken.
                </p>
                <p>
                  Every project generates structured data: trade category, property address, timeline, scope, cost, and outcome. We organize that data into readable service reports and use it to deliver specific, evidence-based maintenance recommendations. The result is ownership built on information rather than guesswork.
                </p>
                <p>
                  Our contractor network is maintained manually. Every contractor carries a current trade license and general liability insurance, and has been individually reviewed before receiving access. These requirements are ongoing.
                </p>
              </div>
            </div>

            {/* Fact sheet — ruled table, no border box */}
            <div className="pt-0 lg:pt-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">Company facts</p>
              <div className="divide-y divide-border border-t border-b border-border text-[13px]">
                {([
                  ["Founded",                 "2025"],
                  ["Headquarters",            "Topeka, KS 66606"],
                  ["Service area",            "Shawnee County + surrounding"],
                  ["Phone",                   "(785) 428-0244"],
                  ["Email",                   "admin@nexusoperations.org"],
                  ["Contractors per request", "One — exclusively assigned"],
                  ["Network requirements",    "License · Insurance · Manual review"],
                  ["Post-project reporting",  "Included with all accounts"],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-6 py-3.5">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Mission ── */}
      <section id="mission" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Mission</p>
          <h2 className="text-[38px] lg:text-[52px] font-bold leading-[1.05] tracking-tight mb-12 text-balance max-w-3xl">
            Property maintenance should be systematic, documented, and informed by data — not guesswork.
          </h2>

          <div className="grid gap-0 lg:grid-cols-2 border-t border-border">
            {([
              [
                "Operational Precision",
                "Every request follows a documented sequence. No step is skipped, no detail is lost, and no contractor receives access without a complete review. We build systems that produce consistent outcomes regardless of who submits the request or which contractor claims it.",
              ],
              [
                "Verified Quality",
                "Our contractor network is curated, not crowded. Every contractor is licensed for their trade, carries active general liability insurance, and has been individually reviewed before receiving access to any project. Approval is not automatic and requirements are re-verified on an ongoing basis.",
              ],
              [
                "Single-Point Accountability",
                "One contractor per request. No auctions, no competing bids, no ambiguity about who is responsible for a given job. The contractor assigned to your project has exclusive access and full documentation from the moment they claim it.",
              ],
              [
                "Data-Driven Decisions",
                "We don't just coordinate work — we track it. Every project record contributes to a growing service history that we turn into structured reports and specific maintenance recommendations. Good data produces better decisions for your property.",
              ],
            ] as [string, string][]).map(([title, desc], i) => (
              <div key={title}
                className={`py-10 pr-0 lg:pr-16 border-b border-border ${i % 2 === 1 ? "lg:pl-16 lg:border-l" : ""}`}>
                <h3 className="text-[15px] font-semibold mb-4">{title}</h3>
                <p className="text-[14px] text-muted-foreground leading-[1.85]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Who We Serve ── */}
      <section id="who-we-serve" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Who we serve</p>
          <h2 className="text-[38px] lg:text-[48px] font-bold leading-[1.05] tracking-tight mb-16 text-balance max-w-2xl">
            Three account types. One managed network.
          </h2>

          <div className="divide-y divide-border border-t border-b border-border">
            {[
              {
                tag:  "Property Owners",
                sub:  "Residential homeowners",
                body: "Homeowners in the Topeka metro area use Nexus to coordinate maintenance and repair projects. Submit a request with photographs, a scope description, and a budget ceiling — Nexus handles contractor assignment and consultation coordination. One contractor, fully prepared, exclusively assigned.",
                fee:  "$25 / request",
                link: "/auth/sign-up",
                cta:  "Open homeowner account",
              },
              {
                tag:  "Property Managers",
                sub:  "Landlords and multi-property managers",
                body: "Built for professionals managing maintenance across multiple addresses. Every request, estimate, and completion record is organized by property. Portfolio reports break down maintenance spend, surface deferred work, and flag approaching service intervals across your entire portfolio.",
                fee:  "$20 / request",
                link: "/auth/sign-up?role=property_manager",
                cta:  "Open manager account",
              },
              {
                tag:  "Contractors",
                sub:  "Licensed tradespeople — free network access",
                body: "Approved contractors receive notifications for requests in their trade and service area. Each notification includes project type, location, and budget ceiling. Claim a request for exclusive access — no auction, no competing bids, no referral fees, no subscription. Free to join, free to participate.",
                fee:  "$0 — always free",
                link: "/auth/sign-up?role=contractor",
                cta:  "Apply for access",
              },
            ].map(({ tag, sub, body, fee, link, cta }) => (
              <div key={tag} className="grid gap-6 py-10 lg:grid-cols-[240px_1fr_200px] lg:items-start">
                <div>
                  <p className="text-[13px] font-semibold">{tag}</p>
                  <p className="text-[12px] text-muted-foreground mt-1">{sub}</p>
                </div>
                <p className="text-[14px] text-muted-foreground leading-[1.85] max-w-xl">{body}</p>
                <div className="lg:text-right">
                  <p className="text-[15px] font-bold text-foreground mb-4">{fee}</p>
                  <Link href={link}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary transition hover:opacity-70">
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
      <section id="pricing" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Pricing</p>
          <h2 className="text-[38px] lg:text-[48px] font-bold leading-[1.05] tracking-tight mb-4 max-w-2xl text-balance">
            Simple, transparent pricing.
          </h2>
          <p className="text-[15px] text-muted-foreground mb-16 max-w-xl leading-[1.75]">
            No subscriptions. No hidden fees. Fees are charged per service request submitted. Contractors pay nothing.
          </p>

          {/* Pricing table */}
          <div className="border-t border-border">
            {/* Header row */}
            <div className="grid grid-cols-[1fr_140px_140px_140px] border-b border-border py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              <span>What's included</span>
              <span className="text-center">Homeowner</span>
              <span className="text-center text-primary">Property Mgr</span>
              <span className="text-center">Contractor</span>
            </div>

            {/* Price row */}
            <div className="grid grid-cols-[1fr_140px_140px_140px] border-b border-border py-6 items-end">
              <span className="text-[13px] text-muted-foreground">Price per request</span>
              <span className="text-center text-[28px] font-bold leading-none">$25</span>
              <span className="text-center text-[28px] font-bold leading-none text-primary">$20</span>
              <span className="text-center text-[28px] font-bold leading-none">$0</span>
            </div>

            {/* Feature rows */}
            {[
              ["Verified contractor assignment",   true,  true,  true  ],
              ["Full project documentation",        true,  true,  true  ],
              ["Consultation coordination",         true,  true,  true  ],
              ["Permanent service record",          true,  true,  true  ],
              ["Post-project reporting",            true,  true,  false ],
              ["Maintenance advisory",              true,  true,  false ],
              ["Multi-property portfolio view",     false, true,  false ],
              ["Deferred maintenance tracking",     false, true,  false ],
              ["Spend breakdown by address",        false, true,  false ],
              ["Exclusive project notifications",   false, false, true  ],
              ["No referral or per-claim fees",     false, false, true  ],
            ].map(([label, hw, pm, co]) => (
              <div key={label as string}
                className="grid grid-cols-[1fr_140px_140px_140px] border-b border-border/50 py-3.5 text-[13px] items-center">
                <span className="text-muted-foreground">{label as string}</span>
                <span className="text-center">{hw ? <span className="text-primary font-bold">✓</span> : <span className="text-border">—</span>}</span>
                <span className="text-center">{pm ? <span className="text-primary font-bold">✓</span> : <span className="text-border">—</span>}</span>
                <span className="text-center">{co ? <span className="text-primary font-bold">✓</span> : <span className="text-border">—</span>}</span>
              </div>
            ))}

            {/* CTA row */}
            <div className="grid grid-cols-[1fr_140px_140px_140px] pt-8 gap-3 items-center">
              <span />
              <div className="flex justify-center">
                <Link href="/auth/sign-up"
                  className="rounded-sm bg-secondary px-4 py-2 text-[11.5px] font-semibold text-foreground transition hover:opacity-80 whitespace-nowrap">
                  Get Started
                </Link>
              </div>
              <div className="flex justify-center">
                <Link href="/auth/sign-up?role=property_manager"
                  className="rounded-sm bg-primary px-4 py-2 text-[11.5px] font-semibold text-primary-foreground transition hover:opacity-90 whitespace-nowrap">
                  Get Started
                </Link>
              </div>
              <div className="flex justify-center">
                <Link href="/auth/sign-up?role=contractor"
                  className="rounded-sm border border-primary px-4 py-2 text-[11.5px] font-semibold text-primary transition hover:bg-primary/10 whitespace-nowrap">
                  Apply Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Services ── */}
      <section id="services" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[320px_1fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Service categories</p>
              <h2 className="text-[38px] lg:text-[44px] font-bold leading-[1.05] tracking-tight mb-6 text-balance">
                Trades in the network.
              </h2>
              <p className="text-[14px] text-muted-foreground leading-[1.85]">
                Each category has verified contractors available in Shawnee County. Every request requires photographs, a written scope, and a budget ceiling before entering the contractor queue.
              </p>
              <p className="mt-5 text-[13px] text-muted-foreground">
                Need a trade not listed?{" "}
                <a href="mailto:admin@nexusoperations.org" className="text-primary hover:underline">Contact us</a>
                {" "}— the network expands as additional contractors are approved.
              </p>
            </div>

            {/* Ruled list — no cards */}
            <div className="divide-y divide-border border-t border-b border-border">
              {services.map((s) => (
                <div key={s.name} className="grid gap-4 py-6 sm:grid-cols-[180px_1fr]">
                  <p className="text-[14px] font-semibold text-foreground">{s.name}</p>
                  <p className="text-[13.5px] text-muted-foreground leading-[1.75]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Process ── */}
      <section id="process" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">How it works</p>
          <h2 className="text-[38px] lg:text-[48px] font-bold leading-[1.05] tracking-tight mb-4 text-balance max-w-2xl">
            The complete sequence.
          </h2>
          <p className="text-[15px] text-muted-foreground mb-16 max-w-xl leading-[1.75]">
            Every service request follows this sequence. Nothing is skipped. No step is automated without human review.
          </p>

          {/* Process rows — no cards, open layout */}
          <div className="divide-y divide-border border-t border-b border-border">
            {process.map(({ n, title, body }) => (
              <div key={n} className="grid gap-6 py-10 lg:grid-cols-[80px_260px_1fr] lg:items-start">
                <span className="text-[44px] font-bold text-primary/20 leading-none tabular-nums select-none">{n}</span>
                <p className="text-[15px] font-semibold text-foreground leading-snug pt-1">{title}</p>
                <p className="text-[14px] text-muted-foreground leading-[1.85]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Reporting ── */}
      <section id="reporting" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[1fr_400px] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Reporting and advisory</p>
              <h2 className="text-[38px] lg:text-[48px] font-bold leading-[1.05] tracking-tight mb-10 max-w-xl text-balance">
                What Nexus does with the data it collects.
              </h2>
              <div className="space-y-6 text-[15px] text-muted-foreground leading-[1.85]">
                <p>
                  Every project that moves through the platform generates a record — trade category, address, timeline, scope, cost, and outcome. Across dozens of projects, that data describes something meaningful: how a property is being maintained, where money is going, what work recurs, and what is being deferred.
                </p>
                <p>
                  Nexus organizes this data into readable service reports. Property owners receive periodic summaries of recent activity, spend by trade category, and any open or unresolved items. Property managers receive the same view at the portfolio level — by address, by category, and in aggregate.
                </p>
                <p>
                  Beyond reporting on what has happened, Nexus uses service history to provide proactive guidance — surfacing service intervals, deferred work patterns, and maintenance recommendations specific to each property.
                </p>
              </div>
            </div>

            <div className="pt-0 lg:pt-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">Report contents</p>
              <div className="divide-y divide-border border-t border-b border-border text-[13px]">
                {[
                  ["Completed project log",        "Trade, address, date, scope, final cost."],
                  ["Spend by category",            "Cost distribution across trades, period and YoY."],
                  ["Open and deferred items",      "Requests not completed and reason where recorded."],
                  ["Service interval flags",       "Categories past standard maintenance windows."],
                  ["Recurring issue patterns",     "Repeated requests in the same trade or address."],
                  ["Proactive recommendations",    "Property-specific — not generic schedules."],
                  ["Portfolio summary",            "Aggregate view across all managed addresses."],
                ].map(([item, detail]) => (
                  <div key={item} className="py-4">
                    <p className="font-medium text-foreground mb-1">{item}</p>
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
      <section id="contractors" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">For contractors</p>
              <h2 className="text-[38px] lg:text-[48px] font-bold leading-[1.05] tracking-tight mb-10 max-w-md text-balance">
                Join the Nexus network. Always free.
              </h2>
              <div className="space-y-6 text-[15px] text-muted-foreground leading-[1.85]">
                <p>
                  Contractors apply through the platform and are reviewed individually before any account is activated. Approval requires a current contractor license and proof of general liability insurance. All applications are reviewed by Nexus staff — approval is not automatic.
                </p>
                <p>
                  <strong className="text-foreground">There is no fee to join the Nexus contractor network.</strong> No subscription, no referral fees, no per-lead charges. You receive project notifications, claim requests that fit your schedule, and work directly with property owners — at no cost, ever.
                </p>
                <p>
                  Service areas are defined by your license and availability. Notifications are filtered to your declared trade categories and Shawnee County service area. You are never contacted about work outside the scope you set.
                </p>
              </div>
              <div className="mt-10">
                <Link href="/auth/sign-up?role=contractor"
                  className="inline-flex items-center gap-2.5 rounded-sm bg-primary px-6 py-3 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90">
                  Apply for Network Access <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="pt-0 lg:pt-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">Contractor requirements</p>
              <div className="divide-y divide-border border-t border-b border-border text-[13px]">
                {[
                  ["License",         "Current, valid contractor license for your trade, issued by the State of Kansas or applicable authority."],
                  ["Insurance",       "Active general liability insurance policy. Certificate of insurance required at application."],
                  ["Service area",    "Must operate within Shawnee County, Kansas or directly adjacent areas."],
                  ["Review",          "All applications are reviewed manually by Nexus staff. No automatic approvals."],
                  ["Ongoing",         "License and insurance documentation is re-verified periodically. Lapsed credentials result in account suspension."],
                ].map(([item, detail]) => (
                  <div key={item} className="py-4">
                    <p className="font-medium text-foreground mb-1">{item}</p>
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
      <section id="contact" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[1fr_400px] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Contact</p>
              <h2 className="text-[38px] lg:text-[48px] font-bold leading-[1.05] tracking-tight mb-10 text-balance max-w-lg">
                Reach Nexus Operations directly.
              </h2>
              <p className="text-[15px] text-muted-foreground leading-[1.85] max-w-lg">
                For general inquiries, contractor applications, or questions about the platform, contact us directly. For active project issues, log in to your dashboard and use the messages section on your request.
              </p>
            </div>

            <div className="pt-0 lg:pt-16">
              <div className="divide-y divide-border border-t border-b border-border text-[14px]">
                {[
                  { icon: Phone, label: "Phone", value: "(785) 428-0244", href: "tel:+17854280244" },
                  { icon: Mail,  label: "Email", value: "admin@nexusoperations.org", href: "mailto:admin@nexusoperations.org" },
                  { icon: MapPin,label: "Location", value: "Topeka, KS 66606", href: null },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 py-5">
                    <Icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-0.5">{label}</p>
                      {href
                        ? <a href={href} className="text-foreground font-medium hover:text-primary transition-colors">{value}</a>
                        : <p className="text-foreground font-medium">{value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Footer ── */}
      <footer className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
            <div>
              <Image src="/nexus-logo.png" alt="Nexus Operations" width={130} height={43}
                style={{ height: "24px", width: "auto" }} className="mb-4" />
              <p className="text-[12px] text-muted-foreground leading-relaxed max-w-xs">
                Property service management in Topeka, Kansas. Coordinating maintenance, repair, and improvement for homeowners and property managers.
              </p>
            </div>

            <div className="grid gap-10 sm:grid-cols-3 text-[12.5px]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-5">Platform</p>
                <div className="space-y-3">
                  {[
                    { href: "#about",        label: "About Nexus" },
                    { href: "#mission",      label: "Mission & Values" },
                    { href: "#who-we-serve", label: "Who We Serve" },
                    { href: "#pricing",      label: "Pricing" },
                    { href: "#services",     label: "Services" },
                    { href: "#process",      label: "Process" },
                    { href: "#reporting",    label: "Reporting & Advisory" },
                    { href: "/faq",          label: "FAQ" },
                  ].map(({ href, label }) => (
                    <Link key={href} href={href}
                      className="block text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-5">Accounts</p>
                <div className="space-y-3">
                  {[
                    { href: "/auth/sign-up",                     label: "Homeowner Account" },
                    { href: "/auth/sign-up?role=property_manager",label: "Property Manager Account" },
                    { href: "/auth/sign-up?role=contractor",      label: "Contractor Application" },
                    { href: "/auth/login",                        label: "Sign In" },
                    { href: "/dashboard",                         label: "Dashboard" },
                  ].map(({ href, label }) => (
                    <Link key={href} href={href}
                      className="block text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-5">Legal</p>
                <div className="space-y-3">
                  {[
                    { href: "/terms",   label: "Terms of Service" },
                    { href: "/privacy", label: "Privacy Policy" },
                    { href: "/sitemap", label: "Sitemap" },
                  ].map(({ href, label }) => (
                    <Link key={href} href={href}
                      className="block text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11.5px] text-muted-foreground">
            <p>© {new Date().getFullYear()} Nexus Operations LLC. All rights reserved. Topeka, Kansas.</p>
            <p>admin@nexusoperations.org · (785) 428-0244</p>
          </div>
        </div>
      </footer>

    </main>
  )
}
