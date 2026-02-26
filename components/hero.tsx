"use client"

import Link from "next/link"
import { ArrowRight, ChevronDown, Shield, Clock, CheckCircle } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="animate-orb-1 absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)",
          }}
        />
        <div
          className="animate-orb-2 absolute bottom-1/3 right-1/6 w-[350px] h-[350px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, oklch(0.70 0.15 85), transparent 70%)",
          }}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-border/40" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <span className="text-primary text-xs font-medium tracking-wide">
                Topeka pilot program: $50–$100 flat request fee for first 30–60 days
                Commercial maintenance coordination for Topeka property managers
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.1] tracking-tight mb-6">
              Guaranteed contractor response.
              <br />
              <span className="gradient-text">Zero vendor chasing.</span>
            </h1>

              <span className="gradient-text">Exclusively yours.</span>
              <br />
              <span className="text-foreground/70">No shared leads. No competing bids.</span>
            </h1>

            <p
              className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10 animate-fade-in-up"
              style={{ animationDelay: "0.25s", opacity: 0 }}
            >
              Nexus Operations matches homeowners with one licensed, insured contractor per project —
              not a list. You submit once with photos, a written scope, and a real budget ceiling. One
              verified contractor in your area claims it exclusively before your phone rings. They arrive
              at your consultation already knowing the scope. You already know who&apos;s coming. That&apos;s
              what it means to hire with confidence.
              <span className="gradient-text">Zero vendor chasing.</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
              Nexus Operations coordinates verified contractors across emergency, urgent, and
              routine maintenance requests, with automated backup assignment when a vendor declines.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 mb-12">
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

            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
              {[
                { icon: Shield, text: "Licensed, insured, and re-verified contractor network" },
                { icon: Clock, text: "Emergency assignment in 1 hour" },
                { icon: CheckCircle, text: "Pilot pricing: $50–$100 flat fee per project/job request" },
                { icon: CheckCircle, text: "Cost-plus pricing with 25–35% markup" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="glass-card rounded-2xl p-6 w-[360px] shadow-2xl shadow-black/40">
              <p className="text-xs text-muted-foreground mb-3">Response SLA snapshot</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border border-border/40 rounded-lg p-3">
                  <span>Emergency</span>
                  <span className="text-primary font-semibold">1h assign / 4h on-site</span>
                </div>
                <div className="flex items-center justify-between border border-border/40 rounded-lg p-3">
                  <span>Urgent</span>
                  <span className="text-primary font-semibold">4h assign / next day</span>
                </div>
                <div className="flex items-center justify-between border border-border/40 rounded-lg p-3">
                </div>
                <div className="flex items-center justify-between border border-border/40 rounded-lg p-3">
                  <span>Urgent</span>
                  <span className="text-primary font-semibold">4h assign / next day</span>
                </div>
                <div className="flex items-center justify-between border border-border/40 rounded-lg p-3">
                  <span>Routine</span>
                  <span className="text-primary font-semibold">24h assign / 3–5 days</span>
                </div>
              </div>
              <a href="#how-it-works" className="inline-flex items-center gap-2 mt-6 text-xs text-primary hover:underline">
                Explore workflow details <ChevronDown className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
