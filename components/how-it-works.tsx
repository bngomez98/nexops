import { ClipboardList, Search, FileCheck, PackageCheck } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Tell Us What You Need",
    description:
      "Submit your request through our intake form or email. Be as specific or general as you like—we'll ask clarifying questions to ensure we understand exactly what you're looking for.",
  },
  {
    icon: Search,
    number: "02",
    title: "We Research & Plan",
    description:
      "Our team researches options, compares vendors, gets quotes, and builds a detailed plan. You receive a clear proposal with costs, timeline, and our recommended approach before any work begins.",
  },
  {
    icon: FileCheck,
    number: "03",
    title: "You Approve, We Execute",
    description:
      "Once you approve the plan, we handle everything: purchases, scheduling, coordination, quality checks, and progress updates. You stay informed without having to manage the details.",
  },
  {
    icon: PackageCheck,
    number: "04",
    title: "Delivered & Documented",
    description:
      "We deliver completed work with full documentation: receipts, warranty info, vendor contacts, and outcome summary. Everything organized and ready for your records.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 md:py-40 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-accent mb-8">
            <ClipboardList className="h-4 w-4" />
            How It Works
          </div>
          <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light leading-[0.9] mb-10 max-w-4xl">
            Simple.
            <br />
            <span className="text-accent">Transparent.</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Four clear steps from your initial request to complete delivery. No hidden processes, no surprises.
          </p>
        </div>
        <div className="grid lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative p-8 bg-card/30 hover:bg-card border border-border/30 hover:border-primary/50 rounded-2xl transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="mb-8">
                  <div className="inline-flex p-4 rounded-2xl bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors glow-primary">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <span className="text-6xl font-serif font-light text-border/20 mb-4">{step.number}</span>
                <h3 className="text-2xl font-light mb-4 text-balance leading-tight">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
