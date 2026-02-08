const stats = [
  { value: "$600B", label: "U.S. home services market annually" },
  { value: "1", label: "Contractor per request, not 5-7" },
  { value: "0", label: "Cost to homeowners, always free" },
  { value: "24hr", label: "Average time from request to consultation" },
]

export function Stats() {
  return (
    <section className="py-16 border-y border-border/40 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <div className="text-3xl lg:text-4xl font-semibold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
