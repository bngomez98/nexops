import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, FileText, MapPin, Calendar, DollarSign, ChevronRight } from "lucide-react"

const STATUS_LABELS: Record<string, string> = {
  pending_review:          "Pending Review",
  in_queue:                "Open",
  assigned:                "Assigned",
  consultation_scheduled:  "Consultation Scheduled",
  in_progress:             "In Progress",
  completed:               "Completed",
  declined:                "Declined",
  cancelled:               "Cancelled",
}

const STATUS_COLORS: Record<string, string> = {
  pending_review:          "text-muted-foreground bg-muted",
  in_queue:                "text-primary bg-primary/10",
  assigned:                "text-blue-600 bg-blue-50",
  consultation_scheduled:  "text-blue-600 bg-blue-50",
  in_progress:             "text-amber-600 bg-amber-50",
  completed:               "text-green-700 bg-green-100",
  declined:                "text-destructive bg-destructive/10",
  cancelled:               "text-muted-foreground bg-muted",
}

export default async function RequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: requests } = await supabase
    .from("service_requests")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  const list = requests ?? []

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">My Requests</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {list.length === 0 ? "No requests submitted yet" : `${list.length} request${list.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <Button asChild size="sm">
            <Link href="/dashboard/requests/new">
              <Plus className="h-3.5 w-3.5" />
              New Request
            </Link>
          </Button>
        </div>

        {list.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-14 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold">No requests yet</h3>
            <p className="mt-1.5 text-xs text-muted-foreground max-w-xs mx-auto">
              Submit your first request to get matched with a verified contractor in your area.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/dashboard/requests/new">Submit Request</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((req) => (
              <div
                key={req.id}
                className="rounded-lg border border-border bg-card overflow-hidden transition hover:border-primary/30"
              >
                <div className="flex items-start justify-between px-5 py-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
                        {req.category.replace(/-/g, " ")}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[req.status] ?? "text-muted-foreground bg-muted"}`}>
                        {STATUS_LABELS[req.status] ?? req.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium line-clamp-2">{req.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3" />{req.address}, {req.city}, {req.state} {req.zip_code}
                      </span>
                      {(req.budget_min || req.budget_max) && (
                        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <DollarSign className="h-3 w-3" />
                          {req.budget_min && req.budget_max
                            ? `$${Number(req.budget_min).toLocaleString()} – $${Number(req.budget_max).toLocaleString()}`
                            : req.budget_max
                            ? `Up to $${Number(req.budget_max).toLocaleString()}`
                            : `From $${Number(req.budget_min).toLocaleString()}`}
                        </span>
                      )}
                      {req.preferred_dates && (
                        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />{req.preferred_dates}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-6 flex-shrink-0">
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
