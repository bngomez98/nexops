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
  FileText,
  BadgeCheck,
  BarChart3,
  Users,
  Lock,
} from "lucide-react"

export const metadata: Metadata = {
  title: "For Contractors | Join the Nexus Operations Network",
  description:
    "Stop paying per lead shared with five competitors. Nexus Operations delivers exclusive, fully documented project requests — with photos, written scope, and a confirmed budget. Licensed and insured contractors only. Flat monthly membership starting at $299.",
}

const benefits = [
  {
    icon: Lock,
    title: "True exclusivity — not just priority",
    description:
      "The instant you claim a request, it is removed from every other contractor's feed permanently. You are the only person contacting this homeowner. No competing quotes, no race to the bottom on price.",
  },
  {
    icon: Clock,
    title: "Fully documented before you commit",
    description:
      "Every request comes with 2–10 project photos, a written description, a defined budget cap, and pre-selected consultation windows. You know the full scope before you decide whether to claim.",
  },
  {
    icon: DollarSign,
    title: "Predictable, flat monthly membership",
    description:
      "Starting at $299/month for unlimited project claims. No per-lead fees. No surprise charges. No annual contracts. The median project on our platform is $4,200 — a single closed job covers 14 months of Standard membership.",
  },
  {
    icon: BarChart3,
    title: "Dashboard built for performance",
    description:
      "Track your response time, claim-to-consultation rate, quote acceptance rate, and customer satisfaction scores. Premium and Elite members get advanced analytics, benchmarking, and pipeline reporting.",
  },
]

const verificationSteps = [
  {
    icon: FileText,
    step: "01",
    title: "Apply online",
    description:
      "Complete your application with business information, service categories you are approved to perform, and your target coverage area.",
  },
  {
    icon: BadgeCheck,
    step: "02",
    title: "Submit credentials",
    description:
      "Upload your business license, applicable trade licenses, general liability insurance ($500K per occurrence, $1M aggregate), and workers' compensation if you have employees.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Verification review",
    description:
      "We cross-reference your licenses against state and county databases, confirm your insurance directly with your provider, and complete a business background check. Process typically takes 3–5 business days.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Activate your portal",
    description:
      "Once approved, configure your notification preferences, set your coverage boundaries, and begin claiming projects immediately. No onboarding delay.",
  },
]

