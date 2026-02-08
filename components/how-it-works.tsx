import { Camera, MousePointerClick, CalendarCheck, Star } from "lucide-react"

const steps = [
  {
    icon: Camera,
    number: "01",
    title: "Document your project",
    description:
      "Upload 2-10 photos, enter project specs, set your budget cap, and pick 3-4 consultation windows. The more detail you provide, the better the match.",
  },
  {
    icon: MousePointerClick,
    number: "02",
    title: "Contractor claims your job",
    description:
      "Licensed, insured contractors in your area see your request instantly. The first one to claim it gets exclusive access — no bidding wars, no shared leads.",
  },
  {
    icon: CalendarCheck,
    number: "03",
    title: "Consultation is scheduled",
    description:
      "Both parties get a confirmed calendar invite for the consultation time you selected. The contractor already knows your scope, budget, and has seen your photos.",
  },
  {
    icon: Star,
    number: "04",
    title: "Get the work done",
    description:
      "After the consultation, you receive a quote. Accept it and the project moves forward. We follow up to ensure quality and track contractor performance.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">How it works</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            From photos to consultation in under 24 hours
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            No phone tag, no waiting for callbacks, no getting bombarded by five different contractors.
            Submit once, get matched once.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="group p-6 rounded-xl bg-card border border-border/40 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-mono font-medium text-muted-foreground">{step.number}</span>
              </div>
              <h3 className="text-base font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
