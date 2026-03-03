"use client"

import React, { Fragment, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStoredUser, type AuthUser } from "@/lib/auth"
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  Wrench,
  User,
  Calendar,
  ArrowRight,
  AlertCircle,
  Home,
  FileText,
  Zap,
  TrendingUp,
  MapPin,
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

function statusBadge(status: ServiceRequest["status"]) {
  const map = {
    pending: { label: "Pending match", variant: "warning" as const },
    matched: { label: "Contractor matched", variant: "success" as const },
    in_progress: { label: "In progress", variant: "info" as const },
    completed: { label: "Completed", variant: "success" as const },
    cancelled: { label: "Cancelled", variant: "muted" as const },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

function statusIcon(status: ServiceRequest["status"]) {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-muted-foreground" />
    case "matched":
      return <CheckCircle2 className="h-4 w-4 text-primary" />
    case "in_progress":
      return <Wrench className="h-4 w-4 text-primary" />
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-primary" />
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />
  }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 24) return h === 0 ? "Just now" : `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function PipelineStep({
  label,
  description,
  active,
  done,
  icon: Icon,
}: {
  label: string
  description: string
  active: boolean
  done: boolean
  icon: React.ElementType
}) {
  return (
    <div className={`flex flex-col items-center gap-1.5 flex-1 min-w-0 ${done || active ? "opacity-100" : "opacity-35"}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center border transition-colors ${
          done
            ? "bg-primary/10 border-primary/40"
            : active
            ? "bg-primary border-primary"
            : "bg-secondary border-border"
        }`}
      >
        <Icon className={`h-3.5 w-3.5 ${done ? "text-primary" : active ? "text-primary-foreground" : "text-muted-foreground"}`} />
      </div>
      <p className={`text-[10px] font-medium text-center ${done || active ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p className="text-[9px] text-muted-foreground/60 text-center leading-tight hidden sm:block">{description}</p>
    </div>
  )
}

function PipelineConnector({ done }: { done: boolean }) {
  return (
    <div className={`flex-1 h-px mt-3.5 ${done ? "bg-primary/30" : "bg-border"}`} />
  )
}

function RequestPipeline({ status }: { status: ServiceRequest["status"] }) {
  const steps = [
    { key: "pending", label: "Submitted", description: "Request received", icon: FileText },
    { key: "matched", label: "Matched", description: "Contractor assigned", icon: Zap },
    { key: "in_progress", label: "In Progress", description: "Work underway", icon: Wrench },
    { key: "completed", label: "Complete", description: "Job finished", icon: CheckCircle2 },
  ]
  const order = ["pending", "matched", "in_progress", "completed"]
  const currentIdx = order.indexOf(status)

  return (
    <div className="flex items-start gap-0 w-full">
      {steps.map((step, i) => (
        <Fragment key={step.key}>
          <PipelineStep
            label={step.label}
            description={step.description}
            active={order[currentIdx] === step.key}
            done={i < currentIdx}
            icon={step.icon}
          />
          {i < steps.length - 1 && <PipelineConnector done={i < currentIdx} />}
        </Fragment>
      ))}
    </div>
  )
}

