"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle,
  CreditCard,
  ExternalLink,
  Loader2,
} from "lucide-react"
import {
  formatUsd,
  getBillingRole,
  getSubscriptionPriceCents,
  hasActiveSubscription,
  OWNER_SUBSCRIPTION_MULTIPLIER,
  SERVICE_REQUEST_FEE_CENTS,
  type BillingRole,
  type SubscriptionStatus,
} from "@/lib/billing/config"

type BillingPageProps = {
  role: BillingRole
}

type ProfileBillingRecord = {
  subscription_status: SubscriptionStatus
  subscription_price_cents: number | null
  contractor_hourly_rate: number | null
  contractor_minimum_service_fee: number | null
}

export function BillingPage({ role }: BillingPageProps) {
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [savingPricing, setSavingPricing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>(null)
  const [pricing, setPricing] = useState({
    subscriptionPrice: "",
    hourlyRate: "",
    minimumServiceFee: "",
  })

  const searchParams = useSearchParams()

  const ownerPriceText = useMemo(() => {
    const contractorPrice = Number.parseFloat(pricing.subscriptionPrice || "0")
    if (!contractorPrice || contractorPrice <= 0) return null
    return formatUsd(Math.round(contractorPrice * OWNER_SUBSCRIPTION_MULTIPLIER * 100))
  }, [pricing.subscriptionPrice])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const billingRole = getBillingRole(user.user_metadata?.role)
      if (billingRole !== role) {
        window.location.href = billingRole === "contractor" ? "/dashboard/contractor/billing" : "/dashboard/billing"
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, subscription_price_cents, contractor_hourly_rate, contractor_minimum_service_fee")
        .eq("id", user.id)
        .single()

      const billingProfile = (profile ?? {}) as Partial<ProfileBillingRecord>
      const effectivePriceCents = getSubscriptionPriceCents({
        billingRole: role,
        configuredPriceCents: billingProfile.subscription_price_cents ?? null,
      })

      setSubStatus(billingProfile.subscription_status ?? null)
      setPricing({
        subscriptionPrice: role === "contractor" ? String(effectivePriceCents / 100) : String(effectivePriceCents / 100),
        hourlyRate: billingProfile.contractor_hourly_rate ? String(billingProfile.contractor_hourly_rate) : "",
        minimumServiceFee: billingProfile.contractor_minimum_service_fee
          ? String(billingProfile.contractor_minimum_service_fee)
          : "",
      })
      setLoading(false)
    }

    void load()

    const billingParam = searchParams.get("billing")
    if (billingParam === "success") {
      setSuccess(
        role === "contractor"
          ? "Your contractor subscription is active and your claim fee is now waived."
          : "Your property owner subscription is active and accepted-request fees are now waived.",
      )
      setSubStatus("active")
    } else if (billingParam === "canceled") {
      setError("Checkout was canceled. Your subscription has not been changed.")
    }
  }, [role, searchParams])

  async function openPortal() {
    setPortalLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
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

  async function startCheckout() {
    setCheckoutLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? "Could not start checkout. Please try again.")
      }
    } catch {
      setError("Could not start checkout. Please try again.")
    } finally {
      setCheckoutLoading(false)
    }
  }

  async function savePricing() {
    setSavingPricing(true)
    setError(null)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      if (role !== "contractor") return

      const subscriptionPrice = Number.parseFloat(pricing.subscriptionPrice)
      const hourlyRate = pricing.hourlyRate ? Number.parseFloat(pricing.hourlyRate) : null
      const minimumServiceFee = pricing.minimumServiceFee ? Number.parseFloat(pricing.minimumServiceFee) : null

      if (!Number.isFinite(subscriptionPrice) || subscriptionPrice <= 0) {
        throw new Error("Set a valid contractor subscription price before saving.")
      }

      await supabase
        .from("profiles")
        .update({
          subscription_price_cents: Math.round(subscriptionPrice * 100),
          contractor_hourly_rate: hourlyRate,
          contractor_minimum_service_fee: minimumServiceFee,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      setSuccess("Your pricing preferences were saved.")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save pricing.")
    } finally {
      setSavingPricing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const isActive = hasActiveSubscription(subStatus)
  const isPastDue = subStatus === "past_due"

  const planTitle = role === "contractor" ? "Nexus Contractor Membership" : "Nexus Property Owner Membership"
  const planPrice = formatUsd(
    getSubscriptionPriceCents({
      billingRole: role,
      configuredPriceCents: role === "contractor" ? Math.round(Number(pricing.subscriptionPrice || "0") * 100) : null,
    }),
  )

  const benefits =
    role === "contractor"
      ? [
          "Unlimited access to open requests",
          "Waived $99 claim fee on accepted jobs",
          "Direct owner payment through Stripe Connect",
          "Contractor pricing preferences stored in your profile",
        ]
      : [
          "Waived $99 accepted-request fee",
          "Centralized billing history and payment methods",
          "Faster acceptance workflow for matching jobs",
          "Monthly coverage for recurring property service needs",
        ]

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight">
            {role === "contractor" ? "Billing & Subscription" : "Owner Billing & Subscription"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {role === "contractor"
              ? "Manage your membership, contractor pricing, and per-request fallback fees."
              : "Manage your owner subscription and waive accepted-request fees across your properties."}
          </p>
        </div>

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
        )}
        {isPastDue && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3.5">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/15">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-500">Payment past due</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Update your Stripe billing details to restore fee waivers and account access.
              </p>
            </div>
          </div>
        )}

        <section className="mb-8 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold">Current Plan</h2>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                isActive
                  ? "border-primary/25 bg-primary/10 text-primary"
                  : isPastDue
                    ? "border-amber-500/25 bg-amber-500/10 text-amber-500"
                    : "border-border bg-muted text-muted-foreground"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive ? "bg-primary" : isPastDue ? "bg-amber-500" : "bg-muted-foreground"
                }`}
              />
              {subStatus === "trialing"
                ? "Trial"
                : subStatus === "past_due"
                  ? "Past Due"
                  : isActive
                    ? "Active"
                    : "Pay Per Request"}
            </span>
          </div>

          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                  <CreditCard className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{planTitle}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {planPrice}/month • {isActive ? "fees waived while active" : `${formatUsd(SERVICE_REQUEST_FEE_CENTS)} fallback per accepted request`}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant={isActive || isPastDue ? "outline" : "default"}
                size="sm"
                onClick={isActive || isPastDue ? openPortal : startCheckout}
                disabled={portalLoading || checkoutLoading}
                className="gap-1.5 text-xs"
              >
                {portalLoading || checkoutLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : isActive || isPastDue ? (
                  <ExternalLink className="h-3.5 w-3.5" />
                ) : (
                  <CreditCard className="h-3.5 w-3.5" />
                )}
                {isActive || isPastDue ? "Manage Billing" : "Start Subscription"}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-2 rounded-xl bg-muted/40 p-4 sm:grid-cols-2">
              {benefits.map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3 w-3 flex-shrink-0 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {role === "contractor" && (
          <section className="mb-8 overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-3.5">
              <h2 className="text-sm font-semibold">Contractor Pricing</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Set your own monthly contractor membership price and store baseline service pricing for invoicing.
              </p>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-3">
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">Contractor subscription</span>
                <input
                  value={pricing.subscriptionPrice}
                  onChange={(event) => setPricing((current) => ({ ...current, subscriptionPrice: event.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  inputMode="decimal"
                  placeholder="99.00"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">Hourly rate</span>
                <input
                  value={pricing.hourlyRate}
                  onChange={(event) => setPricing((current) => ({ ...current, hourlyRate: event.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  inputMode="decimal"
                  placeholder="125.00"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">Minimum service fee</span>
                <input
                  value={pricing.minimumServiceFee}
                  onChange={(event) => setPricing((current) => ({ ...current, minimumServiceFee: event.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  inputMode="decimal"
                  placeholder="250.00"
                />
              </label>
            </div>
            <div className="flex items-center justify-between border-t border-border px-5 py-4">
              <p className="text-xs text-muted-foreground">
                Property owner memberships are offered at 2× the standard contractor subscription price.
                {ownerPriceText ? ` Current contractor price: ${formatUsd(Math.round(Number.parseFloat(pricing.subscriptionPrice) * 100))}/month.` : ""}
              </p>
              <Button type="button" onClick={savePricing} disabled={savingPricing}>
                {savingPricing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Pricing
              </Button>
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold">How Billing Works</h2>
          </div>
          <div className="space-y-3 p-5 text-sm text-muted-foreground">
            <p>
              {role === "contractor"
                ? `Without an active subscription, you can still accept a request by paying a ${formatUsd(SERVICE_REQUEST_FEE_CENTS)} claim fee when you claim it.`
                : `Without an active subscription, a ${formatUsd(SERVICE_REQUEST_FEE_CENTS)} accepted-request fee is charged only after a contractor accepts your request.`}
            </p>
            <p>
              Contractors can store their own subscription price, hourly rate, and minimum service fee so billing preferences stay connected to their profile.
            </p>
            <p>
              Use the Stripe billing portal to update payment methods, review invoices, and cancel or reactivate your subscription.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
