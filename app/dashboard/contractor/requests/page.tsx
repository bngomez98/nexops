import { createClient } from "@/lib/supabase/server"
import { isTemplatedRequest } from "@/lib/requests"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MapPin, DollarSign, Calendar, ArrowRight, Camera } from "lucide-react"

type ServiceRequest = {
  id: string
  category: string
  description: string
  address: string
  city: string
  state: string
  zip_code: string
  budget_max: number | null
  photo_urls: string[] | null
  additional_notes: string | null
  preferred_dates: string | null
  created_at: string
}

const CATEGORY_LABELS: Record<string, string> = {
  "tree-removal": "Tree Removal",
  "hvac": "HVAC",
  "electrical": "Electrical",
  "roofing": "Roofing",
  "concrete": "Concrete",
  "fencing": "Fencing",
  "plumbing": "Plumbing",
  "general-repair": "General Repair",
}

function formatCategory(cat: string) {
  return CATEGORY_LABELS[cat] ?? cat
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default async function ContractorRequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")
  if (user.user_metadata?.role !== "contractor") redirect("/dashboard")

  const { data: requests, error } = await supabase
    .from("service_requests")
    .select("id, category, description, additional_notes, address, city, state, zip_code, budget_max, photo_urls, preferred_dates, created_at")
    .in("status", ["pending_review", "in_queue"])
    .is("assigned_contractor_id", null)
    .order("created_at", { ascending: false })

  const allRequests: ServiceRequest[] = (requests ?? []).filter((request) => !isTemplatedRequest(request))

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Open Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Requests available in your service area. Claiming a request removes it from all other contractor feeds instantly.
          </p>
          {error && (
            <p className="mt-2 text-sm text-destructive">Failed to load requests: {error.message}</p>
          )}
        </div>

        {allRequests.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm font-semibold mb-1">No open requests right now</p>
            <p className="text-xs text-muted-foreground">Check back soon — new requests appear here as soon as they are submitted.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allRequests.map((req) => (
              <div key={req.id} className="rounded-lg border border-border bg-card overflow-hidden transition hover:border-primary/30">
                <div className="flex items-start justify-between px-5 py-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {formatCategory(req.category)}
                      </span>
                      {req.photo_urls && req.photo_urls.length > 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Camera className="h-3 w-3" />{req.photo_urls.length} photo{req.photo_urls.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground">Submitted {formatDate(req.created_at)}</span>
                    </div>
                    <h3 className="text-sm font-semibold mb-2 line-clamp-1">{req.description}</h3>
                    <div className="flex flex-wrap gap-x-5 gap-y-1">
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {req.address}, {req.city}, {req.state} {req.zip_code}
                      </span>
                      {req.budget_max != null && (
                        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <DollarSign className="h-3 w-3" />Budget ceiling: <strong className="text-foreground ml-0.5">${req.budget_max.toLocaleString()}</strong>
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
