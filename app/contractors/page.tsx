import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Clock3, DollarSign, BadgeCheck, BarChart3 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "For Contractors",
  description:
    "Join NexOps to receive exclusive project opportunities with verified scope, budget details, and clear response expectations.",
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
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-card/30 border-y border-border/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">Why teams switch to NexOps</h2>
              <p className="text-muted-foreground leading-relaxed">
                Consistent intake standards and single-ownership routing remove common friction from sales-to-service handoff.
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
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
