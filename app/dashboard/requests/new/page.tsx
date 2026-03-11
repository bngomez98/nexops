"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft, ArrowRight, TreePine, Thermometer, Zap,
  Home, Hammer, Fence, Loader2, CheckCircle, AlertCircle,
  Wrench, Droplets, PaintBucket, Shield,
} from "lucide-react"

const CATEGORIES = [
  { id: "tree-removal",     name: "Tree Removal",      icon: TreePine    },
  { id: "hvac",             name: "HVAC",               icon: Thermometer },
  { id: "electrical",       name: "Electrical",         icon: Zap         },
  { id: "roofing",          name: "Roofing",            icon: Home        },
  { id: "concrete",         name: "Concrete / Flatwork",icon: Hammer      },
  { id: "fencing",          name: "Fencing",            icon: Fence       },
  { id: "plumbing",         name: "Plumbing",           icon: Wrench      },
  { id: "waterproofing",    name: "Waterproofing",      icon: Droplets    },
  { id: "painting",         name: "Painting / Coatings",icon: PaintBucket },
  { id: "general-repair",   name: "General Repair",     icon: Shield      },
]

type FormData = {
  category:      string
  description:   string
  budgetMin:     string
  budgetMax:     string
  address:       string
  city:          string
  state:         string
  zipCode:       string
  preferredDates:string
  notes:         string
}

const EMPTY: FormData = {
  category: "", description: "", budgetMin: "", budgetMax: "",
  address: "", city: "Topeka", state: "KS", zipCode: "",
  preferredDates: "", notes: "",
}

