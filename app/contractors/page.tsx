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
  Users,
  BarChart3,
} from "lucide-react"

export const metadata: Metadata = {
  title: "For Contractors | Join the Network",
  description:
    "Licensed and insured contractors: join the Nexus Operations network for steady, pre-qualified work with guaranteed payment. No subscription fees. We pay you, not the other way around.",
}

const benefits = [
  {
    icon: DollarSign,
    title: "Guaranteed payment, every job",
    description:
      "Nexus Operations pays contractors directly within 30 days of job completion. No chasing property managers for payment. No disputed invoices. We handle collections -- you handle the work.",
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
      "We verify all licenses against state databases, confirm insurance directly with providers, and review references. 3-5 business days.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Start receiving work",
    description:
      "Once approved, you are added to the active network and begin receiving assignment notifications matching your trade and availability.",
  },
]

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
                Steady work.{" "}
                <span className="font-serif italic font-normal text-primary">
                  Guaranteed payment.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
                Nexus Operations connects verified contractors with property
                management companies across Shawnee County. We coordinate the
                work, you execute it. No subscription fees, no lead costs --
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
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  How it works
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

        {/* How assignment works */}
        <section id="how-it-works" className="py-16 lg:py-24">
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
                      desc: "Submit your invoice at your quoted rate. We handle client billing and pay you directly. No collections, no disputes.",
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
        <section className="py-16 lg:py-24 bg-secondary/50">
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
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground mb-4 text-balance">
                Ready for reliable, well-coordinated work?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Apply to join the Nexus Operations contractor network. The
                application takes 5 minutes. Verification completes within 3-5
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
