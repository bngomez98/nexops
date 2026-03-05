import Image from "next/image";
import {
  Shield,
  FileText,
  Clock,
  CheckCircle,
  Users,
  Building,
  Home,
  TreePine,
  Zap,
  Thermometer,
  Hammer,
  Fence,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Image
            src="/nexus-logo.png"
            alt="Nexus Operations"
            width={180}
            height={60}
            className="h-12 w-auto"
          />
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              How It Works
            </a>
            <a
              href="#services"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              Services
            </a>
            <a
              href="#for-contractors"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              For Contractors
            </a>
            <a
              href="#contact"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Get Started
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-bold tracking-tight md:text-6xl">
            One Project. One Contractor.
            <span className="text-primary"> Done Right.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Nexus Operations connects property owners with verified, licensed
            contractors through exclusive project assignment. No competing bids.
            No shared leads. Just one qualified professional matched to your
            project.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#contact"
              className="rounded-md bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Submit a Project
            </a>
            <a
              href="#how-it-works"
              className="rounded-md border border-border px-8 py-3 text-base font-semibold text-foreground transition hover:bg-muted"
            >
              Learn How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
                The Problem
              </h2>
              <h3 className="mt-2 text-3xl font-bold">
                Traditional platforms sell your request to multiple contractors
              </h3>
              <p className="mt-4 text-muted-foreground">
                You submit a project and within minutes, four to six contractors
                call—each having paid for the same lead. None have complete
                information. You repeat yourself to each one. The decision comes
                down to whoever calls first or quotes lowest, not who is most
                qualified.
              </p>
              <p className="mt-4 text-muted-foreground">
                Contractors pay $40 to $80 for leads they have a one-in-four
                chance of winning. They invest hours pursuing work that multiple
                others are also chasing.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
                The Solution
              </h2>
              <h3 className="mt-2 text-3xl font-bold">
                One project. One contractor. Exclusive assignment.
              </h3>
              <p className="mt-4 text-muted-foreground">
                When a contractor claims your project on Nexus Operations, it is
                permanently removed from every other contractor&apos;s view. No
                override. No exception. No re-listing.
              </p>
              <p className="mt-4 text-muted-foreground">
                Your assigned contractor arrives having already reviewed your
                photographs and scope description. The conversation starts at a
                professional level—not with &quot;So what&apos;s the
                problem?&quot; but with informed assessment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              From submission to confirmed consultation in 24 hours. Every step
              eliminates ambiguity and ensures both parties arrive prepared.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Submit Your Project",
                description:
                  "Upload photos, describe the scope, set your budget ceiling, and select consultation windows.",
              },
              {
                step: "2",
                title: "One Contractor Claims It",
                description:
                  "A verified contractor reviews your complete submission and claims the project exclusively.",
              },
              {
                step: "3",
                title: "Consultation Confirmed",
                description:
                  "Within 24 hours, your consultation is scheduled. Both parties receive confirmation with full details.",
              },
              {
                step: "4",
                title: "Review and Decide",
                description:
                  "After the consultation, review the written estimate. Accept or decline—no obligation, no pressure.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Commitments */}
      <section className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">What Makes Us Different</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              These are not features. They are the foundation of how the
              platform operates.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Verified Contractors Only",
                description:
                  "Every contractor completes license verification, insurance confirmation, and background screening before accessing the platform.",
              },
              {
                icon: FileText,
                title: "Complete Documentation",
                description:
                  "Every project generates a timestamped audit trail—photographs, scope, budget, assignment, and consultation records.",
              },
              {
                icon: Clock,
                title: "24-Hour Consultation",
                description:
                  "Median time from submission to confirmed consultation is 24 hours. Fast response without the chaos.",
              },
              {
                icon: CheckCircle,
                title: "Budget Transparency",
                description:
                  "Your budget ceiling is visible to contractors before they claim. No surprises at the consultation.",
              },
              {
                icon: Users,
                title: "Exclusive Assignment",
                description:
                  "One project, one contractor. The moment a contractor claims your project, it disappears from everyone else.",
              },
              {
                icon: Building,
                title: "No Lead Selling",
                description:
                  "Your project details are never sold to third parties or shared with advertisers. Period.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-background p-6">
                <item.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Service Categories</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Submit projects across all major contractor categories. Every
              contractor in our network is licensed, insured, and
              background-verified.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Home,
                title: "Roofing",
                description:
                  "Full replacements, leak repairs, storm damage assessment, and insurance restoration work.",
              },
              {
                icon: Thermometer,
                title: "HVAC",
                description:
                  "Heating and cooling installation, replacement, and repair for residential and commercial properties.",
              },
              {
                icon: Hammer,
                title: "Concrete",
                description:
                  "Driveways, patios, sidewalks, and flatwork. New installation and replacement.",
              },
              {
                icon: TreePine,
                title: "Tree Removal",
                description:
                  "Safe removal, trimming, and stump grinding for trees of all sizes.",
              },
              {
                icon: Fence,
                title: "Fencing",
                description:
                  "Privacy, chain link, vinyl, and specialty fencing for residential and commercial.",
              },
              {
                icon: Zap,
                title: "Electrical",
                description:
                  "Panel upgrades, rewiring, new circuits, and EV charger installation.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="flex items-start gap-4 rounded-lg border border-border p-6 transition hover:border-primary/50"
              >
                <service.icon className="h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Contractors */}
      <section id="for-contractors" className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
                For Contractors
              </h2>
              <h3 className="mt-2 text-3xl font-bold">
                Stop competing for leads you already paid for
              </h3>
              <p className="mt-4 text-muted-foreground">
                Traditional platforms charge you $40 to $80 per lead—and sell
                that same lead to three or four other contractors. You invest
                time pursuing work you have a one-in-four chance of winning.
              </p>
              <p className="mt-4 text-muted-foreground">
                Nexus Operations works differently. You pay a flat monthly
                membership. When you claim a project, it is yours exclusively.
                No competition. The property owner is expecting your call and
                has already shared complete project details.
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
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Join the Contractor Network
              </a>
            </div>
            <div className="rounded-lg border border-border bg-background p-8">
              <h4 className="text-lg font-semibold">Membership Requirements</h4>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>Valid state contractor license in your trade category</span>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>Current general liability insurance ($500K minimum)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
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
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Who We Serve</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Property owners and operators who need reliable, documented
              contractor coordination.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Property Managers",
                description:
                  "Reduce administrative burden with complete, timestamped documentation for every maintenance decision.",
              },
              {
                title: "Homeowners",
                description:
                  "One submission, one contractor, one consultation. Budget transparency prevents wasted time.",
              },
              {
                title: "Landlords",
                description:
                  "Fast consultation confirmation supports tenant communication and minimizes vacancy periods.",
              },
              {
                title: "Short-Term Rental Operators",
                description:
                  "24-hour response minimizes lost booking revenue. Documentation supports damage claims.",
              },
              {
                title: "Real Estate Investors",
                description:
                  "Standardized process across your entire portfolio with accurate expense tracking.",
              },
              {
                title: "HOA Management",
                description:
                  "Professional-grade audit trails for maintenance decisions across multiple properties.",
              },
            ].map((segment) => (
              <div key={segment.title} className="rounded-lg border border-border p-6">
                <h3 className="font-semibold">{segment.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {segment.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Whether you need a contractor for your next project or you&apos;re a
            licensed professional looking to grow your business, we&apos;re here
            to help.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:admin@nexusoperations.org"
              className="rounded-md bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Contact Us
            </a>
            <a
              href="tel:8008702734"
              className="rounded-md border border-border px-8 py-3 text-base font-semibold text-foreground transition hover:bg-muted"
            >
              (800) 870-2734
            </a>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Nexus Operations, LLC
            <br />
            405 SW Fillmore St, Topeka, KS 66606
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Image
              src="/nexus-logo.png"
              alt="Nexus Operations"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Nexus Operations, LLC. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
