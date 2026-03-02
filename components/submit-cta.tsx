import Link from "next/link"
import { ArrowRight, CheckCircle, Shield, ClipboardList, UserCheck, CalendarClock } from "lucide-react"

const steps = [
  { icon: ClipboardList, title: "Submit request", text: "Upload details, scope, and budget requirements." },
  { icon: UserCheck, title: "Verified match", text: "A qualified contractor is assigned to your project." },
  { icon: CalendarClock, title: "Consult scheduled", text: "Consultation is confirmed inside your selected window." },
]

export function SubmitCTA() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card">
          <div className="p-10 lg:p-14">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
                  <span className="text-primary text-xs font-medium">Property owner onboarding</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                  Start with one submission.
                  <br />
                  <span className="gradient-text">Run the project through one accountable workflow.</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl">
                  NexOps coordinates assignment and scheduling with verified contractors so owners and managers avoid fragmented, multi-vendor outreach.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-3 mb-6">
                  <Link href="/dashboard/homeowner/new" className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">
                    Start Your Project
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium border border-border/40 rounded-xl">
                    Talk to Operations Team
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-primary" /> Free submission</span>
                  <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> Verified contractors</span>
                </div>
              </div>

              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div key={step.title} className="p-4 rounded-xl bg-secondary/30 border border-border/30 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <step.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Step {i + 1}</p>
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
