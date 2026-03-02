"use client"

import { useEffect, useRef } from "react"
import { Check } from "lucide-react"

const features = [
  {
    feature: "Single-contractor assignment",
    detail: "Each project request is routed to one verified contractor, not broadcast to multiple bidders.",
  },
  {
    feature: "Defined scope up front",
    detail: "Owners submit photos, scope details, and budget expectations before assignment.",
  },
  {
    feature: "No unsolicited vendor spam",
    detail: "Only the assigned contractor receives the request and makes contact.",
  },
  {
    feature: "Verification-first network",
    detail: "Contractors are credentialed before they can receive projects.",
  },
]

export function Comparison() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((node) => {
              node.classList.add("in-view")
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-12 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">How it works for you</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            How NexOps differs from traditional lead platforms
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Traditional marketplaces often sell the same lead to several contractors. NexOps assigns each
            project to one verified contractor, with scope and budget context provided before first contact.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 reveal" style={{ transitionDelay: "100ms" }}>
          {features.map((item) => (
            <div key={item.feature} className="flex items-start gap-4 p-5 rounded-xl border border-border/40 bg-card">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20 shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{item.feature}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
