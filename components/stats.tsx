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

function StatCard({ stat, enabled }: { stat: Stat; enabled: boolean }) {
  const count = useCountUp(stat.value, 1200, enabled)
  return (
    <div className="reveal p-6 lg:p-8">
      <div className="text-4xl lg:text-5xl font-bold text-primary mb-2 tabular-nums font-mono leading-none">
        {stat.prefix ?? ""}{count.toLocaleString()}{stat.suffix}
      </div>
      <p className="text-sm font-semibold text-foreground mb-1.5">{stat.label}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{stat.context}</p>
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
    <section ref={sectionRef} className="bg-secondary border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex items-center gap-4 mb-10 reveal">
          <p className="section-label">By the numbers</p>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card">
              <StatCard stat={stat} enabled={inView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
