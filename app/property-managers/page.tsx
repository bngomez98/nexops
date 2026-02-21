import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  DollarSign,
  CheckCircle,
  BarChart3,
  Building2,
  Users,
  Eye,
  Layers,
} from "lucide-react"

export const metadata: Metadata = {
  title: "For Property Managers | Nexus Operations",
  description:
    "Nexus Operations gives property managers a centralized, high-efficiency solution for maintenance — with pre-vetted contractors, photo documentation, budget caps, and automatic scheduling. Manage your entire portfolio without the overhead.",
}

const benefits = [
  {
    icon: ShieldCheck,
    title: "Automated contractor vetting & compliance",
    description:
      "Every contractor claiming a job has been pre-verified for active licensing at the state and local levels, general liability and workers' comp documentation, and tracked performance metrics across all jobs. Your liability exposure is managed before a contractor ever sets foot on a property.",
  },
  {
    icon: Clock,
    title: "Drastic reduction in soft costs",
    description:
      "Stop calling five contractors to get three quotes. Submit your photos and specs once. You don't manage outreach — the contractor claims the job and the consultation is automatically scheduled based on your or your tenant's availability. No phone tag.",
  },
  {
    icon: Eye,
    title: "Remote maintenance management",
    description:
      "Photo documentation and budget caps are required upfront, so you can manage repairs across a wide portfolio without being on-site for every estimate. See the tree damage or the roof leak before the contractor does. Set the maximum spend you're authorized by the property owner before the project is even claimed.",
  },
  {
    icon: Layers,
    title: "Scalability for large portfolios",
    description:
      "Whether you manage 10 doors or 500, the process is identical. One consolidated vendor pool replaces your Rolodex of subcontractors across Tree, Concrete, and Roofing categories — with HVAC, Fencing, and more coming soon. Every job follows the same documentation and quoting process.",
  },
]

const howItWorks = [
  {
    icon: Building2,
    step: "01",
    title: "Submit your request",
    description:
      "Upload photos of the issue, write a brief description, and set your authorized budget cap. One submission covers the full scope — no follow-up calls required.",
  },
  {
    icon: ShieldCheck,
    step: "02",
    title: "A verified contractor claims the job",
    description:
      "Your request enters the feed of pre-vetted, licensed, and insured contractors in the right category. The first to claim it locks the job exclusively. No competing contractors contacting your tenant.",
  },
  {
    icon: Clock,
    step: "03",
    title: "Consultation is auto-scheduled",
    description:
      "Once claimed, the platform schedules the on-site consultation against your availability or your tenant's — within 24 hours of submission in most cases. No coordination overhead on your end.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Review, approve, and close",
    description:
      "Receive a standardized quote with documentation for owner approval. Every job follows the same process, making it easy to present options, track history, and report across your portfolio.",
  },
]

