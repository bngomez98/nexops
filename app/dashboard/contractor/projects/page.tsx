"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStoredUser } from "@/lib/auth"
import {
  MapPin,
  Clock,
  Camera,
  Calendar,
  Filter,
  ChevronDown,
  CheckCircle2,
  Phone,
  XCircle,
  ArrowRight,
} from "lucide-react"

interface Lead {
  id: string
  homeownerName: string
  service: string
  description: string
  budget: string
  address: string
  photos: number
  status: "new" | "contacted" | "scheduled" | "won" | "lost"
  tier: "standard" | "premium" | "elite"
  value: number
  createdAt: string
  consultationWindow?: string
  notes?: string
}

const STATUS_META: Record<Lead["status"], { label: string; variant: "info" | "warning" | "success" | "muted" | "destructive" }> = {
  new: { label: "New", variant: "info" },
  contacted: { label: "Contacted", variant: "warning" },
  scheduled: { label: "Scheduled", variant: "success" },
  won: { label: "Won", variant: "success" },
  lost: { label: "Lost", variant: "destructive" },
}

const NEXT_STATUS: Record<Lead["status"], Lead["status"] | null> = {
  new: "contacted",
  contacted: "scheduled",
  scheduled: "won",
  won: null,
  lost: null,
}

const NEXT_LABEL: Record<Lead["status"], string> = {
  new: "Mark Contacted",
  contacted: "Mark Scheduled",
  scheduled: "Mark Won",
  won: "",
  lost: "",
}

function tierBadge(tier: Lead["tier"]) {
  const colors: Record<Lead["tier"], string> = {
    standard: "text-muted-foreground border-border/40",
    premium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    elite: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium capitalize ${colors[tier]}`}>
      {tier}
    </span>
  )
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 24) return h === 0 ? "Just now" : `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function ContractorProjectsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | Lead["status"]>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored || stored.role !== "contractor") {
      router.replace("/login")
      return
    }

    fetch("/api/leads")
      .then((r) => {
        if (r.status === 401) { router.replace("/login"); return null }
        return r.json()
      })
      .then((d) => { if (d) setLeads(d.leads ?? []) })
      .finally(() => setLoading(false))
  }, [router])

  async function updateStatus(leadId: string, status: Lead["status"]) {
    setUpdating(leadId)
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status }),
      })
      if (res.ok) {
        const data = await res.json()
        setLeads((prev) => prev.map((l) => (l.id === leadId ? data.lead : l)))
      }
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter)

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    scheduled: leads.filter((l) => l.status === "scheduled").length,
    won: leads.filter((l) => l.status === "won").length,
    lost: leads.filter((l) => l.status === "lost").length,
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-primary text-sm font-medium mb-1">Contractor Portal</p>
        <h1 className="text-2xl font-semibold">Projects Pipeline</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {leads.length} total projects — advance statuses to track your pipeline.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <Filter className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        {(["all", "new", "contacted", "scheduled", "won", "lost"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
              filter === s
                ? "bg-primary/15 border-primary text-primary"
                : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
            }`}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            {counts[s] > 0 && <span className="ml-1.5 opacity-60">{counts[s]}</span>}
          </button>
        ))}
      </div>

      {/* Project list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <p className="font-medium mb-1">{filter === "all" ? "No projects yet" : `No ${filter} projects`}</p>
            <p className="text-sm text-muted-foreground">Projects are automatically assigned based on your service categories and location.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((lead) => {
            const expanded = expandedId === lead.id
            const nextStatus = NEXT_STATUS[lead.status]
            return (
              <Card key={lead.id} className="border-border/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : lead.id)}
                  className="w-full text-left"
                >
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">{lead.homeownerName}</p>
                          {tierBadge(lead.tier)}
                          <Badge variant={STATUS_META[lead.status].variant}>{STATUS_META[lead.status].label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {lead.service} · {lead.budget}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {lead.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground hidden sm:block">{timeAgo(lead.createdAt)}</span>
                        <span className="text-sm font-semibold text-emerald-400">${lead.value.toLocaleString()}</span>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
                      </div>
                    </div>
                  </CardContent>
                </button>

                {/* Expanded detail */}
                {expanded && (
                  <div className="border-t border-border/40 px-6 py-5 bg-secondary/20">
                    <p className="text-sm text-muted-foreground mb-4">{lead.description}</p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                      {lead.photos > 0 && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Camera className="h-3.5 w-3.5" />
                          {lead.photos} photo{lead.photos > 1 ? "s" : ""} attached
                        </div>
                      )}
                      {lead.consultationWindow && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {lead.consultationWindow}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        Received {timeAgo(lead.createdAt)}
                      </div>
                    </div>

                    {/* Action row */}
                    <div className="flex flex-wrap items-center gap-3">
                      {nextStatus && (
                        <button
                          type="button"
                          onClick={() => updateStatus(lead.id, nextStatus)}
                          disabled={updating === lead.id}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {updating === lead.id ? (
                            <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}
                          {NEXT_LABEL[lead.status]}
                        </button>
                      )}

                      {lead.status !== "won" && lead.status !== "lost" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(lead.id, "lost")}
                          disabled={updating === lead.id}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-destructive rounded-lg border border-border/40 hover:border-destructive/40 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Mark Lost
                        </button>
                      )}

                      <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>Call homeowner to progress this project</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
