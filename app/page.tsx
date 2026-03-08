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
              Create Account
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
                Property service<br />management for<br />
                <span className="text-muted-foreground/40">Topeka, Kansas.</span>
              </h1>

              <div className="mt-8 space-y-4 max-w-2xl">
                <p className="text-[15px] text-muted-foreground leading-[1.85]">
                  Nexus Operations is a property service management company based in Topeka, Kansas. We receive service requests from homeowners and property managers, assign a single verified contractor per project, and document every stage — from the initial submission through the final cost record.
                </p>
                <p className="text-[15px] text-muted-foreground leading-[1.85]">
                  Every contractor in the network is licensed, insured, and approved by Nexus staff before receiving any project. Service history is stored permanently and used to generate property-specific maintenance reports and recommendations.
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

      {/* ── Mission & Values ── */}
      <section id="mission" className="py-28 bg-muted/30">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-14">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary mb-5">Mission &amp; Values</p>
            <h2 className="text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-2xl text-balance">
              Property maintenance should be documented, accountable, and managed — not improvised.
            </h2>
          </div>

          <div className="grid gap-x-16 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 border-t border-border pt-12">
            {[
              {
                label: "Verified contractors only",
                body: "Every contractor in the Nexus network holds a current trade license and active general liability insurance. Credentials are verified by staff at application and maintained as an ongoing requirement — not a one-time checkbox.",
              },
              {
                label: "One contractor per project",
                body: "When a contractor claims a request, that project belongs to them exclusively. There is no competitive bidding, no re-assignment, and no situation where a property owner is managing multiple contractor relationships for a single project.",
              },
              {
                label: "Permanent documentation",
                body: "Every project generates a record that does not expire. Scope, photographs, cost, contractor, and outcome are stored in the platform and accessible to the property owner at any time — including years later.",
              },
              {
                label: "Data-driven recommendations",
                body: "Advisory guidance is derived from each property's own service history, not from generic maintenance schedules. Nexus flags what is overdue, what is recurring, and what is likely to cost more if deferred — based on actual project data.",
              },
            ].map(({ label, body }) => (
              <div key={label} className="border-l-2 border-primary/30 pl-5">
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
          <div className="mb-16">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary mb-5">Who we serve</p>
            <h2 className="text-[34px] font-bold leading-[1.15] tracking-[-0.01em] max-w-xl text-balance">
              Nexus serves homeowners, property managers, and licensed contractors.
            </h2>
            <p className="mt-5 text-[14.5px] text-muted-foreground leading-[1.9] max-w-2xl">
              Each account type has a distinct role and a separate set of tools. Property owners submit and track requests. Property managers do the same across multiple addresses with portfolio-level reporting. Contractors receive project notifications, claim work, and update records.
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
              Eight trade categories currently active in the Nexus network.
            </h2>
            <p className="mt-5 text-[14.5px] text-muted-foreground leading-[1.9] max-w-2xl">
              Requests require photographs, a written scope, and a maximum budget before entering the contractor queue. The network expands as additional licensed contractors are approved.
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
              How a request moves through Nexus.
            </h2>
            <p className="mt-5 text-[14.5px] text-muted-foreground leading-[1.9] max-w-2xl">
              Every project follows the same sequence. No steps are skipped. Each one is documented in the project record as it completes.
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
              Every project builds a record. That record becomes the basis for maintenance reporting.
            </h2>
          </div>

          <div className="grid gap-20 lg:grid-cols-[1fr_360px] items-start">
            <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9]">
              <p>
                Each closed project contributes a data point: trade category, address, date, scope, and cost. Over time, that data gives property owners an accurate, retrievable record of what has been done, how much it cost, and when. For property managers, the same data aggregates across addresses — by category, by property, and in total.
              </p>
              <p>
                Nexus uses accumulated service history to generate maintenance recommendations that are specific to each property — not pulled from generic manufacturer schedules. A property with no documented HVAC service in 18 months generates a recommendation. Repeated requests in the same trade at the same address are flagged as a recurring issue. Categories where deferred maintenance is known to increase cost are identified before that point is reached.
              </p>
              <p>
                For property owners, this changes maintenance from reactive to planned. For property managers, it replaces scattered records and informal tracking with a single, searchable source.
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
              Licensed contractors receive project notifications, claim work exclusively, and arrive with full documentation.
            </h2>
          </div>

          <div className="grid gap-20 lg:grid-cols-2 items-start">
            <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.9]">
              <p>
                Contractors apply through the Nexus platform. Approval requires a current trade license and active general liability insurance — both verified by Nexus staff before the account is activated. There is no fee to join or participate.
              </p>
              <p>
                When a request is submitted in their trade and service area, approved contractors receive a notification with project type, general location, and the owner's maximum budget. The first contractor to claim has exclusive access — the project is removed from all other feeds immediately. There is no obligation to claim any particular project.
              </p>
              <p>
                Upon claiming, the contractor receives the complete project file: photographs, scope description, and budget ceiling. They arrive at the on-site consultation having already reviewed the work, prepared to provide a written estimate. License and insurance status are verified at application and maintained as an ongoing requirement.
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
                Current service area and contact information.
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
                  { href: "#mission",      label: "Mission &amp; Values" },
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
