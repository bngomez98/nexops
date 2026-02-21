import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Check, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Membership Plans | Contractor Access Tiers",
  description:
    "Simple, transparent monthly membership for contractors. Standard, Premium, and Elite plans. Fixed pricing — no per-lead fees, no annual contracts, no hidden charges. Exclusive leads for licensed, insured contractors.",
}

const tiers = [
  {
    name: "Standard",
    price: "$299",
    period: "/month",
    description:
      "Full access to every pre-qualified lead in your service category and coverage area. First-come, first-served.",
    features: [
      "All leads in your approved categories",
      "Real-time push, email, and SMS notifications",
      "Unlimited claim attempts per month",
      "Full project documentation before you claim",
      "Performance dashboard — close rate, response time",
      "Cancel anytime, no commitment",
    ],
    cta: "Apply for Standard",
    highlighted: false,
    badge: null,
  },
  {
    name: "Premium",
    price: "$499",
    period: "/month",
    description:
      "A 90-second advance notification window before the general pool opens, plus deep analytics to sharpen your close rate.",
    features: [
      "Everything in Standard",
      "90-second head-start on every new lead",
      "Priority placement on high-value requests",
      "Advanced analytics — benchmarks, trends, pipeline",
      "Custom budget-floor filter (see only jobs above your minimum)",
      "Coverage area fine-tuning by ZIP code",
    ],
    cta: "Apply for Premium",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Elite",
    price: "$749",
    period: "/month",
    description:
      "A 10-minute exclusive claim window on every premium-tier request ($5K+), plus a dedicated account manager.",
    features: [
      "Everything in Premium",
      "10-minute exclusive window on $5K+ projects",
      "Dedicated account manager (direct line)",
      "Custom coverage configuration across counties",
      "Early access to new service categories",
      "Priority support with same-business-day response",
    ],
    cta: "Apply for Elite",
    highlighted: false,
    badge: "Best ROI",
  },
]

const faqs = [
  {
    q: "Why fixed prices instead of price ranges?",
    a: "Ranges introduce ambiguity — you deserve to know exactly what you will pay before you sign up. Our pricing is standardized across all service categories. No negotiation, no surprises.",
  },
  {
    q: "Is pricing the same regardless of my service category?",
    a: "Yes. Whether you do tree removal, roofing, concrete work, or electrical, the membership tier price is identical. You pay for platform access, not for a particular trade category.",
  },
  {
    q: "How does the ROI math work?",
    a: "The median residential project on our platform is $4,200. A single closed job at that value covers your Standard membership for 14 months. Most active members close 2–5 projects per month.",
  },
  {
    q: "Can I upgrade or downgrade my tier?",
    a: "Yes, at any time. Changes take effect at the start of your next billing cycle. Upgrades can also take effect immediately upon request.",
  },
  {
    q: "What does 'first-come, first-served' mean in practice?",
    a: "When a homeowner submits a request, every qualified contractor in that category and area is notified simultaneously. The first contractor to click 'Claim' locks the lead exclusively — it is immediately removed from all other feeds. Premium and Elite members receive their advance notification window before this opens.",
  },
  {
    q: "Are there any per-lead fees on top of my subscription?",
    a: "No. Your monthly membership is the only charge. You can claim as many leads as you can handle with no additional cost per claim.",
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
              <p className="text-primary text-sm font-medium tracking-wide mb-4">Membership plans</p>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight mb-4">
                Flat monthly membership with unlimited lead claims
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every tier includes unlimited lead claims with no per-lead fees, no annual contracts, and
                no cancellation penalties. Higher tiers add advance notification windows and priority access
                to high-value projects.
              </p>
            </div>
          </div>
        </section>

        {/* Tier Cards */}
        <section className="pb-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative p-8 rounded-2xl border flex flex-col ${
                    tier.highlighted
                      ? "bg-primary/5 border-primary/30 shadow-xl shadow-primary/5"
                      : "bg-card border-border/40"
                  }`}
                >
                  {tier.badge && (
                    <span className="absolute -top-3 left-8 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground bg-primary px-3 py-1 rounded-full">
                      {tier.badge}
                    </span>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-4xl font-bold text-primary tracking-tight">{tier.price}</span>
                      <span className="text-sm text-muted-foreground">{tier.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tier.description}</p>
                  </div>

                  <ul className="flex flex-col gap-3 mb-8 flex-grow">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                      tier.highlighted
                        ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Guarantee strip */}
            <div className="mt-8 p-5 rounded-xl border border-border/40 bg-card/50 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Check className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">No lock-in.</span> Cancel anytime from your
                dashboard. Your account remains active through the end of the current billing period.
                No cancellation fees.
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
                  What you replace
                </p>
                <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>$15–$80 per shared lead, 3–7 contractors calling the same homeowner</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>Sub-15% conversion rate on contested leads</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>30–40% no-show rate on estimate visits</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>5–10 hours per week on unqualified outreach</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span>Zero documentation before you drive to the site</li>
                </ul>
              </div>

              <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">
                  What you get
                </p>
                <ul className="flex flex-col gap-3 text-sm text-foreground">
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>One flat monthly fee — claim as many leads as you can handle</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>You are the only contractor on every job you claim</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>Photos, specs, and a defined budget before you commit</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>Consultation pre-scheduled by the homeowner — no callbacks</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>One closed project typically covers 6+ months of membership</li>
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
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Homeowners never pay to use Nexus Operations</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
              Submitting a project request and receiving a contractor match is free for homeowners.
              Nexus Operations is funded entirely by contractor memberships.
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
