"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, Shield } from "lucide-react"

export function SubmitCTA() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card">
          <div className="relative p-10 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
                  <span className="text-primary text-xs font-medium">Free for property owners</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
                  Submit your project once.
                  <br />
                  <span className="gradient-text">Get one verified contractor match.</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Upload your scope, documentation, and budget expectations. NexOps routes your request to
                  a single credentialed contractor who confirms consultation availability.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <Link
                    href="/dashboard/homeowner/new"
                    className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl"
                  >
                    Start Your Project
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground self-center">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-primary" /> No obligation
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-primary" /> Verified contractors only
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5">What happens next</p>
                <ol className="space-y-3">
                  {[
                    "Scope and budget are reviewed.",
                    "A qualified contractor is assigned.",
                    "Consultation is confirmed.",
                    "Project status is tracked to completion.",
                  ].map((step) => (
                    <li key={step} className="p-3 rounded-xl bg-secondary/30 border border-border/30 text-sm">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
