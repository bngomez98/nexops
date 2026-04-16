import Link from "@/components/link"
import { ArrowRight, Building2, Home, Briefcase } from "lucide-react"

const audiences = [
  {
    icon: Building2,
    label: "Commercial",
    title: "Property Management",
    description:
      "Coordinate maintenance across multiple properties with guaranteed response times and unified invoicing.",
    features: [
      "Response times by urgency",
      "Backup contractor assignment",
      "Monthly unified invoicing",
      "Photo documentation",
    ],
    href: "/services#commercial",
  },
  {
    icon: Home,
    label: "Residential",
    title: "Property Owners",
    description:
      "Access verified contractors and professional coordination without subscriptions or retainers.",
    features: [
      "Verified contractor network",
      "Pay per job only",
      "Direct communication",
      "Transparent pricing",
    ],
    href: "/services#residential",
  },
  {
    icon: Briefcase,
    label: "B2B Services",
    title: "Business Operations",
    description:
      "Outsourced operational support including lead generation, vendor management, and project coordination.",
    features: [
      "Lead generation",
      "Vendor management",
      "Project coordination",
      "Growth consulting",
    ],
    href: "/services#b2b",
  },
]

export function WhoWeServe() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Services
          </p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-4 text-balance">
            Commercial, residential,
            <br className="hidden sm:block" />
            and B2B operations.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Maintenance coordination and operational support for property managers, owners, and businesses.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {audiences.map((a) => (
            <div
              key={a.label}
              className="group rounded-xl border border-border bg-card p-8 lg:p-10 hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
                      <a.icon className="h-5 w-5 text-foreground/70" />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                      {a.label}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {a.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {a.description}
                  </p>
                  <Link
                    href={a.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="lg:w-80 shrink-0">
                  <ul className="flex flex-col gap-3">
                    {a.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-sm text-foreground/70"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
