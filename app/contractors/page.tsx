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
} from "lucide-react"

export const metadata: Metadata = {
  title: "For Contractors | Join the Nexus Operations Network",
  description:
    "Get exclusive, pre-qualified leads delivered to your portal. Licensed and insured contractors only. Monthly subscription, no per-lead fees. First-come, first-served.",
}

const benefits = [
  {
    icon: ShieldCheck,
    title: "Exclusive leads, not shared",
    description:
      "When you claim a request, it disappears from every other contractor's feed. You are the only one contacting this homeowner. No competing quotes, no race to the bottom.",
  },
  {
    icon: Clock,
    title: "Pre-qualified with full documentation",
    description:
      "Every request includes 2-10 photos, detailed specifications, a budget cap, and pre-selected consultation windows. You know exactly what the project is before claiming.",
  },
  {
    icon: DollarSign,
    title: "Predictable monthly cost",
    description:
      "Flat monthly subscription from $200 to $400 depending on your service category. No per-lead fees, no surprise charges, no annual contracts. Cancel anytime.",
  },
  {
    icon: BarChart3,
    title: "Performance dashboard",
    description:
      "Track your response time, claim-to-consultation rate, quote conversion rate, and customer ratings. Premium and Elite tiers get advanced analytics and benchmarking.",
  },
]

const verificationSteps = [
  {
    icon: FileText,
    step: "01",
    title: "Apply online",
    description: "Complete application with business info, service categories, and coverage area.",
  },
  {
    icon: BadgeCheck,
    step: "02",
    title: "Upload documents",
    description:
      "Business license, trade licenses, liability insurance ($500K minimum), and workers comp if applicable.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Verification review",
    description:
      "We verify licenses against state databases, confirm insurance with providers, and run background screening.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Start claiming leads",
    description:
      "Once approved, set up your portal, configure notifications, and start claiming requests immediately.",
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
              <p className="text-primary text-sm font-medium tracking-wide mb-4">For contractors</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
                Exclusive leads.
                <br />
                <span className="text-primary">Zero competition.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
                Stop paying for shared leads that 5 other contractors are also calling. Nexus Operations
                delivers pre-qualified, exclusive requests directly to your portal. First-come, first-served.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Apply to Join
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  View Pricing Tiers
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
                Why contractors choose Nexus
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Better economics than shared lead platforms, higher conversion rates, and zero wasted estimate visits.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="p-6 rounded-xl bg-card border border-border/40 hover:border-primary/30 transition-colors"
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
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-8 text-center">
                The math works in your favor
              </h2>
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                <div className="p-6 rounded-xl bg-card border border-border/40">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">Traditional platforms</p>
                  <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                    <li>$15-$80 per shared lead</li>
                    <li>3-7 contractors calling same homeowner</li>
                    <li>Below 15% conversion rate</li>
                    <li>30-40% no-show rate on estimates</li>
                    <li>5-10 hours/week on unqualified leads</li>
                  </ul>
                </div>
                <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">Nexus Operations</p>
                  <ul className="flex flex-col gap-3 text-sm text-foreground">
                    <li>$200-$400/month flat subscription</li>
                    <li>You are the only contractor</li>
                    <li>Pre-qualified with photos and budget</li>
                    <li>Consultation pre-scheduled by homeowner</li>
                    <li>Claim unlimited leads per month</li>
                  </ul>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                One closed project per month covers your subscription cost many times over.
              </p>
            </div>
          </div>
        </section>

        {/* Verification Process */}
        <section id="verification" className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                Verification process
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We verify every contractor to protect homeowners and maintain platform quality. The process
                takes 3-5 business days.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {verificationSteps.map((s) => (
                <div key={s.step} className="p-6 rounded-xl bg-card border border-border/40">
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

        {/* FAQ */}
        <section id="faq" className="py-24 lg:py-32">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-12">
              Frequently asked questions
            </h2>
            <div className="flex flex-col gap-8">
              {[
                {
                  q: "What service categories are available?",
                  a: "We are launching with tree removal, concrete work, and roofing in Topeka, KS. HVAC, fencing, and electrical are coming in months 7-12. We expand categories based on demand.",
                },
                {
                  q: "What are the requirements to join?",
                  a: "Valid business license, applicable trade licenses, general liability insurance ($500K occurrence, $1M aggregate), workers comp if you have employees, and 3 business or customer references.",
                },
                {
                  q: "How does first-come, first-served work?",
                  a: "When a homeowner submits a request, all qualified contractors in the matching category and area are notified simultaneously. The first contractor to click 'Claim' locks the request exclusively. Premium and Elite tiers get advance notification windows.",
                },
                {
                  q: "Can I set a minimum budget threshold?",
                  a: "Yes. In your portal settings, you can set a minimum budget cap so you only see requests above your threshold. This keeps your feed focused on jobs worth your time.",
                },
                {
                  q: "What if I need to cancel?",
                  a: "No annual contracts. Cancel anytime. Your account stays active through the end of your current billing period.",
                },
              ].map((faq) => (
                <div key={faq.q} className="border-b border-border/40 pb-6">
                  <h3 className="text-base font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Apply to Join
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
