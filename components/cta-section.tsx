export function CTASection() {
  return (
    <section className="py-32 md:py-40 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="border-l-4 border-primary pl-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Ready to begin?</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl">
            Submit your project details and receive a comprehensive proposal with transparent pricing and timeline
            estimates.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Contact us <span className="ml-2">→</span>
          </a>
        </div>
        {/* </CHANGE> */}
      </div>
    </section>
  )
}
