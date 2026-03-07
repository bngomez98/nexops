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
  ChevronRight,
} from "lucide-react"

const services = [
  { icon: TreePine,    name: "Tree Removal",  desc: "Removal, crown reduction, stump grinding, emergency storm response.", range: "$500 – $8,000" },
  { icon: Thermometer, name: "HVAC",           desc: "Central air, heat pumps, mini-splits, furnace replacement, annual maintenance.", range: "$3,000 – $20,000" },
  { icon: Zap,         name: "Electrical",     desc: "Panel upgrades, circuit additions, rewiring, EV charger rough-in.", range: "$500 – $10,000" },
  { icon: Home,        name: "Roofing",        desc: "Full replacements, leak repairs, storm damage, insurance restoration.", range: "$5,000 – $25,000" },
  { icon: Hammer,      name: "Concrete",       desc: "Driveways, patios, sidewalks, flatwork, foundation repair.", range: "$2,000 – $15,000" },
  { icon: Fence,       name: "Fencing",        desc: "Privacy, chain link, vinyl, wood, commercial and residential.", range: "$1,500 – $10,000" },
  { icon: Droplets,    name: "Plumbing",       desc: "Water heaters, leak detection, drain clearing, fixture replacement.", range: "$200 – $6,000" },
  { icon: Wrench,      name: "General Repair", desc: "Drywall, carpentry, painting, door and window replacement.", range: "$100 – $5,000" },
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
              style={{ height: "36px", width: "auto" }}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            <a href="#how-it-works" className="text-[13px] text-muted-foreground transition hover:text-foreground">How It Works</a>
            <a href="#services"     className="text-[13px] text-muted-foreground transition hover:text-foreground">Services</a>
            <a href="#comparison"   className="text-[13px] text-muted-foreground transition hover:text-foreground">Compare</a>
            <a href="#contractors"  className="text-[13px] text-muted-foreground transition hover:text-foreground">For Contractors</a>
            <a
              href="https://nexusoperations.zendesk.com/hc/en-us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-muted-foreground transition hover:text-foreground"
            >
              Help Center
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
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-20">

            {/* Left: text */}
            <div className="flex-1 max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded border border-border bg-card px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Serving Topeka, KS and surrounding areas</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl leading-[1.1]">
                Property service management<br />
                <span className="text-muted-foreground font-normal">without the coordination overhead.</span>
              </h1>

              <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed max-w-xl">
                Nexus Operations manages service requests from submission through completion for homeowners, landlords, and property managers in the Topeka metro area. Submit a request with photos, scope, and a budget cap. A single verified contractor is assigned — no bidding, no competing calls, no ambiguity about who is coming or when.
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
                  Contractor Portal Access
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-5">
                {[
                  { icon: BadgeCheck, text: "All contractors licensed and insured" },
                  { icon: Shield,     text: "Requests never sold or shared" },
                  { icon: Clock,      text: "Consultation confirmed within 24 hours" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: stats panel */}
            <div className="mt-12 lg:mt-0 flex-shrink-0 w-full lg:w-[340px]">
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="border-b border-border px-5 py-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Platform Overview</p>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { label: "Cost to property owners",    value: "$0",   note: "Free to submit" },
                    { label: "Contractors per request",    value: "1",    note: "Exclusive assignment" },
                    { label: "Consultation turnaround",    value: "≤24h", note: "Pre-confirmed at booking" },
                    { label: "Contractor verification",    value: "100%", note: "Licensed + insured required" },
                    { label: "Service area",               value: "Topeka, KS", note: "Shawnee County + surrounding" },
                    { label: "Phone",                      value: "(785) 428-0244", note: "Mon–Fri, 8am–6pm CT" },
                  ].map(({ label, value, note }) => (
                    <div key={label} className="flex items-center justify-between px-5 py-3.5">
                      <div>
                        <p className="text-[12px] text-muted-foreground">{label}</p>
                        {note && <p className="text-[11px] text-muted-foreground/60 mt-0.5">{note}</p>}
                      </div>
                      <p className="text-[13px] font-semibold text-foreground tabular-nums">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <h2 className="text-xl font-bold">Request process</h2>
            <p className="mt-1 text-sm text-muted-foreground">From submission to consultation — four steps, no follow-up required.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Submit your request",
                body: "Upload 2–10 project photos, write a scope of work, set a maximum budget, and select preferred consultation windows.",
              },
              {
                step: "02",
                title: "Contractor assignment",
                body: "Verified contractors in your area are notified. The first qualified contractor to claim the request secures it — removed from all other feeds instantly.",
              },
              {
                step: "03",
                title: "Consultation scheduled",
                body: "Both you and the assigned contractor receive a confirmed appointment. The contractor reviews your photos and scope before arriving.",
              },
              {
                step: "04",
                title: "Estimate and decision",
                body: "You receive a written, itemized estimate at or below your stated budget. Accept, negotiate, or decline. No obligation.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="rounded-lg border border-border bg-card p-5">
                <p className="text-xs font-bold text-primary mb-3">{step}</p>
                <h3 className="text-sm font-semibold mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-16 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <h2 className="text-xl font-bold">Service categories</h2>
            <p className="mt-1 text-sm text-muted-foreground">Every request requires photos, written scope, and a stated budget before submission.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.name} className="rounded-lg border border-border bg-background p-5 transition hover:border-primary/40">
                <div className="flex items-center justify-between mb-3">
                  <s.icon className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <h3 className="text-sm font-semibold mb-1">{s.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{s.desc}</p>
                <p className="text-[11px] text-muted-foreground/70">Range: <span className="text-muted-foreground font-medium">{s.range}</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ── */}
      <section id="comparison" className="py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <h2 className="text-xl font-bold">How Nexus Operations differs</h2>
            <p className="mt-1 text-sm text-muted-foreground">A direct comparison against traditional contractor lead platforms.</p>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="py-3 px-5 text-left text-xs font-medium text-muted-foreground w-1/3">Criteria</th>
                  <th className="py-3 px-5 text-left text-xs font-medium text-primary w-1/3">Nexus Operations</th>
                  <th className="py-3 px-5 text-left text-xs font-medium text-muted-foreground w-1/3">Typical Lead Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { label: "Contractors per request",    nexus: "One — assigned exclusively",           other: "3–7 competing simultaneously" },
                  { label: "Cost to property owner",     nexus: "Free — no fees, no upsells",           other: "Lead costs passed through to prices" },
                  { label: "Budget visibility",          nexus: "Cap set before any contractor sees it", other: "Negotiated on-site" },
                  { label: "Required documentation",     nexus: "Photos, scope, budget — all required", other: "Optional, often skipped" },
                  { label: "Consultation scheduling",    nexus: "Pre-confirmed at submission",           other: "Contractor initiates contact" },
                  { label: "Contractor screening",       nexus: "License, insurance, background check", other: "Self-reported or unverified" },
                  { label: "Unsolicited contact",        nexus: "None — one point of contact",          other: "Multiple contractors call simultaneously" },
                ].map(({ label, nexus, other }) => (
                  <tr key={label} className="bg-background">
                    <td className="py-3 px-5 text-xs text-muted-foreground">{label}</td>
                    <td className="py-3 px-5 text-xs font-medium text-foreground">{nexus}</td>
                    <td className="py-3 px-5 text-xs text-muted-foreground">{other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── For Contractors ── */}
      <section id="contractors" className="py-16 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 items-start">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Contractor Access</p>
              <h2 className="text-xl font-bold mb-4">Claim pre-documented projects in your service area</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                When a property owner submits a request, verified contractors in the matching service area are notified. The first contractor to claim the request receives exclusive access — full photos, written scope, and the budget ceiling — before making contact with the property owner. No bidding against other contractors. No cold calls.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "License, insurance, and background verification required",
                  "Project photos and scope provided before your first contact",
                  "Budget ceiling is set by the property owner at submission",
                  "Exclusive claim — the listing is removed from all other feeds immediately",
                  "Consultation appointment pre-confirmed by the platform",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/sign-up?role=contractor"
                className="inline-flex items-center gap-2 rounded bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Apply for Contractor Access
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-lg border border-border bg-background overflow-hidden">
              <div className="border-b border-border px-5 py-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contractor Dashboard — Preview</p>
              </div>
              <div className="divide-y divide-border">
                {[
                  { label: "Open requests — Shawnee County",  value: "14", highlight: true },
                  { label: "Requests claimed (last 30 days)", value: "6" },
                  { label: "Average budget ceiling",           value: "$6,200" },
                  { label: "Consultation completion rate",     value: "94%" },
                  { label: "Active contractors in network",    value: "23" },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-[12px] text-muted-foreground">{label}</span>
                    <span className={`text-[13px] font-semibold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border px-5 py-4 bg-card">
                <p className="text-xs text-muted-foreground">Contractor accounts are reviewed manually. Approval requires a valid license, proof of insurance, and a passed background check.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Property Managers ── */}
      <section id="property-managers" className="py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Property Management Accounts</p>
            <h2 className="text-xl font-bold mb-2">Manage service requests across multiple properties</h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Property management accounts support multiple property addresses, per-property request tracking, consolidated billing records, and a shared contractor history — all from one login.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: FileText, title: "Per-property request history",  body: "Full documentation — photos, scope, estimates, and job records — stored per property address." },
              { icon: BadgeCheck, title: "Pre-screened contractor pool", body: "Every contractor on the platform has passed license, insurance, and background verification. No self-reporting." },
              { icon: Clock, title: "Portfolio-wide coordination",       body: "Submit and track requests across all managed properties from a single account. No per-property logins." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-lg border border-border bg-card p-5">
                <Icon className="h-4 w-4 text-primary mb-3" />
                <h3 className="text-sm font-semibold mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/auth/sign-up?role=property_manager"
              className="inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 text-[13px] font-semibold text-foreground transition hover:bg-muted"
            >
              Open a Property Manager Account
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact / CTA ── */}
      <section id="contact" className="py-16 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold mb-3">Contact Nexus Operations</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                For questions about a submitted request, contractor onboarding, or property management account setup, contact us directly. Platform support is also available through the Zendesk help center.
              </p>
              <div className="space-y-3">
                <a href="tel:+17854280244" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  (785) 428-0244
                </a>
                <a href="mailto:admin@nexusoperations.org" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  admin@nexusoperations.org
                </a>
                <a
                  href="https://nexusoperations.zendesk.com/hc/en-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition"
                >
                  <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                  Help Center — nexusoperations.zendesk.com
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/auth/sign-up"
                className="flex items-center justify-between rounded border border-border bg-background px-5 py-4 transition hover:border-primary/40 group"
              >
                <div>
                  <p className="text-sm font-semibold">Submit a service request</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Free for property owners and managers</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
              </Link>
              <Link
                href="/auth/sign-up?role=contractor"
                className="flex items-center justify-between rounded border border-border bg-background px-5 py-4 transition hover:border-primary/40 group"
              >
                <div>
                  <p className="text-sm font-semibold">Contractor portal access</p>
                  <p className="text-xs text-muted-foreground mt-0.5">License and insurance required for approval</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
              </Link>
              <Link
                href="/faq"
                className="flex items-center justify-between rounded border border-border bg-background px-5 py-4 transition hover:border-primary/40 group"
              >
                <div>
                  <p className="text-sm font-semibold">Frequently asked questions</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Platform process, fees, and policies</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 border-t border-border">
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
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                Property service coordination — Topeka, KS metro area.
              </p>
              <div className="mt-4 space-y-1.5">
                <a href="tel:+17854280244" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition">
                  <Phone className="h-3 w-3" /> (785) 428-0244
                </a>
                <a href="mailto:admin@nexusoperations.org" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition">
                  <Mail className="h-3 w-3" /> admin@nexusoperations.org
                </a>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Platform</p>
              <ul className="space-y-2.5 text-[12px]">
                <li><a href="#how-it-works"    className="text-muted-foreground hover:text-foreground transition">How It Works</a></li>
                <li><a href="#services"        className="text-muted-foreground hover:text-foreground transition">Service Categories</a></li>
                <li><a href="#comparison"      className="text-muted-foreground hover:text-foreground transition">Platform Comparison</a></li>
                <li><Link href="/faq"          className="text-muted-foreground hover:text-foreground transition">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Portals</p>
              <ul className="space-y-2.5 text-[12px]">
                <li><Link href="/auth/sign-up"                   className="text-muted-foreground hover:text-foreground transition">Property Owner Portal</Link></li>
                <li><Link href="/auth/sign-up?role=property_manager" className="text-muted-foreground hover:text-foreground transition">Property Manager Portal</Link></li>
                <li><Link href="/auth/sign-up?role=contractor"   className="text-muted-foreground hover:text-foreground transition">Contractor Portal</Link></li>
                <li><Link href="/auth/login"                     className="text-muted-foreground hover:text-foreground transition">Sign In</Link></li>
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
            <p>&copy; 2026 Nexus Operations, LLC. All rights reserved. Topeka, Kansas.</p>
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
