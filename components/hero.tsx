export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <div className="absolute top-[20%] right-[15%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-accent/15 blur-[100px]" />
      </div>
      {/* </CHANGE> */}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Serving Busy Professionals Since 2024
          </div>
          {/* </CHANGE> */}

          <h1 className="font-serif text-7xl md:text-8xl lg:text-9xl font-light leading-[0.9] mb-10 text-balance">
            You Don't Have
            <br />
            Time to Hunt
            <br />
            <span className="text-primary">Vendors.</span>
          </h1>
          {/* </CHANGE> */}

          <p className="text-2xl md:text-3xl text-muted-foreground leading-relaxed max-w-3xl mb-14 text-pretty">
            We source specialized products, coordinate contractors, negotiate pricing, and manage fulfillment. You get
            results. We handle everything else.
          </p>
          {/* </CHANGE> */}

          <div className="flex flex-col sm:flex-row gap-6 mb-20">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center px-10 py-5 text-lg font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all glow-primary"
            >
              Start Your Project
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              Explore Services →
            </a>
          </div>
          {/* </CHANGE> */}

          <div className="grid grid-cols-3 gap-12 max-w-3xl pt-12 border-t border-border/30">
            <div>
              <div className="text-5xl font-serif font-light text-primary mb-2">24hr</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Response Time</div>
            </div>
            <div>
              <div className="text-5xl font-serif font-light text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Transparent Pricing</div>
            </div>
            <div>
              <div className="text-5xl font-serif font-light text-primary mb-2">0</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Hidden Fees</div>
            </div>
          </div>
          {/* </CHANGE> */}
        </div>
      </div>
    </section>
  )
}
