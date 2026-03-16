import { ShieldCheck, Zap, MessageSquare, CreditCard, TrendingUp, Headphones } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "Verified contractors",
    description: "Every contractor is background-checked, licensed, and insured before joining the platform.",
  },
  {
    icon: Zap,
    title: "Fast matching",
    description: "Get connected with the right contractor for your project within hours, not days.",
  },
  {
    icon: MessageSquare,
    title: "Direct communication",
    description: "Message contractors directly through the platform. Keep everything in one place.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    description: "Your payment is held safely until you confirm the work is completed to your standards.",
  },
  {
    icon: TrendingUp,
    title: "Transparent pricing",
    description: "No hidden fees. Compare quotes side-by-side and choose what works for your budget.",
  },
  {
    icon: Headphones,
    title: "Dedicated support",
    description: "Our team is here to help resolve any issues and ensure your project goes smoothly.",
  },
]

export function Features() {
  return (
    <section className="border-y border-border bg-card/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for peace of mind
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to hire with confidence and get quality results.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
