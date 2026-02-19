"use client"

import Link from "next/link"
import { ArrowRight, ChevronDown, Settings2, Building2, CalendarClock, Wrench } from "lucide-react"
import { useState, useEffect } from "react"

const cyclingWords = ["Rentals", "Airbnbs", "Portfolios", "HOAs", "Vacation Homes", "Commercial"]

const upcomingTasks = [
  { label: "HVAC Filter Replacement", property: "Unit 4B", due: "Due in 3 days", urgent: true },
  { label: "Roof Inspection", property: "12 Oak St", due: "Due in 8 days", urgent: false },
  { label: "Turnover Clean", property: "Airbnb — Maple Ave", due: "Tonight 5pm", urgent: true },
]

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
              <span className="text-primary text-xs font-medium tracking-wide">Vendor &amp; maintenance automation for properties</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.1] tracking-tight mb-6 animate-fade-in-up"
              style={{ animationDelay: "0.15s", opacity: 0 }}
            >
              Run your{" "}
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
              <span className="gradient-text">like a system.</span>
              <br />
              <span className="text-foreground/70">Not a to-do list.</span>
            </h1>

            <p
              className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10 animate-fade-in-up"
              style={{ animationDelay: "0.25s", opacity: 0 }}
            >
              Property management is vendor management. Nexus Operations connects you to verified,
              accountable service contractors — and automates the coordination: work orders, schedules,
              costs, and history across every property you own or manage.
              Whether you have one home or a hundred units, your maintenance runs itself.
            </p>

            <div
              className="flex flex-col sm:flex-row items-start gap-3 mb-12 animate-fade-in-up"
              style={{ animationDelay: "0.35s", opacity: 0 }}
            >
              <Link
                href="/login?tab=signup"
                className="btn-shimmer inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                Get started — it&apos;s free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/40 rounded-xl hover:border-border/70 hover:bg-secondary/50 transition-all duration-200"
              >
                Try the demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Audience trust indicators */}
            <div
              className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: "0.45s", opacity: 0 }}
            >
              {[
                { icon: Building2, text: "Property managers" },
                { icon: CalendarClock, text: "Airbnb & STR hosts" },
                { icon: Wrench, text: "Homeowners with projects" },
                { icon: Settings2, text: "HOAs & commercial" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — maintenance dashboard card */}
          <div
            className="hidden lg:flex justify-center items-center animate-fade-in-up"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            <div className="animate-float-slow">
              <div className="glass-card rounded-2xl p-6 w-[380px] shadow-2xl shadow-black/40">
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Property Operations</p>
                    <p className="text-sm font-semibold">Upcoming maintenance</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-medium text-primary">
                    3 active
                  </span>
                </div>

                {/* Task list */}
                <div className="space-y-2.5 mb-5">
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.label}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                        task.urgent
                          ? "bg-amber-500/8 border-amber-500/25"
                          : "bg-secondary/40 border-border/30"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.urgent ? "bg-amber-400" : "bg-primary"}`} />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">{task.label}</p>
                          <p className="text-[10px] text-muted-foreground">{task.property}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-medium flex-shrink-0 ml-2 ${task.urgent ? "text-amber-400" : "text-muted-foreground"}`}>
                        {task.due}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Vendor network row */}
                <div className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/15">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-primary font-medium">
                      <Settings2 className="h-3 w-3" />
                      Vendor network
                    </div>
                    <span className="text-[11px] text-primary font-semibold">8 trusted</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">All verified, licensed, and insured</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>4 properties managed</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                    </span>
                    All systems active
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
