const stories = [
  {
    metric: "$2,400 Saved",
    client: "Marketing agency with remote team",
    deliverable: "Office equipment for 4 new hires",
    result:
      "Needed monitors, chairs, keyboards, and software licenses for new employees starting in 2 weeks. Researched 12 vendors, negotiated bulk pricing, coordinated staggered delivery to match start dates. Everything arrived configured and saved $2,400 vs their initial quotes.",
  },
  {
    metric: "48 Hours",
    client: "Startup founder during product launch",
    deliverable: "Emergency office relocation",
    result:
      "Had to relocate office mid-product launch with zero time to manage logistics. We coordinated movers, internet installation, furniture delivery, and cleaning across 4 vendors within 48 hours. Founder stayed focused on launch, office was operational on schedule.",
  },
  {
    metric: "12 Suppliers",
    client: "E-commerce business scaling production",
    deliverable: "Custom packaging from multiple vendors",
    result:
      "Needed specialized packaging materials no single supplier could provide. Sourced from 12 different vendors, negotiated rush delivery, coordinated arrivals to match production schedule. All materials delivered on time, 15% under their budget estimate.",
  },
  {
    metric: "Zero Hassle",
    client: "Remote professional with home repairs",
    deliverable: "Plumbing contractor coordination",
    result:
      "Needed reliable plumber but didn't want to spend days getting quotes and checking reviews. We vetted 8 contractors, verified licenses, obtained detailed quotes, coordinated site visits, and monitored work. Project done on budget with full documentation.",
  },
]

export function SuccessStories() {
  return (
    <section id="results" className="py-32 md:py-40 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-[30%] left-[10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]" />
      </div>
      {/* </CHANGE> */}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-accent mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Proven Results
          </div>
          <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light leading-[0.9] mb-10 max-w-4xl">
            Real clients.
            <br />
            <span className="text-accent">Real outcomes.</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Every engagement follows the same process: clear scope, transparent execution, documented results.
          </p>
        </div>
        {/* </CHANGE> */}

        <div className="grid lg:grid-cols-2 gap-6">
          {stories.map((story, index) => (
            <div
              key={index}
              className="group relative p-10 bg-card/30 hover:bg-card border border-border/30 hover:border-accent/50 rounded-2xl transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent to-transparent rounded-l-2xl" />
              {/* </CHANGE> */}

              <div className="mb-8">
                <h3 className="font-serif text-4xl font-light text-accent mb-2">{story.metric}</h3>
                <p className="text-sm text-muted-foreground">{story.client}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-3">
                    What They Needed
                  </div>
                  <p className="text-foreground font-medium leading-relaxed">{story.deliverable}</p>
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-3">
                    What We Delivered
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{story.result}</p>
                </div>
              </div>
              {/* </CHANGE> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
