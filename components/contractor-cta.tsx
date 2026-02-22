"use client"

import Link from "next/link"
import { ArrowRight, Lock, FileText, DollarSign, TrendingUp, BarChart3 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const benefits = [
  {
    icon: Lock,
    title: "Projects are exclusively yours",
    description: "Claim a project and no one else can touch it. You're the only contractor the homeowner hears from.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: FileText,
    title: "Full details before you claim",
    description: "Photos, written scope, and budget are all there. You only take jobs that fit your business.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    icon: DollarSign,
    title: "Flat membership, no surprises",
    description: "Starting at $299/month. No per-lead fees, no cancellation penalties, unlimited claims.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    icon: BarChart3,
    title: "Reputation based on real work",
    description: "Your standing is calculated from actual project outcomes — consultation attendance, quote-to-close rate, and homeowner satisfaction scores. Contractors with strong performance receive earlier notification windows on new projects.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
]

const miniStats = [
  { value: "1", label: "Contractor per project" },
  { value: "$299", label: "Starting membership" },
  { value: "$0", label: "Per-lead fees, ever" },
]

export function ContractorCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((node, i) => {
            setTimeout(() => node.classList.add("in-view"), i * 100)
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
    <section ref={sectionRef} className="py-24 lg:py-32 bg-card/30 relative overflow-hidden">
      <div
        className="absolute left-0 bottom-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.04]"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)" }}
      />
      <div
        className="absolute right-0 top-0 w-[300px] h-[300px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, oklch(0.70 0.15 85), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — copy */}
          <div className="reveal">
            <p className="text-primary text-sm font-medium tracking-wide mb-3">For contractors</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
              Pre-documented projects.
              <br />
              <span className="gradient-text">Exclusively yours the moment you claim.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Every project arrives with photos, a written scope, and a defined budget cap. Claim it and the project is removed from every other contractor&apos;s feed — permanently. No competing bids, no per-lead fees, one flat monthly membership.
            </p>

            {/* Mini stats row */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-xl border border-border/40 bg-card/50">
              {miniStats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl font-bold text-primary mb-0.5">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contractors"
                className="btn-shimmer inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                Join the Network
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/40 rounded-xl hover:border-border/70 hover:bg-secondary/50 transition-all duration-200"
              >
                <TrendingUp className="h-4 w-4" />
                View Membership Plans
              </Link>
            </div>
          </div>

          {/* Right — benefit cards */}
          <div className="flex flex-col gap-3">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className={`reveal flex items-start gap-4 p-5 rounded-2xl bg-card border transition-all duration-300 cursor-default ${
                  hoveredBenefit === i
                    ? "border-border/70 shadow-lg shadow-black/20 translate-y-[-1px]"
                    : "border-border/40"
                }`}
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
                onMouseEnter={() => setHoveredBenefit(i)}
                onMouseLeave={() => setHoveredBenefit(null)}
              >
                <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${b.bg} border ${b.border} shrink-0 transition-transform duration-300 ${hoveredBenefit === i ? "scale-110" : ""}`}>
                  <b.icon className={`h-5 w-5 ${b.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
