import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  User,
  Info,
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

const STATUS_LABELS: Record<string, string> = {
  pending_review:         "Pending Review",
  in_queue:               "Open",
  assigned:               "Assigned",
  consultation_scheduled: "Consultation Scheduled",
  in_progress:            "In Progress",
  completed:              "Completed",
  declined:               "Declined",
  cancelled:              "Cancelled",
}

export default async function MessageThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const role = user.user_metadata?.role || "homeowner"

  // Fetch the service request — must be owned by or assigned to this user
  const { data: req } = await supabase
    .from("service_requests")
    .select("*")
    .eq("id", id)
    .single()

  if (!req) notFound()

  // Access control: homeowners see their own; contractors see requests assigned to them
  const isOwner      = req.owner_id === user.id
  const isContractor = role === "contractor" && req.assigned_contractor_id === user.id

  if (!isOwner && !isContractor) redirect("/dashboard/messages")

  // Fetch the contractor's profile if one is assigned and the viewer is the owner
  let contractorProfile: { full_name?: string; email?: string; phone?: string } | null = null
  if (isOwner && req.assigned_contractor_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, phone")
      .eq("id", req.assigned_contractor_id)
      .single()
    contractorProfile = profile
  }

  const consultationConfirmed = ["consultation_scheduled", "in_progress", "completed"].includes(req.status)

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* Back */}
        <Link
          href="/dashboard/messages"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All messages
        </Link>

        {/* Request header */}
        <div className="mb-6 rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
              {CATEGORY_LABELS[req.category] ?? req.category.replace(/-/g, " ")}
            </span>
            <span className="text-[10px] text-muted-foreground capitalize">
              {STATUS_LABELS[req.status] ?? req.status.replace(/_/g, " ")}
            </span>
          </div>

          <p className="text-sm font-semibold mb-3">{req.description}</p>

          <div className="space-y-1.5 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
              {req.address}, {req.city}, {req.state} {req.zip_code}
            </span>
            {(req.budget_min || req.budget_max) && (
              <span className="flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                {req.budget_min && req.budget_max
                  ? `$${Number(req.budget_min).toLocaleString()} – $${Number(req.budget_max).toLocaleString()}`
                  : req.budget_max
                  ? `Up to $${Number(req.budget_max).toLocaleString()}`
                  : `From $${Number(req.budget_min).toLocaleString()}`}
              </span>
            )}
            {req.preferred_dates && (
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                {req.preferred_dates}
              </span>
            )}
          </div>
        </div>

        {/* Contractor contact — shown to owner after consultation confirmed */}
        {isOwner && req.assigned_contractor_id && (
          <div className="mb-6 rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Assigned Contractor</p>
            </div>

            {contractorProfile?.full_name && (
              <p className="text-sm font-medium mb-3">{contractorProfile.full_name}</p>
            )}

            {consultationConfirmed ? (
              <div className="space-y-2">
                {contractorProfile?.phone && (
                  <a
                    href={`tel:${contractorProfile.phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-2.5 text-[13px] text-muted-foreground hover:text-foreground transition"
                  >
                    <Phone className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    {contractorProfile.phone}
                  </a>
                )}
                {contractorProfile?.email && (
                  <a
                    href={`mailto:${contractorProfile.email}`}
                    className="flex items-center gap-2.5 text-[13px] text-muted-foreground hover:text-foreground transition"
                  >
                    <Mail className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    {contractorProfile.email}
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded border border-border bg-muted/50 px-3 py-2.5">
                <Info className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  Direct contact information becomes available once your consultation is confirmed.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Contractor view — show owner contact after consultation confirmed */}
        {isContractor && (
          <div className="mb-6 rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Property Owner</p>
            </div>
            {consultationConfirmed ? (
              <div className="space-y-2">
                <p className="text-[12px] text-muted-foreground">
                  Contact the property owner to confirm consultation details.
                </p>
                <a
                  href="mailto:admin@nexusoperations.org"
                  className="flex items-center gap-2.5 text-[13px] text-muted-foreground hover:text-foreground transition"
                >
                  <Mail className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  admin@nexusoperations.org
                </a>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded border border-border bg-muted/50 px-3 py-2.5">
                <Info className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  Owner contact details are released once the consultation is confirmed by Nexus.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Platform message channel note */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">Platform messaging</p>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
            In-platform messaging for this request is managed by Nexus Operations. Send a message directly to our team and we will relay it to the{" "}
            {isOwner ? "contractor" : "property owner"} for this request.
          </p>
          <a
            href={`mailto:admin@nexusoperations.org?subject=Message re: Request ${id.slice(0, 8).toUpperCase()}`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Mail className="h-3.5 w-3.5" />
            Send message via Nexus
          </a>
        </div>

      </div>
    </div>
  )
}
