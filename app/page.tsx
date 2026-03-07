"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, MapPin, ArrowRight, ArrowUpRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const services: Array<{ name: string; desc: string }> = [
  { name: "Roofing",        desc: "Full replacement, storm damage assessment, leak repair, and insurance restoration coordination." },
  { name: "HVAC",           desc: "Central air, heat pumps, ductless mini-splits, furnace replacement, and annual maintenance." },
  { name: "Electrical",     desc: "Panel upgrades, circuit additions, rewiring, subpanel installation, and EV charger prep." },
  { name: "Plumbing",       desc: "Water heaters, leak detection, drain clearing, main line repair, and fixture replacement." },
  { name: "Concrete",       desc: "Driveways, patios, sidewalks, foundation repair, and structural flatwork." },
  { name: "Tree Service",   desc: "Removal, crown reduction, stump grinding, and post-storm emergency response." },
  { name: "Fencing",        desc: "Privacy, chain link, vinyl, wood, and commercial perimeter fencing." },
  { name: "General Repair", desc: "Drywall, carpentry, painting, door and window replacement, and interior repairs." },
]

const steps: { n: string; title: string; body: string }[] = [
  { n: "01", title: "Submit your request",            body: "Provide photographs, a written scope, a budget ceiling, and preferred consultation windows. No contractor contact occurs at this stage." },
  { n: "02", title: "Staff review",                   body: "Every submission is reviewed before entering the queue. Incomplete documentation is flagged and returned — nothing is forwarded unprepared." },
  { n: "03", title: "Exclusive contractor assignment", body: "Contractors in the applicable trade are notified. The first to claim receives exclusive access. The request is immediately removed from all other queues." },
  { n: "04", title: "Consultation confirmed",         body: "Both parties receive confirmation with the scheduled time. The contractor receives full documentation — photographs, scope, budget ceiling — before arriving on site." },
  { n: "05", title: "On-site estimate",               body: "The contractor arrives prepared and delivers a written, itemized estimate. You decide whether to proceed. No obligation, no pressure." },
  { n: "06", title: "Completion and record",          body: "The contractor closes the project with final cost and status. The complete record — original submission through final invoice — is permanent and retrievable." },
]

