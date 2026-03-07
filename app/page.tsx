"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, ArrowRight, MapPin } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background font-sans">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
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
              className="rounded-sm bg-primary px-4 py-1.5 text-[12px] font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-36 pb-28">
        <div className="mx-auto max-w-6xl px-8">
          <div className="flex items-center gap-2 mb-12">
            <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
            <span className="text-[11px] tracking-[0.1em] uppercase text-muted-foreground">
              Topeka, Kansas — Shawnee County and surrounding areas
            </span>
          </div>

          <div className="grid gap-16 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <h1 className="text-[56px] font-bold tracking-[-0.02em] leading-[1.0] md:text-[72px] lg:text-[84px] text-balance">
                Property service management.<br />
                <span className="text-muted-foreground/40">Coordinated end to end.</span>
              </h1>

              <div className="mt-8 space-y-4 max-w-2xl">
                <p className="text-[15px] text-muted-foreground leading-[1.85]">
                  Nexus Operations manages property maintenance, repair, and improvement work for homeowners, landlords, and property managers in the Topeka metro. We handle the full operational arc — contractor coordination, project documentation, service history, and advisory reporting — from submission through permanent record.
                </p>
                <p className="text-[15px] text-muted-foreground leading-[1.85]">
                  One contractor per project, assigned exclusively. Every stage documented. The record never leaves the platform.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90"
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── About ── */}
      <section id="about" className="py-28">
        <div className="mx-auto max-w-6xl px-8">
          <div className="grid gap-20 lg:grid-cols-[1fr_380px] lg:items-start">

            <div className="space-y-7">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary">What we do</p>
              <h2 className="text-[34px] font-bold leading-[1.15] tracking-[-0.01em] text-balance">
                Structured oversight of every project,<br />from intake to permanent record.
              </h2>
              <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9]">
                <p>
                  Nexus Operations manages the full operational lifecycle of a property service request — not just the referral. From submission, Nexus reviews the project documentation, coordinates the contractor assignment, confirms the consultation, and maintains the project record through completion. No stage is handed off or left to chance.
                </p>
                <p>
                  Across projects and properties, the accumulated data builds an accurate picture of a property's maintenance posture: what has been completed, what recurs, what has been deferred, and how spend distributes across trade categories. Property managers with multiple addresses see that picture at the portfolio level — by address, by category, and in aggregate.
                </p>
                <p>
                  Nexus uses service history to surface actionable advisory guidance — upcoming intervals, deferred categories that carry compounding cost risk, recurring issue patterns by trade or address. The output is specific to the properties in the system, not imported from generic maintenance schedules.
                </p>
                <p>
                  Every contractor in the network is approved manually: a current trade license and active general liability insurance are verified before any contractor receives a project notification. Requirements are maintained on an ongoing basis, not checked once at signup.
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

      {/* ── Who We Serve ── */}
      <section id="who-we-serve" className="py-28">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-16">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary mb-5">Who we serve</p>
            <h2 className="text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-xl text-balance">
              Three account types. One coordinated platform.
            </h2>
            <p className="mt-5 text-[14.5px] text-muted-foreground leading-[1.9] max-w-2xl">
              Each account type has a distinct role in the Nexus workflow. The platform is structured to reflect those differences — different dashboards, different data access, different actions available at each stage.
            </p>
          </div>

          <div className="divide-y divide-border border-t border-b border-border">

            {/* Homeowners */}
            <div className="grid gap-8 py-10 lg:grid-cols-[200px_1fr_160px] lg:items-start">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Homeowners</p>
                <p className="mt-2 text-[13.5px] font-semibold text-foreground">Residential owners</p>
              </div>
              <p className="text-[14px] text-muted-foreground leading-[1.9] max-w-xl">
                Submit a request with photographs, a written scope, and a maximum budget. Nexus handles contractor selection, assignment, and consultation scheduling. No contractor contact occurs before a confirmed assignment. Once assigned, all communication runs through the platform. The project record — scope, photos, estimate, final cost — is permanent and accessible at any time.
              </p>
              <div className="lg:text-right">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary hover:underline underline-offset-4"
                >
                  Create account <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Property Managers */}
            <div className="grid gap-8 py-10 lg:grid-cols-[200px_1fr_160px] lg:items-start">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Property Managers</p>
                <p className="mt-2 text-[13.5px] font-semibold text-foreground">Multi-property operators</p>
              </div>
              <p className="text-[14px] text-muted-foreground leading-[1.9] max-w-xl">
                A single account tracks requests, documentation, and project history across multiple addresses. Scope notes, photos, estimates, costs, and completion records are stored and retrievable by property at any time. Portfolio-level reporting aggregates maintenance spend by trade category, flags service intervals by address, and surfaces recurring issue patterns — so maintenance obligations across an entire portfolio can be evaluated without reconstructing records from scattered sources.
              </p>
              <div className="lg:text-right">
                <Link
                  href="/auth/sign-up?role=property_manager"
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary hover:underline underline-offset-4"
                >
                  Create account <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Contractors */}
            <div className="grid gap-8 py-10 lg:grid-cols-[200px_1fr_160px] lg:items-start">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Contractors</p>
                <p className="mt-2 text-[13.5px] font-semibold text-foreground">Licensed tradespeople</p>
              </div>
              <p className="text-[14px] text-muted-foreground leading-[1.9] max-w-xl">
                Apply for network access through the platform. After a manual review verifying a current contractor license and active general liability insurance, the account is activated. Contractors receive notifications of new requests in their trade and service area — each including project type, general location, and the owner's budget ceiling. The first contractor to claim a request has it exclusively. The full project documentation is available immediately upon claim, before any contact with the property owner occurs.
              </p>
              <div className="lg:text-right">
                <Link
                  href="/auth/sign-up?role=contractor"
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary hover:underline underline-offset-4"
                >
                  Apply for access <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Services ── */}
      <section id="services" className="py-28">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-14">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary mb-5">Trade categories</p>
            <h2 className="text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-xl text-balance">
              Eight trades. Verified contractors across Shawnee County.
            </h2>
            <p className="mt-5 text-[14.5px] text-muted-foreground leading-[1.9] max-w-2xl">
              Every submission requires photographs, a written scope, and a stated budget ceiling before it enters the contractor queue. Categories expand as additional verified contractors join the network.
            </p>
          </div>

          <div className="grid gap-x-16 sm:grid-cols-2 border-t border-border">
            {services.map((s, i) => (
              <div
                key={s.name}
                className={`py-6 border-b border-border ${i % 2 === 1 ? "sm:border-l sm:pl-12" : ""}`}
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
          <div className="mb-16">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary mb-5">How it works</p>
            <h2 className="text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-xl text-balance">
              Six steps. No exceptions, no shortcuts.
            </h2>
            <p className="mt-5 text-[14.5px] text-muted-foreground leading-[1.9] max-w-2xl">
              This is the complete sequence for a property owner submitting through Nexus. Each step follows in order.
            </p>
          </div>

          <div className="border-t border-border">
            {[
              {
                n: "01",
                title: "Property owner submits a request",
                body: "Through the Nexus platform, the property owner creates an account, fills out the request form, uploads 2–10 photographs of the area or condition requiring work, writes a description of the scope, and sets a maximum budget. They select preferred consultation time windows. No contractor contact occurs at this stage. No contractor information is visible to the property owner before an assignment is confirmed.",
              },
              {
                n: "02",
                title: "Nexus reviews the submission",
                body: "Before the request enters the contractor queue, Nexus staff review it for completeness. If photographs are insufficient or the scope description lacks enough detail to act on, the owner is contacted for additional information. This step ensures contractors receive documentation that is actionable before they decide whether to claim a project.",
              },
              {
                n: "03",
                title: "A verified contractor claims the request",
                body: "Contractors in the applicable trade and service area are notified. Each notification includes project type, general location, and the stated budget ceiling. The first contractor to claim the request has exclusive access — it is immediately removed from all other contractors' feeds. The decision to claim is entirely the contractor's.",
              },
              {
                n: "04",
                title: "Nexus confirms the consultation",
                body: "Once claimed, the platform sends a consultation confirmation to both parties with the confirmed date and time. The contractor has access to the full project documentation — photographs, written scope, and budget ceiling — before the appointment. No further coordination is required from the property owner.",
              },
              {
                n: "05",
                title: "On-site consultation and written estimate",
                body: "The contractor arrives having already reviewed the project documentation. They assess the work in person and provide a written, itemized estimate. The property owner reviews it and decides whether to proceed. There is no obligation to accept. If declined, the project record is closed.",
              },
              {
                n: "06",
                title: "Completion and permanent documentation",
                body: "When work proceeds, the contractor updates the project record with completion status, final scope, and cost. Nexus retains the full record: original request, photographs, scope description, budget ceiling, written estimate, and final outcome. The record is permanent and retrievable at any time through the owner's or manager's portal.",
              },
            ].map(({ n, title, body }) => (
              <div
                key={n}
                className="grid gap-8 py-10 border-b border-border lg:grid-cols-[100px_1fr] lg:gap-12 group"
              >
                <p className="text-[42px] font-bold text-border/60 leading-none select-none tabular-nums group-hover:text-border transition-colors duration-300">
                  {n}
                </p>
                <div>
                  <p className="text-[15px] font-semibold mb-3 text-foreground">{title}</p>
                  <p className="text-[14px] text-muted-foreground leading-[1.9] max-w-2xl">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Reporting ── */}
      <section id="reporting" className="py-28">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-14">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary mb-5">Service reporting &amp; advisory</p>
            <h2 className="text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-2xl text-balance">
              Service history as an operational asset, not an archive.
            </h2>
          </div>

          <div className="grid gap-20 lg:grid-cols-[1fr_360px] items-start">
            <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9]">
              <p>
                Every project that moves through Nexus generates a record: trade category, property address, date, scope, cost, and outcome. Across dozens of projects, that data describes something operationally meaningful — how a property is actually being maintained, where spend is concentrating, what is recurring, and what has been deferred past a reasonable interval.
              </p>
              <p>
                Property owners receive periodic service reports summarizing recent activity, breaking down spend by trade category, and flagging open or unresolved items. Property managers receive that same view at the portfolio level — by address, by category, and in aggregate — so maintenance obligations across a portfolio can be assessed in one place.
              </p>
              <p>
                Beyond summarizing what has happened, Nexus uses service history to provide proactive advisory guidance. A property with no documented HVAC service in 18 months appears in the record and generates a recommendation. Repeated repair requests in the same trade at the same address surface as a pattern. A category that historically escalates when deferred past a certain interval is flagged before cost compounds. The guidance is derived from Nexus's own operational data — not manufacturer documentation or generic maintenance calendars.
              </p>
            </div>

            {/* Report categories */}
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">
                What service reports include
              </p>
              <div className="border-t border-border text-[12.5px]">
                {[
                  ["Completed project log",        "Trade, address, date, scope, and final cost for every closed project."],
                  ["Spend by category",             "Cost distribution across trades — current period and year-over-year where history exists."],
                  ["Deferred and open items",       "Requests submitted but not completed, with reason where recorded."],
                  ["Maintenance interval flags",    "Categories where elapsed time since last documented service exceeds standard intervals."],
                  ["Recurring issue patterns",      "Repeated requests in the same trade or at the same address, identified as patterns."],
                  ["Proactive recommendations",     "Actions recommended based on service history — property-specific, not generic."],
                  ["Portfolio summary",             "For property managers: aggregate view across all managed addresses."],
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
          <div className="mb-14">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary mb-5">For contractors</p>
            <h2 className="text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-xl text-balance">
              Qualified work. No bidding, no cold calls.
            </h2>
          </div>

          <div className="grid gap-20 lg:grid-cols-2 items-start">
            <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9]">
              <p>
                Contractors apply through the platform and are approved manually. Approval requires a current, active license for the trade being applied under and proof of general liability insurance. Applications that do not meet both requirements are not approved.
              </p>
              <p>
                Approved contractors receive notifications when new requests are submitted in their trade and service area. Each notification includes project type, general location, and the property owner's budget ceiling — enough to evaluate fit before committing. There is no obligation to claim any particular project.
              </p>
              <p>
                When a contractor claims a request, it belongs exclusively to them. No other contractor sees it after that point. The full project documentation — photographs, scope description, and budget — is available immediately. The contractor arrives at the consultation having reviewed everything in advance, prepared to assess and quote.
              </p>
              <p>
                Consultations are expected to be conducted as confirmed. License and insurance requirements are verified at application and periodically thereafter — not tracked once and forgotten.
              </p>
              <div className="pt-4">
                <Link
                  href="/auth/sign-up?role=contractor"
                  className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Apply for contractor access
                  <ArrowRight className="h-3.5 w-3.5" />
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

      {/* ── Contact ── */}
      <section id="contact" className="py-28">
        <div className="mx-auto max-w-6xl px-8">
          <div className="grid gap-20 lg:grid-cols-2 items-start">
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary mb-5">Contact</p>
              <h2 className="text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-sm text-balance mb-10">
                Service area and direct contact.
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
                  (785) 428-0244 — Monday through Friday, 8 am to 6 pm CT
                </a>
                <a
                  href="mailto:admin@nexusoperations.org"
                  className="flex items-center gap-3 text-[13.5px] text-muted-foreground transition hover:text-foreground group"
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
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-6">Get started</p>
              {[
                { href: "/auth/sign-up",                       label: "Homeowner account",          sub: "Submit and track service requests for your property" },
                { href: "/auth/sign-up?role=property_manager", label: "Property manager account",   sub: "Manage requests and records across multiple properties" },
                { href: "/auth/sign-up?role=contractor",       label: "Contractor application",     sub: "Apply to join the verified contractor network" },
                { href: "/faq",                                label: "Frequently asked questions", sub: "Platform process, verification requirements, and policies" },
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
                  { href: "#who-we-serve", label: "Who We Serve" },
                  { href: "#services",     label: "Services" },
                  { href: "#process",      label: "Process" },
                  { href: "#reporting",    label: "Reporting & Advisory" },
                  { href: "/faq",          label: "FAQ" },
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
