"use client"

import Link from "next/link"
import { ArrowRight, Lock, CheckCircle2, Zap } from "lucide-react"
import { useState, useEffect } from "react"

const cyclingWords = ["Roofing", "Tree Removal", "Concrete", "Fencing", "HVAC", "Electrical"]

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % cyclingWords.length)
        setVisible(true)
      }, 280)
    }, 2600)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Ambient background — two soft orbs, no grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="animate-orb-1 absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.055]"
          style={{ background: "radial-gradient(circle at center, oklch(0.76 0.17 158), transparent 65%)" }}
        />
        <div
          className="animate-orb-2 absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle at center, oklch(0.70 0.15 85), transparent 65%)" }}
        />
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-border/30" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left — copy */}
          <div>
            {/* Status badge */}
            <div
              className="inline-flex items-center gap-2.5 mb-10 animate-fade-in-up"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              <span className="section-overline">Live in Topeka, KS — a better way to hire</span>
            </div>

            <h1
              className="text-[2.625rem] sm:text-5xl lg:text-[3.75rem] font-bold leading-[1.08] tracking-[-0.02em] mb-7 animate-fade-in-up"
              style={{ animationDelay: "0.12s", opacity: 0 }}
            >
              One{" "}
              <span
                className="inline-block gradient-text transition-all duration-280"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(6px)",
                }}
              >
                {cyclingWords[wordIndex]}
              </span>
              <span className="animate-cursor-blink text-primary/70 ml-0.5">|</span>
              {" "}contractor.
              <br />
              <span className="text-foreground/90">Exclusively yours.</span>
            </h1>

            <p
              className="text-[1.0625rem] text-muted-foreground leading-[1.75] max-w-[520px] mb-10 animate-fade-in-up"
              style={{ animationDelay: "0.22s", opacity: 0 }}
            >
              Most platforms sell your contact to five to seven contractors the moment you submit —
              and your phone rings within the hour. Nexus Operations runs on a different model:
              you set the scope, the budget ceiling, and the consultation window.
              One verified, insured professional claims your project. No bidding wars.
              No spam calls.
            </p>

            <div
              className="flex flex-col sm:flex-row items-start gap-3 mb-14 animate-fade-in-up"
              style={{ animationDelay: "0.32s", opacity: 0 }}
            >
              <Link
                href="/login?tab=signup"
                className="btn-shimmer inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] shadow-lg shadow-primary/15 tracking-tight"
              >
                Start Your Project — Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contractors"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-foreground/60 hover:text-foreground border border-border/35 rounded-md hover:border-border/60 hover:bg-secondary/40 transition-all duration-200"
              >
                Join as a Contractor
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div
              className="flex flex-col gap-3 text-sm text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: "0.42s", opacity: 0 }}
            >
              {[
                { icon: Lock, text: "You set the terms — scope, budget, schedule" },
                { icon: CheckCircle2, text: "One professional, committed exclusively to your project" },
                { icon: Zap, text: "Consultation confirmed within 24 hours of submission" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-[13px]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating project card */}
          <div
            className="hidden lg:flex justify-center items-center animate-fade-in-up"
            style={{ animationDelay: "0.38s", opacity: 0 }}
          >
            <div className="animate-float-slow">
              <div className="glass-card rounded-xl p-7 w-[370px] shadow-2xl shadow-black/50">
                {/* Card header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-1 tracking-wide uppercase font-medium">Exclusive lead claimed</p>
                    <p className="text-sm font-semibold leading-snug">Roofing — Full Shingle Replacement</p>
                  </div>
                  <span className="mt-0.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400 whitespace-nowrap">
                    Confirmed
                  </span>
                </div>

                {/* Lead details */}
                <div className="space-y-3.5 mb-6">
                  {[
                    { label: "Budget cap", value: "$8,500 maximum" },
                    { label: "Location", value: "NE Topeka, KS" },
                    { label: "Documentation", value: "9 photos · written scope" },
                    { label: "Consultation", value: "Sat, 10–11am — confirmed" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-[13px] text-muted-foreground">{label}</span>
                      <span className="text-[13px] font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Exclusivity notice */}
                <div className="mb-6 px-3.5 py-3 rounded-lg bg-primary/[0.07] border border-primary/15">
                  <div className="flex items-center gap-2 text-[12px] text-primary font-medium">
                    <Lock className="h-3 w-3 shrink-0" />
                    Locked to one contractor. No one else can claim it.
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-4 border-t border-border/30">
                  <span>Posted 6 minutes ago</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                    </span>
                    Claimed exclusively
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
