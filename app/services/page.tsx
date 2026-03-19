import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  Home,
  Briefcase,
  Wrench,
  Flame,
  Zap,
  Droplets,
  TreePine,
  HardHat,
  Fence,
  PaintBucket,
  Target,
  Users,
  BarChart3,
  FileText,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Nexus Operations provides maintenance coordination for commercial and residential properties, plus B2B operational services including lead generation, vendor management, and consulting. Serving Topeka and Shawnee County, Kansas.",
}

const maintenanceTrades = [
  { icon: Droplets, name: "Plumbing" },
  { icon: Zap, name: "Electrical" },
  { icon: Flame, name: "HVAC" },
  { icon: HardHat, name: "Concrete" },
  { icon: TreePine, name: "Tree Services" },
  { icon: Home, name: "Roofing" },
  { icon: Fence, name: "Fencing" },
  { icon: PaintBucket, name: "Painting" },
  { icon: Wrench, name: "General Repair" },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
                Our services
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground mb-6 text-balance">
                Coordination services for
                <br className="hidden sm:block" />
                <span className="font-serif italic font-normal text-primary">
                  every type of property.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                From multi-family commercial complexes to individual residential
                properties to B2B operational support -- we adapt our
                coordination model to the scale and needs of your operation.
              </p>
            </div>
          </div>
        </section>

        {/* Commercial */}
        <section id="commercial" className="py-16 lg:py-24 bg-secondary/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-card border border-border">
                    <Building2 className="h-5 w-5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                    Commercial
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4">
                  Multi-family and commercial property maintenance.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Our primary service: outsourced maintenance coordination for
                  property management companies managing 100-800+ residential
                  units in Shawnee County. We replace the fragmented vendor
                  relationships consuming your operations team with a single
                  coordination layer backed by guaranteed response times.
                </p>

                <div className="flex flex-col gap-3 mb-8">
                  {[
                    "Emergency response: contractor assigned within 1 hour, on-site within 4",
                    "Urgent response: assigned within 4 hours, on-site next business day",
                    "Routine response: assigned within 24 hours, on-site within 3-5 days",
                    "Automated backup assignment if primary contractor declines",
                    "Monthly unified invoicing with full request detail",
                    "Quality assurance with photo documentation on every job",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 text-sm text-foreground/70"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Discuss your property portfolio
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Pricing model
                </h3>
                <div className="rounded-xl bg-card border border-border p-6 lg:p-8 mb-6">
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Cost-plus markup on completed work. No retainers, no
                    subscriptions. Revenue is aligned directly with service
                    delivery volume.
                  </p>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-sm text-foreground">
                        Routine Maintenance
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        25% markup
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-sm text-foreground">
                        Urgent Repairs
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        30% markup
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-foreground">
                        Emergency Response
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        35% markup
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Markup reflects coordination complexity and urgency-driven
                  operating costs. Contractors receive their full quoted rates
                  -- the markup is applied on top, not deducted from their
                  compensation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Residential */}
        <section id="residential" className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
                    <Home className="h-5 w-5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                    Residential
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4">
                  Individual property owners and small portfolios.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Self-managing 50-200 units without a dedicated property
                  management firm? You face the same coordination challenges as
                  larger operations, often with greater intensity due to limited
                  staff. We provide the coordination infrastructure without the
                  overhead.
                </p>

                <div className="flex flex-col gap-3 mb-8">
                  {[
                    "Same verified contractor network as commercial clients",
                    "Same response time guarantees by urgency category",
                    "No minimum commitment or long-term contracts",
                    "Direct communication on every maintenance request",
                    "Transparent pricing -- contractor cost plus service markup",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 text-sm text-foreground/70"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Get started as a property owner
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Maintenance trades we coordinate
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {maintenanceTrades.map((trade) => (
                    <div
                      key={trade.name}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border text-center"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
                        <trade.icon className="h-5 w-5 text-foreground/60" />
                      </div>
                      <span className="text-xs font-medium text-foreground">
                        {trade.name}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Additional trades available on request. Our network is
                  continuously expanding to cover the full range of maintenance
                  needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* B2B */}
        <section id="b2b" className="py-16 lg:py-24 bg-secondary/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-card border border-border">
                  <Briefcase className="h-5 w-5 text-foreground/70" />
                </div>
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  B2B Services
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4">
                Operational support for businesses in Topeka.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Beyond property maintenance, Nexus Operations provides
                outsourced B2B services for businesses that need expert
                operational support without the overhead of additional full-time
                staff. We act as a strategic partner, not a transactional
                vendor.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Target,
                  title: "Lead Generation",
                  description:
                    "Targeted prospect lists, lead qualification, and appointment setting to connect your business with high-potential clients.",
                },
                {
                  icon: Users,
                  title: "Vendor Management",
                  description:
                    "Oversee vendor relationships, ensure contract compliance, and coordinate multi-vendor operations under one roof.",
                },
                {
                  icon: BarChart3,
                  title: "Consulting",
                  description:
                    "Strategic guidance on operational processes, vendor relations optimization, and growth planning for local businesses.",
                },
                {
                  icon: FileText,
                  title: "Project Support",
                  description:
                    "Execute specific defined projects -- from operational audits to process documentation to marketing initiatives.",
                },
              ].map((service) => (
                <div
                  key={service.title}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary mb-4">
                    <service.icon className="h-5 w-5 text-foreground/60" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Discuss your business needs
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4 text-balance">
                Let's talk about what you need.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Every client engagement starts with a conversation about your
                specific operational challenges. No obligation, no sales pitch
                -- just an honest assessment of whether our coordination model
                fits your needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login?tab=signup"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  Create an account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
