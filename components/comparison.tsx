import { Check } from "lucide-react"

const features = [
  {
    title: "One assigned contractor",
    description: "Each request is matched to a single qualified contractor by trade and location.",
  },
  {
    title: "Budget set by the owner",
    description: "Property owners define their budget cap at submission, so expectations are clear from day one.",
  },
  {
    title: "Photos required at intake",
    description: "Project photos are submitted before a contractor is assigned, so the scope is documented and understood.",
  },
  {
    title: "Pre-confirmed availability",
    description: "Owners select their consultation windows upfront. Scheduling is confirmed before the first contact.",
  },
  {
    title: "Verified contractor network",
    description: "Every contractor is licensed, insured, and background-checked before joining the platform.",
  },
  {
    title: "Complete project record",
    description: "Costs, timelines, photos, and follow-up notes are stored automatically for every completed request.",
  },
]

export function Comparison() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">How it works</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            What every request includes
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every service request on Nexus Operations arrives with the information contractors and
            property owners need to move forward with confidence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border/40">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
