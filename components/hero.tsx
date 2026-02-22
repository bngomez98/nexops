"use client"

import Link from "next/link"
import { ArrowRight, ChevronDown, Users, Network, BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"

const cyclingWords = ["Coordination", "Operations", "Vendor Management", "Workflows", "Relationships"]

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
              <span className="text-primary text-xs font-medium tracking-wide">
                Early access open &mdash; launching 2026
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.1] tracking-tight mb-6 animate-fade-in-up"
              style={{ animationDelay: "0.15s", opacity: 0 }}
            >
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
              <br />
              <span className="gradient-text">built on relationship.</span>
              <br />
              <span className="text-foreground/70">For property managers.</span>
            </h1>

            <p
              className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10 animate-fade-in-up"
              style={{ animationDelay: "0.25s", opacity: 0 }}
            >
              NexOps is a consulting agency and SaaS platform for property management companies.
              We coordinate your vendor relationships, document your workflows, and serve as your
              dedicated operations partner.
            </p>

            <div
              className="flex flex-col sm:flex-row items-start gap-3 mb-12 animate-fade-in-up"
              style={{ animationDelay: "0.35s", opacity: 0 }}
            >
              <Link
                href="/contact"
                className="btn-shimmer inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                Request Early Access
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/40 rounded-xl hover:border-border/70 hover:bg-secondary/50 transition-all duration-200"
              >
                How It Works
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Value indicators */}
            <div
              className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: "0.45s", opacity: 0 }}
            >
              {[
                { icon: Users, text: "Relationship-based operations management" },
                { icon: Network, text: "Vendor coordination and workflow documentation" },
                { icon: BarChart3, text: "Consulting available now — platform launching 2026" },
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
                    <p className="text-xs text-muted-foreground mb-0.5">Operations overview</p>
                    <p className="text-sm font-semibold">Greenbrook Property Group</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-medium text-primary">
                    Active
                  </span>
                </div>

                {/* Metrics */}
                <div className="space-y-3 mb-5">
                  {[
                    { label: "Properties under management", value: "47 units" },
                    { label: "Active vendor relationships", value: "23 vendors" },
                    { label: "Open workflows", value: "8 in progress" },
                    { label: "Next coordination review", value: "Thu, 9–10am" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Relationship note */}
                <div className="mb-5 p-3 rounded-xl bg-primary/5 border border-primary/15">
                  <div className="flex items-center gap-2 text-xs text-primary font-medium">
                    <Users className="h-3 w-3" />
                    All vendor relationships coordinated through one dedicated NexOps partner.
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Engagement started Q1 2025</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                    </span>
                    Operations coordinated
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
