"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getStoredUser, type AuthUser } from "@/lib/auth"
import {
  PlusCircle,
  CheckCircle2,
  Upload,
  Calendar,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  Zap,
  Siren,
} from "lucide-react"
import { isFullSentences } from "@/lib/utils"

const EMERGENCY_CATEGORY = "Emergency Response"

const SERVICE_CATEGORIES = [
  "Emergency Response",
  "Tree Removal",
  "Concrete Work",
  "Roofing",
  "HVAC",
  "Fencing",
  "Electrical",
  "Plumbing",
  "Excavation",
  "Water Damage / Remediation",
  "General Maintenance",
]

const BUDGET_RANGES = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "Over $10,000",
]
const CONSULTATION_WINDOWS = [
  "As soon as possible (emergency)",
  "Weekday morning (8–12 AM)",
  "Weekday afternoon (12–5 PM)",
  "Saturday morning (8–12 AM)",
  "Saturday afternoon (12–5 PM)",
  "Flexible – any time works",
]

export default function NewRequestPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)

  // Form state
  const [service, setService] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState("")
  const [address, setAddress] = useState("")
  const [photoCount, setPhotoCount] = useState(0)
  const [consultWindow, setConsultWindow] = useState("")
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const isEmergency = service === EMERGENCY_CATEGORY

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored || stored.role !== "homeowner") {
      router.replace("/login")
      return
    }
    setUser(stored)
    if (stored.address) setAddress(stored.address)
  }, [router])

  // Auto-set emergency consultation window
  useEffect(() => {
    if (isEmergency) {
      setConsultWindow("As soon as possible (emergency)")
    }
  }, [isEmergency])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError("")

    if (!service || !description || !budget || !address) {
      setFormError("Please fill in all required fields.")
      return
    }

    if (!isFullSentences(description)) {
      setFormError(
        "Project description must be written in full sentences. Start each sentence with a capital letter and end it with a period, exclamation mark, or question mark."
      )
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          description,
          budget,
          address,
          photos: photoCount,
          consultationWindow: consultWindow || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error ?? "Submission failed")
        return
      }
      setSuccess(true)
    } catch {
      setFormError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  if (success) {
    return (
      <div className="max-w-lg mx-auto">
        <Card>
          <CardContent className="py-14 text-center">
            <div className={`flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-5 ${isEmergency ? "bg-red-500/15" : "bg-emerald-500/15"}`}>
              <CheckCircle2 className={`h-7 w-7 ${isEmergency ? "text-red-400" : "text-emerald-400"}`} />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {isEmergency ? "Emergency request submitted!" : "Request submitted!"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              {isEmergency
                ? "Your emergency request is being prioritized. A verified, licensed contractor will be dispatched and contact you immediately."
                : "Your request is now in the auto-matching queue. A verified, licensed contractor will be assigned and reach out to schedule a consultation."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard/homeowner/requests")}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Track Request
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSuccess(false)
                  setService("")
                  setDescription("")
                  setBudget("")
                  setPhotoCount(0)
                  setConsultWindow("")
                  if (user.address) setAddress(user.address)
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg border border-border/40 hover:bg-secondary transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Submit another
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.push("/dashboard/homeowner")}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to dashboard
        </button>
        <p className="text-primary text-sm font-medium mb-1">Homeowner Portal</p>
        <h1 className="text-2xl font-semibold">Submit a New Request</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us about your project. We will automatically match you with one verified contractor.
        </p>
      </div>

      {/* Emergency banner */}
      {isEmergency && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/30">
          <Siren className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-400 mb-0.5">Emergency Response Selected</p>
            <p className="text-xs text-muted-foreground">
              Emergency requests are prioritized and routed immediately. A contractor will contact you as soon as possible.
              If this is a life-threatening emergency, call 911 first.
            </p>
          </div>
        </div>
      )}

      {/* Automation note (non-emergency) */}
      {!isEmergency && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Exclusive matching —</span>{" "}
            your request is sent to a single licensed, insured contractor who specializes in your service category and serves your area.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>All fields marked * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Service selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Service needed <span className="text-primary">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isEmerg = cat === EMERGENCY_CATEGORY
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setService(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        service === cat
                          ? isEmerg
                            ? "bg-red-500/20 border-red-500 text-red-400"
                            : "bg-primary/20 border-primary text-primary"
                          : isEmerg
                          ? "border-red-500/30 text-red-400/70 hover:border-red-500/60 hover:text-red-400"
                          : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                    >
                      {isEmerg && <span className="mr-1">⚡</span>}
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium">
                Project description <span className="text-primary">*</span>
              </label>
              <Textarea
                id="description"
                placeholder={
                  isEmergency
                    ? "Describe the emergency situation — what happened, current condition, and any immediate safety concerns."
                    : "Describe your project — scope, urgency, special conditions, dimensions, etc."
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use full sentences. Each sentence must start with a capital letter and end with a period, exclamation mark, or question mark.
              </p>
            </div>

            {/* Budget + Address */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="budget" className="text-sm font-medium">
                  Budget range <span className="text-primary">*</span>
                </label>
                <select
                  id="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="">Select range…</option>
                  {BUDGET_RANGES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="address" className="text-sm font-medium">
                  Service address <span className="text-primary">*</span>
                </label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, ST"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Photos + Consultation */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5" /> Photos (optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setPhotoCount(e.target.files?.length ?? 0)}
                    className="text-xs text-muted-foreground file:mr-2 file:px-3 file:py-1.5 file:rounded-md file:border file:border-border/40 file:text-xs file:font-medium file:bg-secondary file:text-foreground hover:file:bg-muted cursor-pointer"
                  />
                  {photoCount > 0 && (
                    <span className="text-xs text-primary">{photoCount} selected</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="window" className="text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Consultation window
                </label>
                <select
                  id="window"
                  value={consultWindow}
                  onChange={(e) => setConsultWindow(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">No preference</option>
                  {CONSULTATION_WINDOWS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>

            {formError && (
              <p className="text-sm text-destructive flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 flex-shrink-0" /> {formError}
              </p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-opacity disabled:opacity-50 ${
                  isEmergency
                    ? "bg-red-600 text-white hover:opacity-90"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {loading ? "Submitting…" : isEmergency ? "Submit Emergency Request" : "Submit Request"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard/homeowner")}
                className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg border border-border/40 hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Requests are free to submit. You will be matched with a single licensed, insured contractor within your area.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
