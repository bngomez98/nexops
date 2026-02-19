"use client"

import { Camera, MousePointerClick, CalendarCheck, Star } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const steps = [
  {
    icon: Camera,
    number: "01",
    title: "Document your project",
    description:
      "Upload 2–10 photos, enter project specs, set your budget cap, and pick 3–4 consultation windows. The more detail you provide, the better the match.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: MousePointerClick,
    number: "02",
    title: "Contractor claims your job",
    description:
      "Licensed, insured contractors in your area see your request instantly. The first one to claim it gets exclusive access — no bidding wars, no shared leads.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    icon: CalendarCheck,
    number: "03",
    title: "Consultation is scheduled",
    description:
      "Both parties get a confirmed calendar invite for the consultation time you selected. The contractor already knows your scope, budget, and has seen your photos.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    icon: Star,
    number: "04",
    title: "Get the work done",
    description:
      "After the consultation, you receive a quote. Accept it and the project moves forward. We follow up to ensure quality and track contractor performance.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
]

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
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mb-16 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">How it works</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            From photos to consultation in under 24 hours
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            No phone tag, no waiting for callbacks, no getting bombarded by five different contractors.
            Submit once, get matched once.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px">
            <div
              className="h-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full"
              style={{
                transform: inView ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 1.2s ease 0.4s",
              }}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="reveal group relative"
                style={{ transitionDelay: `${i * 130}ms` }}
                onMouseEnter={() => setActiveStep(i)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Card */}
                <div
                  className={`relative p-6 rounded-2xl border bg-card transition-all duration-300 cursor-default ${
                    activeStep === i
                      ? `border-[${step.color}] shadow-lg`
                      : "border-border/40 hover:border-border/70"
                  }`}
                  style={
                    activeStep === i
                      ? { borderColor: "oklch(0.75 0.18 155 / 0.35)", boxShadow: "0 8px 30px oklch(0 0 0 / 0.3)" }
                      : {}
                  }
                >
                  {/* Step number + icon row */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-xl ${step.bg} border ${step.border} transition-transform duration-300 ${activeStep === i ? "scale-110" : ""}`}
                    >
                      <step.icon className={`h-5 w-5 ${step.color}`} />
                    </div>
                    <span
                      className="text-2xl font-bold font-mono text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors"
                    >
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold mb-2 leading-snug">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

                  {/* Active indicator bar */}
                  <div
                    className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full ${step.bg} transition-all duration-300 ${activeStep === i ? "opacity-100" : "opacity-0"}`}
                    style={activeStep === i ? { background: `var(--${step.color.replace("text-", "color-")})` } : {}}
                  />
                </div>

                {/* Arrow between steps (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-[52px] z-10 items-center justify-center w-6 h-6 rounded-full bg-background border border-border/40">
                    <svg width="10" height="10" viewBox="0 0 10 10" className="text-muted-foreground/40">
                      <path d="M3 2L7 5L3 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