export default function ContractorsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-primary text-sm font-medium tracking-wide mb-4">For licensed contractors</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
                Projects that belong
                <br />
                <span className="text-primary">to you alone.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
                Nexus Operations provides licensed, insured contractors in Topeka and the surrounding region
                with access to pre-qualified, exclusive project requests. No shared leads. No competing bids.
                No cold calling into a crowded market. First-come, first-served — and every request you claim
                is permanently, exclusively yours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                >
                  Apply to Join
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/40 rounded-xl hover:border-border/70 hover:bg-secondary/50 transition-all duration-200"
                >
                  View Membership Plans
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                Built around contractor economics
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Shared-lead platforms are optimized to sell your contact information as many times as possible —
                maximizing their revenue at the cost of your close rate. Nexus Operations is structured around
                the opposite model: your membership funds a pipeline that works exclusively for you, with every
                request you claim guaranteed off-limits to every other contractor on the platform.
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
                The economics are straightforward
              </h2>
              <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
                Compare what you spend now versus what a flat-rate exclusive pipeline actually costs.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                <div className="p-7 rounded-2xl bg-card border border-border/40">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
                    Shared-lead platforms
                  </p>
                  <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="text-red-400 shrink-0 mt-0.5">✕</span>$15–$80 per lead — shared with 3 to 7 others</li>
                    <li className="flex items-start gap-2"><span className="text-red-400 shrink-0 mt-0.5">✕</span>Sub-15% conversion — you are competing on every job</li>
                    <li className="flex items-start gap-2"><span className="text-red-400 shrink-0 mt-0.5">✕</span>30–40% no-show rate on site visits</li>
                    <li className="flex items-start gap-2"><span className="text-red-400 shrink-0 mt-0.5">✕</span>5–10 hours per week chasing unqualified contacts</li>
                    <li className="flex items-start gap-2"><span className="text-red-400 shrink-0 mt-0.5">✕</span>No project documentation before you commit to visiting</li>
                  </ul>
                </div>
                <div className="p-7 rounded-2xl bg-primary/5 border border-primary/20">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">
                    Nexus Operations
                  </p>
                  <ul className="flex flex-col gap-3 text-sm text-foreground">
                    <li className="flex items-start gap-2"><span className="text-primary shrink-0 mt-0.5">✓</span>$299/month flat — claim unlimited projects</li>
                    <li className="flex items-start gap-2"><span className="text-primary shrink-0 mt-0.5">✓</span>You are the only contractor on every claimed job</li>
                    <li className="flex items-start gap-2"><span className="text-primary shrink-0 mt-0.5">✓</span>Photos and budget defined before you commit</li>
                    <li className="flex items-start gap-2"><span className="text-primary shrink-0 mt-0.5">✓</span>Consultation pre-confirmed by homeowner — no callbacks</li>
                    <li className="flex items-start gap-2"><span className="text-primary shrink-0 mt-0.5">✓</span>Median project value is $4,200 — 14 months of Standard membership from a single closed job</li>
                  </ul>
                </div>
              </div>
              <div className="p-5 rounded-xl border border-border/40 bg-card/50 text-center">
                <p className="text-sm text-muted-foreground">
                  Median residential project value on our platform: <span className="font-semibold text-foreground">$4,200</span>.
                  That&apos;s 14 months of Standard membership from a single closed job.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Verification Process */}
        <section id="verification" className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                Verification keeps everyone protected
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every contractor in the Nexus Operations network is manually reviewed and credentialed before
                gaining access to project requests. This protects homeowners and ensures that when you win a
                job, you are competing against verified professionals — not unlicensed or uninsured operators.
                Verification typically takes 3–5 business days.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {verificationSteps.map((s) => (
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

        {/* Who This Is For */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-primary text-sm font-medium tracking-wide mb-3">Who qualifies</p>
                <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                  We accept established, insured trade professionals
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Nexus Operations is not a general handyman directory. Our homeowners expect licensed,
                  insured trade professionals, and our network is built and maintained to that standard.
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
                    { name: "Tree Removal", status: "Live" },
                    { name: "Concrete Work", status: "Live" },
                    { name: "Roofing", status: "Live" },
                    { name: "HVAC", status: "Coming Q3" },
                    { name: "Fencing", status: "Coming Q3" },
                    { name: "Electrical", status: "Coming Q4" },
                    { name: "Plumbing", status: "Coming Q4" },
                    { name: "Excavation", status: "Coming 2026" },
                  ].map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
                      <span className="text-sm font-medium">{cat.name}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        cat.status === "Live"
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
                  a: "Tree removal, concrete work, and roofing are live in Topeka, KS. HVAC and fencing are launching in Q3 of this year; electrical and plumbing follow in Q4. We expand categories based on verified contractor and homeowner demand.",
                },
                {
                  q: "What are the minimum requirements to apply?",
                  a: "A valid business license, applicable trade licenses for your category, general liability insurance ($500K per occurrence, $1M aggregate), workers' compensation if you have employees, and three verifiable business or customer references.",
                },
                {
                  q: "How does the first-come, first-served system work?",
                  a: "When a homeowner submits a request, every qualified contractor in that category and geographic area is notified simultaneously. The first to click 'Claim' locks the project exclusively and it is immediately removed from all other feeds. Standard members compete in the open pool. Premium members receive a 90-second advance window. Elite members receive a 10-minute exclusive window on premium-value requests ($5K+).",
                },
                {
                  q: "Can I set a minimum project size?",
                  a: "Yes. In your portal settings you can define a budget floor so only requests above your threshold appear in your feed. This keeps your attention on jobs that fit your business model.",
                },
                {
                  q: "What happens if I claim a project and the homeowner doesn't respond?",
                  a: "If a homeowner becomes unresponsive after you claim their request, contact our support team. We review these cases and issue project credits for confirmed no-shows, not just excuses.",
                },
                {
                  q: "Can I cover multiple service categories?",
                  a: "Yes, provided you hold the appropriate licenses and insurance for each category. Your membership covers all approved categories under a single subscription.",
                },
                {
                  q: "What does cancellation look like?",
                  a: "No annual contracts. Cancel anytime from your dashboard. Your account stays active through the end of the current billing period. No cancellation fees, no hard conversations.",
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
                Compare Membership Plans
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
