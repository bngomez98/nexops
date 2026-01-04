import { Card } from "@/components/ui/card"
import { Clock, Shield, Target, Award } from "lucide-react"

const values = [
  {
    icon: Clock,
    title: "Fast",
    subtitle: "Response Times",
    description: "Same-day replies and rapid project turnaround",
    color: "primary",
  },
  {
    icon: Target,
    title: "Clear",
    subtitle: "Communication",
    description: "Transparent pricing and realistic expectations",
    color: "accent",
  },
  {
    icon: Shield,
    title: "Reliable",
    subtitle: "Results",
    description: "Quality guarantees backed by our service promise",
    color: "chart-3",
  },
  {
    icon: Award,
    title: "Expert",
    subtitle: "Execution",
    description: "Professional standards on every engagement",
    color: "chart-5",
  },
]

export function About() {
  return (
    <section id="about" className="py-28 md:py-36 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-bold tracking-wider text-primary mb-6 uppercase border border-primary/20">
              <Award className="h-4 w-4" />
              About Nexus Operations
            </div>
            {/* </CHANGE> */}
            <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Built on <span className="text-primary">expertise</span>, not algorithms
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
              <strong className="text-foreground">Nexus Operations delivers results</strong> through professional
              execution, not automated workflows. Every request is handled by a real expert who understands quality,
              values your time, and commits to transparent outcomes.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
              We specialize in product sourcing, service coordination, and project management for individuals who need
              reliable support without the overhead of platforms, subscriptions, or hidden fees.
            </p>
            <p className="text-foreground font-semibold text-lg border-l-4 border-primary pl-6 py-2 bg-primary/5">
              Our mission: Handle the work you don't have time for, with speed, clarity, and guaranteed results.
            </p>
            {/* </CHANGE> */}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-card border-border/50 relative overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-${value.color}/5 opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative">
                  <div
                    className={`inline-flex p-4 rounded-xl bg-${value.color}/10 border border-${value.color}/20 mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <value.icon className={`h-8 w-8 text-${value.color}`} />
                  </div>
                  <div className="text-4xl font-serif font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {value.title}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4 font-bold">
                    {value.subtitle}
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{value.description}</div>
                </div>
              </Card>
            ))}
          </div>
          {/* </CHANGE> */}
        </div>
      </div>
    </section>
  )
}