export default function PropertyManagersPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-primary text-sm font-medium tracking-wide mb-4">For property managers</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
                Maintenance without
                <br />
                <span className="text-primary">the overhead.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
                Nexus Operations gives property managers a centralized, high-efficiency solution for
                maintenance requests — pre-vetted contractors, photo documentation, budget controls, and
                automatic scheduling. Manage your entire portfolio without vetting vendors or chasing
                estimates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                >
                  Request Corporate Onboarding
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/#how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/40 rounded-xl hover:border-border/70 hover:bg-secondary/50 transition-all duration-200"
                >
                  See How It Works
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                Built for portfolio-scale operations
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Property managers face unique pressures: liability exposure, soft-cost accumulation from
                chasing estimates, and tenant satisfaction tied directly to maintenance speed. Nexus
                Operations addresses all three with a single, standardized workflow.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="p-6 rounded-2xl bg-card border border-border/40 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-4">
                    <b.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                One workflow for every property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Whether you manage 10 doors or 500, every maintenance request follows the same
                documented, auditable process — making it easy to report to property owners and keep
                tenants informed.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((s) => (
                <div key={s.step} className="p-6 rounded-2xl bg-card border border-border/40">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <s.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-mono font-medium text-muted-foreground">{s.step}</span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1.5">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Soft Cost Comparison */}
        <section className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3 text-center">
                The soft costs add up fast
              </h2>
              <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
                Time spent coordinating estimates is a hidden drag on your management fees. Compare
                the traditional approach to a centralized workflow.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                <div className="p-7 rounded-2xl bg-card border border-border/40">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
                    Traditional vendor management
                  </p>
                  <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                      5 calls to get 3 quotes per property issue
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                      No-show estimates waste your time and your tenant&apos;s
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                      Manual license and insurance verification for each contractor
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                      Inconsistent documentation across jobs and properties
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                      Tenant frustration from slow response times
                    </li>
                  </ul>
                </div>
                <div className="p-7 rounded-2xl bg-primary/5 border border-primary/20">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">
                    Nexus Operations
                  </p>
                  <ul className="flex flex-col gap-3 text-sm text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary shrink-0 mt-0.5">✓</span>
                      One submission — photos, scope, and budget cap upfront
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary shrink-0 mt-0.5">✓</span>
                      Contractor assigned and consultation scheduled within 24 hours
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary shrink-0 mt-0.5">✓</span>
                      Pre-vetted contractors — licensing and insurance already confirmed
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary shrink-0 mt-0.5">✓</span>
                      Standardized documentation on every job for owner reporting
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary shrink-0 mt-0.5">✓</span>
                      Tenants interact with verified professionals — no &quot;stranger danger&quot;
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-5 rounded-xl border border-border/40 bg-card/50 text-center">
                <p className="text-sm text-muted-foreground">
                  Maintenance delays are the{" "}
                  <span className="font-semibold text-foreground">#1 cause of tenant turnover.</span>{" "}
                  A 24-hour matching target keeps tenants satisfied and renewals on track.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Scale */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-primary text-sm font-medium tracking-wide mb-3">Portfolio management</p>
                <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                  The same process whether you manage 10 doors or 500
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Nexus Operations replaces a fragmented vendor Rolodex with a single point of entry
                  for your maintenance needs. Every contractor is pre-verified. Every job is documented
                  the same way. Every quote is structured for owner approval.
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    "Consolidated vendor pool across Tree, Concrete, and Roofing — with more categories launching",
                    "Budget caps set before a contractor ever sees the request",
                    "Photo documentation visible to you before any on-site visit",
                    "Performance metrics tracked across all contractors on all jobs",
                    "Standardized quotes for straightforward owner presentation",
                    "Specialized corporate account onboarding for larger portfolios",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 rounded-2xl bg-card border border-border/40">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold">Available service categories</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Tree Removal", status: "Live" },
                    { name: "Concrete Work", status: "Live" },
                    { name: "Roofing", status: "Live" },
                    { name: "HVAC", status: "Coming Q3" },
                    { name: "Fencing", status: "Coming Q3" },
                    { name: "Electrical", status: "Coming Q4" },
                    { name: "Plumbing", status: "Coming Q4" },
                    { name: "Excavation", status: "Coming 2026" },
                  ].map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30"
                    >
                      <span className="text-sm font-medium">{cat.name}</span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          cat.status === "Live"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {cat.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tenant Satisfaction */}
        <section className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mx-auto mb-6">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                Tenant satisfaction is a retention metric
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
                Maintenance delays are the number one driver of tenant turnover. When tenants call
                with a problem, Nexus Operations puts a verified, professional contractor on the job
                within 24 hours — not a week of scheduling calls and no-shows.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 text-left">
                {[
                  {
                    stat: "24-hour",
                    label: "Contractor matching target",
                    description: "From submission to contractor assigned and consultation scheduled.",
                  },
                  {
                    stat: "100%",
                    label: "Verified professionals",
                    description: "Every contractor is licensed, insured, and background-reviewed before interacting with your tenants.",
                  },
                  {
                    stat: "Zero",
                    label: "Unvetted contacts",
                    description: "No handymen, no unlicensed operators, no strangers your tenants have reason to distrust.",
                  },
                ].map((item) => (
                  <div
                    key={item.stat}
                    className="p-6 rounded-2xl bg-card border border-border/40"
                  >
                    <p className="text-2xl font-semibold text-primary mb-1">{item.stat}</p>
                    <p className="text-sm font-semibold mb-2">{item.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="corporate" className="py-24 lg:py-32">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
              Interested in a Corporate Account?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
              If you manage a portfolio in the Topeka area and want to streamline your maintenance
              workflow, contact us for specialized property management onboarding. We&apos;ll walk
              through your portfolio size, service needs, and how Nexus integrates with your
              current process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                Contact Us for Onboarding
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/40 rounded-xl hover:border-border/70 hover:bg-secondary/50 transition-all duration-200"
              >
                View Service Categories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
