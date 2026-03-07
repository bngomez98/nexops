import Image from "next/image"
import Link from "next/link"
import {
  Phone,
  Mail,
  ArrowRight,
  MapPin,
} from "lucide-react"

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
              { href: "#about",        label: "About" },
              { href: "#who-we-serve", label: "Who We Serve" },
              { href: "#services",     label: "Services" },
              { href: "#process",      label: "Process" },
              { href: "#contractors",  label: "Contractors" },
              { href: "#contact",      label: "Contact" },
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
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-6xl px-8">
          <div className="flex items-center gap-2 mb-10">
            <MapPin className="h-3 w-3 text-primary" />
            <span className="text-xs text-muted-foreground tracking-wide">Topeka, Kansas — Shawnee County and surrounding areas</span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight leading-[1.05] md:text-6xl lg:text-7xl max-w-3xl text-balance">
            Nexus Operations
          </h1>

          <div className="mt-8 max-w-2xl">
            <p className="text-xl text-muted-foreground leading-relaxed font-normal">
              A property service coordination company based in Topeka, Kansas.
            </p>
          </div>

          <div className="mt-10 max-w-3xl space-y-5">
            <p className="text-[15px] text-muted-foreground leading-[1.8]">
              Nexus Operations works directly with homeowners, landlords, and property managers in the Topeka metro area to coordinate property maintenance, repair, and improvement projects. We maintain a network of licensed, insured, and background-checked contractors across the primary residential trades. When a property owner has work that needs to be done, Nexus handles the process of identifying the right contractor, confirming the engagement, and managing the project record — from initial request through on-site consultation and job completion.
            </p>
            <p className="text-[15px] text-muted-foreground leading-[1.8]">
              The company is not a marketplace. Property owners do not browse contractor profiles or solicit competing bids. Nexus assigns one qualified contractor to each request. That contractor reviews the project documentation — photos, scope, and the owner&apos;s stated budget — before any contact occurs. If no qualified contractor is available in your area for the requested trade, you are told that directly. There is no indefinite hold.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 rounded bg-primary px-6 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Submit a service request
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a href="tel:+17854280244" className="text-[13px] text-muted-foreground transition hover:text-foreground">
              (785) 428-0244
            </a>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── About ── */}
      <section id="about" className="py-24">
        <div className="mx-auto max-w-6xl px-8">
          <div className="grid gap-16 lg:grid-cols-[1fr_400px] lg:items-start">

            <div className="space-y-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">What we do</p>
              <h2 className="text-3xl font-bold leading-snug">
                Coordinating property work, end to end.
              </h2>
              <div className="space-y-4 text-[15px] text-muted-foreground leading-[1.8]">
                <p>
                  When a property needs work — routine maintenance, an aging HVAC system, a failing roof, damaged concrete, a downed tree — the process of finding a qualified contractor and getting a legitimate estimate is often as difficult as the project itself. Phone calls go unreturned. Contractors who show up are unprepared. Multiple people are calling you about the same job.
                </p>
                <p>
                  Nexus Operations exists to remove that friction. Property owners and property managers submit a request through the platform with photographs, a written description of the work, and a budget ceiling. Nexus reviews the submission, enters it into the contractor queue for the applicable trade and service area, and notifies verified contractors. When a contractor claims the request, they receive the full project documentation immediately. Nexus confirms the consultation appointment with both parties. The contractor arrives prepared.
                </p>
                <p>
                  Every contractor in the Nexus network has passed a manual approval process: a current contractor license, active general liability insurance, and a passed background check are required before any contractor receives access to submitted requests. These requirements are maintained — not just checked once at signup.
                </p>
              </div>
            </div>

            {/* Sidebar facts */}
            <div className="space-y-0 border border-border rounded-sm overflow-hidden text-[13px]">
              {[
                ["Founded",                "2025"],
                ["Headquarters",           "Topeka, KS 66606"],
                ["Service area",           "Shawnee County + surrounding"],
                ["Phone",                  "(785) 428-0244"],
                ["Email",                  "admin@nexusoperations.org"],
                ["Cost to property owner", "No charge"],
                ["Contractors per request","One, assigned exclusively"],
                ["Contractor verification","License · Insurance · Background check"],
              ].map(([label, value], i) => (
                <div key={label} className={`flex justify-between gap-6 px-5 py-3.5 ${i < 7 ? "border-b border-border" : ""}`}>
                  <span className="text-muted-foreground shrink-0">{label}</span>
                  <span className="text-right font-medium">{value}</span>
                </div>
              ))}
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
                Property management accounts are designed for landlords and professional property managers who are responsible for maintenance across multiple addresses. A single account tracks requests, documentation, and job history per property address. Scope notes, photos, estimates, and completion records are stored and retrievable by address. The same verified contractor network and the same single-assignment process applies — there is no separate tier for property managers, only additional organizational tools within the platform.
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