export default function NewRequestPage() {
  const router = useRouter()
  const [step, setStep]     = useState(1)
  const [form, setForm]     = useState<FormData>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const set = (key: keyof FormData, value: string) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      setError("You must be signed in to submit a request.")
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from("service_requests").insert({
      owner_id:        user.id,
      category:        form.category,
      description:     form.description,
      budget_min:      form.budgetMin  ? parseFloat(form.budgetMin)  : null,
      budget_max:      form.budgetMax  ? parseFloat(form.budgetMax)  : null,
      address:         form.address,
      city:            form.city,
      state:           form.state,
      zip_code:        form.zipCode,
      preferred_dates: form.preferredDates || null,
      additional_notes:form.notes || null,
      status:          "pending_review",
    })

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push("/dashboard/requests"), 2000)
  }

  const selectedCategory = CATEGORIES.find(c => c.id === form.category)

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold mb-2">Request submitted</h2>
          <p className="text-sm text-muted-foreground">
            Your request has been received and is pending review. You will be notified when a contractor is assigned.
          </p>
          <p className="text-[12px] text-muted-foreground mt-4">Redirecting to your requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-2xl px-6 py-8">

        {/* Back link */}
        <Link
          href="/dashboard/requests"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to requests
        </Link>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {["Category", "Details", "Location", "Review"].map((label, i) => (
              <span
                key={label}
                className={`text-[12px] font-medium ${step > i + 1 ? "text-primary" : step === i + 1 ? "text-foreground" : "text-muted-foreground"}`}
              >
                {i + 1}. {label}
              </span>
            ))}
          </div>
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-1 rounded-full bg-primary transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
        </div>

        {/* Step 1 — Category */}
        {step === 1 && (
          <div>
            <h1 className="text-lg font-bold mb-1">Select a service category</h1>
            <p className="text-[13px] text-muted-foreground mb-6">Choose the trade that best describes the work needed.</p>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {CATEGORIES.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => set("category", id)}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-[13px] font-medium transition ${
                    form.category === id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${form.category === id ? "text-primary" : ""}`} />
                  {name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.category}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Step 2 — Details */}
        {step === 2 && (
          <div>
            <h1 className="text-lg font-bold mb-1">Project details</h1>
            <p className="text-[13px] text-muted-foreground mb-6">
              Describe what needs to be done and set your budget ceiling. This information is shared with the assigned contractor before they contact you.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-[13px]">Project description</Label>
                <textarea
                  id="description"
                  rows={5}
                  placeholder="Describe the work in detail: what is wrong, what you want done, any conditions or constraints the contractor should know before arriving."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="flex w-full rounded border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="budgetMin" className="text-[13px]">Budget floor ($)</Label>
                  <Input id="budgetMin" type="number" min="0" placeholder="e.g. 500"
                    value={form.budgetMin} onChange={(e) => set("budgetMin", e.target.value)} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="budgetMax" className="text-[13px]">Budget ceiling ($) <span className="text-destructive">*</span></Label>
                  <Input id="budgetMax" type="number" min="0" placeholder="e.g. 5000"
                    value={form.budgetMax} onChange={(e) => set("budgetMax", e.target.value)} className="text-sm" required />
                  <p className="text-[11px] text-muted-foreground">The contractor receives this number before accepting.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep(1)}
                className="rounded border border-border px-4 py-2.5 text-[13px] font-medium transition hover:border-primary/40">
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.description || !form.budgetMax}
                className="flex flex-1 items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
              >
                Continue <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Location */}
        {step === 3 && (
          <div>
            <h1 className="text-lg font-bold mb-1">Property location</h1>
            <p className="text-[13px] text-muted-foreground mb-6">
              The full address of the property where the work is needed. Nexus currently serves Shawnee County and surrounding areas.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-[13px]">Street address</Label>
                <Input id="address" placeholder="1234 SW Gage Blvd"
                  value={form.address} onChange={(e) => set("address", e.target.value)} className="text-sm" required />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-[13px]">City</Label>
                  <Input id="city" placeholder="Topeka"
                    value={form.city} onChange={(e) => set("city", e.target.value)} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-[13px]">State</Label>
                  <Input id="state" value={form.state} onChange={(e) => set("state", e.target.value)} className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zipCode" className="text-[13px]">ZIP</Label>
                  <Input id="zipCode" placeholder="66604"
                    value={form.zipCode} onChange={(e) => set("zipCode", e.target.value)} className="text-sm" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="preferredDates" className="text-[13px]">Preferred consultation availability</Label>
                <Input id="preferredDates" placeholder="e.g. Weekdays after 4pm, Saturday mornings"
                  value={form.preferredDates} onChange={(e) => set("preferredDates", e.target.value)} className="text-sm" />
                <p className="text-[11px] text-muted-foreground">The contractor will contact you to confirm a time that works.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-[13px]">Additional notes (optional)</Label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Gate code, access instructions, prior work history, HOA restrictions, etc."
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  className="flex w-full rounded border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep(2)}
                className="rounded border border-border px-4 py-2.5 text-[13px] font-medium transition hover:border-primary/40">
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!form.address || !form.zipCode}
                className="flex flex-1 items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
              >
                Review <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Review */}
        {step === 4 && (
          <div>
            <h1 className="text-lg font-bold mb-1">Review your request</h1>
            <p className="text-[13px] text-muted-foreground mb-6">
              Confirm the details below. Once submitted, your request enters the contractor queue for {selectedCategory?.name}. You will be notified when assigned.
            </p>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 px-3 py-3 text-[13px] text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="rounded-lg border border-border bg-card overflow-hidden mb-5">
              {[
                ["Category",     selectedCategory?.name ?? "—"],
                ["Description",  form.description],
                ["Budget",       form.budgetMin
                  ? `$${Number(form.budgetMin).toLocaleString()} – $${Number(form.budgetMax).toLocaleString()}`
                  : `Up to $${Number(form.budgetMax).toLocaleString()}`],
                ["Address",      `${form.address}, ${form.city}, ${form.state} ${form.zipCode}`],
                ...(form.preferredDates ? [["Availability", form.preferredDates] as [string, string]] : []),
                ...(form.notes ? [["Notes", form.notes] as [string, string]] : []),
              ].map(([label, value], i, arr) => (
                <div key={label} className={`flex gap-6 px-5 py-3.5 text-[13px] ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                  <span className="w-24 flex-shrink-0 text-muted-foreground">{label}</span>
                  <span className="text-foreground leading-relaxed">{value}</span>
                </div>
              ))}
            </div>

            <div className="mb-5 rounded border border-primary/20 bg-primary/5 px-4 py-3.5 text-[13px] leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground mb-1">What happens after submission</p>
              Nexus reviews your request and enters it into the contractor queue for your trade and service area. One qualified contractor is notified and given exclusive access. They review your documentation before contacting you to schedule the on-site consultation.
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)}
                className="rounded border border-border px-4 py-2.5 text-[13px] font-medium transition hover:border-primary/40">
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</> : "Submit Request"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
