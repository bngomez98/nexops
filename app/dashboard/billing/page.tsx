"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Receipt,
  Clock,
  Shield,
} from "lucide-react"

type Payment = {
  id: string
  type: "dispatch" | "invoice"
  amount_cents: number
  status: "pending" | "paid" | "refunded" | "failed"
  created_at: string
  request_id: string
  service_requests: {
    category: string
    address: string
    city: string
  } | null
}

function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function statusBadge(status: Payment["status"]) {
  const styles: Record<Payment["status"], string> = {
    paid:     "border-primary/25 bg-primary/10 text-primary",
    pending:  "border-amber-500/25 bg-amber-500/10 text-amber-500",
    refunded: "border-border bg-muted text-muted-foreground",
    failed:   "border-destructive/25 bg-destructive/10 text-destructive",
  }
  const labels: Record<Payment["status"], string> = {
    paid: "Paid", pending: "Pending", refunded: "Refunded", failed: "Failed",
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "paid" ? "bg-primary" : status === "pending" ? "bg-amber-500" : status === "failed" ? "bg-destructive" : "bg-muted-foreground"}`} />
      {labels[status]}
    </span>
  )
}

function BillingContent() {
  const [loading, setLoading]             = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const [success, setSuccess]             = useState<string | null>(null)
  const [payments, setPayments]           = useState<Payment[]>([])
  const [totalPaid, setTotalPaid]         = useState(0)
  const searchParams = useSearchParams()

  useEffect(() => {
    const payment = searchParams.get("payment")
    const billing = searchParams.get("billing")
    if (payment === "success" || billing === "success") setSuccess("Your payment was processed successfully.")
    if (payment === "cancelled" || billing === "canceled") setError("Payment was cancelled. No charge was made.")
  }, [searchParams])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("payments")
        .select(`
          id,
          type,
          amount_cents,
          status,
          created_at,
          request_id,
          service_requests (
            category,
            address,
            city
          )
        `)
        .eq("payer_id", user.id)
        .order("created_at", { ascending: false })

      const list = (data ?? []) as unknown as Payment[]
      setPayments(list)
      setTotalPaid(list.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount_cents, 0))
      setLoading(false)
    }
    load()
  }, [])

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

  const hasPaid = payments.some((p) => p.status === "paid")

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-4xl px-6 py-8">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Billing & Payments</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View your payment history, download receipts, and manage your billing details.
            </p>
          </div>
          {hasPaid && (
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
              Billing Portal
            </Button>
          )}
        </div>

        {/* Status alerts */}
        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/8 px-4 py-3.5">
            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <p className="text-sm text-primary">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3.5">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Summary card */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Paid",
              value: formatCents(totalPaid),
              icon: CreditCard,
              sub: "Across all jobs",
            },
            {
              label: "Transactions",
              value: String(payments.filter((p) => p.status === "paid").length),
              icon: Receipt,
              sub: "Completed payments",
            },
            {
              label: "Pending",
              value: String(payments.filter((p) => p.status === "pending").length),
              icon: Clock,
              sub: "Awaiting confirmation",
            },
          ].map(({ label, value, icon: Icon, sub }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{label}</p>
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-xl font-bold tabular-nums">{value}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        {/* Payment history */}
        <section className="mb-6 overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold">Payment History</h2>
          </div>

          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Receipt className="h-4.5 w-4.5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No payments yet</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                Payments for dispatch fees and project invoices will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {payments.map((payment) => {
                const req = payment.service_requests
                const typeLabel = payment.type === "dispatch" ? "Dispatch Fee" : "Project Invoice"
                const category  = req?.category
                  ? req.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                  : "Service Request"
                const location = req ? `${req.address}, ${req.city}` : null

                return (
                  <div key={payment.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        {payment.type === "dispatch"
                          ? <Receipt className="h-3.5 w-3.5 text-primary" />
                          : <CreditCard className="h-3.5 w-3.5 text-primary" />
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium">{typeLabel} — {category}</p>
                        {location && (
                          <p className="truncate text-[11px] text-muted-foreground">{location}</p>
                        )}
                        <p className="text-[11px] text-muted-foreground">{formatDate(payment.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      {statusBadge(payment.status)}
                      <span className="text-sm font-semibold tabular-nums">
                        {payment.amount_cents === 0 ? "—" : formatCents(payment.amount_cents)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Receipts / portal CTA */}
        {hasPaid && (
          <section className="mb-6 overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-start gap-4 p-5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Receipt className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold">Download receipts</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Access full receipts, update your billing email, or manage payment methods in the Stripe billing portal.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBillingPortal}
                disabled={portalLoading}
                className="flex-shrink-0 gap-1.5 text-xs"
              >
                {portalLoading
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <ExternalLink className="h-3.5 w-3.5" />}
                Open Portal
              </Button>
            </div>
          </section>
        )}

        {/* Trust note */}
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3.5 text-xs text-muted-foreground">
          <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
          <p>
            All payments are processed securely by Stripe. Nexus Operations never stores your card details.
            Questions?{" "}
            <a href="tel:+17854280244" className="text-primary underline-offset-4 hover:underline">
              (785) 428-0244
            </a>
            {" "}or visit the{" "}
            <a href="https://nexusoperations.zendesk.com/hc/en-us" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">
              Help Center
            </a>.
          </p>
        </div>

      </div>
    </div>
  )
}

function BillingFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={<BillingFallback />}>
      <BillingContent />
    </Suspense>
  )
}
