import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus, FileText, MapPin, DollarSign, Calendar, AlertCircle } from "lucide-react"

const STATUS_LABEL: Record<string, string> = {
  pending_review:          "Pending Review",
  in_queue:                "In Queue",
  assigned:                "Assigned",
  consultation_scheduled:  "Consultation Scheduled",
  in_progress:             "In Progress",
  completed:               "Completed",
  declined:                "Declined",
  cancelled:               "Cancelled",
}

const STATUS_COLOR: Record<string, string> = {
  pending_review:          "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  in_queue:                "bg-blue-500/10 text-blue-400 border-blue-500/20",
  assigned:                "bg-primary/10 text-primary border-primary/20",
  consultation_scheduled:  "bg-primary/10 text-primary border-primary/20",
  in_progress:             "bg-primary/10 text-primary border-primary/20",
  completed:               "bg-muted text-muted-foreground border-border",
  declined:                "bg-destructive/10 text-destructive border-destructive/20",
  cancelled:               "bg-muted text-muted-foreground border-border",
}

export default async function RequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: requests, error } = await supabase
    .from("service_requests")
    .select("id, status, category, address, city, state, zip_code, created_at, budget_min, budget_max, description")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  const allRequests = requests ?? []
  const active    = allRequests.filter(r => !["completed","declined","cancelled"].includes(r.status))
  const archived  = allRequests.filter(r =>  ["completed","declined","cancelled"].includes(r.status))

  const RequestRow = ({ req, last }: { req: typeof allRequests[0]; last: boolean }) => (
    <div className={`flex items-start justify-between gap-4 px-5 py-4 hover:bg-muted/30 transition ${!last ? "border-b border-border" : ""}`}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 mb-1">
          <p className="text-[13px] font-semibold">
            {req.category?.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </p>
          <span className={`rounded border px-2 py-0.5 text-[11px] font-medium ${STATUS_COLOR[req.status] ?? "bg-muted text-muted-foreground border-border"}`}>
            {STATUS_LABEL[req.status] ?? req.status}
          </span>
        </div>
        {req.description && (
          <p className="text-[12px] text-muted-foreground mb-2 line-clamp-1">{req.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {req.address}, {req.city}, {req.state} {req.zip_code}
          </span>
          {(req.budget_min || req.budget_max) && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {req.budget_min && req.budget_max
                ? `$${Number(req.budget_min).toLocaleString()} – $${Number(req.budget_max).toLocaleString()}`
                : req.budget_max
                ? `Up to $${Number(req.budget_max).toLocaleString()}`
                : `From $${Number(req.budget_min).toLocaleString()}`}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(req.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Service Requests</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {allRequests.length === 0
                ? "No requests submitted yet."
                : `${allRequests.length} total request${allRequests.length !== 1 ? "s" : ""} — ${active.length} active.`}
            </p>
          </div>
          <Link
            href="/dashboard/requests/new"
            className="flex-shrink-0 inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New Request
          </Link>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            Failed to load requests: {error.message}
          </div>
        )}

        {allRequests.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card px-8 py-14 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold mb-1">No service requests</h3>
            <p className="text-[12px] text-muted-foreground mb-5 max-w-sm mx-auto">
              Submit a request with photographs, a written description of the scope, and a budget ceiling. A verified contractor in your area will be assigned exclusively.
            </p>
            <Link
              href="/dashboard/requests/new"
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Submit First Request
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active */}
            {active.length > 0 && (
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Active — {active.length}
                </p>
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  {active.map((req, i) => (
                    <RequestRow key={req.id} req={req} last={i === active.length - 1} />
                  ))}
                </div>
              </section>
            )}

            {/* Archived */}
            {archived.length > 0 && (
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Completed / Closed — {archived.length}
                </p>
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  {archived.map((req, i) => (
                    <RequestRow key={req.id} req={req} last={i === archived.length - 1} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
