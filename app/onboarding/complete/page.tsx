"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react"

const ROLE_CONFIG: Record<string, { title: string; subtitle: string; nextHref: string; nextLabel: string; items: string[] }> = {
  contractor: {
    title: "You're all set!",
    subtitle: "Your contractor profile has been submitted for review.",
    nextHref: "/dashboard/contractor",
    nextLabel: "Go to Contractor Dashboard",
    items: [
      "Our team will review your documents within 1–2 business days",
      "You'll receive an email when your account is approved",
      "Once approved, you'll start receiving job notifications",
      "You can update your profile anytime from your dashboard",
    ],
  },
  homeowner: {
    title: "Welcome to Nexus Operations!",
    subtitle: "Your homeowner account is ready to use.",
    nextHref: "/dashboard/homeowner",
    nextLabel: "Go to Homeowner Dashboard",
    items: [
      "Submit your first service request in minutes",
      "Get matched with one verified contractor — no bidding wars",
      "Track every project from submission to completion",
      "All project records are stored permanently",
    ],
  },
  "property-manager": {
    title: "Welcome to Nexus Operations!",
    subtitle: "Your property manager account is ready.",
    nextHref: "/dashboard/property-manager",
    nextLabel: "Go to Property Manager Dashboard",
    items: [
      "Add your managed properties to get started",
      "Submit service requests across your entire portfolio",
      "Track spend by property and by trade category",
      "Permanent maintenance records for every property",
    ],
  },
}

function CompleteInner() {
  const params = useSearchParams()
  const role   = params.get("role") ?? "homeowner"
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.homeowner

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <Link href="/">
          <Image src="/nexus-logo.png" alt="Nexus Operations" width={120} height={40} style={{ height: "24px", width: "auto" }} priority />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg text-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{config.title}</h1>
          <p className="text-[15px] text-muted-foreground mb-8">{config.subtitle}</p>

          <div className="bg-card border border-border rounded-2xl p-6 mb-8 text-left space-y-3">
            {config.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                </div>
                <p className="text-[13.5px] text-foreground">{item}</p>
              </div>
            ))}
          </div>

          <Link
            href={config.nextHref}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-[14px] px-7 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            {config.nextLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OnboardingCompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}>
      <CompleteInner />
    </Suspense>
  )
}
