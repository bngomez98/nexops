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
  ArrowRight,
  BadgeCheck,
  Users,
  Building2,
  Phone,
  Mail,
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
                description: "Licensed removal, crown reduction, stump grinding, and post-storm assessment. ISA-certified arborists.",
                range: "$500 – $8,000",
              },
              {
                icon: Thermometer,
                title: "HVAC",
                description: "Central air, heat pumps, ductless mini-splits, furnace replacement, and maintenance agreements.",
                range: "$3,000 – $20,000",
              },
              {
                icon: Zap,
                title: "Electrical",
                description: "Panel upgrades, circuit additions, rewiring, subpanel installation, and EV charger rough-in.",
                range: "$500 – $10,000",
              },
              {
                icon: Home,
                title: "Roofing",
                description: "Full replacements, leak repairs, storm damage assessment, and insurance restoration.",
                range: "$5,000 – $25,000",
              },
              {
                icon: Hammer,
                title: "Concrete",
                description: "Driveways, patios, sidewalks, flatwork, and foundation repairs.",
                range: "$2,000 – $15,000",
              },
              {
                icon: Fence,
                title: "Fencing",
                description: "Privacy, chain link, vinyl, wood, and specialty fencing for residential and commercial.",
                range: "$1,500 – $10,000",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="rounded-lg border border-border bg-card p-6 transition hover:border-primary/50"
              >
                <div className="flex items-start justify-between">
                  <service.icon className="h-6 w-6 text-primary" />
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Live
                  </span>
                </div>
                <h3 className="mt-4 font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Typical range: <span className="font-medium text-foreground">{service.range}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t see your category?{" "}
              <a href="#start" className="text-primary hover:underline">
                Submit a request
              </a>{" "}
              — we prioritize expansion based on demand.
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
                  <th className="py-3 text-left font-medium text-muted-foreground">Feature</th>
                  <th className="py-3 text-left font-medium text-primary">Nexus Operations</th>
                  <th className="py-3 text-left font-medium text-muted-foreground">Traditional Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 text-muted-foreground">Contractor assignment</td>
                  <td className="py-3 font-medium">One contractor per request</td>
                  <td className="py-3 text-muted-foreground">3–7 contractors competing</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Homeowner cost</td>
                  <td className="py-3 font-medium">Free, always</td>
                  <td className="py-3 text-muted-foreground">Free, but data is sold</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Budget transparency</td>
                  <td className="py-3 font-medium">Set before matching</td>
                  <td className="py-3 text-muted-foreground">Contractor guesses on-site</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Documentation</td>
                  <td className="py-3 font-medium">Required before match</td>
                  <td className="py-3 text-muted-foreground">Optional, often absent</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Consultation scheduling</td>
                  <td className="py-3 font-medium">Pre-confirmed at submission</td>
                  <td className="py-3 text-muted-foreground">Phone tag, missed calls</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Contractor vetting</td>
                  <td className="py-3 font-medium">License, insurance, background verified</td>
                  <td className="py-3 text-muted-foreground">Self-reported</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground">Inbound contact volume</td>
                  <td className="py-3 font-medium">One contractor reaches out</td>
                  <td className="py-3 text-muted-foreground">5–15 calls in the first hour</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
            <h3 className="font-semibold text-foreground">The Nexus Commitment</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              One request. One verified contractor. Zero unsolicited calls. If no qualified contractor is currently available in your area, you are told immediately—no indefinite wait, no ambiguity.
            </p>
          </div>
        </div>
      </section>

      {/* For Contractors */}
      <section id="contractors" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-primary">For Contractors</p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Exclusive projects. Flat monthly fee. No bidding wars.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Traditional platforms charge $40–$80 per job request and sell that same request to multiple contractors. You invest time pursuing work you have a one-in-four chance of winning.
              </p>
              <p className="mt-4 text-muted-foreground">
                Nexus Operations works differently. Pay a flat monthly membership. When you claim a project, it is yours exclusively. The property owner is expecting your call and has already shared complete project details.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "Flat monthly fee—no per-job charges",
                  "Exclusive project assignment",
                  "Complete project details before you claim",
                  "Budget ceiling visible upfront",
                  "Property owner expecting your contact",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/sign-up"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Join the Network
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="font-semibold">Membership Requirements</h3>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Valid state license</p>
                    <p className="text-sm text-muted-foreground">In your trade category</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">General liability insurance</p>
                    <p className="text-sm text-muted-foreground">$500K minimum coverage</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Background check</p>
                    <p className="text-sm text-muted-foreground">Clean record required</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">24-hour response commitment</p>
                    <p className="text-sm text-muted-foreground">Consultation confirmation</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Who we serve</h2>
            <p className="mt-2 text-muted-foreground">Property owners and operators who need reliable contractor coordination</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Home, title: "Homeowners", description: "One submission, one contractor, one consultation. Budget transparency prevents wasted time." },
              { icon: Building2, title: "Property Managers", description: "Complete, timestamped documentation for every maintenance decision." },
              { icon: Users, title: "Landlords", description: "Fast consultation confirmation supports tenant communication and minimizes vacancy." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-background p-6">
                <item.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="start" className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Ready to get started?</h2>
          <p className="mt-2 text-muted-foreground">
            Submit your project or join our contractor network today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:admin@nexusoperations.org"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Mail className="h-4 w-4" />
              admin@nexusoperations.org
            </a>
            <a
              href="tel:9139511711"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              <Phone className="h-4 w-4" />
              (913) 951-1711
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Image
                src="/nexus-logo.png"
                alt="Nexus Operations"
                width={140}
                height={47}
                style={{ height: "36px", width: "auto" }}
              />
              <p className="mt-4 text-sm text-muted-foreground">
                One project, one verified contractor. No competing contractors. No bidding wars. Free for property owners.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Platform</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
                <li><a href="#services" className="hover:text-foreground">Service Categories</a></li>
                <li><a href="#start" className="hover:text-foreground">Submit a Request</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Contractors</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#contractors" className="hover:text-foreground">Join the Network</a></li>
                <li><a href="#contractors" className="hover:text-foreground">Membership Plans</a></li>
                <li><a href="#contractors" className="hover:text-foreground">Verification Process</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:admin@nexusoperations.org" className="hover:text-foreground">Contact</a></li>
                <li><a href="https://nexusoperations.zendesk.com/hc/en-us" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Help Center</a></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Nexus Operations, LLC. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Serving Topeka, KS and surrounding areas
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
