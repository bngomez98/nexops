const steps = [
  {
    number: "01",
    title: "Initial consultation",
    detail: "We review your current maintenance operations, vendor workflow, and response bottlenecks.",
  },
  {
    number: "02",
    title: "Workflow design",
    detail: "NexOps defines intake, dispatch, and closeout standards tailored to your portfolio.",
  },
  {
    number: "03",
    title: "Contractor alignment",
    detail: "Verified contractors are matched to service categories with accountability checkpoints.",
  },
  {
    number: "04",
    title: "Execution and reporting",
    detail: "Requests are tracked end to end with structured updates and transparent operational reporting.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Process</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">How NexOps operates</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {steps.map((step) => (
            <div key={step.number} className="rounded-2xl border border-border/40 bg-card p-6">
              <p className="text-xs font-semibold text-primary mb-2">Step {step.number}</p>
              <h3 className="text-base font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
