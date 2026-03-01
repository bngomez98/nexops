import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Clock3, DollarSign, BadgeCheck, BarChart3 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "For Contractors",
  description:
    "Join NexOps to receive exclusive project opportunities with verified scope, budget details, and clear response expectations.",
    "Nexus Operations gives licensed, insured contractors in Topeka and the surrounding region free access to exclusive, fully documented project requests — with photos, written scope, and a confirmed budget. No membership fees.",
}

const benefits = [
  {
    icon: ShieldCheck,
    title: "Exclusive ownership",
    text: "Once claimed, a project is removed from all other feeds so your team can focus on execution instead of bidding races.",
  },
  {
    icon: Clock3,
    title: "Upfront project context",
    text: "Every request includes scope, photos, and budget range before you commit, reducing wasted callbacks and re-qualification.",
  },
  {
    icon: DollarSign,
    title: "Predictable costs",
    text: "Flat monthly membership with no per-lead fees, no hidden surcharges, and clear tier benefits.",
    title: "Free to join. No membership fees.",
    description:
      "Joining and using the Nexus platform is free for verified contractors. No per-lead fees, no subscription charges, no surprise costs. Your cost is your time — and every project you claim is exclusively yours.",
  },
  {
    icon: BarChart3,
    title: "Dashboard built for performance",
    description:
      "Track your response time, claim-to-consultation rate, quote acceptance rate, and customer satisfaction scores. Premium and Elite members get advanced analytics, benchmarking, and pipeline reporting.",
  },
]

const workflow = [
  "Complete onboarding with license and insurance verification.",
  "Set your service categories and operating area.",
  "Receive real-time requests that match your profile.",
  "Claim, schedule, and track conversion in one dashboard.",
]

