import { Check, X } from "lucide-react"

const rows = [
  { feature: "Lead exclusivity", us: "1 contractor per request", them: "3-7 contractors per lead" },
  { feature: "Homeowner cost", us: "Free, always", them: "$0 but data sold" },
  { feature: "Budget transparency", us: "Set upfront by homeowner", them: "Discovered after estimate visit" },
  { feature: "Photo documentation", us: "Required before match", them: "Optional or not available" },
  { feature: "Consultation scheduling", us: "Pre-scheduled, confirmed", them: "Phone tag and callbacks" },
  { feature: "Contractor verification", us: "License, insurance, background", them: "Varies by platform" },
  { feature: "Phone calls to homeowner", us: "1 contractor contacts you", them: "5-15 calls within hours" },
]

export function Comparison() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Why Nexus</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            Built to fix what's broken in home services
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Traditional platforms sell your info to multiple contractors. You get bombarded with calls.
            Contractors waste time on shared leads with low conversion. We eliminate both problems.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-4 pr-6 text-muted-foreground font-medium w-1/3">Feature</th>
                <th className="text-left py-4 px-6 font-semibold text-primary">Nexus Operations</th>
                <th className="text-left py-4 pl-6 font-medium text-muted-foreground">Traditional Platforms</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature} className="border-b border-border/20">
                  <td className="py-4 pr-6 text-foreground/80">{row.feature}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground">{row.us}</span>
                    </div>
                  </td>
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                      <span className="text-muted-foreground">{row.them}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
