import { ShieldCheck, Workflow, Users, ClipboardCheck } from "lucide-react"

const values = [
  {
    icon: ShieldCheck,
    title: "Credentialed contractor network",
    body: "Trade licenses, insurance, and performance history are verified before assignments are enabled.",
  },
  {
    icon: Workflow,
    title: "Standardized dispatch logic",
    body: "Every request follows the same intake, assignment, and closeout sequence to avoid operational drift.",
  },
  {
    icon: Users,
    title: "Operations-team collaboration",
    body: "Property managers get a dedicated coordination partner instead of juggling multiple disconnected vendors.",
  },
  {
    icon: ClipboardCheck,
    title: "Documented service accountability",
    body: "Milestones, response timestamps, and status updates are tracked so decisions are evidence-based.",
  },
]

export function MissionValues() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start mb-12">
          <div>
            <p className="text-primary text-sm font-medium tracking-wide mb-3">Operating principles</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-5">
              Built for property operations teams that need reliability, not marketplace noise
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              NexOps combines services and software to reduce maintenance coordination overhead. The model is simple:
              one structured request, one verified contractor, one accountable workflow.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This removes duplicate outreach, improves response consistency, and gives managers a clean record of what
              happened on every project.
            </p>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-3">NexOps focus</p>
            <ul className="space-y-3 text-sm text-foreground/85">
              <li>• Fewer communication breakdowns between owners, managers, and contractors</li>
              <li>• Faster assignment-to-consultation movement on urgent maintenance work</li>
              <li>• Better visibility for billing, vendor performance, and portfolio-level reporting</li>
            </ul>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {values.map((v) => (
            <div key={v.title} className="group flex gap-5 p-6 rounded-2xl bg-card border border-border/40 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 leading-snug">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
