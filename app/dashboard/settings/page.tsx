"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "KS",
    zip: "",
    emailNotifications: true,
    smsNotifications: false,
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: form.fullName, phone: form.phone },
    })
    setSaving(false)
    if (updateError) {
      setError(updateError.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Account Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Profile, contact details, and notification preferences.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Profile */}
          <section className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Profile</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs">Full Name</Label>
                  <Input id="fullName" placeholder="Jane Smith" value={form.fullName}
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

          {/* Service address */}
          <section className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Primary Property Address</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Default location for new requests</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs">Street Address</Label>
                <Input id="address" placeholder="1234 SW Gage Blvd" value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })} className="text-sm" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs">City</Label>
                  <Input id="city" placeholder="Topeka" value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-xs">State</Label>
                  <Input id="state" value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zip" className="text-xs">ZIP</Label>
                  <Input id="zip" placeholder="66604" value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })} className="text-sm" />
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Notifications</h2>
            </div>
            <div className="divide-y divide-border">
              {[
                { key: "emailNotifications" as const, label: "Email notifications", sub: "Assignment, consultation confirmation, status updates" },
                { key: "smsNotifications"   as const, label: "SMS notifications",   sub: "Critical updates only — consultation reminders and cancellations" },
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
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
