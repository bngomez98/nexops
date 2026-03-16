import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  FileText,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  ChevronRight,
} from "lucide-react"

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

  const fullName        = user.user_metadata?.full_name || user.email?.split("@")[0] || "there"
  const isPropertyManager = role === "property_manager"

  const { data: requests } = await supabase
    .from("service_requests")
    .select("status")
    .eq("owner_id", user.id)

  const open       = requests?.filter((r) => ["in_queue", "pending_review"].includes(r.status)).length ?? 0
  const inProgress = requests?.filter((r) => ["assigned", "consultation_scheduled", "in_progress"].includes(r.status)).length ?? 0
  const completed  = requests?.filter((r) => r.status === "completed").length ?? 0
  const hasRequests = (requests?.length ?? 0) > 0

  const stats = [
    { label: "Open Requests", value: String(open),       sub: "Submitted and waiting for a contractor to claim",        icon: FileText,    color: "text-foreground" },
    { label: "In Progress",   value: String(inProgress), sub: "A contractor has claimed the project and work is active", icon: Clock,       color: "text-primary" },
    { label: "Completed",     value: String(completed),  sub: "Projects finished and closed on this account",            icon: CheckCircle, color: "text-foreground" },
  ]

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* Page header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">
              {isPropertyManager ? "Property Manager Dashboard" : "Owner Dashboard"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isPropertyManager
                ? `Managing requests across all properties — ${fullName}`
                : `Service requests for ${fullName}`}
            </p>
          </div>
          <Link
            href="/dashboard/requests/new"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New Request
          </Link>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className="text-2xl font-bold tabular-nums">{value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        {/* Empty state or recent requests */}
        {!hasRequests ? (
          <div className="mb-8 rounded-lg border border-dashed border-border bg-card p-10 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm mb-1">No service requests submitted</h3>
            <p className="text-xs text-muted-foreground mb-5 max-w-sm mx-auto">
              Submit your project with photos, a written scope, and a budget cap. A verified contractor will be assigned exclusively.
            </p>
            <Link
              href="/dashboard/requests/new"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Submit your project now
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Recent Requests</h2>
              <Link href="/dashboard/requests" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              {open} open · {inProgress} in progress · {completed} completed
            </div>
          </div>
        )}

        {/* Process reference */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold mb-4">How it works</h2>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { step: "01", label: "Submit",       desc: "Photos, scope, and budget cap" },
              { step: "02", label: "Assignment",   desc: "One contractor claims exclusively" },
              { step: "03", label: "Consultation", desc: "Pre-confirmed within 24 hours" },
              { step: "04", label: "Estimate",     desc: "Written, itemized — no obligation" },
            ].map(({ step, label, desc }) => (
              <div key={step} className="rounded-lg border border-border bg-card p-4">
                <p className="text-[11px] font-bold text-primary mb-2">{step}</p>
                <p className="text-xs font-semibold">{label}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h2 className="text-sm font-semibold mb-4">Account</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/dashboard/requests/new", label: "Submit a project request", sub: "Photos, scope, and budget" },
              { href: "/dashboard/requests",     label: "View all requests",        sub: "Track open and completed jobs" },
              { href: "/dashboard/messages",     label: "Messages",                 sub: "Communicate with assigned contractors" },
              { href: "/dashboard/billing",      label: "Billing & Payments",       sub: "Payment history and receipts" },
              { href: "/dashboard/settings",     label: "Account settings",         sub: "Profile, properties, notifications" },
              { href: "https://nexusoperations.zendesk.com/hc/en-us", label: "Help Center", sub: "Platform documentation and support", external: true },
            ].map(({ href, label, sub, external }) => (
              <Link
                key={href}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3.5 transition hover:border-primary/40 group"
              >
                <div>
                  <p className="text-[13px] font-medium">{label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
