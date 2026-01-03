const steps = [
  {
    number: "01",
    title: "Initial consultation",
    description: "Submission of project scope, requirements, and constraints through structured intake process.",
  },
  {
    number: "02",
    title: "Proposal development",
    description:
      "Detailed plan with cost breakdown, timeline projections, and execution strategy delivered within one business day.",
  },
  {
    number: "03",
    title: "Execution phase",
    description:
      "Systematic completion of research, vendor coordination, procurement, and quality verification with milestone updates.",
  },
  {
    number: "04",
    title: "Delivery & documentation",
    description:
      "Final deliverables with comprehensive documentation including receipts, warranties, and relevant reference materials.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-24 max-w-3xl">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Standard process</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A structured approach ensuring consistency, transparency, and accountability throughout every engagement.
          </p>
        </div>
        {/* </CHANGE> */}

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{step.number}</span>
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-serif font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
