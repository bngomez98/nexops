import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MapPin, DollarSign, Calendar, ArrowRight } from "lucide-react"

const CATEGORY_LABELS: Record<string, string> = {
  "tree-removal": "Tree Removal",
  hvac:           "HVAC",
  electrical:     "Electrical",
  roofing:        "Roofing",
  concrete:       "Concrete",
  fencing:        "Fencing",
  plumbing:       "Plumbing",
}

export default async function ContractorRequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")
  if (user.user_metadata?.role !== "contractor") redirect("/dashboard")

  const { data: requests } = await supabase
    .from("service_requests")
    .select("id, category, description, address, city, state, zip_code, budget_max, preferred_dates, created_at")
    .in("status", ["pending_review", "in_queue"])
    .is("assigned_contractor_id", null)
    .order("created_at", { ascending: false })

  const openRequests = requests ?? []

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Open Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Requests available in your service area. Claiming a request removes it from all other contractor feeds instantly.
          </p>
        </div>

        {/* Filter row */}
        <div className="mb-6 flex flex-wrap gap-2">
          {["All Categories", "HVAC", "Roofing", "Electrical", "Concrete", "Tree Removal", "Fencing", "Plumbing"].map((f) => (
            <button
              key={f}
              className={`rounded border px-3 py-1.5 text-[12px] font-medium transition ${f === "All Categories" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {openRequests.length === 0 ? (
          <div className="rounded-lg border border-border bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">No open requests available right now. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {openRequests.map((req) => {
              const categoryLabel = CATEGORY_LABELS[req.category] ?? req.category
              const fullAddress = `${req.address}, ${req.city}, ${req.state} ${req.zip_code}`
              const submitted = new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

              return (
                <div key={req.id} className="rounded-lg border border-border bg-card overflow-hidden transition hover:border-primary/30">
                  <div className="flex items-start justify-between px-5 py-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{categoryLabel}</span>
                        <span className="text-[10px] text-muted-foreground">Submitted {submitted}</span>
                      </div>
                      <h3 className="text-sm font-semibold mb-2 line-clamp-2">{req.description}</h3>
                      <div className="flex flex-wrap gap-x-5 gap-y-1">
                        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <MapPin className="h-3 w-3 flex-shrink-0" />{fullAddress}
                        </span>
                        {req.budget_max && (
                          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <DollarSign className="h-3 w-3" />Budget ceiling: <strong className="text-foreground ml-0.5">${Number(req.budget_max).toLocaleString()}</strong>
                          </span>
                        )}
                        {req.preferred_dates && (
                          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Calendar className="h-3 w-3" />{req.preferred_dates}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/contractor/requests/${req.id}`}
                      className="ml-6 flex-shrink-0 inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      View & Claim <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
