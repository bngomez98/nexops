"use client"

import { useEffect, useRef, useState } from "react"

interface Stat {
  prefix?: string
  value: number
  suffix: string
  label: string
  decimals?: number
}

const stats: Stat[] = [
  { prefix: "$", value: 600, suffix: "B", label: "U.S. home improvement market, annually" },
  { value: 1, suffix: "", label: "Contractor per job — not 5, not 7, just one" },
  { prefix: "$", value: 0, suffix: "", label: "Cost to homeowners — free, every time" },
  { value: 24, suffix: "hr", label: "Median time from submission to consultation" },
]

function useCountUp(target: number, duration = 1200, enabled = false, decimals = 0) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!enabled) return
    if (target === 0) { setCount(0); return }
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(parseFloat((ease * target).toFixed(decimals)))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, enabled, decimals])

  return count
}

function StatItem({ stat, enabled, index }: { stat: Stat; enabled: boolean; index: number }) {
  const count = useCountUp(stat.value, 1200, enabled, stat.decimals ?? 0)

  const displayValue = stat.decimals
    ? count.toFixed(stat.decimals)
    : Math.round(count).toString()

  return (
    <div
      className="reveal group"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="text-[2.75rem] lg:text-5xl font-bold tracking-[-0.03em] text-foreground mb-2 tabular-nums leading-none">
        <span className="text-primary/80">{stat.prefix ?? ""}</span>
        {displayValue}
        <span className="text-primary/80">{stat.suffix}</span>
      </div>
      <div className="text-[13px] text-muted-foreground leading-snug max-w-[200px]">{stat.label}</div>
      <div className="accent-line mt-4 group-hover:w-12" />
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
          el.querySelectorAll(".reveal").forEach((node) => node.classList.add("in-view"))
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 border-y border-border/30 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 120%, oklch(0.76 0.17 158 / 0.03), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} enabled={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
