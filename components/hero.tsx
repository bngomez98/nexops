"use client"

import Link from "next/link"
import { ArrowRight, ChevronDown, CheckCircle2, Lock, Zap } from "lucide-react"
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
      }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Animated background orbs */}
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
        <div
          className="absolute top-1/2 left-1/3 w-[250px] h-[250px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, oklch(0.60 0.15 285), transparent 70%)",
            animation: "orb-drift-2 20s ease-in-out infinite",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.75 0.18 155) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.18 155) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-border/40" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-primary text-xs font-medium tracking-wide">Now serving Topeka, KS &mdash; one project, one professional</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.1] tracking-tight mb-6 animate-fade-in-up"
              style={{ animationDelay: "0.15s", opacity: 0 }}
            >
              One{" "}
              <span
                className="inline-block transition-all duration-300"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(8px)",
                }}
              >
                {cyclingWords[wordIndex]}
              </span>
              <span className="animate-cursor-blink text-primary ml-1">|</span>
              {" "}contractor.
              <br />
              <span className="gradient-text">Exclusively yours.</span>
              <br />
              <span className="text-foreground/70">That&apos;s the whole system.</span>
            </h1>

            <p
              className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10 animate-fade-in-up"
              style={{ animationDelay: "0.25s", opacity: 0 }}
            >
              Submit your project once. One licensed contractor claims it. They know your scope before arriving.
              You know who's coming. No spam calls. No competing bids. That's confidence.
            </p>

            <div
              className="flex flex-col sm:flex-row items-start gap-3 mb-12 animate-fade-in-up"
              style={{ animationDelay: "0.35s", opacity: 0 }}
            >
              <Link
                href="/login?tab=signup"
                className="btn-shimmer inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                Start Your Project — Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contractors"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/40 rounded-xl hover:border-border/70 hover:bg-secondary/50 transition-all duration-200"
              >
                I&apos;m a contractor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div
              className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: "0.45s", opacity: 0 }}
            >
              {[
                { icon: Lock, text: "Your project is never sold or shared with a list" },
                { icon: CheckCircle2, text: "Every contractor is licensed, insured, and verified" },
                { icon: Zap, text: "Consultation confirmed within 24 hours — on your schedule" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating UI card */}
          <div
            className="hidden lg:flex justify-center items-center animate-fade-in-up"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            <div className="animate-float-slow">
              <div className="glass-card rounded-2xl p-6 w-[360px] shadow-2xl shadow-black/40">
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Exclusive project claimed</p>
                    <p className="text-sm font-semibold">Roofing — Full Shingle Replacement</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
                    Confirmed
                  </span>
                </div>

                {/* Lead details */}
                <div className="space-y-3 mb-5">
                  {[
                    { label: "Budget cap", value: "$8,500 maximum" },
                    { label: "Location", value: "NE Topeka, KS" },
                    { label: "Documentation", value: "9 photos · written scope" },
                    { label: "Consultation", value: "Sat, 10–11am — confirmed" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Exclusivity bar */}
                <div className="mb-5 p-3 rounded-xl bg-primary/5 border border-primary/15">
                  <div className="flex items-center gap-2 text-xs text-primary font-medium">
                    <Lock className="h-3 w-3" />
                    This project is locked to one contractor. No one else can claim it.
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Posted 6 minutes ago</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: "1s", opacity: 0 }}>
          <span className="text-[11px] text-muted-foreground tracking-wide uppercase">Scroll</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground animate-float" />
        </div>
      </div>
    </section>
  )
}
