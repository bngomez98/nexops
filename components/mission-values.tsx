"use client"

import { useEffect, useRef } from "react"
import { Users, ShieldCheck, FileText, Award } from "lucide-react"

const values = [
  {
    icon: Users,
    title: "The homeowner deserves control",
    body: "You own the project. You should set the scope, the budget ceiling, and the consultation window — before a single contractor is contacted. Not after you have already given your number to six strangers who all received it at the same time.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: ShieldCheck,
    title: "The contractor deserves exclusivity",
    body: "A skilled professional should not have to fight five competitors for the same job, or undercut their margin just to win a bid. When a contractor claims a request on Nexus, they have earned it outright — no auction, no race to the bottom, no erosion of their craft.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    icon: FileText,
    title: "Both sides deserve preparation",
    body: "Bad projects start with bad information. We require full documentation — photos, written scope, a defined budget cap — before any match is made. The result is a consultation that is productive from the first minute, not a fishing expedition for someone who already called seven people.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    icon: Award,
    title: "Quality is tracked, not assumed",
    body: "Every contractor in the network earned their place through license verification, insurance confirmation, and background review. Every completed project updates their standing. The standard is not a hurdle — it is the reason homeowners trust the match they receive.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
]

export function MissionValues() {
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
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 relative overflow-hidden bg-card/20">
      {/* Background decoration */}
      <div
        className="absolute left-0 top-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.18 155), transparent 70%)" }}
      />
      <div
        className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.025]"
        style={{ background: "radial-gradient(circle, oklch(0.70 0.15 85), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Mission statement */}
        <div className="max-w-3xl mb-16 reveal">
          <p className="text-primary text-sm font-medium tracking-wide mb-3">Why we exist</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-6">
            Home improvement became adversarial.
            <span className="gradient-text"> We built an alternative.</span>
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Homeowners brace for spam calls the moment they submit a request. Contractors undercut their margin
              to survive a bidding war they never agreed to enter. The platforms connecting them profit by
              distributing contact information as widely as possible — five, ten, fifteen contractors
              per lead — and calling that a service.
            </p>
            <p className="text-foreground/80 font-medium">
              Nexus Operations was built on a different premise: one request, one verified contractor,
              no exceptions. Not as a feature. As a founding belief.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12 reveal" style={{ transitionDelay: "80ms" }}>
          <div className="h-px flex-1 bg-border/30" />
          <span className="text-xs text-muted-foreground tracking-wider uppercase font-medium">Our core commitments</span>
          <div className="h-px flex-1 bg-border/30" />
        </div>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="reveal group flex gap-5 p-6 rounded-2xl bg-card border border-border/40 hover:border-border/70 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 cursor-default"
              style={{ transitionDelay: `${(i + 2) * 80}ms` }}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl ${v.bg} border ${v.border} shrink-0 transition-transform duration-300 group-hover:scale-110`}
              >
                <v.icon className={`h-5 w-5 ${v.color}`} />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 leading-snug">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing brand statement */}
        <div
          className="mt-12 p-7 rounded-2xl border border-border/30 bg-secondary/20 reveal"
          style={{ transitionDelay: "500ms" }}
        >
          <blockquote className="text-center">
            <p className="text-lg lg:text-xl font-medium text-foreground/90 leading-relaxed max-w-3xl mx-auto">
              &ldquo;This is what we mean by operations. Not just a marketplace.
              A system that runs the logistics so contractors can focus on the craft —
              and homeowners can focus on their lives.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-muted-foreground">
              Nexus Operations — Topeka, KS
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
