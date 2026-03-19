import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
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
