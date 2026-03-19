import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  FileText,
  ArrowRight,
  MapPin,
  DollarSign,
  Calendar,
  ChevronRight,
  BadgeCheck,
  AlertTriangle,
  CreditCard,
  TrendingUp,
} from "lucide-react"
import { formatUsd, SERVICE_REQUEST_FEE_CENTS } from "@/lib/billing/config"
import { isMissingServiceRequestsTableError } from "@/lib/supabase/errors"

const CATEGORY_LABELS: Record<string, string> = {
  "tree-removal": "Tree Removal",
  hvac:           "HVAC",
  electrical:     "Electrical",
  roofing:        "Roofing",
  concrete:       "Concrete",
  fencing:        "Fencing",
  plumbing:       "Plumbing",
  "general-repair": "General Repair",
}

const STATUS_LABELS: Record<string, string> = {
  pending_review:            "Pending Review",
  in_queue:                  "In Queue",
  assigned:                  "Assigned",
  consultation_scheduled:    "Consultation Scheduled",
  in_progress:               "In Progress",
  completed:                 "Completed",
}

export default async function ContractorDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const role = user.user_metadata?.role || "homeowner"
  if (role !== "contractor") redirect("/dashboard")

  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Contractor"

  // Load profile for subscription status
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, stripe_connect_status, stripe_customer_id")
    .eq("id", user.id)
    .single()

  const subStatus     = profile?.subscription_status     ?? null
  const connectStatus = profile?.stripe_connect_status   ?? "not_connected"

  // Open requests (not yet assigned)
  const { data: openRequests, error: openRequestsError } = await supabase
    .from("service_requests")
    .select("id, category, description, address, city, state, zip_code, budget_max, preferred_dates, created_at")
    .in("status", ["pending_review", "in_queue"])
    .is("assigned_contractor_id", null)
    .order("created_at", { ascending: false })

  // Claimed requests (assigned to this contractor)
  const { data: claimedRequests, error: claimedRequestsError } = await supabase
    .from("service_requests")
    .select("id, category, description, address, city, state, zip_code, budget_max, status, created_at")
    .eq("assigned_contractor_id", user.id)
    .not("status", "in", '("pending_review","in_queue")')
    .order("created_at", { ascending: false })

  const open    = openRequests    ?? []
  const claimed = claimedRequests ?? []
  const requestsUnavailable =
    isMissingServiceRequestsTableError(openRequestsError) ||
    isMissingServiceRequestsTableError(claimedRequestsError)

  const claimedThisMonth = claimed.filter((r) => {
    const d = new Date(r.created_at)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const avgBudget = claimed.length > 0 && claimed.some((r) => r.budget_max)
    ? Math.round(
        claimed.reduce((sum, r) => sum + (r.budget_max ? Number(r.budget_max) : 0), 0) /
        claimed.filter((r) => r.budget_max).length
      )
    : null

  const completedCount = claimed.filter((r) => r.status === "completed").length

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* ── Page header ── */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">Contractor Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {fullName} — Shawnee County service area
            </p>
          </div>
          <Link
            href="/dashboard/contractor/settings"
            className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-[13px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Account Settings
          </Link>
        </div>

        {/* ── Subscription / billing alerts ── */}
        {subStatus === "past_due" && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-600">Membership payment past due</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your monthly membership payment failed. Update your payment method to maintain access to open requests.
              </p>
            </div>
            <Link
              href="/dashboard/contractor/settings"
              className="flex-shrink-0 text-[12px] font-medium text-amber-600 hover:underline underline-offset-4"
            >
              Update billing →
            </Link>
          </div>
        )}
        {(!subStatus || subStatus === "canceled") && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <CreditCard className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Activate your contractor membership</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                A Nexus membership gives you full access to all open requests in Shawnee County. Without it, you can still claim jobs for {formatUsd(SERVICE_REQUEST_FEE_CENTS)} each.
              </p>
            </div>
            <Link
              href="/dashboard/contractor/billing"
              className="flex-shrink-0 text-[12px] font-medium text-primary hover:underline underline-offset-4"
            >
              View plans →
            </Link>
          </div>
        )}
        {connectStatus === "not_connected" && (subStatus === "active" || subStatus === "trialing") && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
            <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Connect your payout account</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Link a bank account through Stripe Connect to receive direct payments after each completed job.
              </p>
            </div>
            <Link
              href="/dashboard/contractor/settings"
              className="flex-shrink-0 text-[12px] font-medium text-primary hover:underline underline-offset-4"
            >
              Connect →
            </Link>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Open Requests",
              value: String(open.length),
              sub:   "Unclaimed requests available in your area",
              color: "text-primary",
            },
            {
              label: "Claimed This Month",
              value: String(claimedThisMonth),
              sub:   "Projects claimed exclusively by you this month",
              color: "text-foreground",
            },
            {
              label: "Avg. Budget",
              value: avgBudget ? `$${avgBudget.toLocaleString()}` : "—",
              sub:   "Average budget ceiling across your claimed requests",
              color: "text-foreground",
            },
            {
              label: "Completed",
              value: String(completedCount),
              sub:   "All-time projects you have completed",
              color: "text-foreground",
            },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="rounded-lg border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground mb-3">{label}</p>
              <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Verification notice ── */}
        <div className="mb-8 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your account is active and verified. License, insurance, and background check on file. To update your credentials or documentation, contact{" "}
            <a href="mailto:admin@nexusoperations.org" className="text-primary hover:underline">
              admin@nexusoperations.org
            </a>.
          </p>
        </div>

        {/* ── Open requests ── */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Open Requests — Shawnee County</h2>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-muted-foreground">{open.length} available</span>
            {open.length > 0 && (
              <Link
                href="/dashboard/contractor/requests"
                className="text-[11px] font-medium text-primary hover:underline underline-offset-4"
              >
                View all →
              </Link>
            )}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mb-5">
          Claiming a request removes it from all other contractor feeds immediately. Review the full project scope before claiming.
        </p>

        {requestsUnavailable && (
          <div className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
            The contractor request feed is temporarily unavailable because the `public.service_requests` table is missing from the Supabase schema cache.
          </div>
        )}

        {open.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
            <FileText className="mx-auto h-5 w-5 text-muted-foreground mb-3" />
            <h3 className="text-sm font-semibold">No open requests right now</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              New requests in Shawnee County will appear here as they are submitted and reviewed.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {open.slice(0, 5).map((req) => (
              <div
                key={req.id}
                className="rounded-lg border border-border bg-card overflow-hidden transition hover:border-primary/30"
              >
                <div className="flex items-start justify-between px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
                        {CATEGORY_LABELS[req.category] ?? req.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-sm font-semibold line-clamp-2 mb-2">{req.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {req.address}, {req.city}, {req.state} {req.zip_code}
                      </span>
                      {req.budget_max && (
                        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <DollarSign className="h-3 w-3" />
                          Budget ceiling:{" "}
                          <strong className="text-foreground ml-0.5">
                            ${Number(req.budget_max).toLocaleString()}
                          </strong>
                        </span>
                      )}
                      {req.preferred_dates && (
                        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />{req.preferred_dates}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0">
                    <Link
                      href={`/dashboard/contractor/requests/${req.id}`}
                      className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      View &amp; Claim
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {open.length > 5 && (
              <Link
                href="/dashboard/contractor/requests"
                className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-3 text-[12px] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              >
                View {open.length - 5} more open request{open.length - 5 !== 1 ? "s" : ""}{" "}
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        )}

        {/* ── Claimed requests ── */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Claimed Requests</h2>
            <span className="text-[11px] text-muted-foreground">{claimed.length} total</span>
          </div>

          {claimed.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
              <FileText className="mx-auto h-5 w-5 text-muted-foreground mb-3" />
              <h3 className="text-sm font-semibold">No claimed requests yet</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
                Projects you claim will appear here with full scope documentation and consultation details.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {claimed.map((req) => (
                <div
                  key={req.id}
                  className="rounded-lg border border-border bg-card overflow-hidden transition hover:border-primary/30"
                >
                  <div className="flex items-start justify-between px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
                          {CATEGORY_LABELS[req.category] ?? req.category}
                        </span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                          req.status === "completed"
                            ? "text-green-600 bg-green-500/10"
                            : req.status === "in_progress"
                            ? "text-blue-600 bg-blue-500/10"
                            : "text-muted-foreground bg-muted"
                        }`}>
                          {STATUS_LABELS[req.status] ?? req.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-sm font-medium line-clamp-2 mb-1">{req.description}</p>
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {req.address}, {req.city}, {req.state} {req.zip_code}
                      </span>
                    </div>
                    <div className="ml-5 flex-shrink-0 text-right">
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                      {req.budget_max && (
                        <p className="text-[11px] font-medium text-foreground mt-1">
                          ${Number(req.budget_max).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Quick links / Resources ── */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold mb-4">Resources</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              {
                href:     "/dashboard/contractor/profile",
                label:    "Contractor Profile",
                sub:      "Business info, trade categories, service area",
                external: false,
              },
              {
                href:     "/dashboard/contractor/billing",
                label:    "Billing &amp; Subscription",
                sub:      "Membership plan, invoices, and payment method",
                external: false,
              },
              {
                href:     "https://nexusoperations.zendesk.com/hc/en-us",
                label:    "Help Center",
                sub:      "Platform policies, claim process, and FAQs",
                external: true,
              },
            ].map(({ href, label, sub, external }) => (
              <Link
                key={href}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3.5 transition hover:border-primary/40 group"
              >
                <div>
                  <p
                    className="text-[13px] font-medium"
                    dangerouslySetInnerHTML={{ __html: label }}
                  />
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
