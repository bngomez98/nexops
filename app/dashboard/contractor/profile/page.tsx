"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

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
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [uid, setUid]           = useState("")
  const [form, setForm] = useState({
    businessName:         "",
    licenseNumber:        "",
    insuranceCarrier:     "",
    bio:                  "",
    serviceRadius:        "25",
    selectedCategories:   [] as string[],
  })

  /* ── Load existing profile data ── */
  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUid(user.id)

      const { data: profile } = await supabase
        .from("profiles")
        .select("business_name, license_number, insurance_carrier, bio, service_radius, service_categories")
        .eq("id", user.id)
        .single()

      if (profile) {
        setForm({
          businessName:       profile.business_name      ?? "",
          licenseNumber:      profile.license_number     ?? "",
          insuranceCarrier:   profile.insurance_carrier  ?? "",
          bio:                profile.bio                ?? "",
          serviceRadius:      profile.service_radius     ? String(profile.service_radius) : "25",
          selectedCategories: Array.isArray(profile.service_categories) ? profile.service_categories : [],
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(cat)
        ? prev.selectedCategories.filter((c) => c !== cat)
        : [...prev.selectedCategories, cat],
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const supabase = createClient()

    const { error: dbError } = await supabase
      .from("profiles")
      .update({
        business_name:       form.businessName     || null,
        license_number:      form.licenseNumber    || null,
        insurance_carrier:   form.insuranceCarrier || null,
        bio:                 form.bio              || null,
        service_radius:      Number(form.serviceRadius) || 25,
        service_categories:  form.selectedCategories,
        updated_at:          new Date().toISOString(),
      })
      .eq("id", uid)

    setSaving(false)
    if (dbError) {
      setError(dbError.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
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
            Business information, service categories, and coverage area. Displayed to property owners after you claim their request.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">

          {/* ── Business info ── */}
          <section className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Business Information</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Shown to property owners once you claim their request
              </p>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="businessName" className="text-xs">Business Name</Label>
                  <Input
                    id="businessName"
                    placeholder="Smith HVAC Services LLC"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="licenseNumber" className="text-xs">Contractor License Number</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="KS-CONT-XXXXX"
                    value={form.licenseNumber}
                    onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="insuranceCarrier" className="text-xs">Insurance Carrier &amp; Policy</Label>
                <Input
                  id="insuranceCarrier"
                  placeholder="State Farm — Policy #XXXXXXXX"
                  value={form.insuranceCarrier}
                  onChange={(e) => setForm({ ...form, insuranceCarrier: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs">Business Description</Label>
                <textarea
                  id="bio"
                  rows={4}
                  placeholder="Brief overview of your business, years in operation, specializations, and what sets your work apart..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="flex w-full rounded border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
                <p className="text-[11px] text-muted-foreground">
                  Keep this concise — property owners read it before approving your consultation.
                </p>
              </div>
            </div>
          </section>

          {/* ── Service categories ── */}
          <section className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Service Categories</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                You will only receive notifications for request types you select here
              </p>
            </div>
            <div className="p-5">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {serviceCategories.map((cat) => {
                  const selected = form.selectedCategories.includes(cat)
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`rounded border px-3 py-2.5 text-[12px] font-medium text-left transition ${
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
              {form.selectedCategories.length === 0 && (
                <p className="mt-3 text-[11px] text-amber-500">
                  Select at least one category to receive request notifications.
                </p>
              )}
            </div>
          </section>

          {/* ── Service area ── */}
          <section className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Service Area</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Coverage radius from Topeka, KS (66604) — requests outside this range will not appear in your feed
              </p>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap items-end gap-6">
                <div className="space-y-1.5 w-36">
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
                <div className="pb-0.5">
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    {Number(form.serviceRadius) <= 25
                      ? "Covers central Topeka and immediate surrounding areas"
                      : Number(form.serviceRadius) <= 50
                      ? "Covers Shawnee County and most adjacent counties"
                      : "Broad regional coverage — verify you can realistically serve this area"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Error / success */}
          {error && (
            <div className="flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
            </div>
          )}
          {saved && (
            <div className="flex items-center gap-2 rounded border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />Profile saved successfully.
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              Profile updates take effect immediately on your next claimed request.
            </p>
            <Button type="submit" disabled={saving} className="text-[13px]">
              {saving
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</>
                : "Save Profile"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
