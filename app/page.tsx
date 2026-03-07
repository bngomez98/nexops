import Image from "next/image"
import Link from "next/link"
import {
  Shield,
  FileText,
  Clock,
  CheckCircle,
  TreePine,
  Zap,
  Thermometer,
  Hammer,
  Fence,
  Home,
  ArrowRight,
  BadgeCheck,
  Phone,
  Mail,
  Droplets,
  Wrench,
  MapPin,
  Users,
  ClipboardList,
} from "lucide-react"

const services = [
  { icon: TreePine,    name: "Tree Removal",   desc: "Removal, crown reduction, stump grinding, emergency storm response.", range: "$500 – $8,000" },
  { icon: Thermometer, name: "HVAC",            desc: "Central air, heat pumps, mini-splits, furnace replacement, annual maintenance.", range: "$3,000 – $20,000" },
  { icon: Zap,         name: "Electrical",      desc: "Panel upgrades, circuit additions, rewiring, EV charger rough-in.", range: "$500 – $10,000" },
  { icon: Home,        name: "Roofing",         desc: "Full replacements, leak repairs, storm damage, insurance restoration.", range: "$5,000 – $25,000" },
  { icon: Hammer,      name: "Concrete",        desc: "Driveways, patios, sidewalks, flatwork, foundation repair.", range: "$2,000 – $15,000" },
  { icon: Fence,       name: "Fencing",         desc: "Privacy, chain link, vinyl, wood, commercial and residential.", range: "$1,500 – $10,000" },
  { icon: Droplets,    name: "Plumbing",        desc: "Water heaters, leak detection, drain clearing, fixture replacement.", range: "$200 – $6,000" },
  { icon: Wrench,      name: "General Repair",  desc: "Drywall, carpentry, painting, door and window replacement.", range: "$100 – $5,000" },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-14">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={160}
              height={53}
              style={{ height: "34px", width: "auto" }}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            <a href="#what-we-do"    className="text-[13px] text-muted-foreground transition hover:text-foreground">What We Do</a>
            <a href="#who-we-serve"  className="text-[13px] text-muted-foreground transition hover:text-foreground">Who We Serve</a>
            <a href="#services"      className="text-[13px] text-muted-foreground transition hover:text-foreground">Services</a>
            <a href="#how-it-works"  className="text-[13px] text-muted-foreground transition hover:text-foreground">How It Works</a>
            <a href="#contractors"   className="text-[13px] text-muted-foreground transition hover:text-foreground">For Contractors</a>
            <a
              href="https://nexusoperations.zendesk.com/hc/en-us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-muted-foreground transition hover:text-foreground"
            >
              Help
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden text-[13px] font-medium text-muted-foreground transition hover:text-foreground md:block"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded bg-primary px-4 py-1.5 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* ── Introduction ── */}
      <section className="pt-28 pb-20 border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row lg:gap-20 lg:items-start">

            {/* Left: Who we are */}
            <div className="flex-1 max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded border border-border bg-card px-3 py-1.5">
                <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                <span className="text-xs text-muted-foreground">Topeka, KS — Shawnee County and surrounding areas</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[42px] leading-[1.1] text-balance">
                Nexus Operations
              </h1>
              <p className="mt-3 text-lg text-muted-foreground font-normal leading-snug">
                A property service management company based in Topeka, Kansas.
              </p>

              <p className="mt-6 text-[15px] text-muted-foreground leading-relaxed">
                Nexus Operations coordinates property maintenance, repair, and improvement projects for homeowners, landlords, and property managers. We connect property owners with licensed, insured, and background-checked contractors in the Topeka metro area — managing the process from the initial service request through scheduling, consultation, and job completion.
              </p>

              <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
                Every request is handled as a discrete, documented project. Property owners submit the details — photos, a written scope of work, and a budget — and Nexus assigns one qualified contractor to that request. That contractor is the only contractor who sees it. There is no bidding, no multiple contractors calling the same homeowner, and no ambiguity about who has been assigned or when they are coming.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-2 rounded bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Submit a Service Request
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/auth/sign-up?role=contractor"
                  className="inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 text-[13px] font-semibold text-foreground transition hover:bg-muted"
                >
                  Contractor Portal
                </Link>
              </div>
            </div>

            {/* Right: Key facts */}
            <div className="mt-12 lg:mt-0 flex-shrink-0 w-full lg:w-[320px]">
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="border-b border-border px-5 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Company Facts</p>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { label: "Founded",              value: "2025" },
                    { label: "Headquarters",          value: "Topeka, KS" },
                    { label: "Service area",          value: "Shawnee County +" },
                    { label: "Phone",                 value: "(785) 428-0244" },
                    { label: "Cost to property owner", value: "Free" },
                    { label: "Contractors per request", value: "One, assigned exclusively" },
                    { label: "Contractor requirements", value: "Licensed, insured, background checked" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between px-5 py-3">
                      <p className="text-[12px] text-muted-foreground">{label}</p>
                      <p className="text-[12px] font-medium text-foreground text-right max-w-[140px]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section id="what-we-do" className="py-20 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <h2 className="text-xl font-bold">What Nexus Operations does</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: ClipboardList,
                title: "Receives and documents service requests",
                body: "Property owners, homeowners, and property managers submit requests through the platform. Each submission includes project photos, a written scope of work, and a maximum budget. Nexus reviews the submission for completeness before it enters the contractor queue.",
              },
              {
                icon: BadgeCheck,
                title: "Maintains a network of verified contractors",
                body: "Every contractor on the Nexus platform has provided proof of a current contractor's license, general liability insurance, and has passed a background check. Contractors are approved manually before receiving access to any submitted requests.",
              },
              {
                icon: Users,
                title: "Coordinates assignment and scheduling",
                body: "When a verified contractor claims a request, that assignment is exclusive. Nexus confirms the consultation appointment with both the property owner and the contractor. The contractor arrives prepared — having reviewed the photos, scope, and budget in advance.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-lg border border-border bg-background p-6">
                <Icon className="h-4 w-4 text-primary mb-4" />
                <h3 className="text-sm font-semibold mb-3 leading-snug">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Serve ── */}
      <section id="who-we-serve" className="py-20 border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <h2 className="text-xl font-bold">Who uses Nexus Operations</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              The platform serves three distinct account types, each with its own portal and feature set.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">

            {/* Homeowners */}
            <div className="rounded-lg border border-border bg-card overflow-hidden flex flex-col">
              <div className="border-b border-border px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">Homeowners</p>
                <h3 className="text-sm font-semibold">Residential property owners</h3>
              </div>
              <div className="px-5 py-4 flex-1">
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Homeowners use Nexus to find qualified contractors for maintenance, repair, improvement, and emergency projects at their residence. The account is free. Once a request is submitted, the homeowner does not need to search for, call, or vet contractors — Nexus handles assignment. The homeowner receives a single confirmation when a contractor has been assigned and a consultation has been scheduled.
                </p>
                <ul className="space-y-2">
                  {["Submit requests with photos and budget","One assigned contractor per project","Consultation confirmation provided","Written estimate before any work begins"].map(i => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />{i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-border px-5 py-4">
                <Link href="/auth/sign-up" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline">
                  Create a homeowner account <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Property Managers */}
            <div className="rounded-lg border border-border bg-card overflow-hidden flex flex-col">
              <div className="border-b border-border px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">Property Managers</p>
                <h3 className="text-sm font-semibold">Managers of multiple properties</h3>
              </div>
              <div className="px-5 py-4 flex-1">
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Property management accounts are designed for landlords and professional property managers who oversee multiple addresses. A single account can submit and track requests across all managed properties. Documentation — photos, scope notes, estimates, and completed job records — is stored per property address and accessible at any time.
                </p>
                <ul className="space-y-2">
                  {["Multiple property addresses per account","Per-property request and job history","Consolidated contractor documentation","Same verified contractor network as homeowners"].map(i => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />{i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-border px-5 py-4">
                <Link href="/auth/sign-up?role=property_manager" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline">
                  Open a property manager account <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Contractors */}
            <div className="rounded-lg border border-border bg-card overflow-hidden flex flex-col">
              <div className="border-b border-border px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">Contractors</p>
                <h3 className="text-sm font-semibold">Licensed, insured tradespeople</h3>
              </div>
              <div className="px-5 py-4 flex-1">
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Licensed contractors apply for access to the Nexus network. After verification, contractors receive notifications of new requests in their trade and service area. When a contractor claims a request, that project is immediately and exclusively theirs — the listing is removed from all other contractors' feeds. The contractor arrives at the consultation having already reviewed the property photos, scope of work, and the owner's stated budget.
                </p>
                <ul className="space-y-2">
                  {["License, insurance, and background check required","Exclusive claim per request","Full project documentation before first contact","Budget ceiling disclosed before arrival"].map(i => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />{i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-border px-5 py-4">
                <Link href="/auth/sign-up?role=contractor" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline">
                  Apply for contractor access <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-20 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <h2 className="text-xl font-bold">Service categories</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Nexus Operations coordinates projects across the following trades. Each request requires photos, a written scope of work, and a stated budget before submission. If your category is not listed, contact us — the network expands based on available verified contractors and submitted demand.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.name} className="rounded-lg border border-border bg-background p-5 transition hover:border-primary/30">
                <s.icon className="h-4 w-4 text-primary mb-3" />
                <h3 className="text-sm font-semibold mb-1.5">{s.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{s.desc}</p>
                <p className="text-[11px] text-muted-foreground">
                  Typical range: <span className="font-medium text-foreground">{s.range}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <h2 className="text-xl font-bold">How a request works</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              From submission to completed consultation, here is the full sequence.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Property owner submits a request",
                body: "Through the Nexus platform, the property owner uploads 2–10 project photos, writes a description of the scope, sets a maximum budget, and selects preferred consultation time windows. No contractor contact occurs at this stage.",
              },
              {
                step: "02",
                title: "A verified contractor claims the request",
                body: "Contractors in the matching service area and trade are notified. The first contractor who claims the request has exclusive access to it. The request is removed from the queue for all other contractors at that moment.",
              },
              {
                step: "03",
                title: "Nexus confirms the consultation",
                body: "The platform sends a confirmed appointment to both the property owner and the contractor, including the agreed date and time. The contractor has access to all submitted photos, the scope description, and the budget ceiling before arriving.",
              },
              {
                step: "04",
                title: "On-site consultation and estimate",
                body: "The contractor visits the property, assesses the work in person, and provides a written, itemized estimate. The property owner reviews the estimate and decides whether to proceed. No obligation to accept.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="rounded-lg border border-border bg-card p-5">
                <p className="text-[11px] font-bold text-primary mb-4 tracking-widest">{step}</p>
                <h3 className="text-sm font-semibold mb-3 leading-snug">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contractors ── */}
      <section id="contractors" className="py-20 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-14 md:grid-cols-2 items-start">
            <div>
              <h2 className="text-xl font-bold mb-4">Contractor participation</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Contractors participate in the Nexus network by application. The approval process verifies a current contractor license, proof of general liability insurance, and a passed background check. Contractors who do not meet these requirements are not approved.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Once approved, contractors receive notifications of new project requests in their trade and Shawnee County service area. Each notification includes the type of work, the general location, and the budget ceiling. Contractors can review this information before deciding whether to claim the request.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Valid contractor license — required at application and maintained annually",
                  "General liability insurance — certificate of insurance required",
                  "Background check — passed before account approval",
                  "Exclusive project claim — no competing contractors on the same request",
                  "Full documentation available before first contact with the property owner",
                  "Budget ceiling visible before claiming — no surprise scope on arrival",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/auth/sign-up?role=contractor"
                className="inline-flex items-center gap-2 rounded bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Apply for contractor access
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-lg border border-border bg-background overflow-hidden">
              <div className="border-b border-border px-5 py-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Contractor requirements checklist</p>
              </div>
              <div className="divide-y divide-border">
                {[
                  { label: "Active contractor license",            status: "Required at application" },
                  { label: "General liability insurance",          status: "Certificate of insurance" },
                  { label: "Background check",                     status: "Passed before approval" },
                  { label: "Shawnee County service area",          status: "Primary coverage required" },
                  { label: "Trade specialization on file",         status: "At least one category" },
                  { label: "Manual review by Nexus staff",         status: "Before account activation" },
                ].map(({ label, status }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-[12px] font-medium">{label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{status}</p>
                    </div>
                    <Shield className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service area + contact ── */}
      <section id="contact" className="py-20 border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-2 items-start">
            <div>
              <h2 className="text-xl font-bold mb-4">Service area and contact</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Nexus Operations is based in Topeka, Kansas and currently serves Shawnee County and immediately surrounding areas. Service area expansion is ongoing as additional verified contractors join the network.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                If you are outside the current service area, contact us — we maintain a waitlist and will notify you when coverage reaches your location.
              </p>
              <div className="space-y-3">
                <a href="tel:+17854280244" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition">
                  <Phone className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  (785) 428-0244 — Mon–Fri, 8 am–6 pm CT
                </a>
                <a href="mailto:admin@nexusoperations.org" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition">
                  <Mail className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  admin@nexusoperations.org
                </a>
                <a
                  href="https://nexusoperations.zendesk.com/hc/en-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition"
                >
                  <FileText className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  Help Center — nexusoperations.zendesk.com
                </a>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { href: "/auth/sign-up",                       title: "Homeowner account",         sub: "Submit and track service requests for your residence" },
                { href: "/auth/sign-up?role=property_manager", title: "Property manager account",  sub: "Manage requests across multiple properties" },
                { href: "/auth/sign-up?role=contractor",       title: "Contractor application",    sub: "Apply to join the verified contractor network" },
                { href: "/faq",                                 title: "Frequently asked questions", sub: "Platform process, fees, verification, and policies" },
              ].map(({ href, title, sub }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded border border-border bg-card px-5 py-4 transition hover:border-primary/30 group"
                >
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-5 mb-10">
            <div className="md:col-span-2">
              <Link href="/">
                <Image
                  src="/nexus-logo.png"
                  alt="Nexus Operations"
                  width={120}
                  height={40}
                  style={{ height: "28px", width: "auto" }}
                />
              </Link>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed max-w-[220px]">
                Property service coordination for homeowners, landlords, and property managers in Topeka, KS.
              </p>
              <div className="mt-4 space-y-1.5">
                <a href="tel:+17854280244" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition">
                  <Phone className="h-3 w-3 flex-shrink-0" /> (785) 428-0244
                </a>
                <a href="mailto:admin@nexusoperations.org" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition">
                  <Mail className="h-3 w-3 flex-shrink-0" /> admin@nexusoperations.org
                </a>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Platform</p>
              <ul className="space-y-2.5 text-[12px]">
                <li><a href="#what-we-do"   className="text-muted-foreground hover:text-foreground transition">What We Do</a></li>
                <li><a href="#who-we-serve" className="text-muted-foreground hover:text-foreground transition">Who We Serve</a></li>
                <li><a href="#services"     className="text-muted-foreground hover:text-foreground transition">Service Categories</a></li>
                <li><a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">How It Works</a></li>
                <li><Link href="/faq"       className="text-muted-foreground hover:text-foreground transition">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Portals</p>
              <ul className="space-y-2.5 text-[12px]">
                <li><Link href="/auth/sign-up"                       className="text-muted-foreground hover:text-foreground transition">Homeowner Account</Link></li>
                <li><Link href="/auth/sign-up?role=property_manager" className="text-muted-foreground hover:text-foreground transition">Property Manager Account</Link></li>
                <li><Link href="/auth/sign-up?role=contractor"       className="text-muted-foreground hover:text-foreground transition">Contractor Application</Link></li>
                <li><Link href="/auth/login"                         className="text-muted-foreground hover:text-foreground transition">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Legal</p>
              <ul className="space-y-2.5 text-[12px]">
                <li><Link href="/terms"   className="text-muted-foreground hover:text-foreground transition">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition">Privacy Policy</Link></li>
                <li><Link href="/sitemap" className="text-muted-foreground hover:text-foreground transition">Sitemap</Link></li>
                <li>
                  <a
                    href="https://nexusoperations.zendesk.com/hc/en-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
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
