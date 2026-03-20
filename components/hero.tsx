import Link from "next/link"
import { ArrowRight, Shield, Clock3, Clock, CheckCircle2, ClipboardCheck, Phone, FileText } from "lucide-react"
import { useEffect, useRef } from "react"

const signals = [
  { label: "One contractor per project", sub: "Mechanically enforced" },
  { label: "24-hour consultation confirmed", sub: "Guaranteed, every time" },
  { label: "Free for everyone", sub: "Property owners and contractors" },
  { label: "Post Implementation Review", sub: "Every project, every time" },
]

const steps = [
  { label: "Submitted", done: true },
  { label: "Assigned", done: true },
  { label: "Consult", done: false, active: true },
  { label: "Complete", done: false },
]
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden border-b border-border/40">
      {/* Fine grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Accent glow — top right */}
      <div
        className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at 70% 20%, oklch(from var(--primary) l c h / 0.10), transparent 65%)" }}
      />

      {/* Accent glow — bottom left */}
      <div
        className="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at 30% 80%, oklch(from var(--primary) l c h / 0.05), transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-36 pb-28 w-full">
        <div className="grid lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-16 xl:gap-24 items-center">

          {/* ── Left column: text ── */}
          <div>
            {/* Eyebrow */}
            <div className="reveal">
              <div className="inline-flex items-center gap-3 mb-10">
                <span className="h-px w-10 bg-primary" />
                <span className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
                  Topeka, Kansas &middot; Contractor Coordination
                </span>
              </div>
            </div>

            {/* Main headline */}
            <div className="reveal mb-8" style={{ transitionDelay: "110ms" }}>
              <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-bold leading-[1.0] tracking-tight text-balance max-w-4xl">
                One project.{" "}
                <br className="hidden lg:block" />
                One contractor.{" "}
                <span className="gradient-text">Full documentation.</span>
              </h1>
            </div>

            {/* Sub-narrative */}
            <div className="reveal" style={{ transitionDelay: "220ms" }}>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-4">
                Nexus Operations connects Topeka property owners and managers with a single,
                verified contractor — exclusively assigned to their project from the moment of submission.
              </p>
              <p className="text-xl font-medium text-foreground/90 leading-relaxed max-w-2xl mb-10">
                That contractor arrives knowing your scope, your photographs, and your budget ceiling.
                The conversation starts at a professional level. Every step is documented, timestamped, and available in your account.
              </p>
            </div>

            {/* CTAs */}
            <div className="reveal flex flex-col sm:flex-row items-start gap-4 mb-16" style={{ transitionDelay: "330ms" }}>
              <Link
                href="/login?tab=signup"
                className="btn-shimmer inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200"
              >
                Submit a Request — Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/40 rounded-xl hover:border-border/70 hover:bg-secondary/50 transition-all duration-200"
              >
                How It Works
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/homeowner/new"
                className="btn-shimmer inline-flex items-center gap-2.5 px-7 py-4 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 shadow-xl shadow-primary/20"
              >
                Submit a Project — It&rsquo;s Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-7 py-4 text-sm font-medium border border-border/60 rounded-xl hover:bg-secondary/50 hover:border-border transition-all duration-200"
              >
                Talk to Us First
              </Link>
            </div>

            {/* Divider + signal strip */}
            <div className="reveal border-t border-border/40 pt-10" style={{ transitionDelay: "440ms" }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                {signals.map((s) => (
                  <div key={s.label}>
                    <p className="text-sm font-semibold text-foreground mb-0.5 leading-snug">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Maintenance Coordination &middot; Topeka, KS
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.1] tracking-tight text-foreground mb-6 text-balance">
            Maintenance coordination
            <br className="hidden sm:block" />
            <span className="font-serif italic font-normal text-primary">
              that actually works.
            </span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
            One point of contact for all property maintenance. We connect you with verified contractors and handle the coordination.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Link
              href="/dashboard/requests/new"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
            >
              Submit a Request
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
            >
              Log in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
          <div className="bg-card p-6 lg:p-8">
            <p className="text-2xl lg:text-3xl font-semibold text-foreground mb-1">
              {"<"} 1hr
            </p>
            <p className="text-sm text-muted-foreground">
              Emergency contractor assignment
            </p>
          </div>
          <div className="bg-card p-6 lg:p-8">
            <p className="text-2xl lg:text-3xl font-semibold text-foreground mb-1">
              100%
            </p>
            <p className="text-sm text-muted-foreground">
              Verified, licensed, and insured
            </p>
          </div>
          <div className="bg-card p-6 lg:p-8">
            <p className="text-2xl lg:text-3xl font-semibold text-foreground mb-1">
              1
            </p>
            <p className="text-sm text-muted-foreground">
              Point of contact for all trades
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
