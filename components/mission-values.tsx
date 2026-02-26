"use client"

import { useEffect, useRef } from "react"
import { Users, ShieldCheck, FileText, Award } from "lucide-react"

const values = [
  {
    icon: Users,
    title: "Dedicated operations partner",
    body: "You work with one accountable team that learns your properties, vendors, and standards instead of rotating call-center reps.",
  },
  {
    icon: ShieldCheck,
    title: "Verified vendor network",
    body: "Every contractor is credentialed before dispatch with license, insurance, and quality checks so your team avoids avoidable risk.",
  },
  {
    icon: FileText,
    title: "Documented workflows",
    body: "Intake, dispatch, QA, and billing steps are standardized and visible, reducing turnover risk and repetitive coordination work.",
  },
  {
    icon: Award,
    title: "Measured outcomes",
    body: "We report response times, completion rates, and recurring issue trends so decisions are based on performance, not assumptions.",
  },
]

export function MissionValues() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.querySelectorAll(".reveal").forEach((node, i) => {
          setTimeout(() => node.classList.add("in-view"), i * 100)
        })
        observer.disconnect()
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-card/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-14 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Why teams choose NexOps</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            A modern operations layer for property managers.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We combine consulting discipline with product-driven execution to keep maintenance predictable,
            auditable, and fast.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((value, index) => (
            <article
              key={value.title}
              className="reveal rounded-2xl border border-border/40 bg-card p-6 hover:border-primary/30 transition-colors"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <value.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
