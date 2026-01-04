import { Card } from "@/components/ui/card"
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
    <section id="how-it-works" className="py-28 md:py-36 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-bold tracking-wider text-primary mb-6 uppercase border border-primary/20">
            <ClipboardList className="h-4 w-4" />
            Our Process
          </div>
          <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8">
            Simple, <span className="text-primary">predictable</span> process
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Four straightforward steps from initial request to documented delivery. No surprises, no hassle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card
              key={step.number}
              className="p-8 hover:shadow-xl transition-all duration-300 bg-card border-border/50 relative"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 shadow-lg inline-flex">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <span className="text-5xl font-serif font-light text-muted-foreground/10 absolute top-6 right-6">
                  {step.number}
                </span>
                <h3 className="text-xl font-serif font-bold mb-4 text-balance">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
