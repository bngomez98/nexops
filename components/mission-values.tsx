"use client"

import { useEffect, useRef } from "react"
import { ShieldCheck, Workflow, Users, ClipboardCheck } from "lucide-react"

const values = [
  {
    icon: ShieldCheck,
    title: "Verified execution",
    body: "Every project is matched with credentialed contractors and tracked through completion.",
  },
  {
    icon: Workflow,
    title: "Operational consistency",
    body: "We standardize intake, dispatch, and closeout workflows across your maintenance portfolio.",
  },
  {
    icon: Users,
    title: "Dedicated partnership",
    body: "NexOps works as an extension of your operations team instead of a generic vendor marketplace.",
  },
  {
    icon: ClipboardCheck,
    title: "Documented accountability",
    body: "Each request includes status visibility, timestamps, and structured notes for reporting and audits.",
  },
]

export function MissionValues() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((node) => node.classList.add("in-view"))
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-16 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">What we do</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            Operations support for property management teams
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            NexOps combines consulting and software to improve vendor coordination, workflow execution,
            and service reliability across maintenance operations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="reveal group flex gap-5 p-6 rounded-2xl bg-card border border-border/40"
              style={{ transitionDelay: `${(i + 1) * 80}ms` }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 leading-snug">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
