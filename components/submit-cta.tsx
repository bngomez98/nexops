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
    <section ref={sectionRef} id="submit" className="py-28 lg:py-40 bg-foreground">
      {/* Red rule at top */}
      <div className="h-1 bg-primary w-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-0 mt-16">

        {/* Constructivist CTA block */}
        <div className="reveal relative border-2 border-background/20 overflow-hidden">
          {/* Diagonal stripe accent — top right corner */}
          <div
            className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage: "repeating-linear-gradient(-45deg, #fff 0px, #fff 2px, transparent 2px, transparent 14px)",
            }}
          />

          <div className="relative px-8 py-16 lg:px-16 lg:py-20">
            <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">

              {/* Left: text */}
              <div className="max-w-3xl">
                <div className="construct-label mb-6" style={{ color: "var(--primary)" }}>Ready to start</div>
                <h2 className="text-4xl lg:text-6xl font-display uppercase leading-[1.0] mb-6 text-balance text-background">
                  Submit your project once.
                  <br />
                  One contractor.
                  <br />
                  <span className="text-primary">Full documentation.</span>
                </h2>
                {/* Red accent bar */}
                <div className="h-1 w-24 bg-primary mb-8" />
                <p className="text-lg text-background/60 leading-relaxed mb-10 max-w-2xl">
                  Free for homeowners and property managers. No account required. No obligation after the estimate.
                  Submit your project, and Nexus handles the rest — contractor assignment, consultation confirmation,
                  coordination through completion, and a Post Implementation Review.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <Link
                    href="/dashboard/homeowner/new"
                    className="btn-shimmer inline-flex items-center gap-2.5 px-7 py-4 text-sm font-black tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 construct-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-none transition-all duration-150"
                  >
                    Start Your Project
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2.5 px-7 py-4 text-sm font-bold tracking-widest uppercase border-2 border-background/30 text-background/70 hover:border-background hover:text-background transition-colors"
                  >
                    Get in Touch First
                  </Link>
                </div>
              </div>

              {/* Right: contact details — constructivist card */}
              <div className="lg:w-72 shrink-0">
                <div className="border-2 border-background/20 bg-background/5 p-6 space-y-0">
                  <p className="text-[10px] font-black tracking-widest uppercase text-background/40 mb-5">Reach us directly</p>

                  <a
                    href="tel:+17854280244"
                    className="group flex items-center gap-3 text-background/50 hover:text-background transition-colors py-4 border-b border-background/10"
                  >
                    <div className="w-9 h-9 border-2 border-background/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-colors shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-background/40 font-bold mb-0.5">Call</p>
                      <p className="text-sm font-mono font-black text-background">785-428-0244</p>
                    </div>
                  </a>

                  <a
                    href="mailto:contact@nexusoperations.org"
                    className="group flex items-center gap-3 text-background/50 hover:text-background transition-colors py-4 border-b border-background/10"
                  >
                    <div className="w-9 h-9 border-2 border-background/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-colors shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-background/40 font-bold mb-0.5">Email</p>
                      <p className="text-sm font-black text-background break-all">contact@nexusoperations.org</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 text-background/50 py-4">
                    <div className="w-9 h-9 border-2 border-background/20 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-background/40 font-bold mb-0.5">Based in</p>
                      <p className="text-sm font-black text-background">Topeka, Kansas</p>
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
