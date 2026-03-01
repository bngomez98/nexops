"use client"

import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
import { useEffect, useRef } from "react"

const signals = [
  { label: "One contractor per project", sub: "Mechanically enforced" },
  { label: "24-hour consultation confirmed", sub: "Guaranteed, every time" },
  { label: "Free for property owners", sub: "Contractor memberships fund the platform" },
  { label: "Post Implementation Review", sub: "Every project, every time" },
]

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const nodes = el.querySelectorAll(".reveal-hero")
    nodes.forEach((node, i) => {
      setTimeout(() => node.classList.add("in-view"), 120 + i * 110)
    })
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden border-b border-border/40">
      {/* Fine grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Accent glow — top right */}
      <div
        className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at 70% 20%, oklch(from var(--primary) l c h / 0.09), transparent 65%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-36 pb-28 w-full">
        {/* Eyebrow */}
        <div className="reveal-hero opacity-0 transition-all duration-700" style={{ transform: "translateY(20px)" }}>
          <div className="inline-flex items-center gap-3 mb-10">
            <span className="h-px w-10 bg-primary" />
            <span className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
              Topeka, Kansas &middot; Contractor Coordination
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div className="reveal-hero opacity-0 transition-all duration-700 mb-8" style={{ transform: "translateY(20px)", transitionDelay: "110ms" }}>
          <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-bold leading-[1.0] tracking-tight text-balance max-w-4xl">
            The contractor platform{" "}
            <br className="hidden lg:block" />
            that doesn&rsquo;t sell{" "}
            <span className="gradient-text">your lead.</span>
          </h1>
        </div>

        {/* Sub-narrative */}
        <div className="reveal-hero opacity-0 transition-all duration-700" style={{ transform: "translateY(20px)", transitionDelay: "220ms" }}>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-4">
            Every other platform sells your request to four, six, eight contractors at once. They call you simultaneously,
            repeat the same pitch, and compete on price — not quality.
          </p>
          <p className="text-xl font-medium text-foreground/90 leading-relaxed max-w-2xl mb-10">
            Nexus Operations assigns one verified contractor exclusively to your project.
            That contractor arrives already knowing your scope, your photos, and your budget.
            No phone tag. No pressure. No surprises.
          </p>
        </div>

        {/* CTAs */}
        <div className="reveal-hero opacity-0 transition-all duration-700 flex flex-col sm:flex-row items-start gap-4 mb-16" style={{ transform: "translateY(20px)", transitionDelay: "330ms" }}>
          <Link
            href="/dashboard/homeowner/new"
            className="btn-shimmer inline-flex items-center gap-2.5 px-7 py-4 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 shadow-xl shadow-primary/20"
          >
            Submit a Project — It&rsquo;s Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 px-7 py-4 text-sm font-medium border border-border/60 rounded-xl hover:bg-secondary/50 hover:border-border transition-all duration-200"
          >
            Talk to Us First
          </Link>
        </div>

        {/* Divider + signal strip */}
        <div className="reveal-hero opacity-0 transition-all duration-700 border-t border-border/40 pt-10" style={{ transform: "translateY(20px)", transitionDelay: "440ms" }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
            {signals.map((s) => (
              <div key={s.label}>
                <p className="text-sm font-semibold text-foreground mb-0.5 leading-snug">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact line */}
        <div className="reveal-hero opacity-0 transition-all duration-700 mt-8" style={{ transform: "translateY(20px)", transitionDelay: "550ms" }}>
          <a
            href="tel:+17854280244"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="font-mono tracking-wide">785-428-0244</span>
            <span className="text-border/70">·</span>
            <a href="mailto:contact@nexusoperation.org" className="hover:text-primary transition-colors">contact@nexusoperation.org</a>
          </a>
        </div>
      </div>
    </section>
  )
}
