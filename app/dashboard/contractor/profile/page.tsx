"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const serviceCategories = [
  "Tree Removal",
  "HVAC",
  "Electrical",
  "Roofing",
  "Concrete",
  "Fencing",
  "Plumbing",
  "General Repair",
]

export default function ContractorProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    businessName: "",
    licenseNumber: "",
    insuranceCarrier: "",
    bio: "",
    serviceRadius: "25",
    selectedCategories: [] as string[],
  })

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/profile")
        const data = await res.json()

        if (!res.ok || data?.error) {
          setError(data?.error ?? "We could not load your profile.")
          return
        }

        setForm({
          businessName: data.business_name ?? "",
          licenseNumber: data.license_number ?? "",
          insuranceCarrier: data.insurance_carrier ?? "",
          bio: data.bio ?? "",
          serviceRadius: data.service_radius != null ? String(data.service_radius) : "25",
          selectedCategories: Array.isArray(data.service_categories) ? data.service_categories : [],
        })
      } catch {
        setError("We could not load your profile.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const toggleCategory = (category: string) => {
    setForm((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((item) => item !== category)
        : [...prev.selectedCategories, category],
    }))
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError("You must be signed in to update your profile.")
        return
      }

      const { error: dbError } = await supabase
        .from("profiles")
        .update({
          business_name: form.businessName || null,
          license_number: form.licenseNumber || null,
          insurance_carrier: form.insuranceCarrier || null,
          bio: form.bio || null,
          service_radius: Number(form.serviceRadius) || 25,
          service_categories: form.selectedCategories,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (dbError) {
        setError(dbError.message)
        return
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("Something went wrong while saving your profile.")
    } finally {
      setSaving(false)
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
          <h1 className="text-xl font-bold">Contractor Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Maintain your business details, service specialties, and coverage area so property owners can review accurate information.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <section className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Business Information</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Shown to property owners after you claim a request.</p>
            </div>
            <div className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="businessName" className="text-xs">Business Name</Label>
                  <Input id="businessName" placeholder="Smith HVAC Services LLC" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="licenseNumber" className="text-xs">Contractor License Number</Label>
                  <Input id="licenseNumber" placeholder="KS-CONT-XXXXX" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} className="text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="insuranceCarrier" className="text-xs">Insurance Carrier and Policy</Label>
                <Input id="insuranceCarrier" placeholder="State Farm — Policy #XXXXXXXX" value={form.insuranceCarrier} onChange={(e) => setForm({ ...form, insuranceCarrier: e.target.value })} className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs">Business Description</Label>
                <textarea
                  id="bio"
                  rows={4}
                  placeholder="Share your experience, specialties, and what clients can expect from your team."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="flex w-full resize-none rounded border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Service Categories</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">You will receive new request notifications only for the categories selected below.</p>
            </div>
            <div className="p-5">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {serviceCategories.map((category) => {
                  const selected = form.selectedCategories.includes(category)
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`rounded border px-3 py-2.5 text-left text-[12px] font-medium transition ${
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {category}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Service Area</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Set your coverage radius from Topeka, KS (66604).</p>
            </div>
            <div className="p-5">
              <div className="w-36 space-y-1.5">
                <Label htmlFor="radius" className="text-xs">Radius (miles)</Label>
                <Input
                  id="radius"
                  type="number"
                  min="5"
                  max="150"
                  value={form.serviceRadius}
                  onChange={(e) => setForm({ ...form, serviceRadius: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
          {saved && (
            <div className="flex items-center gap-2 rounded border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              Profile saved successfully.
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">Changes are applied immediately after save.</p>
            <Button type="submit" disabled={saving} className="text-[13px]">
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
