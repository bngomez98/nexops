import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  FileText, Clock, CheckCircle, Plus, ChevronRight,
  AlertCircle, Calendar, MapPin, DollarSign,
} from "lucide-react"

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
  pending_review:         "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  in_queue:               "bg-blue-500/10 text-blue-400 border-blue-500/20",
  assigned:               "bg-primary/10 text-primary border-primary/20",
  consultation_scheduled: "bg-primary/10 text-primary border-primary/20",
  in_progress:            "bg-primary/10 text-primary border-primary/20",
  completed:              "bg-muted text-muted-foreground border-border",
  declined:               "bg-destructive/10 text-destructive border-destructive/20",
  cancelled:              "bg-muted text-muted-foreground border-border",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const role = user.user_metadata?.role || "homeowner"
  if (role === "contractor") redirect("/dashboard/contractor")

  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "there"
  const isPropertyManager = role === "property_manager"

  // Fetch real request counts
  const { data: requests, error: reqError } = await supabase
    .from("service_requests")
    .select("id, status, category, address, city, created_at, budget_max")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  const allRequests = requests ?? []
  const openCount       = allRequests.filter(r => ["pending_review","in_queue","assigned","consultation_scheduled"].includes(r.status)).length
  const activeCount     = allRequests.filter(r => r.status === "in_progress").length
  const completedCount  = allRequests.filter(r => r.status === "completed").length
  const recentRequests  = allRequests.slice(0, 5)

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">
              {isPropertyManager ? "Property Manager Portal" : "Owner Portal"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back, {fullName}.
              {isPropertyManager
                ? " Showing all properties on this account."
                : " Showing service requests for your property."}
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

        {/* Stats */}
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Open",      value: openCount,      sub: "Pending review or assignment",    icon: FileText,    active: true  },
            { label: "Active",    value: activeCount,    sub: "Work currently in progress",       icon: Clock,       active: activeCount > 0 },
            { label: "Completed", value: completedCount, sub: "All time on this account",         icon: CheckCircle, active: false },
          ].map(({ label, value, sub, icon: Icon, active }) => (
            <div key={label} className={`rounded-lg border p-5 ${active && value > 0 ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <Icon className={`h-4 w-4 ${active && value > 0 ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <p className={`text-2xl font-bold tabular-nums ${active && value > 0 ? "text-primary" : ""}`}>{value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        {/* Recent requests */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Recent Requests</h2>
            <Link href="/dashboard/requests" className="text-[12px] text-primary hover:underline">
              View all
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card px-8 py-12 text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">No requests submitted yet</h3>
              <p className="text-[12px] text-muted-foreground mb-5 max-w-xs mx-auto">
                Submit your first service request with photos, a written scope, and a budget ceiling.
              </p>
              <Link
                href="/dashboard/requests/new"
                className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Submit a Request
              </Link>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              {recentRequests.map((req, i) => (
                <div
                  key={req.id}
                  className={`flex items-center justify-between px-4 py-3.5 hover:bg-muted/40 transition ${i < recentRequests.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium truncate">{req.category?.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <MapPin className="h-3 w-3" />{req.city || "—"}
                        </span>
                        {req.budget_max && (
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <DollarSign className="h-3 w-3" />Up to ${Number(req.budget_max).toLocaleString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`ml-4 flex-shrink-0 rounded border px-2 py-0.5 text-[11px] font-medium ${STATUS_COLOR[req.status] ?? "bg-muted text-muted-foreground border-border"}`}>
                    {STATUS_LABEL[req.status] ?? req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {reqError && (
          <div className="mb-6 flex items-center gap-2 rounded border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            Could not load requests: {reqError.message}
          </div>
        )}

        {/* Quick nav */}
        <div>
          <h2 className="text-sm font-semibold mb-3">Quick Access</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/dashboard/requests/new", label: "New service request",    sub: "Submit with photos, scope, and budget" },
              { href: "/dashboard/requests",     label: "All requests",           sub: "Full history — open and completed" },
              { href: "/dashboard/messages",     label: "Messages",               sub: "Threads with assigned contractors" },
              { href: "/dashboard/settings",     label: "Settings",               sub: "Profile, properties, notifications" },
              ...(isPropertyManager ? [
                { href: "/dashboard/reports", label: "Reports", sub: "Portfolio-level maintenance summaries" },
              ] : []),
            ].map(({ href, label, sub }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3.5 transition hover:border-primary/40 group"
              >
                <div>
                  <p className="text-[13px] font-medium">{label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
