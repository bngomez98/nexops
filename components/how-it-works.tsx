import { ClipboardList, UserCheck, CalendarCheck2, FileText } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Structured intake",
    detail:
      "Requests are submitted with photos, scope notes, urgency, and budget constraints so dispatch starts with complete context.",
    icon: ClipboardList,
    outcome: "No missing details before assignment",
  },
  {
    number: "02",
    title: "Verified contractor assignment",
    detail:
      "NexOps routes the request to one vetted contractor based on service category, location coverage, and response performance.",
    icon: UserCheck,
    outcome: "Single responsible contractor per project",
  },
  {
    number: "03",
    title: "Consultation scheduling",
    detail:
      "The assigned contractor confirms a consultation window and receives the full project packet before speaking with the owner.",
    icon: CalendarCheck2,
    outcome: "Faster first-touch and cleaner handoff",
  },
  {
    number: "04",
    title: "Execution and reporting",
    detail:
      "Progress updates, completion records, and billing context are documented for owners and managers in one workflow.",
    icon: FileText,
    outcome: "Transparent closeout and audit trail",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-card/30 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Process design</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">An operations workflow, not a lead dump</h2>
          <p className="text-muted-foreground leading-relaxed">
            NexOps is built around execution discipline: complete intake, controlled assignment, tracked delivery, and documented completion.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {steps.map((step) => (
            <article key={step.number} className="rounded-2xl border border-border/40 bg-card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">Step {step.number}</p>
                    <h3 className="text-base font-semibold">{step.title}</h3>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.detail}</p>
              <p className="text-xs text-foreground/80 border-t border-border/40 pt-3">
                <span className="font-semibold text-primary">Outcome:</span> {step.outcome}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
