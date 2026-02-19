"use client"

import Link from "next/link"
import { ArrowRight, Building2, CalendarClock, Home, Layers, RotateCcw, ClipboardList } from "lucide-react"
import { useEffect, useRef } from "react"

const audiences = [
  {
    icon: Building2,
    tag: "Property managers",
    headline: "Run a portfolio, not a spreadsheet.",
    description:
      "Track maintenance across every unit. Dispatch verified vendors in minutes. See cost history by property, by category, by month — not buried in email threads. Your tenants stop calling you because things actually get fixed.",
    bullets: [
      "Multi-property work order dispatch",
      "Per-unit cost and vendor history",
      "Tenant communication built in",
      "Recurring task automation",
    ],
    cta: "Explore for property managers",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    cardBorder: "hover:border-primary/40",
  },
  {
    icon: CalendarClock,
    tag: "Airbnb & STR hosts",
    headline: "Every turnover on time. Every vendor on call.",
    description:
      "Your listing's reviews live or die on the condition of the property. Automate cleaner dispatch on checkout, schedule preventive maintenance between bookings, and keep a trusted bench of local vendors who know your property.",
    bullets: [
      "Auto-dispatch cleaners on checkout",
      "Maintenance between bookings",
      "Trusted vendor bench per property",
      "Service history for every stay",
    ],
    cta: "Explore for STR hosts",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    cardBorder: "hover:border-amber-400/40",
  },
  {
    icon: Home,
    tag: "Homeowners",
    headline: "Own your home without it owning you.",
    description:
      "Whether it's a leaky roof, a seasonal HVAC service, or a full renovation — coordinate it all from one place. No bidding chaos, no spam calls. One verified professional, your schedule, your budget.",
    bullets: [
      "Single request, one committed contractor",
      "Seasonal maintenance reminders",
      "Full project cost history",
      "Budget control before anyone is contacted",
    ],
    cta: "Explore for homeowners",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    cardBorder: "hover:border-emerald-400/40",
  },
]

const platformCapabilities = [
  { icon: ClipboardList, label: "Work order management" },
  { icon: Layers, label: "Multi-property view" },
  { icon: RotateCcw, label: "Recurring task automation" },
  { icon: Building2, label: "Verified vendor network" },
]

export function SubmitCTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((node, i) => {
            setTimeout(() => node.classList.add("in-view"), i * 100)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="submit" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span className="text-primary text-xs font-medium">Built for how you actually operate</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            Tell us how you use your property.
            <br />
            <span className="gradient-text">We&apos;ll show you what that looks like here.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Nexus Operations adapts to your context — from single-family homeowners to full property management
            companies. The platform and vendor network work the same way; how you use it is up to you.
          </p>
        </div>

        {/* Audience cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-14">
          {audiences.map((a, i) => (
            <div
              key={a.tag}
              className={`reveal flex flex-col rounded-2xl border border-border/40 bg-card p-7 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-black/20 ${a.cardBorder}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Icon + tag */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center flex-shrink-0`}>
                  <a.icon className={`h-5 w-5 ${a.color}`} />
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wide ${a.color}`}>{a.tag}</span>
              </div>

              <h3 className="text-lg font-semibold mb-3 leading-snug">{a.headline}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{a.description}</p>

              {/* Bullets */}
              <ul className="space-y-2 mb-7">
                {a.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <div className={`w-1.5 h-1.5 rounded-full ${a.bg} border ${a.border} flex-shrink-0`}>
                      <div className={`w-full h-full rounded-full ${a.color.replace("text-", "bg-")}`} />
                    </div>
                    {b}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/login?tab=signup"
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border ${a.border} ${a.bg} ${a.color} hover:opacity-80 transition-all duration-200`}
              >
                {a.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Platform capabilities strip */}
        <div className="reveal rounded-2xl border border-border/40 bg-card/50 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold mb-1">One platform. Any scale.</p>
              <p className="text-xs text-muted-foreground">Start with one property, expand to an entire portfolio.</p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-3">
              {platformCapabilities.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/30">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            <Link
              href="/login"
              className="btn-shimmer inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-primary/20 flex-shrink-0"
            >
              Try the dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
