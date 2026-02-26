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
                Operations coordination for property managers in Topeka, Kansas
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.1] tracking-tight mb-6">
              Nexus Operations introduces a managed maintenance workflow that supports day-to-day property operations.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-6">
              Our business operations manual defines how work is requested, assigned, documented, and reviewed. Property managers
              receive a clear process with service-level targets, contractor verification standards, and complete records for each
              request.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
              The mission is to provide dependable maintenance coordination through transparent communication, documented execution,
              and accountable follow-through. Our values center on clarity, reliability, professional conduct, and well-maintained
              documentation at every stage of service.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 mb-12">
              <Link
                href="/property-managers"
                className="btn-shimmer inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200"
              >
                Review Mission, Values, and Process
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/40 rounded-xl hover:border-border/70 hover:bg-secondary/50 transition-all duration-200"
              >
                Request an Operations Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
              {[
                { icon: Shield, text: "Verified contractor onboarding with license and insurance review" },
                { icon: Clock, text: "Documented response-time targets by priority level" },
                { icon: CheckCircle, text: "Complete records from request intake through completion" },
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
              <p className="text-xs text-muted-foreground mb-3">Operating targets from the business operations manual</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border border-border/40 rounded-lg p-3">
                  <span>Emergency</span>
                  <span className="text-primary font-semibold">1h assignment / 4h on-site</span>
                </div>
                <div className="flex items-center justify-between border border-border/40 rounded-lg p-3">
                  <span>Urgent</span>
                  <span className="text-primary font-semibold">4h assignment / next day</span>
                </div>
                <div className="flex items-center justify-between border border-border/40 rounded-lg p-3">
                  <span>Routine</span>
                  <span className="text-primary font-semibold">24h assignment / 3–5 days</span>
                </div>
              </div>
              <a href="#how-it-works" className="inline-flex items-center gap-2 mt-6 text-xs text-primary hover:underline">
                View service process details <ChevronDown className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
