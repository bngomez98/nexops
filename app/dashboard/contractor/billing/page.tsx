"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  CreditCard,
  ExternalLink,
  Shield,
  Zap,
  AlertTriangle,
  ArrowRight,
  Check,
} from "lucide-react"

type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | null

// Replace with your actual Stripe price IDs from your Stripe dashboard
const PRICE_ID_MONTHLY = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY ?? "price_monthly_placeholder"
const PRICE_ID_ANNUAL  = process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL  ?? "price_annual_placeholder"

const plans = [
  {
    id:          "monthly",
    name:        "Monthly",
    price:       "$79",
    period:      "/month",
    description: "Full access. Cancel anytime.",
    priceId:     PRICE_ID_MONTHLY,
    features: [
      "Unlimited access to open requests in your area",
      "Real-time notifications for new projects",
      "Full project scope, photos, and budget before you claim",
      "Direct payment from property owners — no platform cut",
      "Stripe Connect payout account included",
      "Cancel or pause anytime",
    ],
    highlight: false,
  },
  {
    id:          "annual",
    name:        "Annual",
    price:       "$59",
    period:      "/month, billed annually",
    description: "Save 25% vs. monthly. Best value.",
    priceId:     PRICE_ID_ANNUAL,
    features: [
      "Everything in Monthly",
      "Save $240 per year vs. monthly billing",
      "Priority support response",
      "Locked rate for 12 months",
    ],
    highlight: true,
  },
]

