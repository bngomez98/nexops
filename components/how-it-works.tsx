const steps = [
  {
    number: "01",
    title: "Submit request details",
    detail: "Share scope, photos, urgency, and budget expectations through a guided workflow.",
  },
  {
    number: "02",
    title: "Verified contractor routing",
    detail: "NexOps routes the request to an approved contractor profile that matches category and geography.",
  },
  {
    number: "03",
    title: "Consultation and execution",
    detail: "A consultation is scheduled, work is completed, and progress is tracked against agreed expectations.",
  },
  {
    number: "04",
    title: "Completion QA and reporting",
    detail: "Completion evidence and service metrics are captured so your team has a reliable audit trail.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Workflow</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">How routing works end-to-end</h2>
          <p className="text-muted-foreground leading-relaxed">A transparent process designed for predictable response and less coordination overhead.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <article key={step.number} className="rounded-2xl border border-border/40 bg-card p-6">
              <p className="text-xs font-mono text-primary mb-3">Step {step.number}</p>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
