import { Quote, TrendingUp, Clock3, ShieldCheck } from "lucide-react"

const testimonials = [
  {
    name: "R. Alvarez",
    company: "Alvarez Roofing",
    quote:
      "We stopped wasting time on incomplete leads. By the time we claim, we already know the scope and budget range.",
    metric: "+31% quote acceptance",
  },
  {
    name: "K. Turner",
    company: "Turner Concrete",
    quote:
      "Exclusive assignment changed the whole workflow. We now focus on execution instead of racing competitors.",
    metric: "-42% non-billable pre-sales time",
  },
  {
    name: "S. Morgan",
    company: "Morgan Property Services",
    quote:
      "Our consult scheduling stabilized because the request quality is consistent and expectations are clear from day one.",
    metric: "24h average consult confirmation",
  },
]

const outcomes = [
  { icon: TrendingUp, label: "Higher conversion", value: "Exclusive assignment improves close rate consistency." },
  { icon: Clock3, label: "Faster response", value: "Defined SLAs move projects from intake to consultation quickly." },
  { icon: ShieldCheck, label: "Lower risk", value: "Credential checks and documentation reduce vendor-quality variance." },
]

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Performance signals</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">What teams report after moving to structured assignment</h2>
          <p className="text-muted-foreground leading-relaxed">
            Feedback from contractors and property teams consistently points to cleaner intake, better scheduling, and less operational churn.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {testimonials.map((t) => (
            <article key={t.name} className="flex flex-col p-6 rounded-2xl border border-border/40 bg-card hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 mb-5">
                <Quote className="h-4 w-4 text-primary" />
              </div>
              <blockquote className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">&ldquo;{t.quote}&rdquo;</blockquote>
              <p className="text-xs font-semibold text-primary mb-3">{t.metric}</p>
              <div className="border-t border-border/30 pt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.company}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {outcomes.map((item) => (
            <div key={item.label} className="rounded-xl border border-border/40 bg-background/40 p-4">
              <item.icon className="h-4 w-4 text-primary mb-2" />
              <p className="text-sm font-semibold mb-1">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
