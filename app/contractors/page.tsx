import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CONTACT_INFO } from "@/lib/contact-info"
import Link from "next/link"
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  DollarSign,
  CheckCircle,
  FileText,
  BadgeCheck,
  Wrench,
  BarChart3,
  Search,
  Zap,
  Shield,
} from "lucide-react"

export const metadata: Metadata = {
  title: "For Contractors — Join the Nexus Operations Network in Topeka, KS",
  description:
    "Licensed and insured contractors in Shawnee County: join the Nexus Operations network for pre-qualified, documented service requests with guaranteed payment within 30 days. No subscription fees.",
}

const benefits = [
  {
    icon: DollarSign,
    title: "Guaranteed payment, every job",
    description:
      "Nexus Operations pays contractors directly within 30 days of job completion. No chasing property managers for payment. No disputed invoices. We handle collections — you handle the work.",
  },
  {
    icon: Clock,
    title: "Steady, pre-qualified work",
    description:
      "Requests come with full scope documentation, photos, budget parameters, and property access details. No wasted site visits. No ambiguous scopes. You know exactly what you're walking into.",
  },
  {
    icon: ShieldCheck,
    title: "No subscription fees or lead costs",
    description:
      "We never charge contractors to receive work. Our revenue comes from the coordination markup charged to property clients. You receive your full quoted rate on every job.",
  },
  {
    icon: BarChart3,
    title: "Performance-based priority",
    description:
      "Contractors who consistently meet response times, complete quality documentation, and maintain high ratings get priority assignment on higher-value work. Reliable performance earns more volume.",
  },
]

const requirements = [
  "Valid Kansas business license",
  "Applicable trade licenses for your service categories",
  "General liability insurance ($500K per occurrence minimum)",
  "Workers compensation insurance (if you have employees)",
  "Ability to respond to assignments within defined SLA windows",
  "Willingness to provide photo documentation on every job",
]

const verificationSteps = [
  {
    icon: FileText,
    step: "01",
    title: "Apply online",
    description:
      "Complete the application with your business info, service categories, and coverage area within Shawnee County.",
  },
  {
    icon: BadgeCheck,
    step: "02",
    title: "Submit documentation",
    description:
      "Upload your business license, trade licenses, liability insurance certificate, and workers comp (if applicable).",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Verification review",
    description:
      "We verify all licenses against state databases, confirm insurance directly with providers, and review references. 3–5 business days.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Start receiving work",
    description:
      "Once approved, you are added to the active network and begin receiving assignment notifications matching your trade and availability.",
  },
]

const networkCategories = [
  {
    trade: "Plumbing",
    icon: "🔧",
    activeContractors: 4,
    credentialRequired: "KS Master/Journeyman Plumber license",
    insuranceMin: "$500K general liability",
    acceptingApps: true,
    tiers: ["Routine", "Urgent", "Emergency"],
  },
  {
    trade: "Electrical",
    icon: "⚡",
    activeContractors: 3,
    credentialRequired: "KS Electrical Contractor license",
    insuranceMin: "$500K general liability",
    acceptingApps: true,
    tiers: ["Routine", "Urgent", "Emergency"],
  },
  {
    trade: "HVAC",
    icon: "🌡️",
    activeContractors: 3,
    credentialRequired: "KS HVAC Contractor license + EPA 608",
    insuranceMin: "$500K general liability",
    acceptingApps: true,
    tiers: ["Routine", "Urgent", "Emergency"],
  },
  {
    trade: "Roofing",
    icon: "🏠",
    activeContractors: 2,
    credentialRequired: "KS Roofing Contractor registration",
    insuranceMin: "$500K general liability",
    acceptingApps: true,
    tiers: ["Routine", "Urgent"],
  },
  {
    trade: "General Repair",
    icon: "🔨",
    activeContractors: 3,
    credentialRequired: "KS business license + trade-specific certs",
    insuranceMin: "$500K general liability",
    acceptingApps: true,
    tiers: ["Routine", "Urgent"],
  },
  {
    trade: "Painting",
    icon: "🖌️",
    activeContractors: 2,
    credentialRequired: "KS business license",
    insuranceMin: "$500K general liability",
    acceptingApps: true,
    tiers: ["Routine"],
  },
  {
    trade: "Concrete",
    icon: "🧱",
    activeContractors: 1,
    credentialRequired: "KS business license",
    insuranceMin: "$500K general liability",
    acceptingApps: true,
    tiers: ["Routine"],
  },
  {
    trade: "Fencing",
    icon: "🪵",
    activeContractors: 1,
    credentialRequired: "KS business license",
    insuranceMin: "$500K general liability",
    acceptingApps: true,
    tiers: ["Routine"],
  },
  {
    trade: "Tree Services",
    icon: "🌲",
    activeContractors: 1,
    credentialRequired: "KS business license + liability",
    insuranceMin: "$1M general liability",
    acceptingApps: true,
    tiers: ["Routine", "Urgent"],
  },
]

