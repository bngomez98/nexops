import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MessageSquare, Info, MapPin, ArrowRight } from "lucide-react"

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

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const role = user.user_metadata?.role || "homeowner"

  const { data: threads } = await supabase
    .from("service_requests")
    .select("id, category, description, address, city, state, zip_code, status, assigned_contractor_id, updated_at")
    .eq(role === "contractor" ? "assigned_contractor_id" : "owner_id", user.id)
    .not("assigned_contractor_id", "is", null)
    .order("updated_at", { ascending: false })

  const list = threads ?? []

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Active communication threads for your assigned requests.
          </p>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            A message thread opens when a contractor claims your request. Direct phone and email contact becomes available once a consultation is confirmed.
          </p>
        </div>

        {list.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-14 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold">No active message threads</h3>
            <p className="mt-1.5 text-xs text-muted-foreground max-w-xs mx-auto">
              {role === "contractor"
                ? "Threads will appear here once you claim a request."
                : "Threads will appear here once a contractor claims one of your requests."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {list.map((req) => (
              <Link
                key={req.id}
                href={`/dashboard/messages/${req.id}`}
                className="group flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4 transition hover:border-primary/40"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
                      {CATEGORY_LABELS[req.category] ?? req.category.replace(/-/g, " ")}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {req.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-sm font-medium line-clamp-1">{req.description}</p>
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    {req.address}, {req.city}, {req.state} {req.zip_code}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-4 flex-shrink-0 group-hover:text-primary transition" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
