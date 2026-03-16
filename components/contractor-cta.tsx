import Link from "next/link"
import { ArrowRight, Briefcase, DollarSign, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContractorCTA() {
  return (
    <section id="for-contractors" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                For contractors
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Grow your business with quality leads
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Stop chasing leads and start doing what you do best. We connect you with 
                homeowners who are ready to hire.
              </p>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">Pre-qualified jobs matching your skills and service area</span>
                </li>
                <li className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">No upfront fees - only pay when you get hired</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">Manage your schedule and capacity on your terms</span>
                </li>
              </ul>

              <Button size="lg" className="mt-8" asChild>
                <Link href="/signup?role=contractor">
                  Apply to join
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-background p-6">
                <span className="text-3xl font-bold">$2.5M+</span>
                <p className="mt-1 text-sm text-muted-foreground">Paid to contractors monthly</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-6">
                <span className="text-3xl font-bold">85%</span>
                <p className="mt-1 text-sm text-muted-foreground">Lead-to-hire rate</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-6">
                <span className="text-3xl font-bold">48hr</span>
                <p className="mt-1 text-sm text-muted-foreground">Average payment processing</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-6">
                <span className="text-3xl font-bold">4.8</span>
                <p className="mt-1 text-sm text-muted-foreground">Average homeowner rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
