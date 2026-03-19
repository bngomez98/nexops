import { TreePine, HardHat, Home, Flame, Fence, Zap } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    icon: TreePine,
    name: "Tree Removal",
    description: "Removal, trimming, stump grinding. Storm damage and hazardous tree assessment.",
    budget: "$500 - $8,000",
    available: true,
  },
  {
    icon: HardHat,
    name: "Concrete Work",
    description: "Driveways, patios, sidewalks, foundation repair, decorative and stamped concrete.",
    budget: "$1,200 - $15,000",
    available: true,
  },
  {
    icon: Home,
    name: "Roofing",
    description: "Shingle replacement, metal roofing, leak repair, storm damage restoration.",
    budget: "$300 - $25,000",
    available: true,
  },
  {
    icon: Flame,
    name: "HVAC",
    description: "Installation, repair, and maintenance for heating and cooling systems.",
    budget: "$3,000 - $20,000",
    available: false,
  },
  {
    icon: Fence,
    name: "Fencing",
    description: "Wood, vinyl, chain link, and iron fencing installation and repair.",
    budget: "$1,500 - $8,000",
    available: false,
  },
  {
    icon: Zap,
    name: "Electrical",
    description: "Panel upgrades, wiring, outlet installation, lighting, and code compliance.",
    budget: "$500 - $10,000",
    available: false,
  },
]

export function Services() {
  return (
    <section id="services" className="py-24 lg:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Service categories</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            Launching with 3 categories, expanding fast
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Each request requires photos, specifications, and a budget cap so contractors know exactly
            what they are bidding on before they claim the lead.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`group relative p-6 rounded-xl border transition-colors ${
                cat.available
                  ? "bg-card border-border/40 hover:border-primary/30"
                  : "bg-secondary/30 border-border/20"
              }`}
            >
              {!cat.available && (
                <span className="absolute top-4 right-4 text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  Coming Soon
                </span>
              )}
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg mb-4 ${
                cat.available ? "bg-primary/10" : "bg-secondary"
              }`}>
                <cat.icon className={`h-5 w-5 ${cat.available ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <h3 className="text-base font-semibold mb-1.5">{cat.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{cat.description}</p>
              <p className="text-xs text-muted-foreground">
                Typical range: <span className="text-foreground font-medium">{cat.budget}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start">
          <Link
            href="#submit"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Submit a Request
          </Link>
          <p className="text-sm text-muted-foreground">
            Don't see your category? <Link href="/contact" className="text-primary hover:underline">Let us know</Link> and we'll prioritize it.
          </p>
        </div>
      </div>
    </section>
  )
}
