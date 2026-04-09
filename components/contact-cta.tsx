import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function ContactCTA() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/8 via-card to-primary/3 p-10 lg:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.48_0.155_142_/_0.12),transparent)]" aria-hidden />
          <div className="relative max-w-2xl mx-auto">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3">
              Get started
            </p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-4 text-balance">
              Ready to eliminate your
              <br className="hidden sm:block" />
              coordination burden?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10">
              Whether you manage a commercial portfolio or own residential
              properties, we can start coordinating your maintenance requests
              within days. No contracts, no setup fees.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:opacity-90 transition shadow-lg shadow-primary/20"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium border border-border bg-card/80 text-foreground hover:border-primary/30 hover:bg-card rounded-full transition"
              >
                Log in to your account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span>No retainers</span>
              <span className="text-border">|</span>
              <span>No subscription fees</span>
              <span className="text-border">|</span>
              <span>Pay only for completed work</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
