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
    "Manage maintenance across your entire portfolio. One workflow. Pre-vetted contractors. No vendor coordination.",
}

const benefits = [
  {
    icon: ShieldCheck,
    title: "Pre-vetted contractors",
    description:
      "All contractors are verified for licensing, insurance, and performance. Liability is managed before anyone touches a property.",
  },
  {
    icon: Clock,
    title: "Less time coordinating estimates",
    description:
      "Submit once. One contractor claims it. Consultation scheduled automatically. No phone tag.",
  },
  {
    icon: Eye,
    title: "Remote management",
    description:
      "Manage repairs across multiple properties without being on-site. You see photos and set budgets upfront.",
  },
  {
    icon: Layers,
    title: "Same process at scale",
    description:
      "Whether you manage 10 doors or 500, every job follows the same documented process.",
  },
]

const howItWorks = [
  {
    icon: Building2,
    step: "01",
    title: "Submit",
    description: "Upload photos, describe the issue, set your budget cap.",
  },
  {
    icon: ShieldCheck,
    step: "02",
    title: "Contractor claims it",
    description: "One verified contractor locks the job. Exclusively.",
  },
  {
    icon: Clock,
    step: "03",
    title: "Auto-scheduled",
    description: "Consultation scheduled within 24 hours. No coordination needed.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Review & approve",
    description: "Standardized quote. Easy to report. Done.",
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
                Submit once.
                <br />
                <span className="text-primary">One verified contractor. 24 hours.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
                One submission per job — with photos, scope, and a budget cap. A single pre-vetted contractor claims it and a consultation is scheduled within 24 hours. No vendor sourcing, no quote chasing, no callbacks.
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
                Built for property managers
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Manage liability. Save time on estimates. Keep tenants satisfied. One workflow for all three.
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
                Same process at any scale
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                10 properties or 500. Same documented process. Easy to report.
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
                  One entry point for all maintenance. Every contractor verified. Every job documented the same way. Easy owner approval.
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
                Maintenance delays drive tenant turnover. Get a verified contractor on the job within 24 hours.
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
              Corporate accounts for portfolios managing 10 or more properties
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
              Consolidated billing, a single dashboard across all properties, volume pricing, and a dedicated account contact. Contact us to discuss your portfolio size and active service categories.
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
