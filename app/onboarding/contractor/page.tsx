"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertCircle, Loader2, CheckCircle2, ChevronRight, ChevronLeft,
  Upload, User, MapPin, FileText, Briefcase,
} from "lucide-react"

const TRADE_CATEGORIES = [
  { value: "tree-removal",  label: "Tree Removal",  icon: "🌳" },
  { value: "concrete-work", label: "Concrete Work",  icon: "🏗️" },
  { value: "roofing",       label: "Roofing",        icon: "🏠" },
  { value: "hvac",          label: "HVAC",           icon: "❄️" },
  { value: "fencing",       label: "Fencing",        icon: "🏡" },
  { value: "electrical",    label: "Electrical",     icon: "⚡" },
  { value: "plumbing",      label: "Plumbing",       icon: "🔧" },
  { value: "excavation",    label: "Excavation",     icon: "🚜" },
]

const STEPS = [
  { id: 1, label: "Trade Info",   icon: Briefcase },
  { id: 2, label: "Location",     icon: MapPin },
  { id: 3, label: "Documents",    icon: FileText },
  { id: 4, label: "Profile",      icon: User },
]

export default function ContractorOnboardingPage() {
  const router = useRouter()
  const [step, setStep]     = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    tradeCategories: [] as string[],
    bio: "",
    serviceRadius: "25",
    baseAddress: "",
    city: "",
    state: "KS",
    zip: "",
    phone: "",
    photoFile: null as File | null,
    photoPreview: "",
    licenseFile: null as File | null,
    licenseName: "",
    insuranceFile: null as File | null,
    insuranceName: "",
    licenseExpiry: "",
    insuranceExpiry: "",
  })

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      setUserId(user.id)
      // Pre-fill phone if available
      if (user.user_metadata?.phone) {
        setFormData(prev => ({ ...prev, phone: user.user_metadata.phone }))
      }
    }
    checkAuth()
  }, [router])

  function toggleCategory(cat: string) {
    setFormData(prev => ({
      ...prev,
      tradeCategories: prev.tradeCategories.includes(cat)
        ? prev.tradeCategories.filter(c => c !== cat)
        : [...prev.tradeCategories, cat],
    }))
  }

  function handleFileChange(field: "photoFile" | "licenseFile" | "insuranceFile", nameField: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const update: Record<string, unknown> = { [field]: file, [nameField]: file.name }
    if (field === "photoFile") {
      update.photoPreview = URL.createObjectURL(file)
    }
    setFormData(prev => ({ ...prev, ...update }))
  }

  async function uploadFile(file: File, bucket: string, path: string): Promise<string | null> {
    const supabase = createClient()
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (error) return null
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
    return urlData?.publicUrl ?? null
  }

  async function handleFinish() {
    if (!userId) return
    setError(null)
    setSaving(true)

    try {
      const supabase = createClient()

      let photoUrl = ""
      let licenseUrl = ""
      let insuranceUrl = ""

      if (formData.photoFile) {
        photoUrl = (await uploadFile(formData.photoFile, "profile-photos", `${userId}/profile.${formData.photoFile.name.split(".").pop()}`)) ?? ""
      }
      if (formData.licenseFile) {
        licenseUrl = (await uploadFile(formData.licenseFile, "compliance-docs", `${userId}/license.${formData.licenseFile.name.split(".").pop()}`)) ?? ""
      }
      if (formData.insuranceFile) {
        insuranceUrl = (await uploadFile(formData.insuranceFile, "compliance-docs", `${userId}/insurance.${formData.insuranceFile.name.split(".").pop()}`)) ?? ""
      }

      // Upsert profiles record
      await supabase.from("profiles").upsert({
        user_id: userId,
        role: "contractor",
        photo_url: photoUrl || null,
        phone: formData.phone || null,
      }, { onConflict: "user_id" })

      // Upsert contractor_profiles record
      await supabase.from("contractor_profiles").upsert({
        user_id: userId,
        bio: formData.bio || null,
        service_radius_miles: parseInt(formData.serviceRadius) || 25,
        trade_categories: formData.tradeCategories,
        is_verified: false,
        is_available: true,
      }, { onConflict: "user_id" })

      // Insert documents
      const now = new Date().toISOString()
      if (licenseUrl) {
        await supabase.from("documents").insert({
          user_id: userId,
          type: "license",
          file_url: licenseUrl,
          expires_at: formData.licenseExpiry || null,
          verified: false,
        })
      }
      if (insuranceUrl) {
        await supabase.from("documents").insert({
          user_id: userId,
          type: "insurance",
          file_url: insuranceUrl,
          expires_at: formData.insuranceExpiry || null,
          verified: false,
        })
      }

      router.push("/onboarding/complete?role=contractor")
    } catch (err) {
      setError("Failed to save your profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const canProceed = () => {
    if (step === 1) return formData.tradeCategories.length > 0
    if (step === 2) return formData.baseAddress.trim().length > 0
    if (step === 3) return true // documents optional but encouraged
    if (step === 4) return true
    return true
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <Image src="/nexus-logo.png" alt="Nexus Operations" width={120} height={40} style={{ height: "24px", width: "auto" }} priority />
        </Link>
        <span className="text-[12px] text-muted-foreground">Contractor Onboarding · Step {step} of {STEPS.length}</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const done    = step > s.id
            const active  = step === s.id
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className={`flex items-center gap-2 flex-shrink-0 ${active ? "text-primary" : done ? "text-foreground/50" : "text-muted-foreground"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2 transition-all ${
                    done   ? "bg-primary border-primary text-primary-foreground" :
                    active ? "border-primary text-primary bg-primary/10" :
                    "border-border text-muted-foreground"
                  }`}>
                    {done ? "✓" : s.id}
                  </div>
                  <span className="text-[12px] font-medium hidden sm:block">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 ${done ? "bg-primary/50" : "bg-border"}`} />
                )}
              </div>
            )
          })}
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-[13px] text-destructive mb-6">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1 — Trade Categories */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Select your trade categories</h1>
              <p className="text-[14px] text-muted-foreground">Choose all the services you provide. You&apos;ll only receive job notifications in these categories.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TRADE_CATEGORIES.map(cat => {
                const selected = formData.tradeCategories.includes(cat.value)
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => toggleCategory(cat.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-border/80 hover:text-foreground"
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-[12px] font-semibold leading-tight">{cat.label}</span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </button>
                )
              })}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-[13px] font-medium">Business bio <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <textarea
                id="bio"
                rows={3}
                placeholder="Tell clients about your experience, certifications, and what sets you apart…"
                value={formData.bio}
                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-[13px] placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
          </div>
        )}

        {/* Step 2 — Service Location */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Service area</h1>
              <p className="text-[14px] text-muted-foreground">Your base address helps us match you with nearby jobs. Only your service radius is shown to clients.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="baseAddress" className="text-[13px] font-medium">Street address <span className="text-destructive">*</span></Label>
                <Input
                  id="baseAddress" type="text" placeholder="123 Main St"
                  value={formData.baseAddress}
                  onChange={e => setFormData(prev => ({ ...prev, baseAddress: e.target.value }))}
                  required className="h-10 text-[13px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-[13px] font-medium">City</Label>
                <Input id="city" type="text" placeholder="Topeka" value={formData.city} onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))} className="h-10 text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="zip" className="text-[13px] font-medium">ZIP code</Label>
                <Input id="zip" type="text" placeholder="66604" value={formData.zip} onChange={e => setFormData(prev => ({ ...prev, zip: e.target.value }))} className="h-10 text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-[13px] font-medium">Phone number</Label>
                <Input id="phone" type="tel" placeholder="(785) 555-0100" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="h-10 text-[13px]" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-medium">Service radius: <span className="text-primary font-bold">{formData.serviceRadius} miles</span></Label>
              <input
                type="range" min="5" max="100" step="5"
                value={formData.serviceRadius}
                onChange={e => setFormData(prev => ({ ...prev, serviceRadius: e.target.value }))}
                className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>5 mi</span>
                <span>100 mi</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Documents */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Compliance documents</h1>
              <p className="text-[14px] text-muted-foreground">Upload your license and insurance certificate. These will be verified before you can receive jobs. PDF, JPG, or PNG · max 10MB each.</p>
            </div>

            {[
              {
                label: "Business / Trade License",
                field: "licenseFile" as const,
                nameField: "licenseName",
                expiryField: "licenseExpiry",
                name: formData.licenseName,
                expiry: formData.licenseExpiry,
                inputId: "licenseInput",
              },
              {
                label: "General Liability Insurance Certificate",
                field: "insuranceFile" as const,
                nameField: "insuranceName",
                expiryField: "insuranceExpiry",
                name: formData.insuranceName,
                expiry: formData.insuranceExpiry,
                inputId: "insuranceInput",
              },
            ].map(doc => (
              <div key={doc.label} className="rounded-xl border border-border p-5 space-y-3">
                <p className="text-[13px] font-semibold">{doc.label}</p>
                <input
                  id={doc.inputId} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                  onChange={e => handleFileChange(doc.field, doc.nameField, e)}
                />
                <label
                  htmlFor={doc.inputId}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                    doc.name ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30 hover:bg-muted/40"
                  }`}
                >
                  <Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-[13px] text-muted-foreground truncate">{doc.name || "Click to upload file…"}</span>
                  {doc.name && <CheckCircle2 className="w-4 h-4 text-primary ml-auto flex-shrink-0" />}
                </label>
                <div className="space-y-1">
                  <Label htmlFor={`${doc.inputId}-expiry`} className="text-[12px] text-muted-foreground">Expiry date <span className="font-normal">(optional)</span></Label>
                  <Input
                    id={`${doc.inputId}-expiry`} type="date"
                    value={doc.expiry}
                    onChange={e => setFormData(prev => ({ ...prev, [doc.expiryField]: e.target.value }))}
                    className="h-9 text-[13px] max-w-[200px]"
                  />
                </div>
              </div>
            ))}

            <p className="text-[12px] text-muted-foreground">You can skip this step and upload documents later from your dashboard. Your account will be pending until documents are verified.</p>
          </div>
        )}

        {/* Step 4 — Profile Photo */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Profile photo</h1>
              <p className="text-[14px] text-muted-foreground">A professional photo helps build trust with clients. JPG or PNG · max 10MB.</p>
            </div>

            <div className="flex flex-col items-center gap-5">
              {formData.photoPreview ? (
                <img src={formData.photoPreview} alt="Profile preview" className="w-28 h-28 rounded-full object-cover border-4 border-primary/20" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
              <input id="photoInput" type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={e => handleFileChange("photoFile", "photName", e)} />
              <label htmlFor="photoInput" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-background text-[13px] font-medium cursor-pointer hover:bg-muted transition-colors">
                <Upload className="w-4 h-4" />
                {formData.photoPreview ? "Change photo" : "Upload photo"}
              </label>
            </div>

            <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 space-y-2">
              <p className="text-[13px] font-semibold text-primary">What happens next</p>
              <ul className="text-[13px] text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>Your profile will be reviewed within 1–2 business days</li>
                <li>You&apos;ll receive an email once your account is approved</li>
                <li>After approval you&apos;ll start receiving job notifications</li>
                <li>You can update your profile anytime from your dashboard</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="px-6 h-10 text-[13.5px] font-semibold rounded-lg"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={saving}
              className="px-6 h-10 text-[13.5px] font-semibold rounded-lg"
            >
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <>Complete Setup <CheckCircle2 className="w-4 h-4 ml-1.5" /></>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
