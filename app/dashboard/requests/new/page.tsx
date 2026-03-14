"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { canSubmitServiceRequest } from "@/lib/auth/roles"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  TreePine,
  Thermometer,
  Zap,
  Home,
  Hammer,
  Fence,
  Droplets,
  Wrench,
  Upload,
  Loader2,
  X,
  ImagePlus,
} from "lucide-react"

const categories = [
  { id: "tree-removal",   name: "Tree Removal",   icon: TreePine },
  { id: "hvac",           name: "HVAC",            icon: Thermometer },
  { id: "electrical",     name: "Electrical",      icon: Zap },
  { id: "roofing",        name: "Roofing",         icon: Home },
  { id: "concrete",       name: "Concrete",        icon: Hammer },
  { id: "fencing",        name: "Fencing",         icon: Fence },
  { id: "plumbing",       name: "Plumbing",        icon: Droplets },
  { id: "general-repair", name: "General Repair",  icon: Wrench },
]

export default function NewRequestPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canSubmit, setCanSubmit] = useState(true)
  const [roleChecked, setRoleChecked] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    address: "",
    city: "",
    state: "KS",
    zipCode: "",
    preferredDates: "",
    additionalNotes: "",
  })

  // Generate object URLs for previews whenever photos change
  useEffect(() => {
    const urls = photos.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [photos])

  function handleFiles(files: FileList | null) {
    if (!files) return
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"))
    setPhotos((prev) => [...prev, ...valid].slice(0, 10))
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError("Only homeowners can submit service requests.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      let photoUrls: string[] = []

      // Upload photos to Supabase Storage if any were attached
      if (photos.length > 0) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const uploadResults = await Promise.all(
            photos.map(async (file) => {
              const ext = file.name.split(".").pop() ?? "jpg"
              const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
              const { error: uploadErr } = await supabase.storage
                .from("request-photos")
                .upload(path, file, { cacheControl: "3600", upsert: false })
              if (uploadErr) return null
              const { data: urlData } = supabase.storage
                .from("request-photos")
                .getPublicUrl(path)
              return urlData.publicUrl
            })
          )
          photoUrls = uploadResults.filter((u): u is string => u !== null)
        }
      }

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, photoUrls }),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Failed to submit request")
      }

      router.push("/dashboard/requests")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  useEffect(() => {
    const supabase = createClient()
    const loadRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const allowed = canSubmitServiceRequest(user?.user_metadata?.role)
      setCanSubmit(allowed)
      setRoleChecked(true)
      if (!allowed) setError("Only homeowners can submit service requests.")
    }
    void loadRole()
  }, [])

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard/requests"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to requests
        </Link>

        {!canSubmit && roleChecked && (
          <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            Only homeowners can submit service requests.
          </p>
        )}

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm">
            {["Category", "Details", "Location", "Review"].map((label, i) => (
              <span key={label} className={step >= i + 1 ? "text-primary font-medium" : "text-muted-foreground"}>
                {i + 1}. {label}
              </span>
            ))}
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-muted">
            <div
              className="h-1.5 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Category */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Select a service category</CardTitle>
              <CardDescription>Choose the type of work you need</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setFormData({ ...formData, category: category.id })}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
                      formData.category === category.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <category.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
              <Button className="mt-6 w-full" onClick={() => setStep(2)} disabled={!formData.category}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Details + Photos */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Project details</CardTitle>
              <CardDescription>Describe your project, attach photos, and set your budget</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="description">Project description</Label>
                <textarea
                  id="description"
                  placeholder="Describe the work needed. Include current condition, materials if known, and any access notes."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {/* Photo upload */}
              <div>
                <Label className="mb-2 block">
                  Project photos
                  <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">(up to 10 — helps contractors prepare an accurate estimate)</span>
                </Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />

                {photos.length > 0 ? (
                  <div className="space-y-3">
                    {/* Thumbnail grid */}
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                      {previews.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-border bg-muted group">
                          <Image
                            src={src}
                            alt={`Photo ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="100px"
                          />
                          <button
                            onClick={() => removePhoto(i)}
                            className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-100 transition hover:text-foreground"
                            aria-label={`Remove photo ${i + 1}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {photos.length < 10 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-md border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center gap-1 hover:border-primary/40 transition text-muted-foreground hover:text-foreground"
                        >
                          <ImagePlus className="h-4 w-4" />
                          <span className="text-[10px]">Add</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{photos.length} photo{photos.length !== 1 ? "s" : ""} attached</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-lg border border-dashed border-border bg-muted/50 p-6 text-center hover:border-primary/40 transition"
                  >
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">Upload project photos</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Click to select · 2–10 photos recommended</p>
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="budgetMin">Budget minimum ($)</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    placeholder="500"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetMax">Budget maximum ($)</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    placeholder="5000"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button
                  className="flex-1"
                  onClick={() => setStep(3)}
                  disabled={!formData.description}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Project location</CardTitle>
              <CardDescription>Where is the work needed?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Topeka"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="66601"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredDates">Preferred consultation dates</Label>
                <Input
                  id="preferredDates"
                  placeholder="e.g., Weekdays after 5pm, Saturday mornings"
                  value={formData.preferredDates}
                  onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button
                  className="flex-1"
                  onClick={() => setStep(4)}
                  disabled={!formData.address || !formData.city || !formData.zipCode}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Review your request</CardTitle>
              <CardDescription>Confirm the details before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
                <h3 className="font-semibold capitalize">
                  {categories.find((c) => c.id === formData.category)?.name}
                </h3>
                <p className="text-sm text-muted-foreground">{formData.description}</p>
                <div className="grid gap-2 text-sm">
                  {(formData.budgetMin || formData.budgetMax) && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget:</span>
                      <span>
                        {formData.budgetMin && formData.budgetMax
                          ? `$${formData.budgetMin} – $${formData.budgetMax}`
                          : formData.budgetMax
                          ? `Up to $${formData.budgetMax}`
                          : `From $${formData.budgetMin}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{formData.address}, {formData.city}, {formData.state} {formData.zipCode}</span>
                  </div>
                  {formData.preferredDates && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Availability:</span>
                      <span>{formData.preferredDates}</span>
                    </div>
                  )}
                </div>

                {/* Photo thumbnails in review */}
                {previews.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">{previews.length} photo{previews.length !== 1 ? "s" : ""} attached:</p>
                    <div className="flex flex-wrap gap-2">
                      {previews.map((src, i) => (
                        <div key={i} className="relative h-14 w-14 rounded overflow-hidden border border-border bg-muted flex-shrink-0">
                          <Image src={src} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="56px" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <h4 className="font-medium text-primary">What happens next?</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>1. Your request enters the contractor queue after a brief review</li>
                  <li>2. The first qualified contractor to claim it gets exclusive access</li>
                  <li>3. You receive a confirmed consultation within 24 hours</li>
                </ul>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                <Button className="flex-1" onClick={handleSubmit} disabled={loading || !canSubmit || !roleChecked}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
