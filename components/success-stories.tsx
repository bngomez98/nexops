const stories = [
  {
    metric: "18% Cost Savings",
    client: "Small Marketing Agency",
    deliverable: "Office equipment & software for 4 new hires",
    result:
      "Researched 12 vendors, negotiated bulk pricing on monitors, chairs, and SaaS licenses. Coordinated staggered delivery over 2 weeks. Saved $2,400 vs. initial quotes while ensuring everything arrived configured and ready.",
    color: "primary",
  },
  {
    metric: "48-Hour Completion",
    client: "Tech Startup Founder",
    deliverable: "Emergency office relocation coordination",
    result:
      "Coordinated movers, internet installation, furniture delivery, and cleaning across 4 vendors within tight timeline. Managed scheduling conflicts and ensured sequential completion. Founder stayed focused on product launch.",
    color: "accent",
  },
  {
    metric: "Multi-Vendor Success",
    client: "E-commerce Business",
    deliverable: "Specialized packaging from 12 suppliers",
    result:
      "Sourced custom packaging materials from multiple vendors, negotiated rush delivery, coordinated staggered arrivals to match production schedule. All materials delivered on time, 15% under budget estimate.",
    color: "chart-3",
  },
  {
    metric: "Quality Match",
    client: "Remote Professional",
    deliverable: "Home repair contractor coordination",
    result:
      "Vetted 8 contractors for plumbing work, verified licenses and reviews, obtained detailed quotes, scheduled site visits, and monitored work quality. Project completed on budget with full documentation for future reference.",
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
