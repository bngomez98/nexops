import Image from "next/image";
import Link from "next/link";
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
  ChevronRight,
  ArrowRight,
  Users,
  Building2,
  BadgeCheck,
} from "lucide-react";

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
              className="h-10 w-auto"
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
            <a
              href="#contractors"
              className="hidden text-sm font-medium text-foreground transition hover:text-primary md:block"
            >
              I&apos;m a contractor
            </a>
            <a
              href="#start"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Start Your Project
            </a>
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
              Submit your project once with photos, scope, and budget. A single verified contractor claims it exclusively before your phone rings. No bidding wars. No shared leads. Free for homeowners.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#start"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Start Your Project — Free
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#contractors"
                className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                I&apos;m a contractor
              </a>
            </div>
          </div>

          {/* Trust indicators */}
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

          {/* Verification badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-primary" />
              <span>Every contractor is licensed, insured, and verified</span>
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
                Verified contractors in your area are notified. The first to claim your request secures it exclusively—removed from all others immediately.
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
                Receive a written, itemized estimate. Accept, negotiate, or decline—with no obligation.
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
              Every request requires project photos, scope, and budget before matching
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: TreePine,
                title: "Tree Removal",
                description: "Hazardous and non-hazardous removal, crown reduction, stump grinding, and post-storm assessment.",
                range: "$500 – $8,000",
                live: true,
              },
              {
                icon: Thermometer,
                title: "HVAC",
                description: "Central air, heat pumps, ductless mini-splits, furnace replacement, and ductwork design.",
                range: "$3,000 – $20,000",
                live: true,
              },
              {
                icon: Zap,
                title: "Electrical",
                description: "Panel upgrades, branch circuits, whole-home rewiring, subpanel installation, and EV charger rough-in.",
                range: "$500 – $10,000",
                live: true,
              },
              {
                icon: Home,
                title: "Roofing",
                description: "Full replacements, leak repairs, storm damage assessment, and insurance restoration.",
                range: "$5,000 – $25,000",
                live: true,
              },
              {
                icon: Hammer,
                title: "Concrete",
                description: "Driveways, patios, sidewalks, foundations, and flatwork installation or replacement.",
                range: "$2,000 – $15,000",
                live: true,
              },
              {
                icon: Fence,
                title: "Fencing",
                description: "Privacy, chain link, vinyl, wood, and specialty fencing for residential and commercial.",
                range: "$1,500 – $10,000",
                live: true,
              },
            ].map((service) => (
              <div
                key={service.title}
                className="group rounded-lg border border-border bg-card p-6 transition hover:border-primary/50"
              >
                <div className="flex items-start justify-between">
                  <service.icon className="h-6 w-6 text-primary" />
                  {service.live && (
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      LIVE
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Typical range: {service.range}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t see your category?{" "}
              <a href="#start" className="text-primary hover:underline">
                Tell us about it
              </a>
              —we prioritize expansion based on demand.
            </p>
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
                  <th className="py-4 pr-4 text-left font-semibold">Feature</th>
                  <th className="py-4 px-4 text-left font-semibold text-primary">Nexus Operations</th>
                  <th className="py-4 pl-4 text-left font-semibold text-muted-foreground">Traditional Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-4 pr-4 text-muted-foreground">Lead exclusivity</td>
                  <td className="py-4 px-4 font-medium">One contractor per request, always</td>
                  <td className="py-4 pl-4 text-muted-foreground">3–7 contractors competing</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-muted-foreground">Homeowner cost</td>
                  <td className="py-4 px-4 font-medium">Free — no hidden fees</td>
                  <td className="py-4 pl-4 text-muted-foreground">Your data is sold</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-muted-foreground">Budget transparency</td>
                  <td className="py-4 px-4 font-medium">Set before matching</td>
                  <td className="py-4 pl-4 text-muted-foreground">Guessed after site visit</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-muted-foreground">Project documentation</td>
                  <td className="py-4 px-4 font-medium">Photos + specs required</td>
                  <td className="py-4 pl-4 text-muted-foreground">Optional, often absent</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-muted-foreground">Consultation scheduling</td>
                  <td className="py-4 px-4 font-medium">Pre-confirmed at submission</td>
                  <td className="py-4 pl-4 text-muted-foreground">Phone tag, voicemails</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-muted-foreground">Contractor vetting</td>
                  <td className="py-4 px-4 font-medium">License, insurance, background verified</td>
                  <td className="py-4 pl-4 text-muted-foreground">Self-reported</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 text-muted-foreground">Inbound contact volume</td>
                  <td className="py-4 px-4 font-medium">One contractor reaches out</td>
                  <td className="py-4 pl-4 text-muted-foreground">5–15 calls in the first hour</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-6">
            <h3 className="font-semibold">The Nexus Commitment</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              One request. One verified contractor. Zero unsolicited calls. If no qualified contractor is currently available in your area, you are told immediately—no indefinite wait, no ambiguity.
            </p>
          </div>
        </div>
      </section>

      {/* Core Commitments */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Users,
                title: "Homeowner control",
                description: "You set the scope, budget, and consultation window before any contractor is contacted.",
              },
              {
                icon: Shield,
                title: "Contractor exclusivity",
                description: "When a contractor claims a request, they earn it outright. No auction, no race to the bottom.",
              },
              {
                icon: FileText,
                title: "Full preparation",
                description: "Complete documentation before any match. Consultations are productive from the first minute.",
              },
              {
                icon: BadgeCheck,
                title: "Quality tracked",
                description: "Every contractor is verified. Every completed project updates their standing.",
              },
            ].map((item) => (
              <div key={item.title}>
                <item.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Contractors */}
      <section id="contractors" className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">For contractors</h2>
              <p className="mt-4 text-muted-foreground">
                Stop paying $40–$80 per lead that gets sold to four other contractors. With Nexus, you pay a flat monthly membership. When you claim a project, it&apos;s yours exclusively.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Flat monthly fee—no per-lead charges",
                  "Exclusive project assignment",
                  "Complete project details before you claim",
                  "Budget ceiling visible upfront",
                  "Property owner expecting your contact",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#start"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Join the Network
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="rounded-lg border border-border bg-background p-6">
              <h3 className="font-semibold">Membership Requirements</h3>
              <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>Valid state contractor license in your trade category</span>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>Current general liability insurance ($500K minimum)</span>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>Clean background check</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>Commitment to 24-hour consultation confirmation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Who we serve</h2>
            <p className="mt-2 text-muted-foreground">Property owners and operators who need reliable coordination</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Home, title: "Homeowners", description: "One submission, one contractor, budget transparency." },
              { icon: Building2, title: "Property Managers", description: "Complete documentation for every maintenance decision." },
              { icon: Users, title: "Landlords", description: "Fast consultation confirmation minimizes vacancy periods." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-lg border border-border p-6">
                <item.icon className="h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="start" className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Ready to get started?</h2>
          <p className="mt-4 text-muted-foreground">
            Submit your project or join our contractor network today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:admin@nexusoperations.org"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Contact Us
            </a>
            <a
              href="tel:9139511711"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              (913) 951-1711
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Image
                src="/nexus-logo.png"
                alt="Nexus Operations"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <p className="mt-4 text-sm text-muted-foreground">
                One project, one verified contractor. No shared leads. No bidding wars. Free for homeowners.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Platform</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
                <li><a href="#services" className="hover:text-foreground">Service Categories</a></li>
                <li><a href="#start" className="hover:text-foreground">Submit a Request</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Contractors</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#contractors" className="hover:text-foreground">Join the Network</a></li>
                <li><a href="#contractors" className="hover:text-foreground">Membership</a></li>
                <li><a href="https://nexusoperations.zendesk.com/hc/en-us" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:admin@nexusoperations.org" className="hover:text-foreground">admin@nexusoperations.org</a></li>
                <li><a href="tel:9139511711" className="hover:text-foreground">(913) 951-1711</a></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2026 Nexus Operations, LLC. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Serving Topeka, KS and surrounding areas · Verified contractors only
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
