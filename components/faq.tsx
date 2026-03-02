"use client"

const faqs = [
  {
    q: "How does contractor assignment work?",
    a: "Each project is assigned to one verified contractor based on category, availability, and coverage.",
  },
  {
    q: "Is there a cost for property owners to submit requests?",
    a: "No. Submission is free for property owners.",
  },
  {
    q: "What does contractor membership include?",
    a: "Membership includes access to eligible projects, account controls, and platform reporting features.",
  },
  {
    q: "Can property managers use NexOps for recurring maintenance?",
    a: "Yes. NexOps supports recurring maintenance workflows and dispatch coordination.",
  },
]

export function FAQ() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">Common questions</h2>
          <p className="text-muted-foreground leading-relaxed">
            Straight answers on request flow, contractor onboarding, and operating model.
          </p>
        </div>
        <div className="space-y-5">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-xl border border-border/40 bg-card p-5">
              <h3 className="text-base font-semibold mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
