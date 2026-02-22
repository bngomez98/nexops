"use client"

import { useState, useEffect, useRef } from "react"
import {
  Camera,
  MousePointerClick,
  CalendarCheck,
  Star,
  Briefcase,
  Bell,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react"

// ─── Homeowner process ────────────────────────────────────────────────────────

const homeownerSteps = [
  {
    icon: Camera,
    number: "01",
    title: "Document your project",
    detail: "Photos, written description, budget range, and preferred consultation windows. One submission — no repeat calls.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    accent: "oklch(0.75 0.18 155)",
  },
  {
    icon: MousePointerClick,
    number: "02",
    title: "One contractor claims it",
    detail: "A licensed, insured professional in your area claims your project exclusively. It drops off all other feeds the instant it's claimed.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    accent: "oklch(0.82 0.17 85)",
  },
  {
    icon: CalendarCheck,
    number: "03",
    title: "Consultation within 24 hours",
    detail: "You receive a confirmed appointment time. The contractor arrives already briefed on scope, budget, and photos — no discovery call needed.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    accent: "oklch(0.70 0.15 300)",
  },
  {
    icon: Star,
    number: "04",
    title: "Review the estimate, decide freely",
    detail: "A written estimate lands in your inbox. Accept, decline, or ask questions — with zero pressure and no obligation to proceed.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    accent: "oklch(0.72 0.17 160)",
  },
]

// ─── Contractor process ───────────────────────────────────────────────────────

const contractorSteps = [
  {
    icon: Briefcase,
    number: "01",
    title: "Choose a membership tier",
    detail: "Standard gets real-time feed access. Premium unlocks a 60-second advance window. Elite sees $5K+ projects 5 minutes before everyone else.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    accent: "oklch(0.75 0.18 155)",
  },
  {
    icon: Bell,
    number: "02",
    title: "Receive qualified project alerts",
    detail: "Every alert includes photos, a written description, a defined budget range, and a consultation window. You know the scope before you claim.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    accent: "oklch(0.82 0.17 85)",
  },
  {
    icon: MousePointerClick,
    number: "03",
    title: "Claim it — exclusively",
    detail: "One tap locks the project to your account. It disappears from every other contractor's feed permanently. No split leads, no bidding.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    accent: "oklch(0.70 0.15 300)",
  },
  {
    icon: ClipboardCheck,
    number: "04",
    title: "Arrive prepared, close efficiently",
    detail: "You've seen the job before the consultation. Deliver a written estimate on-site and convert at a higher rate with less back-and-forth.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    accent: "oklch(0.72 0.17 160)",
  },
]

// ─── Step card ────────────────────────────────────────────────────────────────

function StepCard({
  step,
  index,
  activeStep,
  onHover,
}: {
  step: (typeof homeownerSteps)[number]
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

// ─── Main section ─────────────────────────────────────────────────────────────

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [inView, setInView] = useState(false)
  const [perspective, setPerspective] = useState<"homeowner" | "contractor">("homeowner")

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

  // Re-trigger reveal animations when the perspective switches
  useEffect(() => {
    const el = sectionRef.current
    if (!el || !inView) return
    el.querySelectorAll(".reveal").forEach((node) => node.classList.remove("in-view"))
    const timeout = setTimeout(() => {
      el.querySelectorAll(".reveal").forEach((node, i) => {
        setTimeout(() => node.classList.add("in-view"), i * 100)
      })
    }, 50)
    return () => clearTimeout(timeout)
  }, [perspective, inView])

  const steps = perspective === "homeowner" ? homeownerSteps : contractorSteps

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Ambient background */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 reveal">
          <div className="max-w-xl">
            <p className="text-primary text-sm font-medium tracking-wide mb-3">How it works</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3">
              {perspective === "homeowner"
                ? "From submission to consultation in under 24 hours"
                : "From alert to closed job — without the bidding"}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {perspective === "homeowner"
                ? "Submit once with documentation. A single verified contractor claims your project — no callbacks from five companies, no inbox spam."
                : "Every project arrives pre-documented. You see the scope, photos, and budget before you claim — arrive at the consultation ready to close."}
            </p>
          </div>

          {/* Perspective toggle */}
          <div className="flex-shrink-0">
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-secondary border border-border/40">
              <button
                type="button"
                onClick={() => setPerspective("homeowner")}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  perspective === "homeowner"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Homeowner
              </button>
              <button
                type="button"
                onClick={() => setPerspective("contractor")}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  perspective === "contractor"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Contractor
              </button>
            </div>
          </div>
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
                key={`${perspective}-${step.number}`}
                step={step}
                index={i}
                activeStep={activeStep}
                onHover={setActiveStep}
              />
            ))}
          </div>
        </div>

        {/* Bottom callout — different for each perspective */}
        <div className="mt-12 reveal">
          {perspective === "homeowner" ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15 max-w-2xl">
              <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Free for homeowners.</span>{" "}
                Nexus Operations charges contractors a monthly membership — not homeowners, not per-lead fees.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 max-w-2xl">
              <Star className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">No per-lead charges.</span>{" "}
                Your membership covers unlimited project claims. Upgrade to Elite for exclusive advance access on high-value jobs.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