const navLinks = [
  { href: "#about",        label: "About" },
  { href: "#who-we-serve", label: "Who We Serve" },
  { href: "#services",     label: "Services" },
  { href: "#process",      label: "Process" },
  { href: "#reporting",    label: "Reporting" },
  { href: "#contractors",  label: "Contractors" },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10 h-[52px]">
          <Link href="/" className="flex-shrink-0">
            <Image src="/nexus-logo.png" alt="Nexus Operations" width={140} height={46}
              style={{ height: "24px", width: "auto" }} priority />
          </Link>

          <nav className="hidden items-center lg:flex" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => (
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

      {/* ── Hero ────────────────────────────────────────────────── */}
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
              Nexus Operations coordinates maintenance, repair, and improvement work for homeowners and property managers across Topeka. Every project is managed from submission through completion — with documented history and evidence-based maintenance advisory built into every account.
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

      {/* ── Stats bar ───────────────────────────────────────────── */}
      <div className="border-y border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {[
              { stat: "8",    label: "Trade categories in the network" },
              { stat: "1",    label: "Contractor assigned per request" },
              { stat: "$0",   label: "Contractor cost — no fees, ever" },
              { stat: "100%", label: "Requests manually reviewed before assignment" },
            ].map(({ stat, label }) => (
              <div key={label} className="py-8 px-8 first:pl-0 last:pr-0">
                <p className="text-[36px] font-bold tabular-nums leading-none">{stat}</p>
                <p className="mt-2 text-[12px] text-muted-foreground tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── About ───────────────────────────────────────────────── */}
      <section id="about" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-20 lg:grid-cols-[1fr_480px] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">What Nexus is</p>
              <h2 className="text-[38px] lg:text-[52px] font-bold leading-[1.05] tracking-tight mb-10 text-balance max-w-xl">
                An operations company.<br />Not a directory.
              </h2>
              <div className="space-y-6 text-[15px] lg:text-[16px] text-muted-foreground leading-[1.85]">
                <p>
                  Nexus is actively involved in every project. We review submissions, manage contractor assignment, confirm consultations, maintain permanent project records, and produce structured service reports from the data those records generate. Nothing is automated without a human touch.
                </p>
                <p>
                  Our approach is designed around the specific failure modes that make residential contracting unreliable: unprepared contractors, unclear scope, competing bids that stall decisions, and service histories that exist only in someone&apos;s memory. Every project leaves a documented record. Every contractor arrives with full information. Reporting makes that history actionable.
                </p>
                <p>
                  The contractor network is maintained manually. Each contractor carries a current trade license and active general liability insurance, reviewed individually before receiving any project access. Documentation requirements are re-verified on an ongoing basis.
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

      {/* ── Mission & Values ────────────────────────────────────── */}
      <section id="mission" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-20 lg:grid-cols-[360px_1fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Mission</p>
              <h2 className="text-[32px] lg:text-[40px] font-bold leading-[1.1] tracking-tight mb-6 text-balance">
                Property maintenance should be systematic — not reactive.
              </h2>
              <p className="text-[15px] text-muted-foreground leading-[1.85]">
                Most deferred maintenance is not caused by negligence — it is caused by the absence of organized information. Nexus provides that structure and ensures the people responsible for properties grow more informed with each project that passes through the system.
              </p>
            </div>

            <div className="divide-y divide-border border-t border-b border-border">
              {([
                [
                  "Accountability at every step",
                  "Every request follows a documented sequence. Staff review happens before contractor assignment — not after. Nothing is forwarded incomplete or unconfirmed.",
                ],
                [
                  "One contractor, full responsibility",
                  "Exclusive assignment eliminates the ambiguity of competing bids and split accountability. One contractor receives the project, arrives prepared, and is the single point of contact from consultation through completion.",
                ],
                [
                  "Standards maintained, not checked once",
                  "License and insurance documentation is re-verified on an ongoing basis. A contractor whose credentials lapse is suspended before they receive another project notification.",
                ],
                [
                  "Service history as a working asset",
                  "Project records are organized by address, trade, and timeline. They produce reports that support future decisions rather than forcing a reconstruction of the past from memory.",
                ],
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

      {/* ── Who We Serve ────────────────────────────────────────── */}
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
                body: "For residential property owners in the Topeka metro. Submit a request with photographs, a scope description, and a budget ceiling. One qualified contractor is assigned exclusively — no browsing profiles, no competing bids, no cold calls. Full coordination and permanent service records are included.",
                link: "/auth/sign-up",
                cta:  "Open account",
              },
              {
                tag:  "Property Managers",
                body: "Built for professionals managing maintenance across multiple addresses. Every request, estimate, and completion record is organized by property. Portfolio-level reports surface deferred work, maintenance spend by trade, and approaching service intervals across the full portfolio.",
                link: "/auth/sign-up?role=property_manager",
                cta:  "Open manager account",
              },
              {
                tag:  "Contractors",
                body: "Approved contractors receive project notifications for requests in their trade and service area. Each notification includes project type, general location, and the owner's stated budget ceiling. Claim a request for exclusive access. No referral fees, no per-claim charges, no subscription — ever.",
                link: "/auth/sign-up?role=contractor",
                cta:  "Apply for network access",
              },
            ].map(({ tag, body, link, cta }) => (
              <div key={tag} className="grid gap-6 py-12 lg:grid-cols-[220px_1fr_180px] lg:items-start">
                <p className="text-[14px] font-semibold">{tag}</p>
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

      {/* ── Services ────────────────────────────────────────────── */}
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
                <a href="mailto:admin@nexusoperations.org" className="text-primary hover:underline">Contact us.</a>
                {" "}The network expands as additional contractors complete the review process.
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

      {/* ── Process ─────────────────────────────────────────────── */}
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

      {/* ── Reporting ───────────────────────────────────────────── */}
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
                  Each completed project generates a structured record — trade, address, date, scope, cost, outcome. In aggregate, those records describe the maintenance pattern of a property: what has been done, what keeps recurring, what has been deferred, and how spend is distributed across trade categories over time.
                </p>
                <p>
                  Service reports organize that data into a readable format covering recent activity, spend by category, open items, and service intervals that have passed their mark. Property managers receive the same view across their full portfolio — by address and in aggregate.
                </p>
                <p>
                  Advisory guidance is drawn from what has actually happened at the property, not from generic maintenance schedules. When a service interval is approaching, a recurring issue pattern emerges, or deferred work begins to compound risk, the report surfaces it with specific context rather than a generic reminder.
                </p>
              </div>
            </div>

            <div className="pt-0 lg:pt-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">What reports include</p>
              <div className="divide-y divide-border border-t border-b border-border text-[13px]">
                {([
                  ["Completed project log",         "Trade, address, date, scope, and final cost for every closed project."],
                  ["Spend breakdown by category",   "Cost distribution across trades over the reporting period — and year over year where history exists."],
                  ["Deferred and open items",       "Requests not completed, with reason where recorded."],
                  ["Maintenance interval flags",    "Categories where time since last documented service exceeds standard intervals."],
                  ["Recurring issue patterns",      "Repeated service requests in the same trade or at the same address."],
                  ["Proactive recommendations",     "Suggested actions based on service history — specific to that property."],
                  ["Portfolio summary",             "For property managers: aggregate view across all managed addresses."],
                ] as [string, string][]).map(([item, detail]) => (
                  <div key={item} className="py-4">
                    <p className="font-medium mb-1">{item}</p>
                    <p className="text-muted-foreground leading-relaxed text-[12.5px]">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Contractors ─────────────────────────────────────────── */}
      <section id="contractors" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-20 lg:grid-cols-[1fr_420px] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">For contractors</p>
              <h2 className="text-[38px] lg:text-[52px] font-bold leading-[1.05] tracking-tight mb-10 text-balance max-w-xl">
                Qualified work, delivered directly. No fees.
              </h2>
              <div className="space-y-6 text-[15px] text-muted-foreground leading-[1.85]">
                <p>
                  Approved contractors receive notifications when requests are submitted in their declared trade and service area. Each notification includes the project type, general location, and the owner&apos;s stated budget ceiling — enough information to evaluate fit before committing.
                </p>
                <p>
                  Claiming a request grants exclusive access to the full project documentation: photographs, detailed scope, and the owner&apos;s budget ceiling. The consultation is coordinated by Nexus. You arrive knowing exactly what you are being asked to assess.
                </p>
                <p>
                  There are no referral fees, no per-claim charges, and no subscription costs — ever. The Nexus contractor network is entirely free to join and operate within.
                </p>
              </div>

              <div className="mt-10">
                <Link href="/auth/sign-up?role=contractor"
                  className="inline-flex items-center gap-2.5 bg-primary px-6 py-3 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90 rounded-sm">
                  Apply for network access <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="pt-0 lg:pt-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6">Contractor requirements</p>
              <div className="divide-y divide-border border-t border-b border-border text-[13px]">
                {([
                  ["Trade license",      "Current, valid Kansas contractor license or equivalent trade certification."],
                  ["General liability",  "Active policy meeting Nexus minimum coverage requirements."],
                  ["Service area",       "Operating within Shawnee County or declared surrounding area."],
                  ["Manual review",      "Each application is reviewed by Nexus Operations staff — not automatically approved."],
                  ["Ongoing compliance", "Credentials are re-verified on a recurring basis. Lapsed documentation results in suspension."],
                ] as [string, string][]).map(([item, detail]) => (
                  <div key={item} className="py-4">
                    <p className="font-medium mb-1">{item}</p>
                    <p className="text-muted-foreground leading-relaxed text-[12.5px]">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Contact ─────────────────────────────────────────────── */}
      <section id="contact" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Contact</p>
              <h2 className="text-[38px] lg:text-[52px] font-bold leading-[1.05] tracking-tight mb-6 text-balance">
                Get in touch.
              </h2>
              <p className="text-[15px] text-muted-foreground leading-[1.85] max-w-lg">
                For general inquiries, contractor application questions, or support with an existing account — reach us directly. Submissions through the platform portal receive priority handling.
              </p>
            </div>

            <div className="pt-0 lg:pt-16 space-y-0 divide-y divide-border border-t border-b border-border text-[14px]">
              {[
                { icon: Phone, label: "Phone", value: "(785) 428-0244",              href: "tel:+17854280244" },
                { icon: Mail,  label: "Email", value: "admin@nexusoperations.org",   href: "mailto:admin@nexusoperations.org" },
                { icon: MapPin,label: "Office", value: "Topeka, KS 66606",           href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4 py-5">
                  <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="font-medium hover:text-primary transition">{value}</a>
                    ) : (
                      <p className="font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-8 pb-2">
                <Link href="/auth/sign-up"
                  className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90 rounded-sm">
                  Open an Account <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto_auto_auto]">
            <div>
              <Link href="/">
                <Image src="/nexus-logo.png" alt="Nexus Operations" width={130} height={43}
                  style={{ height: "22px", width: "auto" }} />
              </Link>
              <p className="mt-4 text-[12.5px] text-muted-foreground leading-relaxed max-w-xs">
                Property service management for homeowners and property managers in Topeka, Kansas.
              </p>
              <p className="mt-4 text-[11.5px] text-muted-foreground">
                Topeka, KS 66606<br />
                (785) 428-0244 · admin@nexusoperations.org
              </p>
            </div>

            {[
              {
                heading: "Platform",
                links: [
                  { href: "#about",        label: "About Nexus" },
                  { href: "#who-we-serve", label: "Who We Serve" },
                  { href: "#services",     label: "Services" },
                  { href: "#process",      label: "Process" },
                  { href: "#reporting",    label: "Reporting" },
                  { href: "/faq",          label: "FAQ" },
                ],
              },
              {
                heading: "Accounts",
                links: [
                  { href: "/auth/sign-up",                     label: "Property Owner" },
                  { href: "/auth/sign-up?role=property_manager",label: "Property Manager" },
                  { href: "/auth/sign-up?role=contractor",      label: "Contractor" },
                  { href: "/auth/login",                        label: "Sign In" },
                  { href: "/dashboard",                         label: "Dashboard" },
                ],
              },
              {
                heading: "Legal",
                links: [
                  { href: "/terms",   label: "Terms of Service" },
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/sitemap", label: "Sitemap" },
                ],
              },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">{heading}</p>
                <ul className="space-y-3">
                  {links.map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href}
                        className="text-[12.5px] text-muted-foreground transition hover:text-foreground">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[11px] text-muted-foreground">
              &copy; {new Date().getFullYear()} Nexus Operations, LLC. All rights reserved.
            </p>
            <ThemeToggle />
          </div>
        </div>
      </footer>

    </main>
  )
}
