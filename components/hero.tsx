import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/10 to-background" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] text-balance mb-8">
            Solutions delivered,
            <span className="block text-primary">not just sourced</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
            Complete product acquisition and project execution services with transparent processes and documented
            outcomes.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#services"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2 group"
            >
              Explore services
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <span className="text-muted-foreground/40">|</span>
            <a
              href="#contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Get in touch
            </a>
          </div>
          {/* </CHANGE> */}

          {/* Removed the grid section */}
          {/* </CHANGE> */}
        </div>
      </div>
    </section>
  )
}
