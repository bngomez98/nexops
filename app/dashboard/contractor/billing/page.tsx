"use client"

import Script from "next/script"
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
  Check,
} from "lucide-react"
import { StripePricingTable } from "@/components/billing/stripe-pricing-table"

// Tell TypeScript about the Stripe Buy Button web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-buy-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "buy-button-id": string
        "publishable-key": string
      }
    }
  }
}

const PRICING_TABLE_ID   = "prctbl_1TBPE0EFsbUunf9StQYzYJqe"
const STRIPE_PUBLISHABLE = "pk_live_51T6KiTEFsbUunf9SZCRohOy2iHhyoL7HgIign7xKmfzR9837SYXDDlSKdd60E5Ft5vRy7yffafvip2agiwYyxMkc000v1nxqFJ"

export default function ContractorBillingPage() {
  const [loading, setLoading]             = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const [success, setSuccess]             = useState<string | null>(null)
  const [subStatus, setSubStatus]         = useState<SubscriptionStatus>(null)
  const [userEmail, setUserEmail]         = useState<string | undefined>(undefined)
  const [userId, setUserId]               = useState<string | undefined>(undefined)
const BUY_BUTTON_ID       = process.env.NEXT_PUBLIC_STRIPE_BUY_BUTTON_ID       ?? ""
const PUBLISHABLE_KEY     = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY      ?? ""

type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | null

export default function ContractorBillingPage() {
  const [loading, setLoading]           = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [success, setSuccess]           = useState<string | null>(null)
  const [subStatus, setSubStatus]       = useState<SubscriptionStatus>(null)

  const searchParams = useSearchParams()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserEmail(user.email ?? undefined)
      setUserId(user.id)

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
    <>
      {/* Stripe Buy Button script — loaded once, lazily */}
      <Script
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="lazyOnload"
      />

      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl px-6 py-8">

          {/* ── Page header ── */}
          <div className="mb-8">
            <h1 className="text-xl font-bold tracking-tight">Billing &amp; Subscription</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your Nexus contractor membership, payment method, and billing history.
            </p>
          </div>

          {/* ── Status alerts ── */}
          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/8 px-4 py-3.5">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
                <CheckCircle className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-sm text-primary">{success}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3.5">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-destructive/15">
                <AlertCircle className="h-3.5 w-3.5 text-destructive" />
              </div>
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </section>
        )}

        {/* ── Plan selection (shown when not subscribed or canceled) ── */}
        {!isActive && !isPastDue && (
          <section className="mb-8">
            <div className="mb-6">
              <h2 className="text-[22px] font-bold leading-tight tracking-tight">
                Get full access to the Nexus contractor network.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                One flat rate. No per-lead charges, no referral fees, no hidden costs. Cancel anytime.
              </p>
            </div>
            <StripePricingTable
              pricingTableId={PRICING_TABLE_ID}
              publishableKey={STRIPE_PUBLISHABLE}
              clientReferenceId={userId}
              customerEmail={userEmail}
            />
          </section>
        )}
          )}
          {isPastDue && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3.5">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-500">Payment past due</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Your last payment failed. Update your payment method to restore full access.
                </p>
              </div>
            </div>
          )}

          {/* ── Active subscription card ── */}
          {(isActive || isPastDue) && (
            <section className="mb-8 overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <h2 className="text-sm font-semibold">Current Subscription</h2>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                  isActive
                    ? "border-primary/25 bg-primary/10 text-primary"
                    : "border-amber-500/25 bg-amber-500/10 text-amber-500"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-primary" : "bg-amber-500"}`} />
                  {subStatus === "trialing" ? "Trial" : subStatus === "past_due" ? "Past Due" : "Active"}
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                      <CreditCard className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Nexus Contractor Membership</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
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
                    className="gap-1.5 flex-shrink-0 text-xs"
                  >
                    {portalLoading
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <ExternalLink className="h-3.5 w-3.5" />}
                    Manage Billing
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/40 p-4 sm:grid-cols-2">
                  {[
                    "Unlimited access to open requests",
                    "Real-time project notifications",
                    "Full scope and budget before claiming",
                    "Direct payment, no referral fees",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 flex-shrink-0 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  To update your payment method, view past invoices, or cancel, use the{" "}
                  <button
                    onClick={handleBillingPortal}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Stripe billing portal
                  </button>
                  .
                </p>
              </div>
            </section>
          )}

          {/* ── Subscribe — Stripe Buy Button ── */}
          {!isActive && !isPastDue && (
            <section className="mb-8 overflow-hidden rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-3.5">
                <h2 className="text-sm font-semibold">Choose a Plan</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  One flat rate. No per-lead charges, no referral fees, no hidden costs. Cancel anytime.
                </p>
              </div>
              <div className="flex items-center justify-center px-5 py-8">
                {BUY_BUTTON_ID && PUBLISHABLE_KEY ? (
                  <stripe-buy-button
                    buy-button-id={BUY_BUTTON_ID}
                    publishable-key={PUBLISHABLE_KEY}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Checkout is not configured. Contact support.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ── How billing works ── */}
          <section className="overflow-hidden rounded-xl border border-border bg-card mb-6">
            <div className="border-b border-border px-5 py-3.5">
              <h2 className="text-sm font-semibold">How Billing Works</h2>
            </div>
            <div className="divide-y divide-border">
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
                  body:  "Job payments from property owners are processed through Stripe Connect and deposited directly to your linked bank account.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-4 px-5 py-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-foreground">{title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Trust note ── */}
          <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3.5 text-xs text-muted-foreground">
            <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <p>
              Nexus Operations uses Stripe for all payment processing. Your card details are encrypted and stored securely by Stripe — never by Nexus.
              Questions about billing? Visit the{" "}
              <a href="https://nexusoperations.zendesk.com/hc/en-us" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">
                Help Center
              </a>
              {" "}or call{" "}
              <a href="tel:+17854280244" className="text-primary underline-offset-4 hover:underline">
                (785) 428-0244
              </a>
              .
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
