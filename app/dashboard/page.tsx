import { createClient } from "@/lib/supabase/server"
import { isTemplatedRequest } from "@/lib/requests"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  FileText,
  Clock3,
  CheckCircle2,
  Plus,
  ArrowRight,
  ChevronRight,
  Sparkles,
  House,
  MessagesSquare,
} from "lucide-react"

const STATUS_LABELS: Record<string, string> = {
  pending_review: "Pending Review",
  in_queue: "Open",
  assigned: "Assigned",
  consultation_scheduled: "Consultation Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  declined: "Declined",
  cancelled: "Cancelled",
}

const STATUS_COLORS: Record<string, string> = {
  pending_review: "text-muted-foreground bg-muted",
  in_queue: "text-primary bg-primary/10",
  assigned: "text-blue-500 bg-blue-500/10",
  consultation_scheduled: "text-blue-500 bg-blue-500/10",
  in_progress: "text-amber-500 bg-amber-500/10",
  completed: "text-green-500 bg-green-500/10",
  declined: "text-destructive bg-destructive/10",
  cancelled: "text-muted-foreground bg-muted",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const role = user.user_metadata?.role || "homeowner"

  if (role === "contractor") {
    redirect("/dashboard/contractor")
  }

  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "there"
  const isPropertyManager = role === "property_manager"

  const { data: requests } = await supabase
    .from("service_requests")
    .select("id, status, description, category, created_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  const list = requests ?? []

  const open = list.filter((r) => ["in_queue", "pending_review"].includes(r.status)).length
  const inProgress = list.filter((r) => ["assigned", "consultation_scheduled", "in_progress"].includes(r.status)).length
  const completed = list.filter((r) => r.status === "completed").length
  const hasRequests = list.length > 0

  const stats = [
    {
      label: "Open Requests",
      value: String(open),
      sub: "Submitted and waiting for assignment",
      icon: FileText,
      iconClass: "text-foreground",
    },
    {
      label: "In Progress",
      value: String(inProgress),
      sub: "Actively being worked by your contractor",
      icon: Clock3,
      iconClass: "text-primary",
    },
    {
      label: "Completed",
      value: String(completed),
      sub: "Closed projects with full service records",
      icon: CheckCircle2,
      iconClass: "text-emerald-500",
    },
  ]

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 rounded-2xl border border-border/60 bg-card p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {isPropertyManager ? "Portfolio Overview" : "Account Overview"}
              </p>
              <h1 className="text-2xl font-bold tracking-tight">
                {isPropertyManager ? "Property Manager Dashboard" : "Owner Dashboard"}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {isPropertyManager
                  ? `Welcome back, ${fullName}. Monitor projects and keep your properties moving.`
                  : `Welcome back, ${fullName}. Track every project from request to completion.`}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/requests/new"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <Plus className="h-3.5 w-3.5" />
                New Request
              </Link>
              <Link
                href="/dashboard/requests"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-[13px] font-medium transition hover:border-primary/40"
              >
                View all
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, sub, icon: Icon, iconClass }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <Icon className={`h-4 w-4 ${iconClass}`} />
              </div>
              <p className="text-3xl font-bold tabular-nums tracking-tight">{value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Recent requests</h2>
              <Link href="/dashboard/requests" className="text-xs font-medium text-primary hover:underline">
                Manage requests
              </Link>
            </div>

            {!hasRequests ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold">No service requests submitted</h3>
                <p className="mx-auto mt-1.5 max-w-sm text-xs text-muted-foreground">
                  Start with photos, scope details, and budget. We&apos;ll review and assign a verified contractor.
                </p>
                <Link
                  href="/dashboard/requests/new"
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Submit your first request
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {list.slice(0, 4).map((request) => (
                  <Link
                    key={request.id}
                    href={`/dashboard/requests/${request.id}`}
                    className="group flex items-center justify-between rounded-lg border border-border px-3.5 py-3 transition hover:border-primary/40 hover:bg-muted/30"
                  >
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary capitalize">
                          {request.category.replace(/-/g, " ")}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[request.status] ?? "text-muted-foreground bg-muted"}`}>
                          {STATUS_LABELS[request.status] ?? request.status}
                        </span>
                      </div>
                      <p className="line-clamp-1 text-[13px] font-medium">{request.description}</p>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-3 text-sm font-semibold">How Nexus works</h2>
              <div className="space-y-2">
                {[
                  "Submit your scope, timeline, and budget",
                  "Nexus verifies details and assigns one contractor",
                  "Consultation is coordinated within 24 hours",
                  "Progress and records are tracked in your dashboard",
                ].map((step, index) => (
                  <div key={step} className="flex items-start gap-2.5 text-[12px]">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {index + 1}
                    </span>
                    <p className="text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-3 text-sm font-semibold">Quick access</h2>
              <div className="space-y-1.5">
                {[
                  { href: "/dashboard/requests/new", label: "Submit a new project", icon: House },
                  { href: "/dashboard/messages", label: "Open messages", icon: MessagesSquare },
                  { href: "/dashboard/settings", label: "Account settings", icon: ChevronRight },
                ].map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between rounded-md px-2.5 py-2 text-[13px] transition hover:bg-muted"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      {label}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
