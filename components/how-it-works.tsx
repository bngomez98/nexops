"use client"

import { useState, useEffect, useRef } from "react"
import {
  Upload,
  Lock,
  CalendarCheck,
  ClipboardList,
  CheckCircle,
} from "lucide-react"

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Initial consultation",
    detail: "A 45-minute conversation about your portfolio, your current vendor setup, and where coordination is costing your team the most time. No forms, no intake questionnaires — just a direct conversation.",
    title: "Submit your project",
    detail: "Upload photos, describe the work needed, set a budget cap, and choose your preferred consultation windows.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    accent: "oklch(0.75 0.18 155)",
  },
  {
    icon: Lock,
    number: "02",
    title: "One contractor claims it exclusively",
    detail: "A licensed, insured local contractor reviews and claims your project — permanently removing it from every other contractor's feed.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    accent: "oklch(0.82 0.17 85)",
  },
  {
    icon: CalendarCheck,
    number: "03",
    title: "Consultation is confirmed",
    detail: "An appointment is scheduled and confirmed within 24 hours. The contractor has access to all project details — photos, scope, and budget — in advance.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    accent: "oklch(0.70 0.15 300)",
  },
  {
    icon: ClipboardList,
    number: "04",
    title: "Platform access at launch",
    detail: "When the NexOps SaaS platform launches in 2026, your team gets early access to the tools built from your actual workflows — not a generic template applied to your business.",
    title: "Review the estimate and decide",
    detail: "The contractor delivers a written estimate. Review the scope and timeline, then decide — no obligation if it doesn't meet your expectations.",
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
        {/* Icon + number */}
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

        {/* Bottom accent bar */}
        <div
          className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full transition-all duration-300"
          style={{
            background: step.accent,
            opacity: isActive ? 0.6 : 0,
          }}
        />
      </div>

      {/* Arrow connector (desktop, non-last) */}
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
      {/* Ambient background */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-14 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">How it works</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3">
            From submission to confirmed consultation
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            From submission to confirmed consultation in as little as 24 hours. Submit your
            project once — the platform assigns it to a single verified contractor.
          </p>
        </div>

        {/* Connecting timeline line (desktop) */}
        <div className="relative">
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px">
            <div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(to right, oklch(0.75 0.18 155 / 0.2), oklch(0.75 0.18 155 / 0.4), oklch(0.75 0.18 155 / 0.2))",
                transform: inView ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 1.2s ease 0.4s",
              }}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <StepCard
                key={step.number}
                step={step}
                index={i}
                activeStep={activeStep}
                onHover={setActiveStep}
              />
            ))}
          </div>
        </div>

        {/* Bottom callout */}
        <div className="mt-12 reveal">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15 max-w-2xl">
            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Free for property owners.</span>{" "}
              Nexus Operations charges contractors a monthly membership &mdash; not homeowners, not per-lead fees.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
