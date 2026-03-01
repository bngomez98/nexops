import Link from "next/link"
import { ArrowRight, BellRing, ShieldCheck, WalletCards } from "lucide-react"

export function ContractorCTA() {
  return (
    <section className="py-24 lg:py-32 bg-card/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="rounded-3xl border border-border/40 bg-card p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-primary text-sm font-medium tracking-wide mb-3">For contractors</p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                Claim verified work without lead auctions.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Get exclusive access to projects that include scope, photos, and budget context before you commit.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/contractors" className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90">
                  Join network <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border border-border/40 rounded-xl hover:bg-secondary/50">
                  View pricing <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
import { ArrowRight } from "lucide-react"
import { useEffect, useRef } from "react"

const benefits = [
  {
    label: "No cost to join.",
    body: "Joining the Nexus network is free for licensed, insured contractors. Verification, onboarding, and full platform access carry no upfront or ongoing fees.",
  },
  {
    label: "Claim projects instantly.",
    body: "When a homeowner submits a project, you see the full scope, photographs, and budget ceiling. The first verified contractor to claim it owns it — exclusively and permanently.",
  },
  {
    label: "Show up prepared.",
    body: "Every project includes 2–10 photographs, a written scope, and a confirmed consultation window. You arrive informed. The homeowner expects a professional conversation from the first minute.",
  },
]

export function ContractorCTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((node, i) => {
            setTimeout(() => node.classList.add("in-view"), i * 90)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="contractor-cta" className="py-28 lg:py-40 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Top header */}
        <div className="reveal mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-10 bg-primary shrink-0" />
            <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">For Contractors</p>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] mb-6 text-balance">
                Every project you claim is yours — from submission to completion.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join the Nexus network and work exclusively on projects matched to your capabilities.
                You review the full scope, photographs, and budget ceiling before committing.
                One flat monthly membership. Unlimited project claims. Full information before every consultation.
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-shimmer inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/20 shrink-0 self-start lg:self-end"
            >
              Apply to Join the Network
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

            <div className="grid gap-3">
              {[
                { icon: BellRing, title: "Real-time request alerts" },
                { icon: ShieldCheck, title: "Exclusive claim ownership" },
                { icon: WalletCards, title: "Flat monthly membership" },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border/40 p-4 bg-secondary/30 flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium">{item.title}</p>
                </div>
              ))}
            </div>
        {/* What contractors get — narrative list */}
        <div className="reveal border-t border-border/40 pt-12 mb-16">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-10">What changes when you join</p>
          <div className="grid lg:grid-cols-3 gap-px bg-border/40 border border-border/40 rounded-2xl overflow-hidden">
            <div className="bg-background p-8">
              <p className="text-2xl font-bold mb-3">Exclusively assigned.</p>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                The moment you claim a project, it is closed to every other contractor permanently.
                You own the relationship from claim through completion — with the homeowner's full attention.
              </p>
            </div>
            <div className="bg-background p-8">
              <p className="text-2xl font-bold mb-3">Fully informed before you commit.</p>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                You review the homeowner's photographs, written scope, and budget ceiling before claiming.
                Every consultation begins with complete information already in hand.
              </p>
            </div>
            <div className="bg-background p-8">
              <p className="text-2xl font-bold mb-3">One flat membership.</p>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                One monthly fee covers unlimited project claims — no per-project costs,
                no variable pricing based on project size or location. Predictable overhead.
              </p>
            </div>
          </div>
        </div>

        {/* Free benefits */}
        <div className="reveal">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-8">What you get</p>
          <div className="flex flex-col lg:flex-row gap-4">
            {benefits.map((b) => (
              <div key={b.label} className="flex-1 p-8 rounded-2xl border border-border/40 bg-card">
                <p className="text-xl font-bold mb-3">{b.label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Joining is free. Verification typically takes 3–5 business days.
            <Link href="/contact" className="text-primary hover:underline ml-1">Start your application</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
