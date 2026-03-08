"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AvatarUpload } from "@/components/avatar-upload"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2, CreditCard, ExternalLink, Banknote, Clock } from "lucide-react"

type ConnectStatus = "not_connected" | "pending" | "active" | "restricted"

export default function ContractorSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [billingLoading, setBillingLoading] = useState(false)
  const [connectLoading, setConnectLoading] = useState(false)
  const [uid, setUid] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>("not_connected")
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    emailNotifications: true,
    smsNotifications: true,
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
        .select("full_name, phone, avatar_url, stripe_connect_status")
        .eq("id", user.id)
        .single()

      setForm((f) => ({
        ...f,
        fullName: profile?.full_name ?? user.user_metadata?.full_name ?? "",
        phone: profile?.phone ?? user.user_metadata?.phone ?? "",
      }))
      setAvatarUrl(profile?.avatar_url ?? null)
      setConnectStatus((profile?.stripe_connect_status as ConnectStatus) ?? "not_connected")
      setLoading(false)
    }
    load()

    // Show feedback after returning from Stripe onboarding
    const connectParam = searchParams.get("connect")
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
          <h1 className="text-xl font-bold">Account Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Contact details, notifications, and subscription.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">

          {/* Profile photo + contact */}
          <section className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
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
                  <Label htmlFor="fullName" className="text-xs">Full Name</Label>
                  <Input id="fullName" placeholder="John Smith" value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                  <Input id="phone" placeholder="(785) 555-0100" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} className="text-sm" />
                </div>
              </div>
            </div>
          </section>

          {/* Availability & Notifications */}
          <section className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Availability &amp; Notifications</h2>
            </div>
            <div className="divide-y divide-border">
              {[
                { key: "availableForRequests" as const, label: "Available for new requests",    sub: "Turn off to stop receiving new request notifications" },
                { key: "emailNotifications"   as const, label: "Email notifications",            sub: "New requests, claim confirmations, consultation reminders" },
                { key: "smsNotifications"     as const, label: "SMS notifications",              sub: "New request alerts and time-sensitive updates" },
              ].map(({ key, label, sub }) => (
                <div key={key} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
                  </div>
                  <button type="button" onClick={() => setForm({ ...form, [key]: !form[key] })}
                    className={`relative h-5 w-9 rounded-full transition ${form[key] ? "bg-primary" : "bg-border"}`}
                    role="switch" aria-checked={form[key]}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form[key] ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {error && (
            <div className="flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
            </div>
          )}
          {saved && (
            <div className="flex items-center gap-2 rounded border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />Settings saved.
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="text-[13px]">
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Save Changes"}
            </Button>
          </div>
        </form>

        {/* Billing — outside the save form so it doesn't submit */}
        <section className="mt-5 rounded-lg border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold">Subscription &amp; Billing</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">Manage your monthly membership, invoices, and payment method</p>
          </div>
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Contractor Membership</p>
                <p className="text-[11px] text-muted-foreground">Flat monthly fee — no per-lead charges</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBillingPortal}
              disabled={billingLoading}
              className="text-[12px] gap-1.5"
            >
              {billingLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ExternalLink className="h-3.5 w-3.5" />
              )}
              Manage Billing
            </Button>
          </div>
        </section>

        {/* Stripe Connect — payout account */}
        <section className="mt-5 rounded-lg border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold">Payout Account</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Connect a bank account so Nexus can pay you automatically after each completed job
            </p>
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
                    <p className="text-[11px] text-muted-foreground">
                      Payouts are deposited automatically after job completion
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleConnectStripe}
                  disabled={connectLoading}
                  className="text-[12px] gap-1.5"
                >
                  {connectLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ExternalLink className="h-3.5 w-3.5" />
                  )}
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
                    <p className="text-[11px] text-muted-foreground">
                      Stripe is reviewing your information. This usually takes a few minutes.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleConnectStripe}
                  disabled={connectLoading}
                  className="text-[12px] gap-1.5"
                >
                  {connectLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ExternalLink className="h-3.5 w-3.5" />
                  )}
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
                    <p className="text-[11px] text-muted-foreground">
                      Stripe needs additional information before payouts can be enabled
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConnectStripe}
                  disabled={connectLoading}
                  className="text-[12px] gap-1.5"
                >
                  {connectLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ExternalLink className="h-3.5 w-3.5" />
                  )}
                  Fix Issues
                </Button>
              </div>
            ) : (
              /* not_connected */
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                    <Banknote className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">No payout account connected</p>
                    <p className="text-[11px] text-muted-foreground">
                      Connect with Stripe to receive payments for completed jobs
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConnectStripe}
                  disabled={connectLoading}
                  className="text-[12px] gap-1.5"
                >
                  {connectLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ExternalLink className="h-3.5 w-3.5" />
                  )}
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
