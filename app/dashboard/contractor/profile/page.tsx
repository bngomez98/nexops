"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"

const serviceCategories = [
  "Tree Removal", "HVAC", "Electrical", "Roofing", "Concrete",
  "Fencing", "Plumbing", "General Repair",
]

export default function ContractorProfilePage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    businessName: "",
    licenseNumber: "",
    insuranceCarrier: "",
    bio: "",
    serviceRadius: "25",
    selectedCategories: [] as string[],
  })

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
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Contractor Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Business information, service categories, and your service area. Shown to property owners after you claim their request.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">

          {/* Business info */}
          <section className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Business Information</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="businessName" className="text-xs">Business Name</Label>
                  <Input id="businessName" placeholder="Smith HVAC Services LLC" value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="licenseNumber" className="text-xs">Contractor License Number</Label>
                  <Input id="licenseNumber" placeholder="KS-CONT-XXXXX" value={form.licenseNumber}
                    onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} className="text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="insuranceCarrier" className="text-xs">Insurance Carrier</Label>
                <Input id="insuranceCarrier" placeholder="State Farm — Policy #XXXXXXXX" value={form.insuranceCarrier}
                  onChange={(e) => setForm({ ...form, insuranceCarrier: e.target.value })} className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs">Business Description</Label>
                <textarea
                  id="bio"
                  rows={3}
                  placeholder="Brief overview of your business, years in operation, and any specializations..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="flex w-full rounded border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>
            </div>
          </section>

          {/* Service categories */}
          <section className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Service Categories</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">You will only receive notifications for request types you select.</p>
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
                      className={`rounded border px-3 py-2 text-[12px] font-medium text-left transition ${selected ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Service area */}
          <section className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Service Area</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Radius from Topeka, KS (66604)</p>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4">
                <div className="space-y-1.5 w-36">
                  <Label htmlFor="radius" className="text-xs">Radius (miles)</Label>
                  <Input id="radius" type="number" min="5" max="100" value={form.serviceRadius}
                    onChange={(e) => setForm({ ...form, serviceRadius: e.target.value })} className="text-sm" />
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  You will only see open requests within this distance of your registered address.
                </p>
              </div>
            </div>
          </section>

          {saved && (
            <div className="flex items-center gap-2 rounded border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />Profile saved.
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="text-[13px]">
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Profile"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