export default function HomeownerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored || stored.role !== "homeowner") {
      router.replace("/login")
      return
    }
    setUser(stored)

    fetch("/api/requests")
      .then((r) => r.json())
      .then((d) => setRequests(d.requests ?? []))
      .finally(() => setLoading(false))
  }, [router])

  if (!user) return null

  const activeRequests = requests.filter((r) => r.status === "pending" || r.status === "matched" || r.status === "in_progress")
  const completedRequests = requests.filter((r) => r.status === "completed")
  const pendingMatch = requests.filter((r) => r.status === "pending")
  const recentRequests = requests.slice(0, 3)

  const stats = [
    { label: "Total Requests", value: requests.length, sub: "All time", icon: FileText },
    { label: "Active", value: activeRequests.length, sub: "In flight", icon: TrendingUp },
    { label: "Awaiting Match", value: pendingMatch.length, sub: "Auto-routing", icon: Zap },
    { label: "Completed", value: completedRequests.length, sub: "Jobs done", icon: CheckCircle2 },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-xl font-semibold">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          {user.address && (
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {user.address}
            </p>
          )}
        </div>
        <Link
          href="/dashboard/homeowner/new"
          className="btn-shimmer inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          New Request
        </Link>
      </div>

      {/* Auto-matching notice */}
      {!loading && pendingMatch.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-md bg-secondary border border-border">
          <Zap className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">
              {pendingMatch.length} request{pendingMatch.length > 1 ? "s" : ""} in the matching queue
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              We're routing your request to verified, licensed contractors in your area. This typically takes under 24 hours.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium">{label}</p>
              <Icon className="h-3.5 w-3.5 text-muted-foreground/60" />
            </div>
            <p className="text-2xl font-semibold tracking-tight">{loading ? "—" : value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active requests */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Active Requests</h2>
            <Link href="/dashboard/homeowner/requests" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : activeRequests.length === 0 ? (
            <div className="rounded-md border border-dashed border-border bg-secondary/30 py-12 text-center">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                <Home className="h-4 w-4 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium mb-1">No active requests</p>
              <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
                Submit a service request to get matched with a verified, licensed contractor in your area.
              </p>
              <Link
                href="/dashboard/homeowner/new"
                className="btn-shimmer inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
              >
                <PlusCircle className="h-4 w-4" />
                Submit Your First Request
              </Link>
            </div>
          ) : (
            activeRequests.map((req) => (
              <Card key={req.id} className="shadow-none">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      {statusIcon(req.status)}
                      <h3 className="font-semibold text-sm">{req.service}</h3>
                    </div>
                    {statusBadge(req.status)}
                  </div>

                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{req.description}</p>

                  {/* Pipeline tracker */}
                  <div className="mb-4 p-3 rounded-md bg-secondary/50 border border-border">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Request Progress</p>
                    {req.status !== "cancelled" && <RequestPipeline status={req.status} />}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-medium mb-0.5 uppercase tracking-wide">Budget</p>
                      <p className="text-sm font-semibold">{req.budget}</p>
                    </div>
                    {req.contractorName && (
                      <div>
                        <p className="text-[10px] text-muted-foreground font-medium mb-0.5 uppercase tracking-wide flex items-center gap-1">
                          <User className="h-3 w-3" /> Contractor
                        </p>
                        <p className="text-sm font-semibold truncate">{req.contractorName}</p>
                      </div>
                    )}
                    {req.consultationWindow && (
                      <div className="col-span-2">
                        <p className="text-[10px] text-muted-foreground font-medium mb-0.5 uppercase tracking-wide flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Consultation
                        </p>
                        <p className="text-sm font-semibold">{req.consultationWindow}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Quick actions */}
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 pt-0">
              <Link
                href="/dashboard/homeowner/new"
                className="btn-shimmer flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <PlusCircle className="h-4 w-4" />
                Submit New Request
              </Link>
              <Link
                href="/dashboard/homeowner/requests"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-border"
              >
                <FileText className="h-4 w-4" />
                Track All Requests
              </Link>
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="py-6 flex justify-center">
                  <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              ) : recentRequests.length === 0 ? (
                <p className="text-xs text-muted-foreground px-6 pb-4">No requests yet.</p>
              ) : (
                <div className="divide-y divide-border">
                  {recentRequests.map((req) => (
                    <div key={req.id} className="px-5 py-3 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">{req.service}</p>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">{timeAgo(req.createdAt)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{req.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Auto-matching info */}
          <div className="rounded-md border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary flex-shrink-0" />
              <p className="text-sm font-semibold">Smart Auto-Matching</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Each request is routed to a single verified, licensed, and insured contractor — no bidding wars, no spam.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
