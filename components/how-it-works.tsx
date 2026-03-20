const steps = [
  {
    number: "01",
    title: "You submit a request",
    description:
      "Submit via phone, text, email, or portal with the property address, unit, issue, and urgency. We acknowledge within 15 minutes during business hours.",
  },
  {
    number: "02",
    title: "We assign a verified contractor",
    description:
      "We match the request with a verified contractor based on trade, location, and availability. Backup assignment is automatic if the first contractor declines.",
  },
  {
    number: "03",
    title: "Work is completed and documented",
    description:
      "The contractor completes the work and submits photos plus a description to us. We confirm completion with you before processing any payment. You have 48 business hours to raise concerns.",
  },
  {
    number: "04",
    title: "You receive one invoice",
    description:
      "Monthly invoice with every request, property, work performed, and costs. Transparent contractor cost plus our markup.",
  },
]

export function HowItWorks() {
  return (
    <section id="process" className="py-24 lg:py-32 bg-secondary/50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Our process
          </p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-4 text-balance">
            From request to resolution.
            <br className="hidden sm:block" />
            <span className="font-serif italic font-normal text-primary">
              Every time.
            </span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Emergency plumbing at 2 AM or routine HVAC inspection—same process every time.
          </p>
        </div>

        <div className="flex flex-col gap-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`flex gap-6 lg:gap-10 py-8 ${
                i < steps.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="shrink-0 w-12">
                <span className="text-sm font-mono font-medium text-primary">
                  {step.number}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 lg:p-8 rounded-xl bg-card border border-border">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground mb-1">
                Response Time Guarantees
              </h3>
              <p className="text-sm text-muted-foreground">
                Every request is categorized by urgency with guaranteed response times.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 lg:gap-6">
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">1 hr</p>
                <p className="text-xs text-muted-foreground">
                  Emergency assignment
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">4 hr</p>
                <p className="text-xs text-muted-foreground">
                  Urgent assignment
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">24 hr</p>
                <p className="text-xs text-muted-foreground">
                  Routine assignment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
