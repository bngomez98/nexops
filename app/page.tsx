import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, ArrowRight, MapPin, ArrowUpRight } from "lucide-react"

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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background font-sans">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 h-[52px]">
          <Link href="/" className="flex-shrink-0">
            <Image src="/nexus-logo.png" alt="Nexus Operations" width={150} height={50}
              style={{ height: "28px", width: "auto" }} priority />
          </Link>

          <nav className="hidden items-center md:flex" aria-label="Main navigation">
            {[
              { href: "#about",        label: "About" },
              { href: "#who-we-serve", label: "Who We Serve" },
              { href: "#services",     label: "Services" },
              { href: "#process",      label: "Process" },
              { href: "#reporting",    label: "Reporting" },
              { href: "#contractors",  label: "Contractors" },
              { href: "#contact",      label: "Contact" },
            ].map(({ href, label }) => (
              <a key={href} href={href}
                className="px-3.5 py-1 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link href="/auth/login"
              className="hidden text-[12.5px] text-muted-foreground transition-colors hover:text-foreground md:block">
              Sign In
            </Link>
            <Link href="/auth/sign-up"
              className="rounded-sm bg-primary px-4 py-1.5 text-[12px] font-semibold text-primary-foreground transition hover:opacity-90">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-40 pb-28">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex items-center gap-2 mb-12">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] text-muted-foreground tracking-widest uppercase font-medium">
              Topeka, Kansas — Shawnee County
            </span>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-[68px] font-bold tracking-[-0.03em] leading-[1.0] text-foreground md:text-[80px] lg:text-[96px] text-balance">
              Nexus<br />Operations
            </h1>
            <div className="mt-8 h-px w-16 bg-primary" />
            <p className="mt-8 text-[18px] text-muted-foreground leading-[1.7] max-w-2xl font-light">
              Property service management for homeowners, landlords, and property managers in Topeka, Kansas. We coordinate the work, document the results, and turn service history into actionable intelligence about your property.
            </p>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-8">
            <Link href="/auth/sign-up"
              className="inline-flex items-center gap-2.5 rounded-sm bg-primary px-7 py-3 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90">
              Open an Account
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a href="#about" className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition hover:text-foreground">
              Learn how it works <ArrowRight className="h-3 w-3" />
            </a>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
            {[
              { stat: "8", label: "Trade categories" },
              { stat: "1",  label: "Contractor per request" },
              { stat: "100%", label: "Verified network" },
              { stat: "$0",  label: "Cost to property owners" },
            ].map(({ stat, label }) => (
              <div key={label} className="bg-background px-6 py-5">
                <p className="text-2xl font-bold tabular-nums">{stat}</p>
                <p className="mt-1 text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full-bleed divider ── */}
      <div className="border-t border-border" />

      {/* ── About ── */}
      <section id="about" className="py-28">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid gap-20 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary mb-8">What we do</p>
              <h2 className="text-[40px] font-bold leading-[1.1] tracking-tight mb-8 max-w-lg text-balance">
                End-to-end property service management.
              </h2>
              <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.85]">
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
            <div className="border border-border text-[12.5px] overflow-hidden">
              <div className="border-b border-border px-5 py-3.5 bg-muted">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Company facts</p>
              </div>
              {[
                ["Founded",                 "2025"],
                ["Headquarters",            "Topeka, KS 66606"],
                ["Service area",            "Shawnee County + surrounding"],
                ["Phone",                   "(785) 428-0244"],
                ["Email",                   "admin@nexusoperations.org"],
                ["Cost to property owner",  "No charge"],
                ["Contractors per request", "One — exclusively assigned"],
                ["Network requirements",    "License · Insurance · Manual review"],
                ["Post-project reporting",  "Included — history, spend, advisory"],
              ].map(([label, value], i, arr) => (
                <div key={label}
                  className={`flex justify-between gap-4 px-5 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
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
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex items-end justify-between gap-6 mb-16">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary mb-6">Who we serve</p>
              <h2 className="text-[40px] font-bold leading-[1.1] tracking-tight max-w-xl text-balance">
                Three account types. One managed network.
              </h2>
            </div>
          </div>

          <div className="divide-y divide-border border-t border-border">
            {[
              {
                tag:   "Property Owners",
                role:  "Residential homeowners",
                body:  "Homeowners in the Topeka metro area use Nexus to coordinate maintenance and repair projects at their residence. The account is free. Submit a request with photographs, a scope description, and a budget ceiling — Nexus handles everything from assignment through consultation confirmation. No contractor research, no cold calls, no competing estimates. One contractor, fully prepared, confirmed by Nexus.",
                link:  "/auth/sign-up",
                cta:   "Open a homeowner account",
              },
              {
                tag:   "Property Managers",
                role:  "Landlords and multi-property managers",
                body:  "Property management accounts are built for professionals managing maintenance obligations across multiple addresses. Every request, estimate, and completion record is organized by property address and trade category. Periodic portfolio reports break down maintenance spend, surface deferred work across all managed properties, and flag categories where service intervals are approaching. Advisory recommendations are generated from the actual service history of each address, not from generic guidelines.",
                link:  "/auth/sign-up?role=property_manager",
                cta:   "Open a property manager account",
              },
              {
                tag:   "Contractors",
                role:  "Licensed tradespeople",
                body:  "Contractors apply for access and are reviewed individually before any account is activated. Approved contractors receive notifications when new requests are submitted in their trade and service area. Each notification includes the project type, general location, and the property owner's stated budget ceiling — enough information to evaluate the opportunity before committing. The first contractor to claim a request has exclusive access. The full project documentation is immediately available. No auction, no competing bids.",
                link:  "/auth/sign-up?role=contractor",
                cta:   "Apply for network access",
              },
            ].map(({ tag, role, body, link, cta }) => (
              <div key={tag} className="grid gap-8 py-12 lg:grid-cols-[240px_1fr_200px] lg:items-start">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{tag}</p>
                  <p className="mt-2 text-[13px] font-semibold">{role}</p>
                </div>
                <p className="text-[14px] text-muted-foreground leading-[1.85] max-w-2xl">{body}</p>
                <div className="lg:text-right">
                  <Link href={link}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary hover:opacity-80 transition">
                    {cta} <ArrowUpRight className="h-3 w-3" />
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
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid gap-16 lg:grid-cols-[380px_1fr] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary mb-6">Service categories</p>
              <h2 className="text-[40px] font-bold leading-[1.1] tracking-tight mb-6 text-balance">
                Trades in the Nexus network.
              </h2>
              <p className="text-[14px] text-muted-foreground leading-[1.85]">
                Each trade listed below has verified contractors available in the Shawnee County service area. Every submission requires photographs, a written scope, and a budget ceiling before entering the contractor queue. If a needed trade is not listed, contact us directly — the network expands as additional contractors are approved.
              </p>
            </div>
            <div className="border border-border divide-y divide-border">
              {services.map((s) => (
                <div key={s.name} className="flex gap-6 px-6 py-4">
                  <p className="w-28 flex-shrink-0 text-[12.5px] font-semibold">{s.name}</p>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Process ── */}
      <section id="process" className="py-28">
        <div className="mx-auto max-w-7xl px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary mb-6">How it works</p>
          <h2 className="text-[40px] font-bold leading-[1.1] tracking-tight mb-4 max-w-xl text-balance">
            The complete sequence.
          </h2>
          <p className="text-[14px] text-muted-foreground leading-[1.85] max-w-2xl mb-16">
            Every service request follows this sequence in order. Nothing is skipped and no step is automated without human review.
          </p>

          <div className="divide-y divide-border border-t border-border">
            {[
              {
                n: "01",
                title: "Property owner submits a request",
                body: "Through the platform, the property owner creates a request with 2–10 photographs of the area or condition requiring work, a written description of scope, a maximum budget, and preferred consultation windows. No contractor information is shown and no contractor contact occurs at this stage.",
              },
              {
                n: "02",
                title: "Nexus reviews the submission",
                body: "Before entering the contractor queue, Nexus staff review the submission for completeness. If photographs are insufficient or the scope description needs clarification, the property owner is contacted. This step ensures contractors receive actionable documentation before deciding whether to claim a project.",
              },
              {
                n: "03",
                title: "A contractor claims the request",
                body: "Contractors in the applicable trade and service area are notified. Each notification includes the project type, general location, and budget ceiling. The first contractor to claim the request has exclusive access. At the moment of claim, the listing is removed from all other contractors.",
              },
              {
                n: "04",
                title: "Consultation is confirmed",
                body: "Nexus confirms the consultation with both parties — date, time, and address. The contractor receives all submitted documentation: photographs, scope description, and budget ceiling. No further coordination is required from the property owner before the appointment.",
              },
              {
                n: "05",
                title: "On-site consultation and written estimate",
                body: "The contractor arrives prepared, having already reviewed the documentation. They assess the work in person and provide a written, itemized estimate. The property owner decides whether to proceed. There is no obligation to accept. If declined, the record is closed.",
              },
              {
                n: "06",
                title: "Job completion and permanent documentation",
                body: "When work proceeds, the contractor updates the project record with completion status, final scope, and cost. Nexus maintains the complete record permanently: original request, photographs, scope, budget ceiling, written estimate, and final outcome — retrievable at any time.",
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="grid gap-6 py-10 lg:grid-cols-[100px_200px_1fr]">
                <p className="text-[36px] font-bold text-border leading-none select-none tabular-nums">{n}</p>
                <p className="text-[13.5px] font-semibold leading-snug pt-1">{title}</p>
                <p className="text-[13.5px] text-muted-foreground leading-[1.85] max-w-xl">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* ── Reporting & Advisory ── */}
      <section id="reporting" className="py-28">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid gap-20 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary mb-6">Reporting and advisory</p>
              <h2 className="text-[40px] font-bold leading-[1.1] tracking-tight mb-8 max-w-lg text-balance">
                What Nexus does with every project record.
              </h2>
              <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.85]">
                <p>
                  Every project that moves through Nexus generates a structured record: trade category, property address, date, scope of work, cost, and outcome. Over time, across all projects at a property, that data describes how the property is actually being maintained — where money is going, what categories of work recur, and what is being deferred.
                </p>
                <p>
                  Nexus compiles this data into periodic service reports. Property owners receive a summary of recent activity, a spend breakdown by trade category, open or unresolved items, and any flags for maintenance categories approaching standard service intervals. Property managers receive the same view at the portfolio level — by address, by category, and in aggregate — so that maintenance obligations across all managed properties can be evaluated in one place.
                </p>
                <p>
                  The advisory component goes beyond documenting what happened. Nexus identifies patterns: the same repair category appearing repeatedly at one address, a trade category with no documented service in an unusually long period, cost escalation trends in specific project types. These patterns generate specific, property-level recommendations — not generic maintenance checklists. The intent is to give owners and managers the intelligence to make informed decisions before circumstances make the decisions for them.
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5 border-b border-border pb-4">Service report contents</p>
              <div className="divide-y divide-border text-[12.5px]">
                {[
                  ["Completed project log",       "Every closed project: trade, address, date, scope, and final cost."],
                  ["Spend by category",           "Cost distribution across trades for the period — and year over year."],
                  ["Deferred and open items",     "Submitted requests that were not completed, with reason where recorded."],
                  ["Interval flags",              "Trades where time since last documented service exceeds standard thresholds."],
                  ["Recurring issue patterns",    "Repeated requests in the same trade or at the same address."],
                  ["Proactive recommendations",   "Specific action items based on that property's service history."],
                  ["Portfolio summary",           "For property managers: aggregate view across all managed addresses."],
                ].map(([item, detail]) => (
                  <div key={item} className="py-4">
                    <p className="font-semibold mb-1">{item}</p>
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
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid gap-20 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary mb-6">For contractors</p>
              <h2 className="text-[40px] font-bold leading-[1.1] tracking-tight mb-8 max-w-md text-balance">
                Joining the Nexus contractor network.
              </h2>
              <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.85]">
                <p>
                  Contractors apply through the platform and are reviewed individually before any account is activated. Approval requires a current, active contractor license for the trade applied under and proof of general liability insurance in the form of a certificate of insurance. All applications are reviewed by Nexus staff — approval is not automatic.
                </p>
                <p>
                  Approved contractors receive notifications when new requests are submitted in their trade and service area. Each notification includes the project type, general location, and the property owner's budget ceiling. Claiming a request is entirely optional — there is no obligation to accept any particular project.
                </p>
                <p>
                  When a contractor claims a request, it belongs exclusively to them. No other contractor sees it after that point. The full project documentation — photographs, written scope, and budget — is available immediately. The contractor arrives at the consultation with complete context.
                </p>
                <p>
                  Contractors are expected to conduct consultations as confirmed. Cancellations without valid advance notice may result in account review. License and insurance documentation is re-verified periodically.
                </p>
              </div>
              <div className="mt-10">
                <Link href="/auth/sign-up?role=contractor"
                  className="inline-flex items-center gap-2.5 rounded-sm bg-primary px-7 py-3 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90">
                  Apply for contractor access
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5 border-b border-border pb-4">
                Application requirements
              </p>
              <div className="divide-y divide-border text-[12.5px]">
                {[
                  ["Active contractor license",    "Required for each applied trade. Must be current at time of application and maintained."],
                  ["General liability insurance",  "Certificate of insurance required. Minimum coverage limits apply. Policy must remain active."],
                  ["Shawnee County service area",  "Primary coverage required. Adjacent county coverage may be approved separately."],
                  ["Manual review by Nexus staff", "All applications are reviewed individually. Activation is not automatic."],
                  ["Ongoing compliance",           "License and insurance documentation is periodically reverified — not checked once at signup."],
                ].map(([req, detail]) => (
                  <div key={req} className="py-4">
                    <p className="font-semibold mb-1">{req}</p>
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
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid gap-20 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary mb-6">Contact</p>
              <h2 className="text-[40px] font-bold leading-[1.1] tracking-tight mb-8 max-w-md text-balance">
                Service area and direct contact.
              </h2>
              <div className="space-y-5 text-[14.5px] text-muted-foreground leading-[1.85] mb-12">
                <p>
                  Nexus Operations is based in Topeka, Kansas and currently serves Shawnee County and immediately adjacent areas. The service area expands as additional verified contractors are approved for each trade. If you are outside the current coverage area, contact us — we maintain a geographic waitlist and will notify you when coverage reaches your location.
                </p>
              </div>
              <div className="space-y-5">
                <a href="tel:+17854280244"
                  className="flex items-center gap-3 text-[13.5px] text-muted-foreground transition hover:text-foreground">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  (785) 428-0244 — Monday through Friday, 8 am to 6 pm CT
                </a>
                <a href="mailto:admin@nexusoperations.org"
                  className="flex items-center gap-3 text-[13.5px] text-muted-foreground transition hover:text-foreground">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  admin@nexusoperations.org
                </a>
                <div className="flex items-center gap-3 text-[13.5px] text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  Nexus Operations, LLC — Topeka, KS 66606
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-2 lg:pt-16">
              {[
                { href: "/auth/sign-up",                       label: "Homeowner account",         sub: "Submit and track service requests for your residence" },
                { href: "/auth/sign-up?role=property_manager", label: "Property manager account",  sub: "Manage requests and reporting across multiple properties" },
                { href: "/auth/sign-up?role=contractor",       label: "Contractor application",    sub: "Apply to join the verified contractor network" },
                { href: "/faq",                                label: "Frequently asked questions", sub: "Process, fees, verification, policies" },
                { href: "/auth/login",                         label: "Sign in to your account",   sub: "Access your owner, manager, or contractor portal" },
              ].map(({ href, label, sub }) => (
                <Link key={href} href={href}
                  className="group flex items-center justify-between border-b border-border py-4 transition hover:border-primary/40">
                  <div>
                    <p className="text-[13.5px] font-medium">{label}</p>
                    <p className="text-[11.5px] text-muted-foreground mt-0.5">{sub}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition group-hover:text-primary flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-16">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 mb-16">
            <div>
              <Link href="/">
                <Image src="/nexus-logo.png" alt="Nexus Operations" width={110} height={37}
                  style={{ height: "24px", width: "auto" }} />
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
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">Platform</p>
              <ul className="space-y-3">
                {[
                  { href: "#about",        label: "About Nexus" },
                  { href: "#who-we-serve", label: "Who We Serve" },
                  { href: "#services",     label: "Services" },
                  { href: "#process",      label: "Process" },
                  { href: "#reporting",    label: "Reporting" },
                  { href: "/faq",          label: "FAQ" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="text-[12px] text-muted-foreground transition hover:text-foreground">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">Portals</p>
              <ul className="space-y-3">
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
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">Legal &amp; Support</p>
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
            <p className="text-[11px] text-muted-foreground">&copy; 2026 Nexus Operations, LLC. Topeka, Kansas. All rights reserved.</p>
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
