import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, DollarSign, Calendar, FileText } from "lucide-react"
import { ClaimButton } from "./claim-button"

const CATEGORY_LABELS: Record<string, string> = {
  "tree-removal": "Tree Removal",
  hvac:           "HVAC",
  electrical:     "Electrical",
  roofing:        "Roofing",
  concrete:       "Concrete",
  fencing:        "Fencing",
  plumbing:       "Plumbing",
}

export default async function ContractorRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const role = user.user_metadata?.role || "homeowner"
  if (role !== "contractor") redirect("/dashboard")

  const { data: req } = await supabase
    .from("service_requests")
    .select("*")
    .eq("id", id)
    .or(
      `and(status.in.(pending_review,in_queue),assigned_contractor_id.is.null),assigned_contractor_id.eq.${user.id}`,
    )
    .single()

  if (!req) notFound()

  const isOpen = ["pending_review", "in_queue"].includes(req.status) && !req.assigned_contractor_id
  const isMine = req.assigned_contractor_id === user.id

  if (!isOpen && !isMine) notFound()

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Link
          href="/dashboard/contractor/requests"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to open requests
        </Link>

        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {CATEGORY_LABELS[req.category] ?? req.category}
              </span>
              {isMine && (
                <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  Claimed by you
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold">{CATEGORY_LABELS[req.category] ?? req.category} Request</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Submitted {new Date(req.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          {isOpen && <ClaimButton requestId={req.id} contractorId={user.id} />}
        </div>

        <div className="space-y-4">
          {/* Scope */}
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Project Scope</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{req.description}</p>
            {req.additional_notes && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground font-medium mb-1">Additional notes</p>
                <p className="text-sm text-muted-foreground">{req.additional_notes}</p>
              </div>
            )}
          </div>

          {/* Details grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Location</h2>
              </div>
              <p className="text-sm">{req.address}</p>
              <p className="text-sm">{req.city}, {req.state} {req.zip_code}</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Budget</h2>
              </div>
              {req.budget_min || req.budget_max ? (
                <p className="text-sm">
                  {req.budget_min && req.budget_max
                    ? `$${Number(req.budget_min).toLocaleString()} – $${Number(req.budget_max).toLocaleString()}`
                    : req.budget_max
                    ? `Up to $${Number(req.budget_max).toLocaleString()}`
                    : `From $${Number(req.budget_min).toLocaleString()}`}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Not specified</p>
              )}
            </div>
          </div>

          {req.preferred_dates && (
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Owner Availability</h2>
              </div>
              <p className="text-sm">{req.preferred_dates}</p>
            </div>
          )}

          {/* Claim info */}
          {isOpen && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <h3 className="text-sm font-medium text-primary mb-2">Claiming this request</h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Claiming removes this request from all other contractor feeds immediately.</li>
                <li>• You are committing to contact the homeowner within 24 hours to schedule a consultation.</li>
                <li>• A no-show without notice may result in account review.</li>
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
