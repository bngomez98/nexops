"use client"

import { useState, useEffect } from "react"
import { useRouter } from "@/lib/router"
import Link from "@/components/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, CheckCircle2, ChevronRight, ChevronLeft, Upload, User } from "lucide-react"

const STEPS = [
  { id: 1, label: "Company Info" },
  { id: 2, label: "Portfolio" },
  { id: 3, label: "Documents" },
  { id: 4, label: "Profile Photo" },
]

export default function PropertyManagerOnboardingPage() {
  const router = useRouter()
  const [step, setStep]     = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    portfolioSize: "",
    propertiesUnderManagement: "",
    photoFile: null as File | null,
    photoPreview: "",
    eoInsuranceFile: null as File | null,
    eoInsuranceName: "",
    eoInsuranceExpiry: "",
  })

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      setUserId(user.id)
      if (user.user_metadata?.company_name) {
        setFormData(prev => ({ ...prev, companyName: user.user_metadata.company_name }))
      }
      if (user.user_metadata?.phone) {
        setFormData(prev => ({ ...prev, phone: user.user_metadata.phone }))
      }
    }
    checkAuth()
  }, [router])

  function handleFileChange(field: "photoFile" | "eoInsuranceFile", nameField: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const update: Record<string, unknown> = { [field]: file, [nameField]: file.name }
    if (field === "photoFile") update.photoPreview = URL.createObjectURL(file)
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
      let eoUrl = ""

      if (formData.photoFile) {
        photoUrl = (await uploadFile(formData.photoFile, "profile-photos", `${userId}/profile.${formData.photoFile.name.split(".").pop()}`)) ?? ""
      }
      if (formData.eoInsuranceFile) {
        eoUrl = (await uploadFile(formData.eoInsuranceFile, "compliance-docs", `${userId}/eo-insurance.${formData.eoInsuranceFile.name.split(".").pop()}`)) ?? ""
      }

      await supabase.from("profiles").upsert({
        user_id: userId,
        role: "property-manager",
        photo_url: photoUrl || null,
        phone: formData.phone || null,
      }, { onConflict: "user_id" })

      await supabase.from("property_manager_profiles").upsert({
        user_id: userId,
        company_name: formData.companyName || null,
        portfolio_size: formData.portfolioSize ? parseInt(formData.portfolioSize) : null,
      }, { onConflict: "user_id" })

      if (eoUrl) {
        await supabase.from("documents").insert({
          user_id: userId,
          type: "eo_insurance",
          file_url: eoUrl,
          expires_at: formData.eoInsuranceExpiry || null,
          verified: false,
        })
      }

      router.push("/onboarding/complete?role=property-manager")
    } catch (err) {
      console.error(err)
      setError("Failed to save your profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const canProceed = () => {
    if (step === 1) return formData.companyName.trim().length > 0
    return true
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <Image src="/nexus-logo.png" alt="Nexus Operations" width={120} height={40} style={{ height: "24px", width: "auto" }} priority />
        </Link>
        <span className="text-[12px] text-muted-foreground">Property Manager Onboarding · Step {step} of {STEPS.length}</span>
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

        {/* Step 1 — Company Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Company information</h1>
              <p className="text-[14px] text-muted-foreground">Tell us about your property management company.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="companyName" className="text-[13px] font-medium">Company name <span className="text-destructive">*</span></Label>
                <Input id="companyName" type="text" placeholder="Acme Property Management" value={formData.companyName} onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))} required className="h-10 text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-[13px] font-medium">Phone number</Label>
                <Input id="phone" type="tel" placeholder="(785) 555-0100" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="h-10 text-[13px]" />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Portfolio */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Portfolio details</h1>
              <p className="text-[14px] text-muted-foreground">Help us understand the scale of your portfolio.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="portfolioSize" className="text-[13px] font-medium">Portfolio size (units)</Label>
                <Input id="portfolioSize" type="number" min="1" placeholder="e.g. 50" value={formData.portfolioSize} onChange={e => setFormData(prev => ({ ...prev, portfolioSize: e.target.value }))} className="h-10 text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="propertiesCount" className="text-[13px] font-medium">Properties under management</Label>
                <Input id="propertiesCount" type="number" min="1" placeholder="e.g. 12" value={formData.propertiesUnderManagement} onChange={e => setFormData(prev => ({ ...prev, propertiesUnderManagement: e.target.value }))} className="h-10 text-[13px]" />
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — E&O Insurance */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">E&amp;O Insurance</h1>
              <p className="text-[14px] text-muted-foreground">Upload your Errors &amp; Omissions insurance certificate. PDF, JPG, or PNG · max 10MB.</p>
            </div>
            <div className="rounded-xl border border-border p-5 space-y-3">
              <p className="text-[13px] font-semibold">E&amp;O Insurance Certificate</p>
              <input id="eoInput" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => handleFileChange("eoInsuranceFile", "eoInsuranceName", e)} />
              <label htmlFor="eoInput" className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${formData.eoInsuranceName ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"}`}>
                <Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-[13px] text-muted-foreground truncate">{formData.eoInsuranceName || "Click to upload…"}</span>
                {formData.eoInsuranceName && <CheckCircle2 className="w-4 h-4 text-primary ml-auto flex-shrink-0" />}
              </label>
              <div className="space-y-1">
                <Label htmlFor="eoExpiry" className="text-[12px] text-muted-foreground">Expiry date (optional)</Label>
                <Input id="eoExpiry" type="date" value={formData.eoInsuranceExpiry} onChange={e => setFormData(prev => ({ ...prev, eoInsuranceExpiry: e.target.value }))} className="h-9 text-[13px] max-w-[200px]" />
              </div>
            </div>
            <p className="text-[12px] text-muted-foreground">You can skip this step and upload documents later.</p>
          </div>
        )}

        {/* Step 4 — Profile Photo */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Profile photo</h1>
              <p className="text-[14px] text-muted-foreground">Optional. JPG or PNG · max 10MB.</p>
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
            <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="px-6 h-10 text-[13.5px] font-semibold rounded-lg">
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