export default function ContractorBillingPage() {
  const [loading, setLoading]                 = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading]     = useState(false)
  const [error, setError]                     = useState<string | null>(null)
  const [success, setSuccess]                 = useState<string | null>(null)
  const [subStatus, setSubStatus]             = useState<SubscriptionStatus>(null)

  const searchParams = useSearchParams()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .single()

      setSubStatus((profile?.subscription_status as SubscriptionStatus) ?? null)
      setLoading(false)
    }
    load()

    const billingParam = searchParams.get("billing")
    if (billingParam === "success") {
      setSuccess("Your subscription is now active. Welcome to the Nexus contractor network.")
      setSubStatus("active")
    } else if (billingParam === "canceled") {
      setError("Checkout was canceled. Your subscription has not been changed.")
    }
  }, [searchParams])

  const handleCheckout = async (priceId: string, planId: string) => {
    setCheckoutLoading(planId)
    setError(null)
    try {
      const res  = await fetch("/api/stripe/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? "Could not start checkout. Please try again.")
      }
    } catch {
      setError("Could not start checkout. Please try again.")
    } finally {
      setCheckoutLoading(null)
    }
  }

  const handleBillingPortal = async () => {
    setPortalLoading(true)
    setError(null)
    try {
      const res  = await fetch("/api/stripe/portal", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? "Could not open billing portal. Please try again.")
      }
    } catch {
      setError("Could not open billing portal. Please try again.")
    } finally {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const isActive  = subStatus === "active" || subStatus === "trialing"
  const isPastDue = subStatus === "past_due"

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-4xl px-6 py-8">

        {/* ── Page header ── */}
        <div className="mb-8">
          <h1 className="text-xl font-bold">Billing &amp; Subscription</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your Nexus contractor membership, payment method, and billing history.
          </p>
        </div>

        {/* ── Status alerts ── */}
        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-primary">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        {isPastDue && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-600">Payment past due</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your last payment failed. Update your payment method to restore full access.
              </p>
            </div>
          </div>
        )}

        {/* ── Current subscription status ── */}
        {(isActive || isPastDue) && (
          <section className="mb-8 rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Current Subscription</h2>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                isActive
                  ? "text-green-600 bg-green-500/10 border-green-500/30"
                  : "text-amber-600 bg-amber-500/10 border-amber-500/30"
              }`}>
                {subStatus === "trialing" ? "Trial" : subStatus === "past_due" ? "Past Due" : "Active"}
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Nexus Contractor Membership</p>
                    <p className="text-[11px] text-muted-foreground">
                      Full access to all open requests in your service area
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleBillingPortal}
                  disabled={portalLoading}
                  className="text-[12px] gap-1.5 flex-shrink-0"
                >
                  {portalLoading
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <ExternalLink className="h-3.5 w-3.5" />}
                  Manage Billing
                </Button>
              </div>

              {/* What's included */}
              <div className="rounded-lg bg-muted/30 px-4 py-3 space-y-1.5">
                {[
                  "Unlimited access to open requests in Shawnee County",
                  "Real-time project notifications in your trade categories",
                  "Full project scope, photos, and budget ceiling before you claim",
                  "Direct payment from property owners — no referral fees",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <Check className="h-3 w-3 text-primary flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-muted-foreground">
                To update your payment method, view past invoices, or cancel your subscription, use the{" "}
                <button
                  onClick={handleBillingPortal}
                  className="text-primary hover:underline underline-offset-4"
                >
                  Stripe billing portal
                </button>
                .
              </p>
            </div>
          </section>
        )}

        {/* ── Plan selection (shown when not subscribed or canceled) ── */}
        {!isActive && !isPastDue && (
          <>
            <div className="mb-6">
              <p className="font-mono-label text-primary mb-3">Choose a plan</p>
              <h2 className="text-[22px] font-bold leading-tight tracking-tight">
                Get full access to the Nexus contractor network.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                One flat monthly rate. No per-lead charges, no referral fees, no hidden costs. Cancel anytime from your billing dashboard.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border overflow-hidden ${
                    plan.highlight
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  {plan.highlight && (
                    <div className="bg-primary px-4 py-1.5 text-center">
                      <span className="text-[11px] font-bold text-primary-foreground uppercase tracking-wider">
                        Best Value — Save 25%
                      </span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {plan.name}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[36px] font-bold tracking-tight">{plan.price}</span>
                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                      </div>
                      <p className="mt-1 text-[12px] text-muted-foreground">{plan.description}</p>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[12.5px] text-muted-foreground">
                          <Check className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-primary" : "text-primary"}`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Button
                      type="button"
                      onClick={() => handleCheckout(plan.priceId, plan.id)}
                      disabled={checkoutLoading !== null}
                      className={`w-full text-[13px] gap-2 ${
                        plan.highlight ? "" : "bg-foreground text-background hover:bg-foreground/90"
                      }`}
                      variant={plan.highlight ? "default" : "outline"}
                    >
                      {checkoutLoading === plan.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                      Get started — {plan.name}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── How billing works ── */}
        <section className="rounded-lg border border-border bg-card overflow-hidden mb-6">
          <div className="border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold">How Billing Works</h2>
          </div>
          <div className="divide-y divide-border text-[12.5px]">
            {[
              {
                icon: CreditCard,
                title: "Flat monthly membership fee",
                body:  "One predictable charge per billing cycle. No additional fees when you claim requests or complete jobs.",
              },
              {
                icon: Zap,
                title: "Processed securely by Stripe",
                body:  "All payment processing is handled by Stripe. Nexus never stores your card details or bank information.",
              },
              {
                icon: Shield,
                title: "Cancel or pause anytime",
                body:  "Manage your subscription, update your payment method, or cancel entirely from the Stripe billing portal — no contact required.",
              },
              {
                icon: CheckCircle,
                title: "Payouts via Stripe Connect",
                body:  "Job payments from property owners are processed through Stripe Connect and deposited directly to your linked bank account. Nexus does not take a cut.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4 px-5 py-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-0.5">{title}</p>
                  <p className="text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Trust / security note ── */}
        <div className="flex items-start gap-3 rounded-lg bg-muted/40 px-4 py-3 text-[11.5px] text-muted-foreground">
          <Shield className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
          <p>
            Nexus Operations uses Stripe for all payment processing. Your card details are encrypted and stored securely by Stripe — never by Nexus.
            Questions about billing? Visit the{" "}
            <a href="https://nexusoperations.zendesk.com/hc/en-us" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">
              Help Center
            </a>
            {" "}or call{" "}
            <a href="tel:+17854280244" className="text-primary hover:underline underline-offset-4">
              (785) 428-0244
            </a>
            .
          </p>
        </div>

      </div>
    </div>
  )
}
