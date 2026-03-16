import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MessageSquare, MapPin, ArrowRight, Clock } from "lucide-react"

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

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 2)   return "just now"
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)   return `${days}d ago`
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" })
}

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const role = (user.user_metadata?.role as string) || "homeowner"

  const { data: threads } = await supabase
    .from("service_requests")
    .select("id, category, description, address, city, state, zip_code, status, assigned_contractor_id, updated_at")
    .eq(role === "contractor" ? "assigned_contractor_id" : "owner_id", user.id)
    .not("assigned_contractor_id", "is", null)
    .order("updated_at", { ascending: false })

  const list = threads ?? []

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {list.length > 0
              ? `${list.length} active thread${list.length !== 1 ? "s" : ""}`
              : "Threads open when a contractor claims your request."}
          </p>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-8 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold">No active threads</h3>
            <p className="mt-2 max-w-xs text-xs text-muted-foreground leading-relaxed">
              {role === "contractor"
                ? "Message threads appear here once you claim a request. Head to Open Requests to get started."
                : "Message threads appear here once a contractor claims one of your requests."}
            </p>
            {role === "contractor" ? (
              <Link
                href="/dashboard/contractor/requests"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-[12.5px] font-semibold text-primary-foreground transition hover:opacity-90"
              >
                View open requests <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <Link
                href="/dashboard/requests/new"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-[12.5px] font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Submit a request <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {list.map((req) => (
              <Link
                key={req.id}
                href={`/dashboard/messages/${req.id}`}
                className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                      {CATEGORY_LABELS[req.category] ?? req.category.replace(/-/g, " ")}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {STATUS_LABELS[req.status] ?? req.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-snug line-clamp-1">{req.description}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      {req.address}, {req.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      {relativeTime(req.updated_at)}
                    </span>
                  </div>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
