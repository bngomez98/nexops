"use client"

import Link from "next/link"
import { ArrowRight, ChevronDown, Shield, Clock3, CheckCircle2, Building2, BadgeCheck } from "lucide-react"

const trustPoints = [
  { icon: Shield, text: "Licensed and insured contractor network" },
  { icon: Clock3, text: "Emergency assignments in as little as 1 hour" },
  { icon: BadgeCheck, text: "Single-contractor matching with no shared leads" },
  { icon: CheckCircle2, text: "Documented scope, photos, and budget before dispatch" },
]

const slaRows = [
  { priority: "Emergency", response: "1h assign / 4h on-site" },
  { priority: "Urgent", response: "4h assign / next business day" },
  { priority: "Routine", response: "24h assign / 3–5 business days" },
]

export function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="animate-orb-1 absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)" }}
        />
        <div
          className="animate-orb-2 absolute bottom-1/3 right-1/6 w-[350px] h-[350px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, oklch(0.70 0.15 85), transparent 70%)" }}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-border/40" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-7">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-primary text-xs font-medium tracking-wide">
                Topeka pilot: $50–$100 request fee for first 30–60 days
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.1] tracking-tight mb-5">
              Guaranteed contractor response.
              <br />
              <span className="gradient-text">Professional coordination from request to completion.</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-9">
              Nexus Operations gives property owners and managers a structured maintenance workflow: one verified contractor per
              request, complete project documentation up front, and clear service-level timelines for emergency, urgent, and
              routine work.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 mb-10">
              <Link
                href="/property-managers"
                className="btn-shimmer inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200"
              >
                See the Operations Model
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/40 rounded-xl hover:border-border/70 hover:bg-secondary/50 transition-all duration-200"
              >
                Request a 30-Day Pilot
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              {trustPoints.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2.5 rounded-lg border border-border/40 bg-card/40 px-3.5 py-3">
                  <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="glass-card rounded-2xl p-6 w-[380px] shadow-2xl shadow-black/40 border border-border/40">
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-[0.16em]">Service delivery snapshot</p>
              <div className="space-y-3 text-sm mb-5">
                {slaRows.map((row) => (
                  <div key={row.priority} className="flex items-center justify-between border border-border/40 rounded-lg p-3">
                    <span>{row.priority}</span>
                    <span className="text-primary font-semibold">{row.response}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-secondary/60 border border-border/40 p-3.5">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every project includes photos, written scope confirmation, and budget ceiling validation before contractor
                  assignment.
                </p>
              </div>

              <a href="#how-it-works" className="inline-flex items-center gap-2 mt-5 text-xs text-primary hover:underline">
                Explore workflow details <ChevronDown className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
