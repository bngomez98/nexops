"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getStoredUser, type AuthUser } from "@/lib/auth"
import {
  Star,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  ClipboardList,
} from "lucide-react"

interface RequestData {
  id: string
  service: string
  description: string
  address: string
  contractorName?: string
  contractorId?: string
  status: string
}

function StarRating({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                star <= (hovered || value)
                  ? "text-amber-400 fill-amber-400"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-xs text-muted-foreground">
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
          </span>
        )}
      </div>
    </div>
  )
}

export default function ReviewPage() {
  const router = useRouter()
  const params = useParams()
  const requestId = params.requestId as string

  const [user, setUser] = useState<AuthUser | null>(null)
  const [request, setRequest] = useState<RequestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [alreadyReviewed, setAlreadyReviewed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formError, setFormError] = useState("")

  // Ratings
  const [overallRating, setOverallRating] = useState(0)
  const [qualityRating, setQualityRating] = useState(0)
  const [timelinessRating, setTimelinessRating] = useState(0)
  const [communicationRating, setCommunicationRating] = useState(0)

  // Text feedback
  const [whatWentWell, setWhatWentWell] = useState("")
  const [improvements, setImprovements] = useState("")
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null)
  const [nextMaintenanceNeeds, setNextMaintenanceNeeds] = useState("")

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored || stored.role !== "homeowner") {
      router.replace("/login")
      return
    }
    setUser(stored)

    // Fetch the request details and check for existing review
    Promise.all([
      fetch("/api/requests").then((r) => r.json()),
      fetch(`/api/reviews?requestId=${requestId}`).then((r) => r.json()),
    ])
      .then(([reqData, reviewData]) => {
        const found = (reqData.requests ?? []).find((r: RequestData) => r.id === requestId)
        if (!found) {
          router.replace("/dashboard/homeowner/requests")
          return
        }
        if (found.status !== "completed") {
          router.replace("/dashboard/homeowner/requests")
          return
        }
        setRequest(found)
        if (reviewData.review) {
          setAlreadyReviewed(true)
        }
      })
      .finally(() => setLoading(false))
  }, [router, requestId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError("")

    if (!overallRating || !qualityRating || !timelinessRating || !communicationRating) {
      setFormError("Please provide all four ratings before submitting.")
      return
    }
    if (wouldRecommend === null) {
      setFormError("Please indicate whether you would recommend NexOps for this type of project.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          contractorId: request?.contractorId,
          contractorName: request?.contractorName,
          service: request?.service,
          overallRating,
          qualityRating,
          timelinessRating,
          communicationRating,
          whatWentWell: whatWentWell.trim() || undefined,
          improvements: improvements.trim() || undefined,
          wouldRecommend,
          nextMaintenanceNeeds: nextMaintenanceNeeds.trim() || undefined,
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
      setSubmitting(false)
    }
  }

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto">
        <Card>
          <CardContent className="py-14 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/15 mx-auto mb-5">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Post Implementation Review submitted</h2>
            <p className="text-sm text-muted-foreground mb-2 max-w-sm mx-auto">
              Thank you for your feedback. Your review helps us evaluate contractor performance and improve the quality of every project.
            </p>
            {nextMaintenanceNeeds && (
              <div className="my-4 p-3 rounded-xl bg-primary/5 border border-primary/20 text-left max-w-sm mx-auto">
                <p className="text-xs font-semibold text-primary mb-1">Next maintenance needs logged</p>
                <p className="text-xs text-muted-foreground">{nextMaintenanceNeeds}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => router.push("/dashboard/homeowner")}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Back to Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (alreadyReviewed) {
    return (
      <div className="max-w-lg mx-auto">
        <Card>
          <CardContent className="py-14 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-secondary mx-auto mb-5">
              <ClipboardList className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Review already submitted</h2>
            <p className="text-sm text-muted-foreground mb-6">
              A Post Implementation Review has already been submitted for this project.
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/homeowner")}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Back to Dashboard
            </button>
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
          onClick={() => router.push("/dashboard/homeowner/requests")}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to requests
        </button>
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList className="h-4 w-4 text-primary" />
          <p className="text-primary text-sm font-medium">Post Implementation Review</p>
        </div>
        <h1 className="text-2xl font-semibold">Project Review</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Evaluate your completed project. Your feedback directly informs contractor performance and helps us improve every engagement.
        </p>
      </div>

      {/* Project summary */}
      {request && (
        <div className="mb-6 p-4 rounded-xl bg-secondary/30 border border-border/40">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Project Summary</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Service</p>
              <p className="text-sm font-semibold">{request.service}</p>
            </div>
            {request.contractorName && (
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Contractor</p>
                <p className="text-sm font-semibold">{request.contractorName}</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Address</p>
              <p className="text-sm">{request.address}</p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Rate Your Experience</CardTitle>
          <CardDescription>
            All ratings are required. Written feedback is optional but valuable.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Ratings section */}
            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Performance Ratings</p>
              <StarRating label="Overall satisfaction" value={overallRating} onChange={setOverallRating} />
              <StarRating label="Quality of work" value={qualityRating} onChange={setQualityRating} />
              <StarRating label="Timeliness" value={timelinessRating} onChange={setTimelinessRating} />
              <StarRating label="Communication" value={communicationRating} onChange={setCommunicationRating} />
            </div>

            <div className="h-px bg-border/40" />

            {/* Text feedback */}
            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Written Feedback (Optional)</p>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="well" className="text-sm font-medium">What went well?</label>
                <Textarea
                  id="well"
                  placeholder="Describe what the contractor did particularly well — punctuality, craftsmanship, communication, cleanup, etc."
                  value={whatWentWell}
                  onChange={(e) => setWhatWentWell(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="improve" className="text-sm font-medium">What could be improved?</label>
                <Textarea
                  id="improve"
                  placeholder="Describe anything that could have gone better or suggestions for future projects."
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="h-px bg-border/40" />

            {/* Would recommend */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">
                Would you use NexOps for this type of project again? <span className="text-primary">*</span>
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setWouldRecommend(true)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    wouldRecommend === true
                      ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400"
                      : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setWouldRecommend(false)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    wouldRecommend === false
                      ? "bg-red-500/15 border-red-500/50 text-red-400"
                      : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <ThumbsDown className="h-4 w-4" />
                  No
                </button>
              </div>
            </div>

            <div className="h-px bg-border/40" />

            {/* Next maintenance needs */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="next" className="text-sm font-medium">
                Upcoming maintenance needs (Optional)
              </label>
              <Textarea
                id="next"
                placeholder="Are there other maintenance projects on your radar? Describe any upcoming needs — we will keep this on file and reach out when you are ready."
                value={nextMaintenanceNeeds}
                onChange={(e) => setNextMaintenanceNeeds(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This information stays in your project file and helps us anticipate your future needs.
              </p>
            </div>

            {formError && (
              <p className="text-sm text-destructive flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 flex-shrink-0" /> {formError}
              </p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit Review"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard/homeowner/requests")}
                className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg border border-border/40 hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
