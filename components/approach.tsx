import { Card } from "@/components/ui/card"
import { TrendingUp, Clock, Target } from "lucide-react"

const approaches = [
  {
    icon: TrendingUp,
    title: "Product Sourcing Win",
    description:
      "Found specialized tech equipment at 18% below market rate in 24 hours, including verified specs and same-week delivery coordination.",
    metric: "18% savings",
  },
  {
    icon: Clock,
    title: "Service Coordination",
    description:
      "Coordinated emergency home repair with three competitive quotes, same-day scheduling, and full warranty documentation—completed in 48 hours.",
    metric: "48-hour turnaround",
  },
  {
    icon: Target,
    title: "Complete Project Solution",
    description:
      "Delivered a complete home office setup under $800 budget—desk, chair, lighting, and cable management—sourced, assembled, and ready to use.",
    metric: "Under budget",
  },
]

export function Approach() {
  return (
    <section id="approach" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block text-sm font-semibold tracking-wider text-muted-foreground mb-4 uppercase">
            Proven Results
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-6">Real work, real outcomes</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            These are actual examples from recent engagements—showing the speed, savings, and quality we deliver for
            every client. Your results will vary, but our commitment to excellence remains constant.
          </p>
        </div>
        {/* </CHANGE> */}

        <div className="grid md:grid-cols-3 gap-8">
          {approaches.map((item, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-border/50"
            >
              <div className="inline-flex p-3 rounded-lg bg-secondary/50 mb-6">
                <item.icon className="h-6 w-6 text-foreground" />
              </div>
              <div className="inline-block text-xs font-semibold tracking-wider text-foreground mb-3 uppercase bg-secondary/30 px-3 py-1 rounded-full">
                {item.metric}
              </div>
              <h3 className="text-2xl font-serif font-semibold mb-4 text-balance">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-[15px]">{item.description}</p>
            </Card>
          ))}
        </div>
        {/* </CHANGE> */}
      </div>
    </section>
  )
}
