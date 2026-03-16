import { FileText, Users, Hammer, CheckCircle2 } from "lucide-react"

const steps = [
  {
    icon: FileText,
    title: "Describe your project",
    description: "Tell us what you need done. Include photos, budget, and timeline for better matches.",
  },
  {
    icon: Users,
    title: "Get matched",
    description: "Our system connects you with qualified contractors who specialize in your type of project.",
  },
  {
    icon: Hammer,
    title: "Work gets done",
    description: "Your contractor completes the project. Track progress and communicate directly through the platform.",
  },
  {
    icon: CheckCircle2,
    title: "Pay with confidence",
    description: "Release payment only when you're satisfied. Your funds are protected until the job is complete.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent process
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From request to completion, we make it easy to get quality work done on your home.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-1/2 hidden h-0.5 w-full bg-border lg:block" />
              )}
              
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
