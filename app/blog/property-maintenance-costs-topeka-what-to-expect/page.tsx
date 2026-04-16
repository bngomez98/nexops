import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "@/components/link"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Property Maintenance Costs in Topeka: Benchmarks for Common Repairs | Nexus Operations",
  description:
    "Expected cost ranges for common maintenance jobs in Topeka, Kansas — plumbing, electrical, HVAC, roofing, and general repair — plus notes on what drives costs higher.",
  keywords: [
    "property maintenance costs Topeka",
    "plumbing repair cost Topeka KS",
    "HVAC repair cost Kansas",
    "contractor rates Topeka",
    "maintenance cost benchmarks",
    "property repair cost estimate Kansas",
  ],
  alternates: { canonical: "https://nexusoperations.org/blog/property-maintenance-costs-topeka-what-to-expect" },
}

const costData = [
  { trade: "Plumbing", job: "Leaking fixture repair", range: "$75–$200", notes: "Faucet replacement or fixture re-seal. Higher end includes parts." },
  { trade: "Plumbing", job: "Supply line replacement", range: "$150–$350", notes: "Higher if access is difficult or cabinets need adjustment." },
  { trade: "Plumbing", job: "Water heater replacement (tank, 40 gal)", range: "$800–$1,400", notes: "Includes labor and basic tank unit. Tankless higher." },
  { trade: "Electrical", job: "Outlet or switch replacement", range: "$80–$180", notes: "Per outlet. Higher for GFCI or 240V." },
  { trade: "Electrical", job: "Panel breaker replacement", range: "$150–$300", notes: "Single breaker. Full panel replacement significantly higher." },
  { trade: "HVAC", job: "Refrigerant recharge", range: "$200–$400", notes: "Depends on refrigerant type and quantity. Does not address leak." },
  { trade: "HVAC", job: "Capacitor or contactor replacement", range: "$150–$350", notes: "Common summer failure. Quick repair if part is on the truck." },
  { trade: "HVAC", job: "System replacement (central, 2.5 ton)", range: "$4,500–$8,000", notes: "Wide range based on brand, efficiency, and install complexity." },
  { trade: "Roofing", job: "Minor repair / patch (flat < 10 sq ft)", range: "$300–$700", notes: "Emergency patch or single section. Full inspection recommended." },
  { trade: "General Repair", job: "Door hardware / lock replacement", range: "$80–$200", notes: "Per door. Deadbolt re-key lower; full replacement higher." },
  { trade: "General Repair", job: "Drywall patch (< 1 sq ft)", range: "$100–$250", notes: "Includes texture match. Larger patches scale up significantly." },
]

export default function BlogPost() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <article className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
            </Link>
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">Cost Guidance</span>
              <span className="text-[12px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> 7 min read</span>
              <span className="text-[12px] text-muted-foreground">· February 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-foreground mb-6">
              What Property Maintenance Actually Costs in Topeka: Benchmarks for Common Repairs
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-primary/30 pl-5">
              Knowing whether a contractor&apos;s quote is reasonable requires benchmarks. These ranges reflect the Topeka, Kansas market based on common maintenance jobs across trade categories.
            </p>
            <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-6">
              <p>
                These are rough benchmarks, not quotes. Actual costs vary based on parts, access, the specific contractor, and current material pricing. Use these as a reasonableness check — not a ceiling.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="bg-secondary/60 border-b border-border">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Trade</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Job</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[11px] whitespace-nowrap">Est. range</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-[11px] hidden sm:table-cell">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {costData.map((row, i) => (
                      <tr key={i} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground font-medium">{row.trade}</td>
                        <td className="px-4 py-3 text-foreground">{row.job}</td>
                        <td className="px-4 py-3 font-bold text-primary whitespace-nowrap">{row.range}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell max-w-xs">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h2 className="text-xl font-semibold text-foreground">What drives costs higher</h2>
              <p>Several factors consistently push repair costs above the midpoint of these ranges:</p>
              <ul className="pl-4 space-y-1">
                <li><strong>Emergency or after-hours response</strong> — contractors typically charge a premium for off-hours calls, reflected in Emergency tier invoicing.</li>
                <li><strong>Access difficulty</strong> — units with finished ceilings above plumbing runs, cramped mechanical rooms, or multi-story access add labor time.</li>
                <li><strong>Material lead times</strong> — specialty parts, older system components, or supply chain constraints can extend timelines and increase quotes.</li>
                <li><strong>Deferred maintenance compounding</strong> — a minor leak found late often involves secondary repairs: cabinet replacement, drywall, mold mitigation.</li>
              </ul>
              <h2 className="text-xl font-semibold text-foreground">How Nexus Operations invoicing works</h2>
              <p>
                When Nexus Operations handles a job, the contractor&apos;s quoted rate becomes the line item on your monthly invoice — no per-job percentage surcharge bolted on top. Dispatch, SLA tracking, documentation, and unified billing are all covered by your Nexus subscription plan, not by a cut of each contractor&apos;s work.
              </p>
              <p>
                The result: property managers receive one consolidated monthly invoice that itemizes every job across every property — not a separate bill from each contractor, and not a confusing split between &quot;base cost&quot; and &quot;markup&quot; on every line.
              </p>
            </div>
            <div className="mt-12 p-6 rounded-2xl border border-primary/20 bg-primary/5">
              <h3 className="text-base font-semibold text-foreground mb-2">See how pricing works</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">The pricing page shows current subscription plans for homeowners, portfolios, and contractors — with everything that is included at each tier.</p>
              <Link href="/pricing" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
                View pricing <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 pt-8 border-t border-border">
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to all posts
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
