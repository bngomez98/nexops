"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, MapPin, ArrowRight, ArrowUpRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const services: { name: string; desc: string }[] = [
  { name: "Roofing",        desc: "Replacement, storm damage evaluation, leak repair, and insurance restoration coordination." },
  { name: "HVAC",           desc: "Central air, heat pumps, ductless mini-splits, furnace, and annual maintenance intervals." },
  { name: "Electrical",     desc: "Panel upgrades, circuit additions, rewiring, subpanel installation, and EV charger rough-in." },
  { name: "Plumbing",       desc: "Water heaters, leak detection, drain clearing, main line repair, and fixture work." },
  { name: "Concrete",       desc: "Driveways, patios, sidewalks, foundation repair, and structural flatwork." },
  { name: "Tree Service",   desc: "Removal, crown reduction, stump grinding, and emergency storm response." },
  { name: "Fencing",        desc: "Privacy, chain link, vinyl, wood, and commercial perimeter fencing." },
  { name: "General Repair", desc: "Drywall, carpentry, painting, door and window replacement, and interior repairs." },
]

const steps: { n: string; title: string; body: string }[] = [
  { n: "01", title: "Submit your request",           body: "Provide photographs, a written scope, a budget ceiling, and preferred consultation windows. No contractor contact occurs at this stage." },
  { n: "02", title: "Staff review",                  body: "Every submission is reviewed before entering the queue. If documentation is insufficient, you are contacted directly — it is not sent forward incomplete." },
  { n: "03", title: "Exclusive contractor assignment",body: "Contractors in the applicable trade are notified. The first to claim gets exclusive access. The request is immediately removed from all other queues." },
  { n: "04", title: "Consultation confirmed",        body: "Both parties receive confirmation. The contractor receives full documentation: photographs, scope, and your budget ceiling — before any site visit." },
  { n: "05", title: "On-site estimate",              body: "The contractor arrives prepared and delivers a written itemized estimate. You decide whether to proceed. No obligation." },
  { n: "06", title: "Completion and record",         body: "The contractor closes the project with final cost and completion status. The record — from original submission through final invoice — is permanent." },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10 h-[52px]">
          <Link href="/" className="flex-shrink-0">
            <Image src="/nexus-logo.png" alt="Nexus Operations" width={140} height={46}
              style={{ height: "24px", width: "auto" }} priority />
          </Link>

          <nav className="hidden items-center lg:flex" aria-label="Main navigation">
            {[
              { href: "#about",        label: "About" },
              { href: "#who-we-serve", label: "Who We Serve" },
              { href: "#pricing",      label: "Pricing" },
              { href: "#services",     label: "Services" },
              { href: "#process",      label: "Process" },
              { href: "#reporting",    label: "Reporting" },
              { href: "#contractors",  label: "Contractors" },
            ].map(({ href, label }) => (
              <a key={href} href={href}
                className="px-3.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground tracking-wide">
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

          <h1 className="text-[56px] sm:text-[72px] lg:text-[96px] xl:text-[112px] font-bold tracking-[-0.04em] leading-[0.92] max-w-5xl text-balance">
            Property service<br />
            <span className="text-primary">management.</span>
          </h1>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <p className="text-[17px] lg:text-[18px] text-muted-foreground leading-[1.8] max-w-2xl">
              Nexus Operations coordinates property maintenance, repair, and improvement for homeowners and property managers in the Topeka metro. Every project is managed from submission through completion — with documented service history and evidence-based maintenance advisory built into every account.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/auth/sign-up"
                className="inline-flex items-center gap-2.5 bg-primary px-6 py-3 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90 rounded-sm">
                Open an Account <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#about" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition hover:text-foreground">
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
              { stat: "$0",    label: "Contractor cost — always" },
              { stat: "$25",   label: "Per homeowner request" },
            ].map(({ stat, label }) => (
              <div key={label} className="py-8 px-8 first:pl-0 last:pr-0">
                <p className="text-[36px] font-bold tabular-nums leading-none">{stat}</p>
                <p className="mt-2 text-[12px] text-muted-foreground tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── About ── */}
      <section id="about" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-20 lg:grid-cols-[1fr_480px] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">What Nexus is</p>
              <h2 className="text-[38px] lg:text-[52px] font-bold leading-[1.05] tracking-tight mb-10 text-balance max-w-xl">
                An operations company. Not a directory.
              </h2>
              <div className="space-y-6 text-[15px] lg:text-[16px] text-muted-foreground leading-[1.85]">
                <p>
                  Nexus is actively involved in every project — not as a passive matchmaker, but as the coordinating party. We review submissions, manage contractor assignment, confirm consultations, maintain permanent project records, and produce structured service reports from the data those records generate.
                </p>
                <p>
                  Our approach eliminates the specific failure modes that make residential contracting unreliable: unprepared contractors, unclear scope, competing bids that stall decisions, and maintenance histories that exist only in someone&apos;s memory. Every project leaves a documented record. Every contractor arrives with full information. Reporting turns that history into something actionable.
                </p>
                <p>
                  Our network is maintained manually. Contractors carry current trade licenses and active general liability insurance and are individually reviewed before receiving any project access. Requirements are re-verified on an ongoing basis — not checked once at signup.
                </p>
              </div>
            </div>

            {/* Fact sheet */}
            <div className="pt-0 lg:pt-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">At a glance</p>
              <div className="divide-y divide-border border-t border-b border-border text-[13px]">
                {([
                  ["Founded",                 "2025"],
                  ["Headquarters",            "Topeka, KS 66606"],
                  ["Service area",            "Shawnee County and surrounding"],
                  ["Phone",                   "(785) 428-0244"],
                  ["Email",                   "admin@nexusoperations.org"],
                  ["Contractors per request", "One — exclusively assigned"],
                  ["Contractor requirements", "License · Insurance · Manual review"],
                  ["Reporting",               "Included with every account"],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-6 py-3.5">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Mission & Values ── */}
      <section id="mission" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-20 lg:grid-cols-[360px_1fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Mission</p>
              <h2 className="text-[32px] lg:text-[40px] font-bold leading-[1.1] tracking-tight mb-6 text-balance">
                Property maintenance should be systematic — not reactive.
              </h2>
              <p className="text-[15px] text-muted-foreground leading-[1.85]">
                Most deferred maintenance is not caused by negligence. It is caused by the absence of organized information. Nexus exists to provide that structure — and to make the people responsible for properties more informed with each project that passes through the system.
              </p>
            </div>

            <div className="divide-y divide-border border-t border-b border-border">
              {([
                ["Accountability at every step", "Every request follows a documented sequence. Staff review happens before contractor assignment, not after. No submission is forwarded without being confirmed complete and accurate."],
                ["One contractor, full responsibility", "Exclusive assignment eliminates the ambiguity of competing bids and split accountability. One contractor receives the project, arrives prepared, and is the single point of contact from consultation to completion."],
                ["Maintained standards, not one-time checks", "License and insurance documentation is re-verified on an ongoing basis. A contractor whose credentials lapse is suspended before they receive another project notification."],
                ["Service history as a working asset", "The project records we maintain are not for our benefit — they are for yours. Organized by address, by trade, and by timeline, they produce reports that inform future decisions rather than reconstructing the past from memory."],
              ] as [string, string][]).map(([title, desc]) => (
                <div key={title} className="py-10">
                  <h3 className="text-[15px] font-semibold mb-3">{title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-[1.85] max-w-2xl">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Who We Serve ── */}
      <section id="who-we-serve" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Who we serve</p>
          <h2 className="text-[38px] lg:text-[52px] font-bold leading-[1.05] tracking-tight mb-16 text-balance max-w-2xl">
            Three account types built for distinct needs.
          </h2>

          <div className="divide-y divide-border border-t border-b border-border">
            {[
              {
                tag:  "Homeowners",
                sub:  "$25 per request",
                body: "For residential property owners in the Topeka metro area. Submit a request with photographs, a scope description, and a budget ceiling. One licensed contractor is assigned — no browsing profiles, no soliciting bids, no cold calls. The full coordination process is included: review, assignment, consultation confirmation, and permanent service record.",
                link: "/auth/sign-up",
                cta:  "Open account",
              },
              {
                tag:  "Property Managers",
                sub:  "$20 per request",
                body: "Built for professionals managing maintenance across multiple properties. Every request, estimate, and completion record is organized by address. Portfolio-level reports surface deferred work, maintenance spend by trade, and approaching service intervals across the entire portfolio — not property by property.",
                link: "/auth/sign-up?role=property_manager",
                cta:  "Open manager account",
              },
              {
                tag:  "Contractors",
                sub:  "Always free",
                body: "Approved contractors receive project notifications for requests in their trade and declared service area. Each notification includes project type, general location, and the owner\u2019s budget ceiling. Claim a request for exclusive access. No referral fees, no per-claim charges, no subscription — ever.",
                link: "/auth/sign-up?role=contractor",
                cta:  "Apply for access",
              },
            ].map(({ tag, sub, body, link, cta }) => (
              <div key={tag} className="grid gap-6 py-12 lg:grid-cols-[220px_1fr_180px] lg:items-start">
                <div>
                  <p className="text-[14px] font-semibold">{tag}</p>
                  <p className="text-[13px] text-primary font-medium mt-1">{sub}</p>
                </div>
                <p className="text-[14px] text-muted-foreground leading-[1.85] max-w-2xl">{body}</p>
                <div className="lg:text-right">
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
          <h2 className="text-[38px] lg:text-[52px] font-bold leading-[1.05] tracking-tight mb-4 text-balance max-w-xl">
            Per request. No subscriptions.
          </h2>
          <p className="text-[15px] text-muted-foreground mb-16 max-w-xl leading-[1.75]">
            Fees are charged at the time a request is submitted. If no contractor is available for your trade and area, you are notified immediately — no indefinite hold. Contractors pay nothing.
          </p>

          <div className="border-t border-border overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-[1fr_140px_140px_140px] border-b border-border py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                <span>Included with every account</span>
                <span className="text-center">Homeowner</span>
                <span className="text-center text-primary">Property Mgr</span>
                <span className="text-center">Contractor</span>
              </div>

              <div className="grid grid-cols-[1fr_140px_140px_140px] border-b border-border py-7 items-baseline">
                <span className="text-[13px] text-muted-foreground">Price per request</span>
                <span className="text-center text-[32px] font-bold leading-none">$25</span>
                <span className="text-center text-[32px] font-bold leading-none text-primary">$20</span>
                <span className="text-center text-[32px] font-bold leading-none">$0</span>
              </div>

              {[
                ["Staff-reviewed contractor assignment",  true,  true,  true  ],
                ["Full project documentation",             true,  true,  true  ],
                ["Consultation coordination",              true,  true,  true  ],
                ["Permanent service record",               true,  true,  true  ],
                ["Post-project service reports",           true,  true,  false ],
                ["Maintenance advisory",                   true,  true,  false ],
                ["Portfolio view across addresses",        false, true,  false ],
                ["Deferred work and spend tracking",       false, true,  false ],
                ["Project notifications by trade",         false, false, true  ],
                ["No per-claim or referral fees",          false, false, true  ],
              ].map(([label, hw, pm, co]) => (
                <div key={label as string}
                  className="grid grid-cols-[1fr_140px_140px_140px] border-b border-border/40 py-3.5 text-[13px] items-center">
                  <span className="text-muted-foreground">{label as string}</span>
                  <span className="text-center">{hw ? <span className="text-primary font-bold text-[15px]">✓</span> : <span className="text-border text-[18px]">–</span>}</span>
                  <span className="text-center">{pm ? <span className="text-primary font-bold text-[15px]">✓</span> : <span className="text-border text-[18px]">–</span>}</span>
                  <span className="text-center">{co ? <span className="text-primary font-bold text-[15px]">✓</span> : <span className="text-border text-[18px]">–</span>}</span>
                </div>
              ))}

              <div className="grid grid-cols-[1fr_140px_140px_140px] pt-8 items-center">
                <span />
                <div className="flex justify-center">
                  <Link href="/auth/sign-up"
                    className="rounded-sm border border-border px-4 py-2 text-[11.5px] font-semibold transition hover:border-foreground whitespace-nowrap">
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
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Services ── */}
      <section id="services" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-20 lg:grid-cols-[300px_1fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Service categories</p>
              <h2 className="text-[32px] lg:text-[38px] font-bold leading-[1.1] tracking-tight mb-6 text-balance">
                Eight trades in the network.
              </h2>
              <p className="text-[14px] text-muted-foreground leading-[1.85]">
                Each category has licensed contractors operating in Shawnee County. Requests require photographs, a written scope description, and a stated budget ceiling before entering the assignment queue.
              </p>
              <p className="mt-5 text-[13px] text-muted-foreground">
                Need a trade not listed?{" "}
                <a href="mailto:admin@nexusoperations.org" className="text-primary hover:underline">Contact us</a>
                . The network expands as additional contractors complete the review process.
              </p>
            </div>

            <div className="divide-y divide-border border-t border-b border-border">
              {services.map((s) => (
                <div key={s.name} className="grid gap-3 py-6 sm:grid-cols-[160px_1fr]">
                  <p className="text-[14px] font-semibold">{s.name}</p>
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
          <h2 className="text-[38px] lg:text-[52px] font-bold leading-[1.05] tracking-tight mb-4 text-balance max-w-xl">
            Six steps. No shortcuts.
          </h2>
          <p className="text-[15px] text-muted-foreground mb-16 max-w-xl leading-[1.75]">
            Every request follows this sequence in order. No step is automated without human review. No contractor receives access before documentation is confirmed complete.
          </p>

          <div className="divide-y divide-border border-t border-b border-border">
            {steps.map(({ n, title, body }) => (
              <div key={n} className="grid gap-6 py-10 lg:grid-cols-[64px_280px_1fr] lg:items-baseline">
                <span className="text-[40px] font-bold text-muted-foreground/20 leading-none tabular-nums select-none">{n}</span>
                <p className="text-[15px] font-semibold leading-snug">{title}</p>
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
          <div className="grid gap-20 lg:grid-cols-[1fr_380px] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Reporting and advisory</p>
              <h2 className="text-[38px] lg:text-[52px] font-bold leading-[1.05] tracking-tight mb-10 max-w-xl text-balance">
                Your service history, organized and put to work.
              </h2>
              <div className="space-y-6 text-[15px] text-muted-foreground leading-[1.85]">
                <p>
                  Each project generates a structured record — trade, address, date, scope, cost, outcome. Individually, those records are receipts. In aggregate, they describe the maintenance pattern of a property: what has been done, what keeps recurring, what has been deferred, and how spend is distributed across trade categories over time.
                </p>
                <p>
                  Service reports organize that data into a readable format — recent activity, spend by category, open items, and flags for service intervals that have passed. Property managers receive the same view across their full portfolio, by address and in aggregate.
                </p>
                <p>
                  Advisory guidance is drawn from what has actually happened at each property — not from generic maintenance calendars. When a service interval is approaching, when a recurring issue pattern emerges, or when deferred work begins to compound, the report surfaces it with specific context.
                </p>
              </div>
            </div>

            <div className="pt-0 lg:pt-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">Report contents</p>
              <div className="divide-y divide-border border-t border-b border-border text-[13px]">
                {([
                  ["Completed project log",     "Trade, address, date, scope, and final cost for every closed record."],
                  ["Spend by category",         "Cost distribution across trades — by period and year over year where history exists."],
                  ["Open and deferred items",   "Requests submitted but not completed, with reason where recorded."],
                  ["Service interval flags",    "Categories past their standard maintenance window based on prior work history."],
                  ["Pattern identification",    "Recurring requests in the same trade or address, noted explicitly."],
                  ["Property-specific advisory","Recommended actions derived from the property\u2019s own record — not a template."],
                  ["Portfolio summary",         "For property managers: aggregate view by address and across the full portfolio."],
                ] as [string, string][]).map(([item, detail]) => (
                  <div key={item} className="py-4">
                    <p className="font-medium mb-1">{item}</p>
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
          <div className="grid gap-20 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">For contractors</p>
              <h2 className="text-[38px] lg:text-[52px] font-bold leading-[1.05] tracking-tight mb-10 max-w-md text-balance">
                Work that comes to you — at no cost.
              </h2>
              <div className="space-y-6 text-[15px] text-muted-foreground leading-[1.85]">
                <p>
                  Contractors in the Nexus network receive notifications for requests that match their declared trade and service area. Each notification includes project type, general location, and the owner&apos;s stated budget ceiling. Claim the request for exclusive access — the owner&apos;s contact information and full documentation are released immediately. The request is removed from all other contractors at that moment.
                </p>
                <p>
                  <strong className="text-foreground">The Nexus contractor network has no fees.</strong> No signup cost, no monthly subscription, no referral percentage, no per-lead charge. The economic relationship is straightforward: you do the work, you get paid by the property owner directly, Nexus takes nothing from that transaction.
                </p>
                <p>
                  Applications require a current contractor license for your trade and proof of active general liability insurance. Both are reviewed by staff before any account is activated. License and insurance are re-verified on an ongoing basis.
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">Requirements</p>
              <div className="divide-y divide-border border-t border-b border-border text-[13px]">
                {([
                  ["Trade license",   "Current, valid contractor license for your trade — issued by the State of Kansas or applicable authority."],
                  ["Insurance",       "Active general liability insurance. Certificate of insurance required at the time of application."],
                  ["Service area",    "Must operate within Shawnee County or directly adjacent areas."],
                  ["Manual review",   "All applications are reviewed by Nexus staff. No automatic approvals."],
                  ["Ongoing",         "Credentials are re-verified periodically. A lapsed license or policy results in immediate account suspension."],
                ] as [string, string][]).map(([item, detail]) => (
                  <div key={item} className="py-4">
                    <p className="font-medium mb-1">{item}</p>
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
          <div className="grid gap-20 lg:grid-cols-[1fr_380px] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Contact</p>
              <h2 className="text-[38px] lg:text-[52px] font-bold leading-[1.05] tracking-tight mb-10 text-balance max-w-lg">
                Reach Nexus Operations directly.
              </h2>
              <p className="text-[15px] text-muted-foreground leading-[1.85] max-w-lg">
                For general inquiries, contractor applications, and questions about the platform, contact us directly. For active project issues, log in to your dashboard and use the messages section on your open request.
              </p>
            </div>

            <div className="pt-0 lg:pt-16">
              <div className="divide-y divide-border border-t border-b border-border text-[14px]">
                {[
                  { icon: Phone, label: "Phone",    value: "(785) 428-0244",           href: "tel:+17854280244" },
                  { icon: Mail,  label: "Email",    value: "admin@nexusoperations.org", href: "mailto:admin@nexusoperations.org" },
                  { icon: MapPin,label: "Location", value: "Topeka, KS 66606",          href: null },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 py-5">
                    <Icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-0.5">{label}</p>
                      {href
                        ? <a href={href} className="font-medium hover:text-primary transition-colors">{value}</a>
                        : <p className="font-medium">{value}</p>}
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
          <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
            <div>
              <Image src="/nexus-logo.png" alt="Nexus Operations" width={130} height={43}
                style={{ height: "24px", width: "auto" }} className="mb-4" />
              <p className="text-[12px] text-muted-foreground leading-relaxed max-w-xs">
                Property service management in Topeka, Kansas. Coordinating maintenance, repair, and improvement for homeowners and property managers since 2025.
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
                    { href: "#reporting",    label: "Reporting" },
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
                    { href: "/auth/sign-up",                      label: "Homeowner Account" },
                    { href: "/auth/sign-up?role=property_manager", label: "Property Manager" },
                    { href: "/auth/sign-up?role=contractor",       label: "Contractor Application" },
                    { href: "/auth/login",                         label: "Sign In" },
                    { href: "/dashboard",                          label: "Dashboard" },
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
