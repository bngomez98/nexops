const stories = [
  {
    metric: "$2,400 Saved",
    client: "Marketing agency with remote team",
    deliverable: "Office equipment for 4 new hires",
    result:
      "Needed monitors, chairs, keyboards, and software licenses for new employees starting in 2 weeks. Researched 12 vendors, negotiated bulk pricing, coordinated staggered delivery to match start dates. Everything arrived configured and saved $2,400 vs their initial quotes.",
    color: "primary",
  },
  {
    metric: "48 Hours",
    client: "Startup founder during product launch",
    deliverable: "Emergency office relocation",
    result:
      "Had to relocate office mid-product launch with zero time to manage logistics. We coordinated movers, internet installation, furniture delivery, and cleaning across 4 vendors within 48 hours. Founder stayed focused on launch, office was operational on schedule.",
    color: "accent",
  },
  {
    metric: "12 Suppliers",
    client: "E-commerce business scaling production",
    deliverable: "Custom packaging from multiple vendors",
    result:
      "Needed specialized packaging materials no single supplier could provide. Sourced from 12 different vendors, negotiated rush delivery, coordinated arrivals to match production schedule. All materials delivered on time, 15% under their budget estimate.",
    color: "chart-3",
  },
  {
    metric: "Zero Hassle",
    client: "Remote professional with home repairs",
    deliverable: "Plumbing contractor coordination",
    result:
      "Needed reliable plumber but didn't want to spend days getting quotes and checking reviews. We vetted 8 contractors, verified licenses, obtained detailed quotes, coordinated site visits, and monitored work. Project done on budget with full documentation.",
    color: "chart-5",
  },
]

export function SuccessStories() {
  return (
    <section id="results" className="py-28 md:py-36 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block text-sm font-semibold tracking-widest text-accent/80 mb-6 uppercase">
            Proven Results
          </div>
          <h2 className="font-serif text-5xl md:text-7xl font-light leading-[1.1] mb-8 text-balance">
            Real outcomes for
            <br />
            <span className="text-accent">real clients</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Every engagement follows the same pattern: clear scope, transparent execution, documented results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {stories.map((story, index) => (
            <div
              key={index}
              className="group relative p-8 bg-card hover:bg-card/80 border border-border/50 hover:border-primary/50 rounded-2xl hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`h-2 w-2 rounded-full bg-${story.color} mt-2 shrink-0`} />
                <div>
                  <h3 className="text-2xl font-serif font-semibold text-primary mb-1">{story.metric}</h3>
                  <p className="text-sm text-muted-foreground">{story.client}</p>
                </div>
              </div>

              <div className="space-y-4 pl-6">
                <div>
                  <div className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Deliverable</div>
                  <p className="text-sm text-foreground font-medium">{story.deliverable}</p>
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Result</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{story.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
