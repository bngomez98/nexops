"use client"

import { useEffect, useRef, useState } from "react"

interface Stat {
  prefix?: string
  value: number
  suffix: string
  label: string
  context: string
}

const stats: Stat[] = [
  {
    value: 1,
    suffix: "",
    label: "Contractor per project",
    context: "One exclusive assignment — never shared, never auctioned.",
  },
  {
    value: 24,
    suffix: "h",
    label: "Consultation confirmation",
    context: "From submission to confirmed appointment window.",
  },
  {
    value: 1,
    suffix: "h",
    label: "Emergency assignment target",
    context: "On-site response within 4 hours of assignment.",
  },
  {
    prefix: "$",
    value: 4200,
    suffix: "",
    label: "Median residential project",
    context: "Roofing, concrete, HVAC, electrical, tree removal, and more.",
  },
]

function useCountUp(target: number, duration = 1200, enabled = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!enabled) return
    if (target === 0) { setCount(0); return }
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, enabled])
  return count
}

function StatCard({ stat, enabled, index }: { stat: Stat; enabled: boolean; index: number }) {
  const count = useCountUp(stat.value, 1200, enabled)
  return (
    <div className="reveal stat-card group relative overflow-hidden">
      {/* Constructivist index number — faint background */}
      <div className="absolute bottom-2 right-3 text-7xl font-black text-foreground/[0.04] leading-none select-none font-mono pointer-events-none">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Red top accent */}
      <div className="h-1 bg-primary w-full mb-5" />

      <div className="p-6 relative">
        <div className="text-5xl lg:text-6xl font-black text-primary mb-3 tabular-nums font-mono leading-none">
          {stat.prefix ?? ""}{count.toLocaleString()}{stat.suffix}
        </div>
        <p className="text-[10px] font-bold tracking-widest uppercase text-foreground mb-2">{stat.label}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{stat.context}</p>
      </div>
    </div>
  )
}

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          el.querySelectorAll(".reveal").forEach((node, i) => {
            setTimeout(() => node.classList.add("in-view"), i * 100)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="border-b-2 border-foreground bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex items-center gap-4 mb-12 reveal">
          <div className="construct-label">By the numbers</div>
          <div className="h-0.5 flex-1 bg-foreground/15" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/20">
          {stats.map((stat, i) => (
            <div key={stat.label} className="bg-secondary">
              <StatCard stat={stat} enabled={inView} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
