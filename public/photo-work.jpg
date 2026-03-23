import type { ElementType } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Camera,
  MessageSquare,
  Clock,
  CheckCircle2,
  CircleDashed,
  Loader2,
  XCircle,
} from "lucide-react"

const CATEGORY_LABELS: Record<string, string> = {
  "tree-removal":   "Tree Removal",
  hvac:             "HVAC",
  electrical:       "Electrical",
  roofing:          "Roofing",
  concrete:         "Concrete",
  fencing:          "Fencing",
  plumbing:         "Plumbing",
  "general-repair": "General Repair",
}

const STATUS_META: Record<string, { label: string; color: string; icon: ElementType }> = {
  pending_review:         { label: "Pending Review",          color: "text-muted-foreground",  icon: CircleDashed },
  in_queue:               { label: "Open — Awaiting Claim",   color: "text-primary",           icon: Clock },
  assigned:               { label: "Assigned",                color: "text-blue-600",          icon: Clock },
  consultation_scheduled: { label: "Consultation Scheduled",  color: "text-blue-600",          icon: Calendar },
  in_progress:            { label: "In Progress",             color: "text-amber-600",         icon: Loader2 },
  completed:              { label: "Completed",               color: "text-green-600",         icon: CheckCircle2 },
  declined:               { label: "Declined",                color: "text-destructive",       icon: XCircle },
  cancelled:              { label: "Cancelled",               color: "text-muted-foreground",  icon: XCircle },
}

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: req } = await supabase
    .from("service_requests")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single()

  if (!req) notFound()

  const status = STATUS_META[req.status] ?? { label: req.status, color: "text-muted-foreground", icon: CircleDashed }
  const StatusIcon = status.icon

  const hasContractor = !!req.assigned_contractor_id
  const isActive = ["assigned", "consultation_scheduled", "in_progress"].includes(req.status)

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">

        <Link
          href="/dashboard/requests"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All requests
        </Link>

        {/* Header */}
        <div className="mb-6 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {CATEGORY_LABELS[req.category] ?? req.category.replace(/-/g, " ")}
            </span>
            <span className={`flex items-center gap-1 text-[10px] font-medium ${status.color}`}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
          </div>

          <h1 className="text-base font-semibold mb-4">{req.description}</h1>

          <div className="grid gap-2 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              {req.address}, {req.city}, {req.state} {req.zip_code}
            </span>

            {(req.budget_min || req.budget_max) && (
              <span className="flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                {req.budget_min && req.budget_max
                  ? `$${Number(req.budget_min).toLocaleString()} – $${Number(req.budget_max).toLocaleString()}`
                  : req.budget_max
                  ? `Up to $${Number(req.budget_max).toLocaleString()}`
                  : `From $${Number(req.budget_min).toLocaleString()}`}
              </span>
            )}

            {req.preferred_dates && (
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                {req.preferred_dates}
              </span>
            )}

            {req.photo_urls && req.photo_urls.length > 0 && (
              <span className="flex items-center gap-2">
                <Camera className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                {req.photo_urls.length} photo{req.photo_urls.length !== 1 ? "s" : ""} attached
              </span>
            )}
          </div>

          <p className="mt-4 text-[11px] text-muted-foreground">
            Submitted {new Date(req.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {/* Status timeline */}
        <div className="mb-6 rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Status timeline</p>
          <div className="space-y-3 text-[13px]">
            {[
              { key: "pending_review",         label: "Submitted for review" },
              { key: "in_queue",               label: "Approved — open for contractor claims" },
              { key: "assigned",               label: "Contractor assigned" },
              { key: "consultation_scheduled", label: "Consultation scheduled" },
              { key: "in_progress",            label: "Work in progress" },
              { key: "completed",              label: "Completed" },
            ].map(({ key, label }) => {
              const statuses = ["pending_review", "in_queue", "assigned", "consultation_scheduled", "in_progress", "completed"]
              const currentIdx = statuses.indexOf(req.status)
              const stepIdx = statuses.indexOf(key)
              const isDone = currentIdx > stepIdx
              const isCurrent = currentIdx === stepIdx

              return (
                <div key={key} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                    isCurrent ? "bg-primary" : isDone ? "bg-green-500" : "bg-muted-foreground/30"
                  }`} />
                  <span className={isCurrent ? "text-foreground font-medium" : isDone ? "text-muted-foreground line-through" : "text-muted-foreground/60"}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Additional notes */}
        {req.additional_notes && (
          <div className="mb-6 rounded-lg border border-border bg-card p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Additional notes</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{req.additional_notes}</p>
          </div>
        )}

        {/* Photo gallery */}
        {req.photo_urls && req.photo_urls.length > 0 && (
          <div className="mb-6 rounded-lg border border-border bg-card p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Project photos ({req.photo_urls.length})
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {(req.photo_urls as string[]).map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted hover:opacity-90 transition"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Message thread CTA */}
        {hasContractor && isActive && (
          <Link
            href={`/dashboard/messages/${req.id}`}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4 transition hover:border-primary/40"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Message thread open</p>
                <p className="text-[11px] text-muted-foreground">View your assigned contractor details</p>
              </div>
            </div>
            <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
          </Link>
        )}

        {/* Pending review notice */}
        {req.status === "pending_review" && (
          <div className="rounded-lg border border-border bg-muted/30 px-5 py-4 text-[13px] text-muted-foreground">
            Your request is under review by Nexus Operations. Once approved, it will enter the contractor queue and a contractor will be assigned within 24 hours.
          </div>
        )}

      </div>
    </div>
  )
}
