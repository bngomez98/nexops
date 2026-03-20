"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AvatarUpload } from "@/components/avatar-upload"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  CreditCard,
  ExternalLink,
  Banknote,
  Clock,
  AlertTriangle,
  ArrowRight,
  Shield,
} from "lucide-react"
import Link from "next/link"

type ConnectStatus      = "not_connected" | "pending" | "active" | "restricted"
type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | null

export default function ContractorSettingsPage() {
  const [loading, setLoading]               = useState(true)
  const [saving, setSaving]                 = useState(false)
  const [saved, setSaved]                   = useState(false)
  const [error, setError]                   = useState<string | null>(null)
  const [billingLoading, setBillingLoading] = useState(false)
  const [connectLoading, setConnectLoading] = useState(false)
  const [uid, setUid]                       = useState("")
  const [avatarUrl, setAvatarUrl]           = useState<string | null>(null)
  const [connectStatus, setConnectStatus]   = useState<ConnectStatus>("not_connected")
  const [subStatus, setSubStatus]           = useState<SubscriptionStatus>(null)
  const [form, setForm] = useState({
    fullName:             "",
    phone:                "",
    emailNotifications:   true,
    smsNotifications:     true,
    availableForRequests: true,
  })

  const searchParams = useSearchParams()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUid(user.id)

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, avatar_url, stripe_connect_status, subscription_status")
        .eq("id", user.id)
        .single()

      setForm((f) => ({
        ...f,
        fullName: profile?.full_name ?? user.user_metadata?.full_name ?? "",
        phone:    profile?.phone     ?? user.user_metadata?.phone     ?? "",
      }))
      setAvatarUrl(profile?.avatar_url                          ?? null)
      setConnectStatus((profile?.stripe_connect_status as ConnectStatus) ?? "not_connected")
      setSubStatus((profile?.subscription_status as SubscriptionStatus) ?? null)
      setLoading(false)
    }
    load()

    const billingParam = searchParams.get("billing")
    const connectParam = searchParams.get("connect")

    if (billingParam === "success") {
      setSubStatus("active")
    }
    if (connectParam === "success") {
      setConnectStatus("active")
    } else if (connectParam === "pending") {
      setConnectStatus("pending")
    } else if (connectParam === "error") {
      setError("There was a problem connecting your Stripe account. Please try again.")
    }
  }, [searchParams])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: form.fullName, phone: form.phone },
    })

    if (!authError) {
      await supabase
        .from("profiles")
        .update({ full_name: form.fullName, phone: form.phone })
        .eq("id", uid)
    }

    setSaving(false)
    if (authError) {
      setError(authError.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const handleBillingPortal = async () => {
    setBillingLoading(true)
    try {
      const res  = await fetch("/api/stripe/portal", { method: "POST" })
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
      const res  = await fetch("/api/stripe/connect/onboard", { method: "POST" })
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

  const subBadge: Record<NonNullable<SubscriptionStatus>, { label: string; classes: string; dot: string }> = {
    active:   { label: "Active",    classes: "border-primary/25 bg-primary/10 text-primary",         dot: "bg-primary" },
    trialing: { label: "Trial",     classes: "border-blue-500/25 bg-blue-500/10 text-blue-500",       dot: "bg-blue-500" },
    past_due: { label: "Past Due",  classes: "border-amber-500/25 bg-amber-500/10 text-amber-500",    dot: "bg-amber-500" },
    canceled: { label: "Canceled",  classes: "border-destructive/25 bg-destructive/10 text-destructive", dot: "bg-destructive" },
  }
  const badge = subStatus ? subBadge[subStatus] : null

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* ── Page header ── */}
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight">Account Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Contact information, notification preferences, subscription, and payout account.
          </p>
        </div>

        {/* ── Alerts ── */}
        {subStatus === "past_due" && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3.5">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/15">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-500">Payment past due</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your membership payment failed. Update your payment method to keep access to open requests.{" "}
                <button onClick={handleBillingPortal} className="text-amber-500 underline-offset-4 hover:underline">
                  Update billing →
                </button>
              </p>
            </div>
          </div>
        )}
        {subStatus === "canceled" && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3.5">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-destructive/15">
              <AlertCircle className="h-3.5 w-3.5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold text-destructive">Subscription canceled</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your contractor membership has been canceled.{" "}
                <Link href="/dashboard/contractor/billing" className="text-primary underline-offset-4 hover:underline">
                  Reactivate membership →
                </Link>
              </p>
            </div>
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
        {saved && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/8 px-4 py-3.5">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-sm text-primary">Changes saved successfully.</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">

          {/* ── Contact info ── */}
          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-3.5">
              <h2 className="text-sm font-semibold">Contact Information</h2>
            </div>
            <div className="p-5 space-y-5">
              <AvatarUpload
                uid={uid}
                url={avatarUrl}
                name={form.fullName || "Contractor"}
                onUpload={(url) => setAvatarUrl(url)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-medium">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Smith"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="(785) 555-0100"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── Availability & Notifications ── */}
          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-3.5">
              <h2 className="text-sm font-semibold">Availability &amp; Notifications</h2>
            </div>
            <div className="divide-y divide-border">
              {[
                {
                  key:   "availableForRequests" as const,
                  label: "Available for new requests",
                  sub:   "Disable to pause incoming request notifications",
                },
                {
                  key:   "emailNotifications" as const,
                  label: "Email notifications",
                  sub:   "New requests, claim confirmations, and consultation reminders",
                },
                {
                  key:   "smsNotifications" as const,
                  label: "SMS notifications",
                  sub:   "Urgent alerts and time-sensitive request updates",
                },
              ].map(({ key, label, sub }) => (
                <div key={key} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, [key]: !form[key] })}
                    className={`relative h-5 w-9 rounded-full transition-colors ${form[key] ? "bg-primary" : "bg-border"}`}
                    role="switch"
                    aria-checked={form[key]}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${form[key] ? "translate-x-4" : "translate-x-0.5"}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="gap-2 font-semibold text-sm">
              {saving
                ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</>
                : "Save Changes"}
            </Button>
          </div>
        </form>

        {/* ── Subscription & Billing ── */}
        <section className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-start justify-between border-b border-border px-5 py-3.5">
            <div>
              <h2 className="text-sm font-semibold">Subscription &amp; Billing</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Manage your contractor membership, payment method, and invoices
              </p>
            </div>
            {badge && (
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.classes}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                {badge.label}
              </span>
            )}
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                  <CreditCard className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Contractor Membership</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {subStatus === "active" || subStatus === "trialing"
                      ? "Flat monthly rate — full access to all open requests"
                      : "Flat monthly rate — no per-request charges or referral fees"}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                {(subStatus === "active" || subStatus === "trialing" || subStatus === "past_due") ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleBillingPortal}
                    disabled={billingLoading}
                    className="gap-1.5 text-xs"
                  >
                    {billingLoading
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <ExternalLink className="h-3.5 w-3.5" />}
                    Manage Billing
                  </Button>
                ) : (
                  <Link
                    href="/dashboard/contractor/billing"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    View Plans <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3.5 py-2.5 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
              Payment processing is handled securely by Stripe. Nexus does not store your card details.
            </div>
          </div>
        </section>

        {/* ── Payout Account (Stripe Connect) ── */}
        <section className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold">Payout Account</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Connect a bank account to receive direct payments after each completed job
            </p>
          </div>
          <div className="p-5">
            {connectStatus === "active" ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                    <CheckCircle className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">Stripe account connected</p>
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Active
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Payouts deposit automatically after each completed job
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleConnectStripe}
                  disabled={connectLoading}
                  className="gap-1.5 flex-shrink-0 text-xs"
                >
                  {connectLoading
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <ExternalLink className="h-3.5 w-3.5" />}
                  Update Account
                </Button>
              </div>
            ) : connectStatus === "pending" ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/15">
                    <Clock className="h-4.5 w-4.5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Verification in progress</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Stripe is reviewing your information — this usually takes a few minutes
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleConnectStripe}
                  disabled={connectLoading}
                  className="gap-1.5 flex-shrink-0 text-xs"
                >
                  {connectLoading
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <ExternalLink className="h-3.5 w-3.5" />}
                  Continue Setup
                </Button>
              </div>
            ) : connectStatus === "restricted" ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 ring-1 ring-destructive/15">
                    <AlertCircle className="h-4.5 w-4.5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Action required</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Stripe needs additional information before payouts can be enabled
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConnectStripe}
                  disabled={connectLoading}
                  className="gap-1.5 flex-shrink-0 text-xs"
                >
                  {connectLoading
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <ExternalLink className="h-3.5 w-3.5" />}
                  Resolve Issues
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted ring-1 ring-border">
                    <Banknote className="h-4.5 w-4.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">No payout account connected</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Connect a bank account through Stripe to receive payments for completed jobs
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConnectStripe}
                  disabled={connectLoading}
                  className="gap-1.5 flex-shrink-0 text-xs font-semibold"
                >
                  {connectLoading
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <ExternalLink className="h-3.5 w-3.5" />}
                  Connect with Stripe
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* ── Footer note ── */}
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            To update your license, insurance, or background check documentation, contact{" "}
            <a href="mailto:admin@nexusoperations.org" className="text-primary underline-offset-4 hover:underline">
              admin@nexusoperations.org
            </a>
            .
          </p>
        </div>

      </div>
    </div>
  )
}
