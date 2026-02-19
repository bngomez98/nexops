import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Check, HelpCircle, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing | Pay Per Lead — Nexus Operations",
  description:
    "No monthly subscription. Buy lead credits and pay only for the jobs you claim. Small jobs cost 1 credit, mid-size 2 credits, large projects 3 credits. Exclusive leads for licensed, insured contractors.",
}

const creditCosts = [
  {
    size: "Small",
    range: "Under $1,000",
    credits: 1,
    examples: "Stump grinding, minor repairs, small installations",
  },
  {
    size: "Mid-size",
    range: "$1,000 – $5,000",
    credits: 2,
    examples: "Driveway work, tree removal, fencing, roofing sections",
  },
  {
    size: "Large",
    range: "$5,000+",
    credits: 3,
    examples: "Full roof replacements, large concrete pours, major landscaping",
  },
]

const bundles = [
  {
    name: "Starter",
    credits: 5,
    price: "$75",
    perCredit: "$15 / credit",
    description: "Try the platform. Good for contractors evaluating the pipeline before committing volume.",
    features: [
      "5 lead credits",
      "Use across any job size",
      "Credits never expire",
      "Full project details before claiming",
      "Real-time notifications",
    ],
    cta: "Buy Starter Pack",
    highlighted: false,
    badge: null,
  },
  {
    name: "Pro",
    credits: 20,
    price: "$240",
    perCredit: "$12 / credit",
    description: "The right volume for an active contractor closing 5–10 jobs a month. Best price-to-volume balance.",
    features: [
      "20 lead credits",
      "Use across any job size",
      "Credits never expire",
      "Full project details before claiming",
      "Real-time notifications",
      "Priority support",
    ],
    cta: "Buy Pro Pack",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Scale",
    credits: 50,
    price: "$500",
    perCredit: "$10 / credit",
    description: "Maximum volume for high-output teams. Lowest cost per lead on the platform.",
    features: [
      "50 lead credits",
      "Use across any job size",
      "Credits never expire",
      "Full project details before claiming",
      "Real-time notifications",
      "Priority support",
      "Dedicated account manager",
    ],
    cta: "Buy Scale Pack",
    highlighted: false,
    badge: "Best Value",
  },
]

const faqs = [
  {
    q: "Why credits instead of a monthly subscription?",
    a: "Subscriptions force you to pay whether leads are flowing or not. Credits let you spend exactly what your pipeline demands — buy more when you're growing, hold off during slow seasons. You're never locked in.",
  },
  {
    q: "How many credits does a lead cost?",
    a: "Small jobs (under $1,000) cost 1 credit. Mid-size jobs ($1,000–$5,000) cost 2 credits. Large projects ($5,000+) cost 3 credits. You see the credit cost on every lead before you claim it.",
  },
  {
    q: "Do credits expire?",
    a: "No. Credits you purchase remain in your account indefinitely. There are no monthly use-it-or-lose-it windows.",
  },
  {
    q: "What is the ROI like at these credit prices?",
    a: "The median residential project on our platform is $4,200. At 2 credits ($24 at Pro pricing), that's a $24 acquisition cost on a $4,200 job — roughly 0.6% of project value. Traditional shared-lead platforms charge $15–$80 per lead with a sub-15% close rate, making your effective cost per closed job $100–$500+.",
  },
  {
    q: "What happens if I claim a lead and the homeowner goes dark?",
    a: "Contact our support team. We review no-show and non-responsive cases and issue credit refunds for confirmed homeowner-side failures. We do not simply penalize contractors for circumstances outside their control.",
  },
  {
    q: "Are there any other fees?",
    a: "No platform commission, no monthly access fee, no category fees. You pay for credits and nothing else. The homeowner side is free — our platform is funded entirely by contractor lead purchases.",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-primary text-sm font-medium tracking-wide mb-4">Pay-per-lead pricing</p>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight mb-4">
                Pay for leads.<br />Not for access.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                No monthly subscription. No recurring fees. Buy lead credits and spend them only on the jobs
                you actually want to claim. Credits never expire.
              </p>
            </div>
          </div>
        </section>

        {/* Credit cost by job size */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-1">How credits work</h2>
              <p className="text-sm text-muted-foreground">Each lead costs credits based on the project size. You see the cost before you commit.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {creditCosts.map((c) => (
                <div key={c.size} className="p-5 rounded-xl border border-border/40 bg-card flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{c.size} job</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      <Zap className="h-3 w-3" />
                      {c.credits} credit{c.credits > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{c.range}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.examples}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Credit bundle cards */}
        <section className="pb-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-1">Buy credits</h2>
              <p className="text-sm text-muted-foreground">Volume discounts kick in at the Pro and Scale tiers. Credits are shared across all job sizes and never expire.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {bundles.map((bundle) => (
                <div
                  key={bundle.name}
                  className={`relative p-8 rounded-2xl border flex flex-col ${
                    bundle.highlighted
                      ? "bg-primary/5 border-primary/30 shadow-xl shadow-primary/5"
                      : "bg-card border-border/40"
                  }`}
                >
                  {bundle.badge && (
                    <span className="absolute -top-3 left-8 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground bg-primary px-3 py-1 rounded-full">
                      {bundle.badge}
                    </span>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-1">{bundle.name}</h3>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl font-bold text-primary tracking-tight">{bundle.price}</span>
                      <span className="text-sm font-semibold text-primary/70">{bundle.credits} credits</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{bundle.perCredit}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{bundle.description}</p>
                  </div>

                  <ul className="flex flex-col gap-3 mb-8 flex-grow">
                    {bundle.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                      bundle.highlighted
                        ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {bundle.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>

            {/* No lock-in strip */}
            <div className="mt-8 p-5 rounded-xl border border-border/40 bg-card/50 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Check className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">No subscription. No lock-in.</span> Buy credits
                when you need them. Credits never expire. No recurring charges, no cancellation process — because
                there&apos;s nothing to cancel.
              </p>
            </div>
          </div>
        </section>

        {/* ROI callout */}
        <section className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-card border border-border/40">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
                  Shared-lead platforms
                </p>
                <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>$15–$80 per lead, shared with 3–7 other contractors</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>Sub-15% close rate — you race every competitor on price</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>Effective cost per closed job: $100–$500+</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>Monthly subscription even in slow months</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>No project details until after you call</li>
                </ul>
              </div>

              <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">
                  Nexus Operations
                </p>
                <ul className="flex flex-col gap-3 text-sm text-foreground">
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>$10–$15 per credit — exclusive lead, yours alone</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>No competing contractors on any job you claim</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>Photos, scope, and budget before you spend a credit</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>Buy credits when you need them — zero idle spend</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>Consultation pre-confirmed — no callbacks, no no-shows</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 lg:py-32">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-10">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold tracking-tight">Pricing questions</h2>
            </div>
            <div className="flex flex-col gap-6">
              {faqs.map((faq) => (
                <div key={faq.q} className="border-b border-border/40 pb-6">
                  <h3 className="text-sm font-semibold mb-2 text-foreground">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Free for homeowners */}
        <section className="py-24 lg:py-32 bg-card/30">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Always free for homeowners</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
              Property owners never pay to submit a request or receive a match. Our platform is funded
              entirely by contractor lead purchases — so homeowners get a premium matching experience at zero cost.
            </p>
            <Link
              href="/login?tab=signup"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
            >
              Submit a Request — It&apos;s Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
