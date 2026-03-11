"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Phone,
  Mail,
  ArrowRight,
  MapPin,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const services = [
  { name: "Roofing",         desc: "Full replacements, storm damage assessment, leak repairs, and insurance restoration work." },
  { name: "HVAC",            desc: "Central air, heat pumps, ductless mini-splits, furnace replacement, and annual maintenance." },
  { name: "Electrical",      desc: "Panel upgrades, circuit additions, rewiring, subpanel installation, and EV charger rough-in." },
  { name: "Plumbing",        desc: "Water heaters, leak detection, drain clearing, main line repair, and fixture replacement." },
  { name: "Concrete",        desc: "Driveways, patios, sidewalks, foundation repair, and structural flatwork." },
  { name: "Tree Removal",    desc: "Removal, crown reduction, stump grinding, and post-storm emergency response." },
  { name: "Fencing",         desc: "Privacy, chain link, vinyl, wood, and commercial perimeter fencing." },
  { name: "General Repair",  desc: "Drywall, carpentry, painting, door and window replacement, and interior repairs." },
]

export default function HomePage() {
  const { resolvedTheme, setTheme } = useTheme()
  
  return (
    <main className="min-h-screen bg-background font-sans">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/96 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 h-14">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={150}
              height={50}
              style={{ height: "30px", width: "auto" }}
              priority
            />
          </Link>

          <nav className="hidden items-center md:flex" aria-label="Main">
            {[
              { href: "#about",       label: "About" },
              { href: "#who-we-serve",label: "Who We Serve" },
              { href: "#services",    label: "Services" },
              { href: "#process",     label: "Process" },
              { href: "#reporting",   label: "Reporting" },
              { href: "#contractors", label: "For Contractors" },
              { href: "#contact",     label: "Contact" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="px-4 py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link href="/auth/login" className="hidden text-[13px] text-muted-foreground transition-colors hover:text-foreground md:block">
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded bg-primary px-4 py-1.5 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-32 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-transparent to-transparent"></div>
        </div>
        
        <div className="mx-auto max-w-6xl px-8 relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground tracking-wide font-medium">Topeka, Kansas — Serving Shawnee County and surrounding areas</span>
          </div>

          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-6xl lg:text-7xl font-bold tracking-[-0.02em] leading-[1.0] mb-6 text-balance">
                Property maintenance done right.
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-4">
                Nexus Operations is the property service management platform that handles every detail — from contractor selection through permanent documentation — so you don't have to.
              </p>
              
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Get verified contractors, documented project history, and actionable maintenance intelligence for your properties. All in one place. All with zero hassle.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90 shadow-lg hover:shadow-xl"
                >
                  Start Your First Request
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a 
                  href="tel:+17854280244" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-[13px] font-medium text-foreground transition hover:bg-muted"
                >
                  <Phone className="h-4 w-4" />
                  (785) 428-0244
                </a>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-3xl font-bold text-primary mb-2">8</p>
                  <p className="text-[13px] text-muted-foreground">Trade Categories</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary mb-2">Licensed</p>
                  <p className="text-[13px] text-muted-foreground">Every contractor verified</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary mb-2">Permanent</p>
                  <p className="text-[13px] text-muted-foreground">Service history forever</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary mb-2">Smart</p>
                  <p className="text-[13px] text-muted-foreground">Maintenance recommendations</p>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <div className="text-center p-8">
                  <p className="text-muted-foreground text-sm mb-4">Hero image will be placed here</p>
                  <p className="text-xs text-muted-foreground">Property maintenance professional at work</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── About ── */}
      <section id="about" className="py-24 bg-muted/30">
        <div className="mx-auto max-w-6xl px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Why Nexus Exists</p>
              <h2 className="text-4xl font-bold leading-tight mb-6">
                Property maintenance should be documented, transparent, and managed — not left to chance.
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                Most property owners lack a complete record of what has been done to their properties. Contractors are sourced ad hoc. Estimates vary. Work is completed, documented poorly, and then forgotten. When it's time to refinance, insure, or sell, critical maintenance history is missing.
              </p>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Nexus changes that. We've built a managed service platform where every project is documented, tracked, and used to give you intelligence about what your property needs — now and in the future.
              </p>
            </div>

            <div className="space-y-6 border-l-4 border-primary pl-8">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">For homeowners</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">Stop juggling contractors and losing invoices. Get a permanent, verified record that increases your property's value and insurance standing.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">For property managers</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">Manage maintenance across your entire portfolio from one dashboard. See spend trends, identify patterns, and make data-driven decisions.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">For contractors</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">Access pre-documented, pre-vetted projects. No cold calling. No competitive bidding. Just qualified leads delivered directly to you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Who We Serve ── */}
      <section id="who-we-serve" className="py-24">
        <div className="mx-auto max-w-6xl px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-6">Who we serve</p>
          <h2 className="text-3xl font-bold leading-snug mb-4 max-w-xl">
            Three account types, each with a dedicated portal.
          </h2>
          <p className="text-[15px] text-muted-foreground leading-[1.8] max-w-2xl mb-16">
            The platform is structured around three distinct users. Each has a different relationship with the work being coordinated, and the platform reflects that.
          </p>

          <div className="space-y-0 divide-y divide-border border-t border-b border-border">

            {/* Homeowners */}
            <div className="grid gap-6 py-10 lg:grid-cols-[220px_1fr_180px] lg:items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Homeowners</p>
                <p className="mt-1.5 text-sm font-semibold">Residential owners</p>
              </div>
              <p className="text-[14px] text-muted-foreground leading-[1.8] max-w-xl">
                Homeowners use Nexus to find qualified contractors for work at their primary residence or additional residential properties they own. The account is free. After submitting a request with photos, a description, and a budget, the homeowner waits for Nexus to confirm an assigned contractor and a scheduled consultation. There are no contractor calls or back-and-forth before that confirmation. Once a contractor is confirmed, communication occurs through the platform.
              </p>
              <div className="lg:text-right">
                <Link href="/auth/sign-up" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline">
                  Create account <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Property Managers */}
            <div className="grid gap-6 py-10 lg:grid-cols-[220px_1fr_180px] lg:items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Property Managers</p>
                <p className="mt-1.5 text-sm font-semibold">Multi-property managers</p>
              </div>
              <p className="text-[14px] text-muted-foreground leading-[1.8] max-w-xl">
                Property management accounts are designed for landlords and professional managers responsible for maintenance across multiple addresses. A single account tracks requests, documentation, and job history by property address. Scope notes, photos, estimates, costs, and completion records are stored and retrievable at any time. In addition to coordinating service requests, property manager accounts receive aggregated reporting across their entire portfolio — maintenance spend by category, service history by address, open items, and Nexus advisory recommendations based on patterns in the data.
              </p>
              <div className="lg:text-right">
                <Link href="/auth/sign-up?role=property_manager" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline">
                  Create account <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Contractors */}
            <div className="grid gap-6 py-10 lg:grid-cols-[220px_1fr_180px] lg:items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Contractors</p>
                <p className="mt-1.5 text-sm font-semibold">Licensed tradespeople</p>
              </div>
              <p className="text-[14px] text-muted-foreground leading-[1.8] max-w-xl">
                Contractors apply for access to the Nexus network. After a manual review that verifies a current contractor license, general liability insurance, and a passed background check, the contractor account is activated. Contractors receive notifications of new requests in their trade and service area. Each notification includes the project type, general location, and the budget ceiling. When a contractor claims a request, it is exclusively theirs — the listing is immediately removed from all other contractors. The contractor has the full project documentation before any contact with the property owner occurs.
              </p>
              <div className="lg:text-right">
                <Link href="/auth/sign-up?role=contractor" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline">
                  Apply for access <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Services ── */}
      <section id="services" className="py-24">
        <div className="mx-auto max-w-6xl px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-6">Service categories</p>
          <h2 className="text-3xl font-bold leading-snug mb-4 max-w-xl">
            Trades currently in the Nexus network.
          </h2>
          <p className="text-[15px] text-muted-foreground leading-[1.8] max-w-2xl mb-14">
            Each of the following trades has verified contractors available in the Shawnee County service area. Every submission requires photographs, a written scope of work, and a stated budget ceiling before it enters the contractor queue. Categories expand as additional verified contractors join the network — if a needed trade is not listed, contact us.
          </p>

          <div className="grid gap-x-12 gap-y-0 sm:grid-cols-2 divide-y divide-border border-t border-b border-border sm:border-b-0">
            {services.map((s, i) => (
              <div
                key={s.name}
                className={`py-6 ${
                  // On sm+, draw bottom borders only on the last 2 items
                  i >= services.length - 2 ? "sm:border-b border-border" : ""
                } ${
                  // Right column gets a left border on sm+
                  i % 2 === 1 ? "sm:border-l sm:pl-12" : ""
                }`}
              >
                <p className="text-[13px] font-semibold mb-2">{s.name}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Process ── */}
      <section id="process" className="py-24">
        <div className="mx-auto max-w-6xl px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-6">How it works</p>
          <h2 className="text-3xl font-bold leading-snug mb-4 max-w-xl">
            The sequence, from submission to consultation.
          </h2>
          <p className="text-[15px] text-muted-foreground leading-[1.8] max-w-2xl mb-16">
            This is the complete process for a property owner who submits a request through Nexus Operations. Each step follows the previous in order. Nothing is skipped.
          </p>

          <div className="space-y-0 divide-y divide-border border-t border-border">
            {[
              {
                n: "1",
                title: "Property owner submits a request",
                body: "Through the Nexus platform, the property owner creates an account, fills out the request form, uploads 2–10 photographs of the area or condition requiring work, writes a description of the scope, and sets a maximum budget. They also select preferred consultation time windows. No contractor contact occurs at this stage, and no contractor information is shown to the property owner before an assignment is confirmed.",
              },
              {
                n: "2",
                title: "Nexus reviews the submission",
                body: "Before the request enters the contractor queue, Nexus staff review the submission for completeness. If photographs are insufficient or the scope description is unclear, the property owner is contacted for additional information. This review step exists to ensure that contractors receive project documentation that is actionable before they decide whether to claim it.",
              },
              {
                n: "3",
                title: "A verified contractor claims the request",
                body: "Contractors in the applicable trade and service area are notified of the new request. The notification includes the project type, general location, and the stated budget ceiling. The contractor can review this information and decide whether to claim the request. The first contractor to claim it has exclusive access. At the moment of claim, the request is removed from the feed of all other contractors.",
              },
              {
                n: "4",
                title: "Nexus confirms the consultation",
                body: "Once a contractor claims the request, the platform sends a consultation confirmation to both parties — the property owner and the contractor — with the agreed date and time. The contractor has access to all submitted documentation: project photographs, the written scope description, and the budget ceiling. No further coordination is required from the property owner before the appointment.",
              },
              {
                n: "5",
                title: "On-site consultation and written estimate",
                body: "The contractor arrives at the property at the confirmed time, having already reviewed the project documentation. They assess the work in person and provide a written, itemized estimate. The property owner reviews the estimate and decides whether to proceed. There is no obligation to accept. If the property owner declines, the project record is closed and no further action occurs.",
              },
              {
                n: "6",
                title: "Job completion and documentation",
                body: "When work proceeds, the contractor updates the project record in the platform with completion status, final scope, and cost. Nexus maintains the complete record: the original request, photographs, scope description, budget ceiling, the written estimate, and the final outcome. This record is permanent and retrievable at any time through the property owner's or property manager's portal.",
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="grid gap-6 py-10 lg:grid-cols-[80px_1fr]">
                <p className="text-4xl font-bold text-border leading-none select-none">{n}</p>
                <div>
                  <p className="text-[15px] font-semibold mb-3">{title}</p>
                  <p className="text-[14px] text-muted-foreground leading-[1.8] max-w-2xl">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Reporting & Advisory ── */}
      <section id="reporting" className="py-24">
        <div className="mx-auto max-w-6xl px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-6">Service reporting and advisory</p>
          <h2 className="text-3xl font-bold leading-snug mb-4 max-w-2xl">
            What Nexus does with the data it collects.
          </h2>

          <div className="grid gap-16 lg:grid-cols-[1fr_380px] items-start mt-10">
            <div className="space-y-5 text-[15px] text-muted-foreground leading-[1.8]">
              <p>
                Every project that moves through the Nexus platform generates a record. That record includes the trade category, the property address, the date, the scope of work, the cost, and the outcome. Across dozens of projects and multiple properties, that accumulated data describes something meaningful: how a property is actually being maintained, where money is going, what categories of work recur, and what is being deferred.
              </p>
              <p>
                Nexus organizes this data and makes it readable. Property owners receive periodic service reports that summarize recent activity, break down spend by trade category, and flag any open or unresolved project items. Property managers with multiple addresses receive that same view at the portfolio level — by address, by category, and in aggregate — so that maintenance obligations across a portfolio can be evaluated in one place rather than reconstructed from scattered records.
              </p>
              <p>
                Beyond reporting on what has happened, Nexus uses service history to provide proactive advisory guidance. If a property has not had a documented HVAC service in 18 months, that appears in the record and generates a recommendation. If the same category of repair is appearing across multiple units at an address, the pattern surfaces in the report. If a project category historically escalates in cost when deferred beyond a certain interval, that is noted. The intent is to give property owners and managers the information needed to make decisions about their properties before those decisions are forced by failure.
              </p>
              <p>
                This advisory function is built on the data Nexus has collected through its own operations — not on generic maintenance schedules or manufacturer recommendations imported from outside. The guidance is specific to what has and has not been done at each property in the network.
              </p>
            </div>

            {/* Report categories */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-5">What service reports include</p>
              <div className="space-y-0 divide-y divide-border border-t border-b border-border text-[13px]">
                {[
                  ["Completed project log",         "Trade, address, date, scope, and final cost for every closed project."],
                  ["Spend breakdown by category",   "Cost distribution across trades over the reporting period — and year over year where history exists."],
                  ["Deferred and open items",       "Requests that were submitted but not completed, and the reason where recorded."],
                  ["Maintenance interval flags",    "Categories where time elapsed since last documented service exceeds standard intervals."],
                  ["Recurring issue patterns",      "Repeated service requests in the same trade or at the same address, noted as patterns."],
                  ["Proactive recommendations",     "Suggested actions based on service history — specific to that property, not generic."],
                  ["Portfolio summary",             "For property managers: an aggregate view across all managed addresses."],
                ].map(([item, detail]) => (
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

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Contractors ── */}
      <section id="contractors" className="py-24">
        <div className="mx-auto max-w-6xl px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-6">For contractors</p>
          <h2 className="text-3xl font-bold leading-snug mb-4 max-w-xl">
            Applying to the Nexus contractor network.
          </h2>

          <div className="grid gap-16 lg:grid-cols-2 items-start mt-10">
            <div className="space-y-5 text-[15px] text-muted-foreground leading-[1.8]">
              <p>
                Contractors apply through the platform and are approved manually. Approval requires a current, active contractor license for the trade being applied under, proof of general liability insurance in the form of a certificate of insurance, and a passed background check. Applications that do not meet all three requirements are not approved.
              </p>
              <p>
                Approved contractors receive notifications when new project requests are submitted in their trade and service area. Each notification includes enough information to evaluate the project before committing — trade type, general location, and the property owner&apos;s budget ceiling. The decision to claim a request is entirely the contractor&apos;s. There is no obligation to claim any particular project.
              </p>
              <p>
                When a contractor claims a request, that project belongs exclusively to them. No other contractor sees it after that point. The full project documentation — photographs, scope description, and budget — is available immediately. The contractor arrives at the consultation having reviewed everything in advance.
              </p>
              <p>
                Contractors are expected to conduct the consultation as scheduled. Cancellations without valid advance notice may result in account review. Requirements — license, insurance — are verified at application and periodically thereafter.
              </p>
              <div className="pt-4">
                <Link
                  href="/auth/sign-up?role=contractor"
                  className="inline-flex items-center gap-2 rounded bg-primary px-6 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Apply for contractor access
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-5">Application requirements</p>
              <div className="space-y-0 divide-y divide-border border-t border-b border-border text-[13px]">
                {[
                  ["Active contractor license",        "Required for each applied trade — must be current at time of application and maintained annually."],
                  ["General liability insurance",      "Certificate of insurance required. Minimum coverage limits apply. Policy must remain active."],
                  ["Background check",                 "Passed before account activation. Conducted through a third-party screening service."],
                  ["Shawnee County service area",      "Primary coverage required. Adjacent county coverage may be approved separately."],
                  ["Manual review by Nexus staff",     "All applications are reviewed individually before any account is activated."],
                ].map(([req, detail]) => (
                  <div key={req} className="py-4">
                    <p className="font-medium mb-1">{req}</p>
                    <p className="text-muted-foreground leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Contact ── */}
      <section id="contact" className="py-24">
        <div className="mx-auto max-w-6xl px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-6">Contact</p>
              <h2 className="text-3xl font-bold leading-snug mb-8">
                Service area and direct contact.
              </h2>
              <div className="space-y-4 text-[15px] text-muted-foreground leading-[1.8] mb-10">
                <p>
                  Nexus Operations is based in Topeka, Kansas and currently serves Shawnee County and immediately adjacent areas. Service area expansion is ongoing as additional verified contractors are approved for the network.
                </p>
                <p>
                  If you are submitting a request from outside the current service area, contact us directly. We maintain a geographic waitlist and will notify you when coverage reaches your location.
                </p>
              </div>
              <div className="space-y-4">
                <a
                  href="tel:+17854280244"
                  className="flex items-center gap-3 text-[14px] text-muted-foreground transition hover:text-foreground"
                >
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  (785) 428-0244 — Monday through Friday, 8 am to 6 pm CT
                </a>
                <a
                  href="mailto:admin@nexusoperations.org"
                  className="flex items-center gap-3 text-[14px] text-muted-foreground transition hover:text-foreground"
                >
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  admin@nexusoperations.org
                </a>
                <p className="text-[13px] text-muted-foreground pt-1">
                  Nexus Operations, LLC — Topeka, KS 66606
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 lg:pt-16">
              {[
                { href: "/auth/sign-up",                        label: "Homeowner account",          sub: "Submit and track service requests for your residence" },
                { href: "/auth/sign-up?role=property_manager",  label: "Property manager account",   sub: "Manage requests and records across multiple properties" },
                { href: "/auth/sign-up?role=contractor",        label: "Contractor application",     sub: "Apply to join the verified contractor network" },
                { href: "/faq",                                  label: "Frequently asked questions", sub: "Platform process, fees, verification requirements, and policies" },
                { href: "https://nexusoperations.zendesk.com/hc/en-us", label: "Help center",        sub: "Documentation, guides, and support tickets" },
              ].map(({ href, label, sub }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center justify-between border-b border-border py-4 transition hover:border-primary/40"
                >
                  <div>
                    <p className="text-[14px] font-medium">{label}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{sub}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition group-hover:text-primary group-hover:translate-x-0.5 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-14">
        <div className="mx-auto max-w-6xl px-8">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 mb-12">
            <div>
              <Link href="/">
                <Image
                  src="/nexus-logo.png"
                  alt="Nexus Operations"
                  width={110}
                  height={37}
                  style={{ height: "26px", width: "auto" }}
                />
              </Link>
              <p className="mt-4 text-[12px] text-muted-foreground leading-relaxed">
                Property service coordination for homeowners, landlords, and property managers in Topeka, Kansas.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-4">Platform</p>
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
                    <a href={href} className="text-[12px] text-muted-foreground transition hover:text-foreground">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-4">Portals</p>
              <ul className="space-y-2.5">
                {[
                  { href: "/auth/sign-up",                       label: "Homeowner Account" },
                  { href: "/auth/sign-up?role=property_manager", label: "Property Manager" },
                  { href: "/auth/sign-up?role=contractor",       label: "Contractor Application" },
                  { href: "/auth/login",                         label: "Sign In" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-[12px] text-muted-foreground transition hover:text-foreground">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-4">Legal &amp; Support</p>
              <ul className="space-y-2.5">
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
