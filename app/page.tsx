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
} from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/">
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={160}
              height={53}
              style={{ height: "40px", width: "auto" }}
            />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#how-it-works" className="text-sm text-muted-foreground transition hover:text-foreground">
              How It Works
            </a>
            <a href="#services" className="text-sm text-muted-foreground transition hover:text-foreground">
              Services
            </a>
            <a href="#why-nexus" className="text-sm text-muted-foreground transition hover:text-foreground">
              Why Nexus
            </a>
            <a href="#contractors" className="text-sm text-muted-foreground transition hover:text-foreground">
              For Contractors
            </a>
            <a
              href="https://nexusoperations.zendesk.com/hc/en-us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              Help Center
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground md:block"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-primary">Now serving Topeka, KS and surrounding areas</p>
            <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              One contractor.
              <br />
              <span className="text-primary">Exclusively yours.</span>
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground">
              Submit your project once with photos, scope, and budget. A single verified contractor claims it exclusively before your phone rings. No bidding wars. No competing contractors. Free for property owners.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Start Your Project
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Join as Contractor
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">$0</div>
              <div className="mt-1 text-xs text-muted-foreground">Cost to homeowners</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">1</div>
              <div className="mt-1 text-xs text-muted-foreground">Contractor per job</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">24hr</div>
              <div className="mt-1 text-xs text-muted-foreground">Consultation confirmed</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="mt-1 text-xs text-muted-foreground">Verified contractors</div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-primary" />
              <span>Licensed, insured, and verified contractors</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Your project is never sold or shared</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">How it works</h2>
            <p className="mt-2 text-muted-foreground">From submission to consultation in under 24 hours</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                01
              </div>
              <h3 className="mt-4 font-semibold">Submit your project</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload 2–10 project photos, document the scope of work, set a budget cap, and select consultation windows.
              </p>
            </div>
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                02
              </div>
              <h3 className="mt-4 font-semibold">A contractor claims it</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Verified contractors in your area are notified. The first to claim your request secures it exclusively — removed from all others immediately.
              </p>
            </div>
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                03
              </div>
              <h3 className="mt-4 font-semibold">Consultation confirmed</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Both you and the contractor receive a confirmed appointment. They review your photos and scope in advance.
              </p>
            </div>
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                04
              </div>
              <h3 className="mt-4 font-semibold">Project moves forward</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Receive a written, itemized estimate. Accept, negotiate, or decline — with no obligation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section id="services" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Service categories</h2>
            <p className="mt-2 text-muted-foreground">
              Every request requires project photos, specifications, scope, and budget before submission.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: TreePine,    title: "Tree Removal",  description: "Licensed removal, crown reduction, stump grinding, and post-storm assessment.", range: "$500 – $8,000" },
              { icon: Thermometer, title: "HVAC",          description: "Central air, heat pumps, ductless mini-splits, furnace replacement, and maintenance.", range: "$3,000 – $20,000" },
              { icon: Zap,         title: "Electrical",    description: "Panel upgrades, circuit additions, rewiring, subpanel installation, and EV charger rough-in.", range: "$500 – $10,000" },
              { icon: Home,        title: "Roofing",       description: "Full replacements, leak repairs, storm damage assessment, and insurance restoration.", range: "$5,000 – $25,000" },
              { icon: Hammer,      title: "Concrete",      description: "Driveways, patios, sidewalks, flatwork, and foundation repairs.", range: "$2,000 – $15,000" },
              { icon: Fence,       title: "Fencing",       description: "Privacy, chain link, vinyl, wood, and specialty fencing for residential and commercial.", range: "$1,500 – $10,000" },
            ].map((service) => (
              <div key={service.title} className="rounded-lg border border-border bg-card p-6 transition hover:border-primary/50">
                <div className="flex items-start justify-between">
                  <service.icon className="h-6 w-6 text-primary" />
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Available</span>
                </div>
                <h3 className="mt-4 font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Typical range: <span className="font-medium text-foreground">{service.range}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Nexus */}
      <section id="why-nexus" className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Why Nexus Operations</h2>
            <p className="mt-2 text-muted-foreground">Built for outcomes, not volume</p>
          </div>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left font-medium text-muted-foreground">Feature</th>
                  <th className="py-3 text-left font-medium text-primary">Nexus Operations</th>
                  <th className="py-3 text-left font-medium text-muted-foreground">Traditional Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { feature: "Contractor assignment",    nexus: "One contractor per request",            other: "3–7 contractors competing" },
                  { feature: "Cost to homeowner",        nexus: "Free to submit — no hidden fees",       other: "Lead fees passed to contractors" },
                  { feature: "Budget transparency",      nexus: "Budget cap set at submission",          other: "Contractor guesses on-site" },
                  { feature: "Documentation",            nexus: "Required — photos, scope, budget",      other: "Optional, often absent" },
                  { feature: "Consultation scheduling",  nexus: "Pre-confirmed at submission",           other: "Tag-and-chase phone calls" },
                  { feature: "Contractor verification",  nexus: "Licensed, insured, background checked", other: "Self-reported or non-existent" },
                ].map(({ feature, nexus, other }) => (
                  <tr key={feature}>
                    <td className="py-3 text-muted-foreground">{feature}</td>
                    <td className="py-3 font-medium">{nexus}</td>
                    <td className="py-3 text-muted-foreground">{other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
            <h3 className="font-semibold text-foreground">The Nexus Commitment</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              One request. One verified contractor. Zero unsolicited calls. If no qualified contractor is available in your area, you are told immediately — no indefinite wait, no ambiguity.
            </p>
          </div>
        </div>
      </section>

      {/* For Contractors */}
      <section id="contractors" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-medium text-primary">For Contractors</p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">Stop chasing leads. Let them come to you.</h2>
              <p className="mt-4 text-muted-foreground">
                Every project you claim is yours alone. No competing bids, no price wars. Homeowners arrive at the consultation already knowing your scope — all you have to do is show up and close.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Exclusive claim — no competing contractors",
                  "Full project documentation before you arrive",
                  "Budget ceiling set upfront by the homeowner",
                  "Simple license and insurance verification",
                  "Growing network across the Topeka region",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/sign-up"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Apply as a Contractor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-lg border border-border bg-card p-8">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Contractor dashboard preview</p>
              <div className="mt-6 divide-y divide-border">
                {[
                  { label: "Open projects near you",      value: "14",    green: true },
                  { label: "Projects claimed this month", value: "6",     green: false },
                  { label: "Avg. budget ceiling",         value: "$6,200", green: false },
                  { label: "Consultation rate",           value: "94%",   green: false },
                ].map(({ label, value, green }) => (
                  <div key={label} className="flex items-center justify-between py-3.5">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className={`text-sm font-bold ${green ? "text-primary" : "text-foreground"}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Ready to hire with confidence?</h2>
          <p className="mt-4 text-muted-foreground">
            Submit your first project free and get matched with a verified contractor in your area.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Start Your Project — Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Apply as a Contractor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/">
                <Image
                  src="/nexus-logo.png"
                  alt="Nexus Operations"
                  width={120}
                  height={40}
                  style={{ height: "32px", width: "auto" }}
                />
              </Link>
              <p className="mt-3 text-xs text-muted-foreground">One contractor. Exclusively yours. Topeka, KS.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Product</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="#how-it-works" className="text-muted-foreground transition hover:text-foreground">How It Works</a></li>
                <li><a href="#services"     className="text-muted-foreground transition hover:text-foreground">Services</a></li>
                <li><a href="#why-nexus"    className="text-muted-foreground transition hover:text-foreground">Why Nexus</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Company</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="#contractors" className="text-muted-foreground transition hover:text-foreground">For Contractors</a></li>
                <li>
                  <a
                    href="https://nexusoperations.zendesk.com/hc/en-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-foreground"
                  >
                    Help Center
                  </a>
                </li>
                <li><a href="#contact" className="text-muted-foreground transition hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Legal</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground transition hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="text-muted-foreground transition hover:text-foreground">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">&copy; 2026 Nexus Operations. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="tel:+1" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Phone className="h-3 w-3" /> Contact
              </a>
              <a href="mailto:hello@nexusoperations.com" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Mail className="h-3 w-3" /> Email
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