export default function ContractorsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div className="max-w-3xl">
              <p className="text-primary text-sm font-medium tracking-wide mb-4">For licensed contractors</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
                Exclusive project flow built for speed.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Claim opportunities that match your verified categories, review complete project details up front,
                and move from intake to consultation without marketplace noise.
                Projects that belong to you.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
                Nexus Operations delivers exclusive, pre-documented project requests to licensed, insured
                contractors. Every request includes photos, a written scope, and a defined budget. When you
                claim a project, it is permanently yours — removed from every other contractor's feed
                the moment you commit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90"
                >
                  Apply to join <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium border border-border/40 rounded-xl hover:bg-secondary/50"
                >
                  View plans <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <aside className="rounded-2xl border border-border/40 bg-card p-6 lg:p-7">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Onboarding workflow</p>
              <ul className="space-y-3">
                {workflow.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground/85 leading-relaxed">
                    <BadgeCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
        {/* Benefits */}
        <section className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                Designed around how contractors do business
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your membership funds a pipeline that works exclusively for you. Every request you claim is
                permanently yours — no competing bids, no per-lead charges. The platform is built so that
                when you commit to a project, you already know the scope, the budget, and when the homeowner
                is available.
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

        {/* The Math */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3 text-center">
                How membership pays for itself
              </h2>
              <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
                A flat monthly membership with unlimited claims — and every project you claim is fully documented and exclusively yours.
              </p>
              <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20 mb-6">
                <ul className="flex flex-col gap-4 text-sm text-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary shrink-0 mt-0.5">✓</span>
                    <span><span className="font-semibold">$299/month flat</span> — claim unlimited projects with no per-project fees or hidden charges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary shrink-0 mt-0.5">✓</span>
                    <span>You are <span className="font-semibold">the only contractor</span> on every job you claim — permanently exclusive, removed from all other feeds instantly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary shrink-0 mt-0.5">✓</span>
                    <span><span className="font-semibold">Full project documentation</span> before you commit — photos, written scope, and a defined budget cap</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary shrink-0 mt-0.5">✓</span>
                    <span><span className="font-semibold">Pre-scheduled consultations</span> — homeowners select their preferred windows at submission, so you can plan your day</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary shrink-0 mt-0.5">✓</span>
                    <span>Median project value of <span className="font-semibold">$4,200</span> — a single closed job covers 14 months of Standard membership</span>
                  </li>
                </ul>
              </div>
              <div className="p-5 rounded-xl border border-border/40 bg-card/50 text-center">
                <p className="text-sm text-muted-foreground">
                  Median residential project value on our platform: <span className="font-semibold text-foreground">$4,200</span>.
                  That's 14 months of Standard membership from a single closed job.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-card/30 border-y border-border/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">Why teams switch to NexOps</h2>
              <p className="text-muted-foreground leading-relaxed">
                Consistent intake standards and single-ownership routing remove common friction from sales-to-service handoff.
                Every contractor in the Nexus Operations network is manually reviewed and credentialed before
                gaining access to project requests. This protects homeowners and ensures that every professional
                in the network meets a consistent standard of licensing and insurance coverage.
                Verification typically takes 3–5 business days.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((b) => (
                <article key={b.title} className="rounded-2xl border border-border/40 bg-card p-6">
                  <b.icon className="h-5 w-5 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 lg:p-8 flex items-start gap-4">
              <BarChart3 className="h-5 w-5 text-primary mt-1" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Built-in performance visibility</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track response time, conversion, and category-level win trends from your dashboard to improve staffing
                  and scheduling decisions over time.
                </p>
                <p className="text-primary text-sm font-medium tracking-wide mb-3">Who qualifies</p>
                <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                  We accept established, insured trade professionals
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Nexus Operations serves licensed, insured trade professionals. Our homeowners expect
                  credentialed contractors, and our network is built and maintained to that standard.
                  Applications from unlicensed or uninsured operators are declined without exception.
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    "Valid state or county business license",
                    "Applicable trade licenses for your category",
                    "General liability insurance — $500K per occurrence minimum",
                    "Workers' compensation (if you employ field staff)",
                    "Three verifiable business or customer references",
                    "Currently operating within our service area",
                  ].map((req) => (
                    <li key={req} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 rounded-2xl bg-card border border-border/40">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold">Service categories we cover</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Tree Removal", status: "Available" },
                    { name: "Concrete Work", status: "Available" },
                    { name: "Roofing", status: "Available" },
                    { name: "HVAC", status: "Available" },
                    { name: "Fencing", status: "Available" },
                    { name: "Electrical", status: "Expanding" },
                    { name: "Plumbing", status: "Expanding" },
                    { name: "Excavation", status: "Expanding" },
                  ].map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
                      <span className="text-sm font-medium">{cat.name}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        cat.status === "Available"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}>{cat.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-12">
              Common questions from contractors
            </h2>
            <div className="flex flex-col gap-8">
              {[
                {
                  q: "Which service categories are available right now?",
                  a: "Tree removal, concrete work, roofing, HVAC, and fencing are available in Topeka, KS. Electrical, plumbing, and excavation are expanding — we add categories based on verified contractor and homeowner demand.",
                },
                {
                  q: "What are the minimum requirements to apply?",
                  a: "A valid business license, applicable trade licenses for your category, general liability insurance ($500K per occurrence, $1M aggregate), workers' compensation if you have employees, and three verifiable business or customer references.",
                },
                {
                  q: "How does the first-come, first-served claiming work?",
                  a: "When a homeowner submits a request, every qualified contractor in that category and geographic area is notified simultaneously. The first to click 'Claim' locks the project exclusively and it is immediately removed from all other feeds. Standard members compete in the open pool. Premium members receive a 90-second advance window. Elite members receive a 10-minute exclusive window on premium-value requests ($5K+).",
                },
                {
                  q: "Can I set a minimum project size?",
                  a: "Yes. In your portal settings you can define a budget floor so only requests above your threshold appear in your feed. This keeps your attention on jobs that fit your business model.",
                },
                {
                  q: "What happens if I claim a project and the homeowner doesn't respond?",
                  a: "If a homeowner becomes unresponsive after you claim their request, contact our support team. We review these cases and issue project credits for confirmed no-shows.",
                },
                {
                  q: "Can I cover multiple service categories?",
                  a: "Yes, provided you hold the appropriate licenses and insurance for each category. Your membership covers all approved categories under a single subscription.",
                },
                {
                  q: "What does cancellation look like?",
                  a: "No annual contracts. Cancel anytime from your dashboard. Your account stays active through the end of the current billing period. No cancellation fees.",
                },
              ].map((faq) => (
                <div key={faq.q} className="border-b border-border/40 pb-6">
                  <h3 className="text-base font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                Apply to Join
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/40 rounded-xl hover:border-border/70 hover:bg-secondary/50 transition-all duration-200"
              >
                View Membership Plans
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
