import Link from "next/link"
import { ArrowRight, Building2, HardHat, WalletCards, ClipboardCheck, ShieldCheck, BarChart3 } from "lucide-react"

const paths = [
  {
    icon: Building2,
    title: "For Property Managers",
    description: "Review the operating model, response-time targets, and implementation framework.",
    href: "/property-managers",
    cta: "View manager services",
  },
  {
    icon: HardHat,
    title: "For Contractors",
    description: "Access onboarding standards, opportunity flow, and performance expectations.",
    href: "/contractors",
    cta: "View contractor program",
  },
  {
    icon: WalletCards,
    title: "Membership Plans",
    description: "Compare tier options and feature scope to match your operating stage.",
    href: "/pricing",
    cta: "Compare plans",
  },
]

const highlights = [
  { icon: ClipboardCheck, label: "Structured intake and routing" },
  { icon: ShieldCheck, label: "Verified assignment controls" },
  { icon: BarChart3, label: "Operational performance visibility" },
]

export function MainCommandCenter() {
  return (
    <section className="py-24 lg:py-32 border-y border-border/30 bg-card/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Platform overview</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">Start from the right operating path</h2>
          <p className="text-muted-foreground leading-relaxed">
            Navigate directly to the program designed for your role, with clear expectations for onboarding,
            response standards, and outcomes.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {paths.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border/40 bg-card p-6 flex flex-col">
              <item.icon className="h-5 w-5 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">{item.description}</p>
              <Link href={item.href} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80">
                {item.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 lg:p-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {highlights.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 text-sm font-medium text-foreground/90">
                <item.icon className="h-4 w-4 text-primary" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
