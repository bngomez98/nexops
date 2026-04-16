import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "@/components/link"
import { ArrowRight, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog | Property Management & Maintenance Insights | Nexus Operations",
  description:
    "Practical guides for Topeka property managers: contractor vetting, maintenance management, emergency response, and reducing repair costs. Written by the Nexus Operations team.",
  keywords: [
    "property management Topeka KS",
    "property maintenance Topeka",
    "contractor vetting Kansas",
    "property manager tips Topeka",
    "managed maintenance",
    "rental property repairs Topeka",
    "emergency maintenance property management",
    "property management company Topeka Kansas",
  ],
  alternates: {
    canonical: "https://nexusoperations.org/blog",
  },
  openGraph: {
    title: "Blog | Nexus Operations",
    description: "Practical guides for Topeka property managers on maintenance management, contractor vetting, and emergency response.",
    url: "https://nexusoperations.org/blog",
    type: "website",
  },
}

const posts = [
  {
    slug: "property-manager-maintenance-coordination-topeka",
    title: "Why Property Managers in Topeka Spend 10+ Hours a Week on Maintenance Management (and How to Stop)",
    excerpt:
      "The average property manager overseeing 150–200 units in Topeka spends between 10 and 15 hours a week on maintenance management: fielding calls, sourcing contractors, chasing confirmations, and reconciling invoices. Here is where that time actually goes — and what a structured operations model looks like instead.",
    category: "Operations",
    readTime: "6 min read",
    date: "March 2026",
    featured: true,
  },
  {
    slug: "how-to-vet-contractors-topeka-kansas",
    title: "How to Properly Vet a Contractor in Kansas: License Verification, Insurance Checks, and What Most Property Managers Skip",
    excerpt:
      "Calling a contractor 'verified' because they showed you a license isn't enough. This guide covers the specific steps to confirm a Kansas contractor's license is current and active, how to verify insurance directly with the provider, and why the certificate of insurance you're handed isn't always accurate.",
    category: "Contractor Management",
    readTime: "8 min read",
    date: "March 2026",
    featured: true,
  },
  {
    slug: "emergency-maintenance-response-property-management",
    title: "Emergency Maintenance at 11 PM: What a Well-Managed Response Actually Looks Like",
    excerpt:
      "A burst pipe on a Saturday night is a test of your operations system. Most property managers have a mental rolodex of contractors they hope will pick up. This post walks through what a documented emergency response process looks like — from the moment the tenant calls to the invoice landing in your inbox.",
    category: "Emergency Response",
    readTime: "5 min read",
    date: "February 2026",
    featured: false,
  },
  {
    slug: "property-maintenance-costs-topeka-what-to-expect",
    title: "What Property Maintenance Actually Costs in Topeka: Benchmarks for Common Repairs Across Trade Categories",
    excerpt:
      "Plumbing, electrical, HVAC, roofing — knowing whether a contractor's quote is reasonable requires benchmarks. This post compiles expected cost ranges for common maintenance jobs in the Topeka, Kansas market, along with notes on what typically drives costs higher.",
    category: "Cost Guidance",
    readTime: "7 min read",
    date: "February 2026",
    featured: false,
  },
  {
    slug: "unified-invoicing-property-management",
    title: "The Case for Unified Invoicing: Why Dozens of Contractor Bills Are Costing Your Team More Than the Invoices Say",
    excerpt:
      "When a 200-unit property management company processes 40 maintenance jobs a month, that's potentially 40 separate contractor invoices — each with different formats, payment terms, and follow-up requirements. The administrative overhead is real. Here is what unified invoicing solves.",
    category: "Billing",
    readTime: "5 min read",
    date: "January 2026",
    featured: false,
  },
  {
    slug: "sla-property-maintenance-what-is-it",
    title: "What Is an SLA in Property Maintenance — and Why You Should Be Holding Your Vendors to One",
    excerpt:
      "A service level agreement is a written commitment that a service will be delivered within specific time windows. In property maintenance, that means: how long until a contractor is assigned, and how long until they're on-site. Without an SLA, you have a vendor relationship built on goodwill. With one, you have a contractual benchmark.",
    category: "Operations",
    readTime: "4 min read",
    date: "January 2026",
    featured: false,
  },
]

export default function BlogPage() {
  const featured = posts.filter((p) => p.featured)
  const rest = posts.filter((p) => !p.featured)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
                Nexus Operations Blog
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground mb-6 text-balance">
                Property management and maintenance operations.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Practical guides for property managers and owners in Topeka, Kansas.
                Written by the Nexus Operations team.
              </p>
            </div>
          </div>
        </section>

        {/* Featured posts */}
        <section className="pb-12 lg:pb-16">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-6">
              {featured.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-border bg-card p-7 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[13px] text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-muted-foreground">{post.date}</span>
                    <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-primary">
                      Read more
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* All posts */}
        <section className="py-12 lg:py-16 bg-secondary/40">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-8">
              All posts
            </h2>
            <div className="flex flex-col divide-y divide-border">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group py-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 hover:bg-secondary/30 -mx-4 px-4 rounded-xl transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span className="text-muted-foreground/50">·</span>
                      <span className="text-[11px] text-muted-foreground">{post.date}</span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[12.5px] text-muted-foreground leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground shrink-0 sm:mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
