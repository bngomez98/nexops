"use client"

import { Camera, MousePointerClick, CalendarCheck, Star } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const steps = [
  {
    icon: Camera,
    number: "01",
    title: "Submit your project",
    description:
      "Upload 2–10 project photos, document the scope of work, set a hard budget cap, and select 3–4 available consultation windows. A thorough submission produces a faster match and ensures the contractor arrives fully prepared.",
    color: "text-primary",
    accent: "oklch(0.76 0.17 158)",
  },
  {
    icon: MousePointerClick,
    number: "02",
    title: "A contractor claims it",
    description:
      "Every qualified, verified contractor in your trade category and geographic area receives simultaneous notification. The first to claim your request secures it exclusively — the listing disappears from every other contractor's portal immediately and permanently.",
    color: "text-amber-400",
    accent: "oklch(0.70 0.15 85)",
  },
  {
    icon: CalendarCheck,
    number: "03",
    title: "We confirm your consultation",
    description:
      "Both you and the contractor receive a confirmed calendar appointment for the window you selected during submission. The contractor reviews your photos, written scope, and budget cap in advance — so the consultation produces answers, not questions.",
    color: "text-violet-400",
    accent: "oklch(0.60 0.15 285)",
  },
  {
    icon: Star,
    number: "04",
    title: "Your project moves forward",
    description:
      "Following the on-site consultation, you receive a written, itemized estimate. Accept, negotiate, or decline — no obligation. Every completed project generates a quality review, and we update contractor standing in the network accordingly.",
    color: "text-emerald-400",
    accent: "oklch(0.70 0.16 155)",
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStep, setActiveStep] = useState<number | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((node, i) => {
            setTimeout(() => node.classList.add("in-view"), i * 110)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 lg:py-36 relative overflow-hidden">
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.025]"
        style={{ background: "radial-gradient(circle, oklch(0.76 0.17 158), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mb-20 reveal">
          <p className="section-overline mb-4">How it works</p>
          <h2 className="text-3xl lg:text-[2.5rem] font-bold tracking-[-0.02em] leading-[1.12] mb-5">
            Submission to consultation
            <br />
            <span className="text-muted-foreground font-normal">in under 24 hours.</span>
          </h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            No phone tag. Submit your project once — with documentation and a defined budget —
            and we match you with a single verified professional.
          </p>
        </div>

        {/* Editorial step list */}
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="reveal group"
              style={{ transitionDelay: `${i * 100}ms` }}
              onMouseEnter={() => setActiveStep(i)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div
                className={`relative grid lg:grid-cols-[120px_1fr_2fr] gap-8 py-10 border-t border-border/30 transition-all duration-300 ${
                  activeStep === i ? "border-border/60" : ""
                }`}
              >
                {/* Step number — large editorial */}
                <div className="flex items-start">
                  <div className="relative">
                    <span
                      className={`font-mono text-[0.6875rem] font-semibold tracking-widest transition-colors duration-300 ${
                        activeStep === i ? step.color : "text-muted-foreground/30"
                      }`}
                    >
                      {step.number}
                    </span>
                    {/* Active left border */}
                    <div
                      className="absolute -left-6 top-0 bottom-0 w-px transition-all duration-300"
                      style={{
                        background: step.accent,
                        opacity: activeStep === i ? 0.7 : 0,
                      }}
                    />
                  </div>
                </div>

                {/* Title + icon */}
                <div className="flex flex-col gap-4 lg:pt-0.5">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                      activeStep === i ? "scale-105" : ""
                    }`}
                    style={{
                      background: `${step.accent}18`,
                      border: `1px solid ${step.accent}25`,
                    }}
                  >
                    <step.icon
                      className={`h-4.5 w-4.5 transition-colors duration-300 ${step.color}`}
                      size={18}
                    />
                  </div>
                  <h3 className="text-base font-semibold leading-snug">{step.title}</h3>
                </div>

                {/* Description */}
                <div className="lg:pt-0.5">
                  <p className="text-[15px] text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>

              {/* Last step gets a closing border */}
              {i === steps.length - 1 && (
                <div className="border-b border-border/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
