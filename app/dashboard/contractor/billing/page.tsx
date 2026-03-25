"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { AlertCircle, Banknote, CheckCircle, Clock, CreditCard, ExternalLink, Loader2 } from "lucide-react"

type ConnectStatus = "not_connected" | "pending" | "active" | "restricted"

export default function ContractorBillingPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [billingLoading, setBillingLoading] = useState(false)
  const [connectLoading, setConnectLoading] = useState(false)
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>("not_connected")
  const searchParams = useSearchParams()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_connect_status")
        .eq("id", user.id)
        .single()

      setConnectStatus((profile?.stripe_connect_status as ConnectStatus) ?? "not_connected")
      setLoading(false)
    }

    load()

    const connectParam = searchParams.get("connect")
    if (connectParam === "success") {
      setConnectStatus("active")
    } else if (connectParam === "pending") {
      setConnectStatus("pending")
    } else if (connectParam === "error") {
      setError("There was a problem connecting your Stripe account. Please try again.")
    }
  }, [searchParams])

  const handleBillingPortal = async () => {
    setBillingLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? "Could not open billing portal.")
      }
    } catch {
      setError("Could not open billing portal.")
    } finally {
      setBillingLoading(false)
    }
  }

  const handleConnectStripe = async () => {
    setConnectLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/connect/onboard", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? "Could not start Stripe Connect onboarding.")
      }
    } catch {
      setError("Could not start Stripe Connect onboarding.")
    } finally {
      setConnectLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Billing</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage contractor membership billing and payout setup in one place.</p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold">Subscription &amp; Billing</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Flat monthly membership, invoices, and payment method.</p>
          </div>
          <div className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Contractor Membership</p>
                <p className="text-[11px] text-muted-foreground">Monthly plan. No per-lead charges or referral cut.</p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleBillingPortal} disabled={billingLoading} className="gap-1.5 text-[12px]">
              {billingLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
              Manage Billing
            </Button>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold">Payout Account</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Connect Stripe to receive payouts automatically after completed jobs.</p>
          </div>
          <div className="p-5">
            {connectStatus === "active" ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Stripe account connected</p>
                    <p className="text-[11px] text-muted-foreground">Payouts are deposited automatically after job completion.</p>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleConnectStripe} disabled={connectLoading} className="gap-1.5 text-[12px]">
                  {connectLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
                  Update Account
                </Button>
              </div>
            ) : connectStatus === "pending" ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-500/10">
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Verification in progress</p>
                    <p className="text-[11px] text-muted-foreground">Stripe is reviewing your information. This usually takes a few minutes.</p>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleConnectStripe} disabled={connectLoading} className="gap-1.5 text-[12px]">
                  {connectLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
                  Continue Setup
                </Button>
              </div>
            ) : connectStatus === "restricted" ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-destructive/10">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Action required</p>
                    <p className="text-[11px] text-muted-foreground">Stripe needs additional information before payouts can be enabled.</p>
                  </div>
                </div>
                <Button type="button" size="sm" onClick={handleConnectStripe} disabled={connectLoading} className="gap-1.5 text-[12px]">
                  {connectLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
                  Fix Issues
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                    <Banknote className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">No payout account connected</p>
                    <p className="text-[11px] text-muted-foreground">Connect with Stripe to receive payments for completed jobs.</p>
                  </div>
                </div>
                <Button type="button" size="sm" onClick={handleConnectStripe} disabled={connectLoading} className="gap-1.5 text-[12px]">
                  {connectLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
                  Connect with Stripe
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
