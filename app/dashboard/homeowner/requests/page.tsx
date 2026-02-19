"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStoredUser } from "@/lib/auth"
import {
  Clock,
  CheckCircle2,
  Wrench,
  User,
  Calendar,
  AlertCircle,
  PlusCircle,
  MapPin,
  Camera,
  XCircle,
  ChevronDown,
  Filter,
} from "lucide-react"

interface ServiceRequest {
  id: string
  service: string
  description: string
  budget: string
  address: string
  photos: number
  status: "pending" | "matched" | "in_progress" | "completed" | "cancelled"
  contractorName?: string
  consultationWindow?: string
  createdAt: string
  updatedAt?: string
}

const STATUS_LABELS: Record<ServiceRequest["status"], { label: string; variant: "warning" | "success" | "info" | "muted" }> = {
  pending: { label: "Pending Match", variant: "warning" },
  matched: { label: "Contractor Matched", variant: "success" },
  in_progress: { label: "In Progress", variant: "info" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "muted" },
}

const TIMELINE_STEPS: ServiceRequest["status"][] = ["pending", "matched", "in_progress", "completed"]

function stepIndex(status: ServiceRequest["status"]) {
  if (status === "cancelled") return -1
  return TIMELINE_STEPS.indexOf(status)
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return "Just now"
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function StatusTimeline({ status }: { status: ServiceRequest["status"] }) {
  const current = stepIndex(status)
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <XCircle className="h-4 w-4 text-destructive" />
        <span className="text-destructive font-medium">Cancelled</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-0">
      {TIMELINE_STEPS.map((step, i) => {
        const done = i <= current
        const active = i === current
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`h-2.5 w-2.5 rounded-full border-2 transition-colors ${
                  done
                    ? active
                      ? "bg-primary border-primary"
                      : "bg-emerald-500 border-emerald-500"
                    : "bg-transparent border-border/50"
                }`}
              />
              <span className="text-[10px] text-muted-foreground mt-1 capitalize whitespace-nowrap hidden sm:block">
                {step.replace("_", " ")}
              </span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-12 mx-0.5 transition-colors ${i < current ? "bg-emerald-500" : "bg-border/40"}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function RequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | ServiceRequest["status"]>("all")
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored || stored.role !== "homeowner") {
      router.replace("/login")
      return
    }

    fetch("/api/requests")
      .then((r) => r.json())
      .then((d) => setRequests(d.requests ?? []))
      .finally(() => setLoading(false))
  }, [router])

  async function handleCancel(requestId: string) {
    setCancelling(requestId)
    try {
      const res = await fetch("/api/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status: "cancelled" }),
      })
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: "cancelled" as const } : r)),
        )
      }
    } finally {
      setCancelling(null)
    }
  }

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter)

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    matched: requests.filter((r) => r.status === "matched").length,
    in_progress: requests.filter((r) => r.status === "in_progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
    cancelled: requests.filter((r) => r.status === "cancelled").length,
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-medium mb-1">Homeowner Portal</p>
          <h1 className="text-2xl font-semibold">Request Tracker</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track every request through the full lifecycle.</p>
        </div>
        <Link
          href="/dashboard/homeowner/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          New Request
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <Filter className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        {(["all", "pending", "matched", "in_progress", "completed", "cancelled"] as const).map((s) => (
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
            {s === "all" ? "All" : s.replace("_", " ")}
            {counts[s] > 0 && <span className="ml-1.5 opacity-60">{counts[s]}</span>}
          </button>
        ))}
      </div>

      {/* Request list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <Wrench className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-medium mb-1">{filter === "all" ? "No requests yet" : `No ${filter.replace("_", " ")} requests`}</p>
            {filter === "all" && (
              <p className="text-sm text-muted-foreground mb-4">Submit your first request to get matched with a verified contractor.</p>
            )}
            {filter === "all" && (
              <Link
                href="/dashboard/homeowner/new"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <PlusCircle className="h-4 w-4" />
                Submit a Request
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((req) => {
            const expanded = expandedId === req.id
            const cancellable = req.status === "pending"
            return (
              <Card key={req.id} className="border-border/60 overflow-hidden">
                {/* Row header */}
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : req.id)}
                  className="w-full text-left"
                >
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{req.service}</h3>
                          <Badge variant={STATUS_LABELS[req.status].variant}>{STATUS_LABELS[req.status].label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{req.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">{timeAgo(req.createdAt)}</span>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="mt-4">
                      <StatusTimeline status={req.status} />
                    </div>
                  </CardContent>
                </button>

                {/* Expanded detail */}
                {expanded && (
                  <div className="border-t border-border/40 px-6 py-5 bg-secondary/20">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Budget cap</p>
                        <p className="text-sm font-medium">{req.budget}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Address
                        </p>
                        <p className="text-sm font-medium">{req.address}</p>
                      </div>
                      {req.photos > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Camera className="h-3 w-3" /> Photos
                          </p>
                          <p className="text-sm font-medium">{req.photos} attached</p>
                        </div>
                      )}
                      {req.contractorName && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <User className="h-3 w-3" /> Matched contractor
                          </p>
                          <p className="text-sm font-medium">{req.contractorName}</p>
                        </div>
                      )}
                      {req.consultationWindow && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Consultation
                          </p>
                          <p className="text-sm font-medium">{req.consultationWindow}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Submitted
                        </p>
                        <p className="text-sm font-medium">{formatDate(req.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {req.status === "matched" && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Contractor assigned — expect a call to schedule.
                        </div>
                      )}
                      {req.status === "pending" && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full">
                          <AlertCircle className="h-3.5 w-3.5" />
                          Auto-routing in progress…
                        </div>
                      )}
                      {cancellable && (
                        <button
                          type="button"
                          onClick={() => handleCancel(req.id)}
                          disabled={cancelling === req.id}
                          className="ml-auto inline-flex items-center gap-1.5 text-xs text-destructive hover:underline disabled:opacity-50"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          {cancelling === req.id ? "Cancelling…" : "Cancel request"}
                        </button>
                      )}
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
