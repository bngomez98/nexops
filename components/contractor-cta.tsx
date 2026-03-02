import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function ContractorCTA() {
  return (
    <section className="py-24 lg:py-32 bg-card/30">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="rounded-3xl border border-border/40 bg-card p-10 lg:p-14">
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
            Built for licensed contractors.
            <br />
            <span className="gradient-text">Flat monthly membership.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Every request includes scope context and budget details before you claim it. Once claimed,
            the project is exclusive to your team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-xl">
              View Membership Plans
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-border/40 rounded-xl">
              Apply to Join
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