const tierColors: Record<string, string> = {
  Routine: "bg-secondary text-foreground/70",
  Urgent: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Emergency: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export default function ContractorsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
                For contractors
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground mb-6 text-balance">
                Pre-qualified work.{" "}
                <span className="font-serif italic font-normal text-primary">
                  Direct payment within 30 days.
                </span>
                Steady work. Guaranteed payment.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
                Nexus Operations connects verified contractors with property
                management companies across Shawnee County. We coordinate the
                work, you execute it. No subscription fees, no lead costs —
                we pay you your full quoted rate on every completed job.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                >
                  Apply to Join
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#network"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  View the network
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 lg:py-24 bg-secondary/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4">
                Why contractors join the network.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We built the contractor relationship to be straightforward:
                pre-qualified work, clear scopes, and payment you can rely on.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary mb-4">
                    <b.icon className="h-5 w-5 text-foreground/60" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {b.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Network at a Glance */}
        <section id="network" className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Contractor network
              </p>
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4">
                Who's in the network.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every contractor in the network has been manually verified —
                license confirmed against state records, insurance confirmed
                directly with the provider. Below is the current network by
                trade category. Contractor identities are kept confidential
                until a specific job assignment is confirmed.
              </p>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Active contractors", value: "20+" },
                { label: "Trade categories", value: "9" },
                { label: "Accepting applications", value: "All trades" },
                { label: "Avg. verification time", value: "3–5 days" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-5 rounded-xl bg-card border border-border text-center"
                >
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Network table */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/60 border-b border-border">
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Trade
                      </th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                        Credential required
                      </th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                        Insurance min.
                      </th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Tiers covered
                      </th>
                      <th className="text-center px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Active
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {networkCategories.map((cat) => (
                      <tr key={cat.trade} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{cat.icon}</span>
                            <span className="font-medium text-foreground text-[13px]">
                              {cat.trade}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[12.5px] text-muted-foreground hidden sm:table-cell max-w-[220px]">
                          {cat.credentialRequired}
                        </td>
                        <td className="px-5 py-4 text-[12.5px] text-muted-foreground hidden md:table-cell whitespace-nowrap">
                          {cat.insuranceMin}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {cat.tiers.map((tier) => (
                              <span
                                key={tier}
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium ${tierColors[tier]}`}
                              >
                                {tier}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[12.5px] font-semibold text-foreground">
                              {cat.activeContractors}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3.5 bg-secondary/40 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-[11.5px] text-muted-foreground">
                  Contractor identities are anonymized until job assignment. Verified credentials are available for review upon request before any job begins.
                </p>
                <Link
                  href="/contact"
                  className="text-[11.5px] font-semibold text-primary hover:underline whitespace-nowrap"
                >
                  Request credential details →
                </Link>
              </div>
            </div>

            {/* Credential verification callout */}
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: BadgeCheck,
                  title: "License verified against state records",
                  desc: "Every license number is cross-checked with Kansas KLCA and relevant trade board databases before approval.",
                },
                {
                  icon: ShieldCheck,
                  title: "Insurance confirmed with provider",
                  desc: "We contact the issuing insurance company directly — not just the contractor — to confirm active, adequate coverage.",
                },
                {
                  icon: CheckCircle,
                  title: "Annual re-verification",
                  desc: "Credentials are re-checked annually and whenever a policy approaches expiration. Lapsed coverage results in automatic suspension.",
                },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl bg-card border border-border">
                  <item.icon className="h-5 w-5 text-primary mb-3" />
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">{item.title}</h4>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How assignment works */}
        <section id="how-it-works" className="py-16 lg:py-24 bg-secondary/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Assignment process
                </p>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-6">
                  How you receive and complete work.
                </h2>
                <div className="flex flex-col gap-6">
                  {[
                    {
                      num: "1",
                      title: "We receive a maintenance request",
                      desc: "A property manager submits a request through our system with full scope, photos, and urgency classification.",
                    },
                    {
                      num: "2",
                      title: "You receive an assignment notification",
                      desc: "Based on your trade, availability, and performance history, you are notified of the assignment. Accept or decline within the response window.",
                    },
                    {
                      num: "3",
                      title: "Complete the work with documentation",
                      desc: "Arrive within the SLA window, complete the repair, and submit before/after photos plus a brief completion report through the portal.",
                    },
                    {
                      num: "4",
                      title: "Get paid within 30 days",
                      desc: "Submit your invoice at your quoted rate. Nexus Operations collects payment from the client and pays you directly. No collections, no disputes.",
                    },
                  ].map((step) => (
                    <div key={step.num} className="flex gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-sm font-semibold text-foreground/60 shrink-0">
                        {step.num}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-1">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Requirements
                </p>
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-6">
                  What we require to join.
                </h2>
                <div className="rounded-xl bg-card border border-border p-6 lg:p-8">
                  <div className="flex flex-col gap-4">
                    {requirements.map((req) => (
                      <div
                        key={req}
                        className="flex items-start gap-3 text-sm text-foreground/70"
                      >
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {req}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We currently accept contractors in: plumbing, electrical,
                      HVAC, concrete, tree services, roofing, fencing, painting,
                      and general repair. Additional categories added as demand
                      warrants.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verification Process */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4">
                Verification process.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every contractor is verified before receiving any assignments.
                This protects our property management clients and ensures the
                network maintains professional standards.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {verificationSteps.map((s) => (
                <div
                  key={s.step}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
                      <s.icon className="h-5 w-5 text-foreground/60" />
                    </div>
                    <span className="text-xs font-mono font-medium text-muted-foreground">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-secondary/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4 text-balance">
                Apply to join the Nexus contractor network.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                The application takes 5 minutes. Verification completes within 3-5 business days. Once approved, you begin receiving assignment notifications.
                Apply to join the Nexus Operations contractor network. The
                application takes 5 minutes. Verification completes within 3–5
                business days.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  Email us with questions
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
