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
  { value: 1, suffix: "", label: "Licensed contractor assigned per project — exclusively" },
  { prefix: "$", value: 0, suffix: "", label: "Cost to homeowners — no fees, no exceptions" },
  { value: 24, suffix: "hr", label: "Median time from submission to consultation" },
]

function useCountUp(target: number, duration = 1400, enabled = false, decimals = 0) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!enabled) return
    if (target === 0) { setCount(0); return }
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3) // ease-out-cubic
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
      className="group text-center lg:text-left reveal"
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Accent line */}
      <div className="hidden lg:block h-0.5 w-8 bg-primary rounded-full mb-4 group-hover:w-14 transition-all duration-300" />

      <div className="text-3xl lg:text-4xl font-bold tracking-tight text-primary mb-1.5 tabular-nums">
        {stat.prefix ?? ""}{displayValue}{stat.suffix}
      </div>
      <div className="text-sm text-muted-foreground leading-snug">{stat.label}</div>
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
          // Add in-view class to all reveal elements
          el.querySelectorAll(".reveal").forEach((node) => node.classList.add("in-view"))
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 border-y border-border/40 bg-card/30 relative overflow-hidden">
      {/* Subtle glow behind */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, oklch(0.75 0.18 155 / 0.04), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} enabled={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
