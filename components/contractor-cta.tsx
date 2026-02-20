"use client"

import Link from "next/link"
import { ArrowRight, Lock, FileText, DollarSign, BarChart3, TrendingUp } from "lucide-react"
import { useEffect, useRef } from "react"

const benefits = [
  {
    icon: Lock,
    title: "Leads that belong to you — entirely",
    description: "The instant you claim a request, it disappears from every other contractor's portal — permanently. You are the sole point of contact for this homeowner. No competing bids. No price undercutting. No wasted site visits.",
    color: "text-primary",
    accent: "oklch(0.76 0.17 158)",
  },
  {
    icon: FileText,
    title: "Full project context before you commit",
    description: "Every request includes 2–10 photos, a written scope, a homeowner-defined budget cap, and a pre-confirmed consultation window. You review the complete project profile before claiming — so you only take jobs that make sense for your business.",
    color: "text-amber-400",
    accent: "oklch(0.70 0.15 85)",
  },
  {
    icon: DollarSign,
    title: "One flat membership. No per-lead fees.",
    description: "Starting at $299/month with no per-lead charges, no cancellation penalties, and no annual lock-in. Your membership covers unlimited lead claims across every category you hold approval for. One closed residential project typically returns your monthly cost many times over.",
    color: "text-emerald-400",
    accent: "oklch(0.70 0.16 155)",
  },
  {
    icon: BarChart3,
    title: "A reputation built on documented outcomes",
    description: "Your standing in the network reflects actual project performance — not reviews anyone can game. Consistent quality earns you priority notifications, advanced access to high-value leads, and long-term eligibility for the Elite tier.",
    color: "text-violet-400",
    accent: "oklch(0.60 0.15 285)",
  },
]

const miniStats = [
  { value: "1", label: "Contractor per lead" },
  { value: "$299", label: "Starting membership" },
  { value: "$0", label: "Per-lead fees, ever" },
]

export function ContractorCTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((node, i) => {
            setTimeout(() => node.classList.add("in-view"), i * 90)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 relative overflow-hidden">
      <div
        className="absolute left-0 bottom-0 w-[450px] h-[450px] rounded-full pointer-events-none opacity-[0.025]"
        style={{ background: "radial-gradient(circle, oklch(0.76 0.17 158), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left — copy */}
          <div className="reveal">
            <p className="section-overline mb-4">For contractors</p>
            <h2 className="text-3xl lg:text-[2.5rem] font-bold tracking-[-0.02em] leading-[1.12] mb-6">
              Stop competing for leads.
              <br />
              <span className="gradient-text">Start owning them.</span>
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-10">
              Licensed, insured contractors in Topeka and the surrounding region use Nexus Operations
              to replace unpredictable shared-lead platforms with a structured, exclusive pipeline.
              You do not bid against competitors. You do not pay per lead. You claim a fully documented project
              and it is yours from that moment to the final invoice — no exceptions.
            </p>

            {/* Mini stats */}
            <div className="flex gap-10 mb-10">
              {miniStats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-foreground tracking-tight mb-0.5">{s.value}</div>
                  <div className="text-[12px] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contractors"
                className="btn-shimmer inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] shadow-lg shadow-primary/15 tracking-tight"
              >
                Join the Network
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-foreground/60 hover:text-foreground border border-border/35 rounded-md hover:border-border/60 hover:bg-secondary/40 transition-all duration-200"
              >
                <TrendingUp className="h-4 w-4" />
                View Membership Plans
              </Link>
            </div>
          </div>

          {/* Right — benefit list */}
          <div className="space-y-0">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className="reveal group"
                style={{ transitionDelay: `${(i + 1) * 80}ms` }}
              >
                <div className="flex items-start gap-5 py-8 border-t border-border/30 hover:border-border/55 transition-colors duration-200">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: `${b.accent}15`,
                      border: `1px solid ${b.accent}22`,
                    }}
                  >
                    <b.icon className={`h-4 w-4 ${b.color}`} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold mb-1.5 leading-snug">{b.title}</h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{b.description}</p>
                  </div>
                </div>
                {i === benefits.length - 1 && (
                  <div className="border-b border-border/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
