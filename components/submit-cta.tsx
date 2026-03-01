"use client"

import Link from "next/link"
import { ArrowRight, Phone, Mail } from "lucide-react"
import { useEffect, useRef } from "react"

export function SubmitCTA() {
  const sectionRef = useRef<HTMLElement>(null)

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
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="submit" className="py-28 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="border-t border-border/40 pt-20">

          {/* Main CTA narrative */}
          <div className="reveal max-w-3xl mb-16">
            <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase mb-6">Ready to start</p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] mb-8 text-balance">
              Submit your project once.
              <br />
              One contractor. Full documentation.
              <br />
              <span className="gradient-text">Coordinated start to finish.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Free for homeowners and property managers. No account required. No obligation after the estimate.
              Submit your project, and Nexus handles the rest — contractor assignment, consultation confirmation,
              coordination through completion, and a Post Implementation Review.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/dashboard/homeowner/new"
                className="btn-shimmer inline-flex items-center gap-2.5 px-7 py-4 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 shadow-xl shadow-primary/20"
              >
                Start Your Project
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-7 py-4 text-sm font-medium border border-border/60 rounded-xl hover:bg-secondary/50 hover:border-border transition-all duration-200"
              >
                Get in Touch First
              </Link>
            </div>
          </div>

          {/* Contact details — editorial strip */}
          <div className="reveal border-t border-border/40 pt-10 flex flex-col sm:flex-row sm:items-center gap-8">
            <a
              href="tel:+17854280244"
              className="group inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground/60 mb-0.5 uppercase tracking-wider text-[10px] font-medium">Call us</p>
                <p className="text-sm font-mono font-medium">785-428-0244</p>
              </div>
            </a>

            <div className="hidden sm:block w-px h-10 bg-border/40" />

            <a
              href="mailto:contact@nexusoperation.org"
              className="group inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground/60 mb-0.5 uppercase tracking-wider text-[10px] font-medium">Email us</p>
                <p className="text-sm font-mono font-medium">contact@nexusoperation.org</p>
              </div>
            </a>

            <div className="hidden sm:block w-px h-10 bg-border/40" />

            <div className="text-muted-foreground">
              <p className="text-xs text-muted-foreground/60 mb-0.5 uppercase tracking-wider text-[10px] font-medium">Based in</p>
              <p className="text-sm font-medium">Topeka, Kansas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
