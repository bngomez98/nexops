"use client"

import Link from "next/link"
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react"
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

        {/* CTA island */}
        <div className="reveal relative rounded-3xl overflow-hidden border border-border/50 bg-card">
          {/* Gradient overlays */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 0% 0%, oklch(from var(--primary) l c h / 0.10) 0%, transparent 55%), radial-gradient(ellipse at 100% 100%, oklch(from var(--primary) l c h / 0.06) 0%, transparent 55%)",
            }}
          />
          {/* Grid texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative px-8 py-16 lg:px-16 lg:py-20">
            <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">

              {/* Left: text */}
              <div className="max-w-3xl">
                <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase mb-6">Ready to start</p>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] mb-8 text-balance">
                  Submit your project once.
                  <br />
                  One contractor. Full documentation.
                  <br />
                  <span className="gradient-text">Coordinated start to finish.</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl">
                  Free for homeowners and property managers. No account required. No obligation after the estimate.
                  Submit your project, and Nexus handles the rest — contractor assignment, consultation confirmation,
                  coordination through completion, and a Post Implementation Review.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link
                    href="/dashboard/homeowner/new"
                    className="btn-shimmer inline-flex items-center gap-2.5 px-7 py-4 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 shadow-xl shadow-primary/25"
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

              {/* Right: contact details card */}
              <div className="lg:w-72 shrink-0">
                <div className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm p-6 space-y-5">
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">Reach us directly</p>

                  <a
                    href="tel:+17854280244"
                    className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-0.5">Call</p>
                      <p className="text-sm font-mono font-semibold text-foreground">785-428-0244</p>
                    </div>
                  </a>

                  <div className="h-px bg-border/40" />

                  <a
                    href="mailto:contact@nexusoperations.org"
                    className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-0.5">Email</p>
                      <p className="text-sm font-semibold text-foreground break-all">contact@nexusoperations.org</p>
                    </div>
                  </a>

                  <div className="h-px bg-border/40" />

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-0.5">Based in</p>
                      <p className="text-sm font-semibold text-foreground">Topeka, Kansas</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
