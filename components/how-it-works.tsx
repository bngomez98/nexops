"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, ClipboardList, Network, Monitor, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Discovery call",
    detail:
      "We run a focused 45-minute call with your leadership team to map your portfolio, current vendor setup, and your most expensive coordination bottlenecks.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    accent: "oklch(0.75 0.18 155)",
  },
  {
    icon: ClipboardList,
    number: "02",
    title: "Operations assessment",
    detail:
      "Within two weeks, we document your current workflows and hand you a written operations plan with priorities, owners, and execution timelines.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    accent: "oklch(0.82 0.17 85)",
  },
  {
    icon: Network,
    number: "03",
    title: "Hands-on coordination",
    detail:
      "A dedicated NexOps operator coordinates vendors, scheduling, scope follow-through, and communication so your property team can stay focused on residents and assets.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    accent: "oklch(0.70 0.15 300)",
  },
  {
    icon: Monitor,
    number: "04",
    title: "Platform rollout",
    detail:
      "When the NexOps platform launches in 2026, your team starts with workflows already built around your real operating model, not a generic template.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    accent: "oklch(0.72 0.17 160)",
  },
]

function StepCard({
  step,
  index,
  activeStep,
  onHover,
}: {
  step: (typeof steps)[number]
  index: number
  activeStep: number | null
  onHover: (i: number | null) => void
}) {
  const isActive = activeStep === index

  return (
    <div
      className="reveal group relative"
      style={{ transitionDelay: `${index * 130}ms` }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className="relative p-6 rounded-2xl border bg-card transition-all duration-300 cursor-default h-full"
        style={
          isActive
            ? { borderColor: `${step.accent}55`, boxShadow: `0 8px 30px oklch(0 0 0 / 0.3)` }
            : { borderColor: "oklch(0.25 0.01 240 / 0.4)" }
        }
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-xl ${step.bg} border ${step.border} transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
          >
            <step.icon className={`h-5 w-5 ${step.color}`} />
          </div>
          <span className="text-2xl font-bold font-mono text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors">
            {step.number}
          </span>
        </div>

        <h3 className="text-base font-semibold mb-2 leading-snug">{step.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{step.detail}</p>

        <div
          className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full transition-all duration-300"
          style={{
            background: step.accent,
            opacity: isActive ? 0.6 : 0,
          }}
        />
      </div>

      {index < 3 && (
        <div className="hidden lg:flex absolute -right-3 top-[52px] z-10 items-center justify-center w-6 h-6 rounded-full bg-background border border-border/40">
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-muted-foreground/40">
            <path
              d="M3 2L7 5L3 8"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          el.querySelectorAll(".reveal").forEach((node, i) => {
            setTimeout(() => node.classList.add("in-view"), i * 130)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden">
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-14 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">How we work</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3">
            Clear process. Direct ownership. Measurable operations support.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We are not a software-only product. We are an operations partner that documents your process,
            coordinates your vendors, and then gives your team software built around how you actually work.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px">
            <div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(to right, oklch(0.75 0.18 155 / 0.2), oklch(0.75 0.18 155 / 0.4), oklch(0.75 0.18 155 / 0.2))",
                transform: inView ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 1.2s ease 0.4s",
              }}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} activeStep={activeStep} onHover={setActiveStep} />
            ))}
          </div>
        </div>

        <div className="mt-12 reveal">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15 max-w-3xl">
            <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">What we deliver:</span> documented workflows,
              vendor accountability, recurring operations reviews, and executive reporting your team can act on.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
