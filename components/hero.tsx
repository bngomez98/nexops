export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-primary/10 to-transparent blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-4xl">
          <div className="inline-block text-sm font-semibold tracking-widest text-primary/80 mb-6 uppercase">
            Product Sourcing · Vendor Coordination · Project Management
          </div>

          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] mb-8">
            We find it.
            <br />
            <span className="text-primary">We handle it.</span>
            <br />
            <span className="text-muted-foreground text-5xl md:text-6xl">You move forward.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
            Nexus Operations executes operational tasks for busy professionals and small businesses—from sourcing
            specialized products to coordinating multi-vendor projects. Fixed pricing, documented deliverables,
            measurable outcomes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg"
            >
              Request a Quote
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-foreground hover:text-primary border-2 border-border hover:border-primary transition-colors rounded-lg"
            >
              View Services
            </a>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl pt-8 border-t border-border/50">
            <div>
              <div className="text-3xl font-serif font-semibold text-primary mb-1">24hrs</div>
              <div className="text-sm text-muted-foreground">Initial Response</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-semibold text-primary mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Price Transparency</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-semibold text-primary mb-1">$0</div>
              <div className="text-sm text-muted-foreground">Hidden Fees</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
