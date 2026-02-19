"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getStoredUser, type AuthUser } from "@/lib/auth"
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  Wrench,
  User,
  Calendar,
  Upload,
  ArrowRight,
  AlertCircle,
  Home,
} from "lucide-react"

interface ServiceRequest {
  id: string
  service: string
  description: string
  budget: string
  address: string
  photos: number
  status: "pending" | "matched" | "in_progress" | "completed" | "cancelled"
  contractorName?: string
  consultationWindow?: string
  createdAt: string
}

const SERVICE_CATEGORIES = [
  "Tree Removal",
  "Concrete Work",
  "Roofing",
  "HVAC",
  "Fencing",
  "Electrical",
  "Plumbing",
  "Excavation",
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
  "Weekday morning (8–12 AM)",
  "Weekday afternoon (12–5 PM)",
  "Saturday morning (8–12 AM)",
  "Saturday afternoon (12–5 PM)",
  "Flexible – any time works",
]

function statusBadge(status: ServiceRequest["status"]) {
  const map = {
    pending: { label: "Pending match", variant: "warning" as const },
    matched: { label: "Contractor matched", variant: "success" as const },
    in_progress: { label: "In progress", variant: "info" as const },
    completed: { label: "Completed", variant: "success" as const },
    cancelled: { label: "Cancelled", variant: "muted" as const },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

function statusIcon(status: ServiceRequest["status"]) {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-amber-400" />
    case "matched":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    case "in_progress":
      return <Wrench className="h-4 w-4 text-blue-400" />
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />
  }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 24) return h === 0 ? "Just now" : `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

export default function HomeownerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Form state
  const [service, setService] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState("")
  const [address, setAddress] = useState("")
  const [photoCount, setPhotoCount] = useState(0)
  const [consultWindow, setConsultWindow] = useState("")
  const [formError, setFormError] = useState("")

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored || stored.role !== "homeowner") {
      router.replace("/login")
      return
    }
    setUser(stored)
    if (stored.address) setAddress(stored.address)

    fetch("/api/requests")
      .then((r) => r.json())
      .then((d) => setRequests(d.requests ?? []))
      .finally(() => setLoading(false))
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError("")

    if (!service || !description || !budget || !address) {
      setFormError("Please fill in all required fields.")
      return
    }

    setSubmitLoading(true)
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
          consultationWindow: consultWindow,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setFormError(data.error ?? "Submission failed")
        return
      }

      setRequests((prev) => [data.request, ...prev])
      setSubmitSuccess(true)
      setShowForm(false)
      // Reset
      setService("")
      setDescription("")
      setBudget("")
      setPhotoCount(0)
      setConsultWindow("")
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch {
      setFormError("Network error. Please try again.")
    } finally {
      setSubmitLoading(false)
    }
  }

  if (!user) return null

  const activeRequest = requests.find((r) => r.status === "pending" || r.status === "matched" || r.status === "in_progress")
  const pastRequests = requests.filter((r) => r.status === "completed" || r.status === "cancelled")

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-medium mb-1">Homeowner Portal</p>
          <h1 className="text-2xl font-semibold">Welcome, {user.name.split(" ")[0]}</h1>
          {user.address && (
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5" />
              {user.address}
            </p>
          )}
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            New Request
          </button>
        )}
      </div>

      {/* Success message */}
      {submitSuccess && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">Your request was submitted successfully! A contractor will be matched shortly.</p>
        </div>
      )}

      {/* New request form */}
      {showForm && (
        <Card className="mb-8 border-primary/30">
          <CardHeader>
            <CardTitle>Submit a New Request</CardTitle>
            <CardDescription>
              Tell us about your project and we will match you with one verified contractor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Service */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Service needed <span className="text-primary">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setService(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        service === cat
                          ? "bg-primary/20 border-primary text-primary"
                          : "border-border/40 text-muted-foreground hover:border-border"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="req-desc" className="text-sm font-medium">
                  Project description <span className="text-primary">*</span>
                </label>
                <Textarea
                  id="req-desc"
                  placeholder="Describe your project in detail — scope, any urgency, special conditions…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Budget + Address row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="req-budget" className="text-sm font-medium">
                    Budget cap <span className="text-primary">*</span>
                  </label>
                  <select
                    id="req-budget"
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
                  <label htmlFor="req-address" className="text-sm font-medium">
                    Service address <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="req-address"
                    placeholder="123 Main St, Topeka, KS"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Photos + Consultation row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <Upload className="h-4 w-4" /> Photos (optional)
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
                  <label htmlFor="req-window" className="text-sm font-medium flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> Consultation window
                  </label>
                  <select
                    id="req-window"
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

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitLoading ? "Submitting…" : "Submit Request"}
                  {!submitLoading && <ArrowRight className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setFormError("") }}
                  className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg border border-border/40 hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                Requests are free to submit. You will be matched with a single licensed, insured contractor.
              </p>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Active requests */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {/* Active / in-flight */}
          {activeRequest && (
            <div className="mb-6">
              <h2 className="text-base font-semibold mb-3">Active Request</h2>
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {statusIcon(activeRequest.status)}
                        <h3 className="font-semibold">{activeRequest.service}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{activeRequest.description}</p>
                    </div>
                    {statusBadge(activeRequest.status)}
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-border/40">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Budget cap</p>
                      <p className="text-sm font-medium">{activeRequest.budget}</p>
                    </div>
                    {activeRequest.contractorName && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <User className="h-3 w-3" /> Matched contractor
                        </p>
                        <p className="text-sm font-medium">{activeRequest.contractorName}</p>
                      </div>
                    )}
                    {activeRequest.consultationWindow && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Consultation
                        </p>
                        <p className="text-sm font-medium">{activeRequest.consultationWindow}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* All requests list */}
          {requests.length > 0 ? (
            <div>
              <h2 className="text-base font-semibold mb-3">All Requests</h2>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/40">
                    {requests.map((req) => (
                      <div key={req.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center gap-4 min-w-0">
                          {statusIcon(req.status)}
                          <div className="min-w-0">
                            <p className="font-medium text-sm">{req.service}</p>
                            <p className="text-xs text-muted-foreground truncate">{req.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {statusBadge(req.status)}
                          <span className="text-xs text-muted-foreground hidden sm:block">{timeAgo(req.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Wrench className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="font-medium mb-1">No requests yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Submit your first request to get matched with a verified contractor.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <PlusCircle className="h-4 w-4" />
                  Submit a Request
                </button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
