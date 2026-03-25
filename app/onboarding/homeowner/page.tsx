"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, CheckCircle2, ChevronRight, ChevronLeft, Upload, User, Home } from "lucide-react"

const STEPS = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "Property" },
  { id: 3, label: "Profile Photo" },
]

export default function HomeownerOnboardingPage() {
  const router = useRouter()
  const [step, setStep]     = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    phone: "",
    propertyAddress: "",
    propertyCity: "",
    propertyState: "KS",
    propertyZip: "",
    photoFile: null as File | null,
    photoPreview: "",
    insuranceFile: null as File | null,
    insuranceName: "",
  })

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      setUserId(user.id)
      if (user.user_metadata?.phone) {
        setFormData(prev => ({ ...prev, phone: user.user_metadata.phone }))
      }
    }
    checkAuth()
  }, [router])

  function handleFileChange(field: "photoFile" | "insuranceFile", nameField: string, e: React.ChangeEvent<HTMLInputElement>) {
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
      let insuranceUrl = ""

      if (formData.photoFile) {
        photoUrl = (await uploadFile(formData.photoFile, "profile-photos", `${userId}/profile.${formData.photoFile.name.split(".").pop()}`)) ?? ""
      }
      if (formData.insuranceFile) {
        insuranceUrl = (await uploadFile(formData.insuranceFile, "compliance-docs", `${userId}/homeowner-insurance.${formData.insuranceFile.name.split(".").pop()}`)) ?? ""
      }

      await supabase.from("profiles").upsert({
        user_id: userId,
        role: "homeowner",
        photo_url: photoUrl || null,
        phone: formData.phone || null,
      }, { onConflict: "user_id" })

      await supabase.from("homeowner_profiles").upsert({ user_id: userId }, { onConflict: "user_id" })

      if (formData.propertyAddress.trim()) {
        await supabase.from("properties").insert({
          owner_id: userId,
          address: formData.propertyAddress,
          city: formData.propertyCity,
          state: formData.propertyState,
          zip: formData.propertyZip,
        })
      }

      if (insuranceUrl) {
        await supabase.from("documents").insert({
          user_id: userId,
          type: "homeowner_insurance",
          file_url: insuranceUrl,
          verified: false,
        })
      }

      router.push("/onboarding/complete?role=homeowner")
    } catch {
      setError("Failed to save your profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <Image src="/nexus-logo.png" alt="Nexus Operations" width={120} height={40} style={{ height: "24px", width: "auto" }} priority />
        </Link>
        <span className="text-[12px] text-muted-foreground">Homeowner Onboarding · Step {step} of {STEPS.length}</span>
      </div>

      <div className="max-w-xl mx-auto px-6 py-10">
        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => {
            const done   = step > s.id
            const active = step === s.id
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className={`flex items-center gap-2 flex-shrink-0 ${active ? "text-primary" : done ? "text-foreground/50" : "text-muted-foreground"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2 ${
                    done   ? "bg-primary border-primary text-primary-foreground" :
                    active ? "border-primary text-primary bg-primary/10" :
                    "border-border text-muted-foreground"
                  }`}>
                    {done ? "✓" : s.id}
                  </div>
                  <span className="text-[12px] font-medium hidden sm:block">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-3 ${done ? "bg-primary/50" : "bg-border"}`} />}
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

        {/* Step 1 — Personal Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Contact information</h1>
              <p className="text-[14px] text-muted-foreground">This is used for contractor coordination and job updates.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-[13px] font-medium">Phone number</Label>
                <Input
                  id="phone" type="tel" placeholder="(785) 555-0100"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="h-10 text-[13px]"
                />
              </div>

              <div className="rounded-xl border border-border p-5 space-y-3">
                <p className="text-[13px] font-semibold flex items-center gap-2">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  Homeowner insurance <span className="text-muted-foreground font-normal">(optional)</span>
                </p>
                <input id="insuranceInput" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => handleFileChange("insuranceFile", "insuranceName", e)} />
                <label htmlFor="insuranceInput" className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${formData.insuranceName ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"}`}>
                  <Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-[13px] text-muted-foreground truncate">{formData.insuranceName || "Click to upload…"}</span>
                  {formData.insuranceName && <CheckCircle2 className="w-4 h-4 text-primary ml-auto flex-shrink-0" />}
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Property */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Add your property</h1>
              <p className="text-[14px] text-muted-foreground">Your primary service address. You can add more properties from your dashboard later.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="address" className="text-[13px] font-medium">Street address</Label>
                <Input id="address" type="text" placeholder="123 Maple Ave" value={formData.propertyAddress} onChange={e => setFormData(prev => ({ ...prev, propertyAddress: e.target.value }))} className="h-10 text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-[13px] font-medium">City</Label>
                <Input id="city" type="text" placeholder="Topeka" value={formData.propertyCity} onChange={e => setFormData(prev => ({ ...prev, propertyCity: e.target.value }))} className="h-10 text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="zip" className="text-[13px] font-medium">ZIP code</Label>
                <Input id="zip" type="text" placeholder="66604" value={formData.propertyZip} onChange={e => setFormData(prev => ({ ...prev, propertyZip: e.target.value }))} className="h-10 text-[13px]" />
              </div>
            </div>
            <p className="text-[12px] text-muted-foreground">You can skip this step and add properties later.</p>
          </div>
        )}

        {/* Step 3 — Profile Photo */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Profile photo</h1>
              <p className="text-[14px] text-muted-foreground">Optional but helps contractors recognize you. JPG or PNG · max 10MB.</p>
            </div>
            <div className="flex flex-col items-center gap-5">
              {formData.photoPreview ? (
                <img src={formData.photoPreview} alt="Profile preview" className="w-28 h-28 rounded-full object-cover border-4 border-primary/20" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
              <input id="photoInput" type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={e => handleFileChange("photoFile", "photoName", e)} />
              <label htmlFor="photoInput" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-background text-[13px] font-medium cursor-pointer hover:bg-muted transition-colors">
                <Upload className="w-4 h-4" />
                {formData.photoPreview ? "Change photo" : "Upload photo"}
              </label>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          {step > 1 ? (
            <button type="button" onClick={() => setStep(s => s - 1)} className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : <div />}

          {step < STEPS.length ? (
            <Button onClick={() => setStep(s => s + 1)} className="px-6 h-10 text-[13.5px] font-semibold rounded-lg">
              Continue <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={saving} className="px-6 h-10 text-[13.5px] font-semibold rounded-lg">
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <>Complete Setup <CheckCircle2 className="w-4 h-4 ml-1.5" /></>}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
