"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, ArrowRight, MapPin } from "lucide-react"
import { Header } from "@/components/header"

const services = [
  { name: "Roofing", desc: "Full replacements, storm damage assessment, leak repairs, and insurance restoration work." },
  { name: "HVAC", desc: "Central air, heat pumps, ductless mini-splits, furnace replacement, and annual maintenance." },
  { name: "Electrical", desc: "Panel upgrades, circuit additions, rewiring, subpanel installation, and EV charger rough-in." },
  { name: "Plumbing", desc: "Water heaters, leak detection, drain clearing, main line repair, and fixture replacement." },
  { name: "Concrete", desc: "Driveways, patios, sidewalks, foundation repair, and structural flatwork." },
  { name: "Tree Removal", desc: "Removal, crown reduction, stump grinding, and post-storm emergency response." },
  { name: "Fencing", desc: "Privacy, chain link, vinyl, wood, and commercial perimeter fencing." },
  { name: "General Repair", desc: "Drywall, carpentry, painting, door and window replacement, and interior repairs." },
]

const processSteps = [
  { num: "01", title: "Submit request", desc: "Property owner submits project with photos, written scope, and maximum budget." },
  { num: "02", title: "Nexus review", desc: "Nexus staff reviews submission for clarity and scope." },
  { num: "03", title: "Contractor assigned", desc: "Qualified contractor in that trade is notified and can claim the project." },
  { num: "04", title: "Consultation confirmed", desc: "Contractor confirms availability; homeowner receives contractor info and appointment time." },
  { num: "05", title: "Estimate provided", desc: "Contractor provides written, itemized estimate within the stated budget ceiling." },
  { num: "06", title: "Record created", desc: "Once accepted, project is documented in permanent service record." },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background font-sans">
      <Header />

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
                Contractors apply for access to the Nexus network. After a manual review that verifies a current contractor license and general liability insurance, the contractor account is activated. Contractors receive notifications of new requests in their trade and service area. Each notification includes the project type, general location, and the budget ceiling. When a contractor claims a request, it is exclusively theirs — the listing is immediately removed from all other contractors. The contractor has the full project documentation before any contact with the property owner occurs.
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
            Each of the following trades has verified contractors available in the Shawnee County service area. Every submission requires photographs, a written scope of work, and a stated budget ceiling before it enters the contractor queue. Categories expand as additional verified contractors join the network.
          </p>

          <div className="grid gap-x-12 gap-y-0 sm:grid-cols-2 divide-y divide-border border-t border-b border-border sm:border-b-0">
            {services.map((s, i) => (
              <div
                key={s.name}
                className={`py-6 ${
                  i >= services.length - 2 ? "sm:border-b border-border" : ""
                } ${
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
            {processSteps.map((step) => (
              <div key={step.num} className="grid gap-6 py-12 lg:grid-cols-[80px_1fr]">
                <div className="text-4xl font-bold text-primary/40 lg:text-right">{step.num}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed max-w-lg">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Reporting ── */}
      <section id="reporting" className="py-24 bg-muted/30">
        <div className="mx-auto max-w-6xl px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-6">Data-driven reporting</p>
          <h2 className="text-3xl font-bold leading-snug mb-4 max-w-xl">
            Every closed project generates a post-project report.
          </h2>
          <p className="text-[15px] text-muted-foreground leading-[1.8] max-w-2xl mb-16">
            Each report covers financial data, efficiency metrics, and recommendations. For property managers, reports aggregate across your entire portfolio with benchmarking and portfolio-level insights.
          </p>

          <div className="grid gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Financial Summary", desc: "Total cost, labor vs. materials breakdown, variance from budget." },
              { title: "Efficiency Metrics", desc: "Time to completion, contractor response time, scheduling turnaround." },
              { title: "Maintenance Intervals", desc: "Recommended next service date based on trade standards and history." },
              { title: "Historical Comparison", desc: "Cost and timeline vs. prior projects in the same trade category." },
              { title: "Recurring Issues", desc: "Patterns detected across multiple projects at the same address or trade." },
              { title: "Portfolio Analytics", desc: "For managers: spend trends, open items, performance across all properties." },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-background rounded-lg border border-border">
                <p className="text-sm font-semibold mb-3 text-foreground">{item.title}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{item.desc}</p>
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
            Join the Nexus network. Qualified leads, zero marketing overhead.
          </h2>
          <p className="text-[15px] text-muted-foreground leading-[1.8] max-w-2xl mb-16">
            Licensed contractors receive a dedicated project feed with pre-documented, pre-vetted residential and commercial work. There is no cost to join.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">How it works for contractors</h3>
                <ul className="space-y-3 text-[14px] text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>Apply with current license and general liability insurance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>Get activated once verified by our team</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>Receive notifications for new requests in your trade and service area</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>Claim projects exclusively — no bidding wars or competition</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>Access full project documentation before any owner contact</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/auth/sign-up?role=contractor"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Apply for Access
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-muted/30 p-8 rounded-lg border border-border">
              <p className="text-sm font-semibold text-primary mb-4">Network requirements</p>
              <ul className="space-y-3 text-[13px] text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  <span>Current, active trade license in your field</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  <span>Active general liability insurance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  <span>Professional communication and reliable scheduling</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  <span>Ability to provide written estimates within stated budgets</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Contact ── */}
      <section id="contact" className="py-24 bg-muted/30">
        <div className="mx-auto max-w-6xl px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Get in Touch</p>
              <h2 className="text-4xl font-bold leading-tight mb-6">
                Headquarters: Topeka, Kansas. Serving Shawnee County and surrounding areas.
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">
                Have questions about how Nexus works? Want to learn more about contractor opportunities? Reach out to our team directly.
              </p>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-1">Phone</p>
                  <a href="tel:+17854280244" className="text-lg text-primary font-semibold hover:underline">
                    (785) 428-0244
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Email</p>
                  <a href="mailto:admin@nexusoperations.org" className="text-lg text-primary font-semibold hover:underline">
                    admin@nexusoperations.org
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold mb-4 text-muted-foreground">Quick links</p>
                <nav className="space-y-2">
                  {[
                    { href: "/faq", label: "FAQ" },
                    { href: "/privacy", label: "Privacy Policy" },
                    { href: "/terms", label: "Terms of Service" },
                  ].map(({ href, label }) => (
                    <Link key={href} href={href} className="block text-[13px] text-muted-foreground hover:text-foreground transition">
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  © 2025 Nexus Operations. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
