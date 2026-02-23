"use client"

import React, { useEffect, useState } from "react"
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
  Sparkles,
  ClipboardList,
  Star,
} from "lucide-react"

interface Review {
  id: string
  requestId: string
  service: string
  overallRating: number
  qualityRating: number
  timelinessRating: number
  communicationRating: number
  wouldRecommend: boolean
  nextMaintenanceNeeds?: string
  createdAt: string
}

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
      return <Clock className="h-4 w-4 text-amber-400" />
    case "matched":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    case "in_progress":
      return <Wrench className="h-4 w-4 text-blue-400" />
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
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

// Pipeline step component
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
    <div className={`flex flex-col items-center gap-1.5 flex-1 min-w-0 ${done || active ? "opacity-100" : "opacity-40"}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
          done
            ? "bg-emerald-500/20 border-emerald-500/60"
            : active
            ? "bg-primary/20 border-primary animate-pulse-glow"
            : "bg-secondary border-border/40"
        }`}
      >
        <Icon className={`h-3.5 w-3.5 ${done ? "text-emerald-400" : active ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <p className={`text-[10px] font-semibold text-center ${done ? "text-emerald-400" : active ? "text-primary" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p className="text-[9px] text-muted-foreground/60 text-center leading-tight hidden sm:block">{description}</p>
    </div>
  )
}

// Connector line between pipeline steps
function PipelineConnector({ done }: { done: boolean }) {
  return (
    <div className={`flex-1 h-px mt-4 ${done ? "bg-emerald-500/40" : "bg-border/30"}`} />
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
        <>
          <PipelineStep
            key={step.key}
            label={step.label}
            description={step.description}
            active={order[currentIdx] === step.key}
            done={i < currentIdx}
            icon={step.icon}
          />
          {i < steps.length - 1 && <PipelineConnector key={`conn-${i}`} done={i < currentIdx} />}
        </>
      ))}
    </div>
  )
}

export default function HomeownerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored || stored.role !== "homeowner") {
      router.replace("/login")
      return
    }
    setUser(stored)

    Promise.all([
      fetch("/api/requests").then((r) => r.json()),
      fetch("/api/reviews").then((r) => r.json()),
    ])
      .then(([reqData, reviewData]) => {
        setRequests(reqData.requests ?? [])
        setReviews(reviewData.reviews ?? [])
      })
      .finally(() => setLoading(false))
  }, [router])

  if (!user) return null

  const activeRequests = requests.filter((r) => r.status === "pending" || r.status === "matched" || r.status === "in_progress")
  const completedRequests = requests.filter((r) => r.status === "completed")
  const pendingMatch = requests.filter((r) => r.status === "pending")
  const recentRequests = requests.slice(0, 3)

  // PIR derived data
  const reviewedIds = new Set(reviews.map((rv) => rv.requestId))
  const pendingReviews = completedRequests.filter((r) => !reviewedIds.has(r.id))
  const avgOverall = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.overallRating, 0) / reviews.length).toFixed(1)
    : null
  const latestMaintenanceNeeds = reviews
    .filter((r) => r.nextMaintenanceNeeds)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 1)[0]

  const stats = [
    {
      label: "Total Requests",
      value: requests.length,
      sub: "All time",
      icon: FileText,
      accent: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      label: "Active",
      value: activeRequests.length,
      sub: "In flight",
      icon: TrendingUp,
      accent: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Awaiting Match",
      value: pendingMatch.length,
      sub: "Auto-routing",
      icon: Zap,
      accent: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Completed",
      value: completedRequests.length,
      sub: "Jobs done",
      icon: CheckCircle2,
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome banner */}
      <div className="relative rounded-2xl overflow-hidden border border-border/40">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-background pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="relative px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">Homeowner Portal</p>
            </div>
            <h1 className="text-xl font-bold">
              Welcome back, <span className="gradient-text">{user.name.split(" ")[0]}</span>
            </h1>
            {user.address && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary/60" />
                {user.address}
              </p>
            )}
          </div>
          <Link
            href="/dashboard/homeowner/new"
            className="btn-shimmer inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] flex-shrink-0 shadow-lg shadow-primary/20"
          >
            <PlusCircle className="h-4 w-4" />
            New Request
          </Link>
        </div>
      </div>

      {/* Auto-matching alert */}
      {!loading && pendingMatch.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/8 border border-amber-500/25">
          <div className="flex-shrink-0 mt-0.5">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
              <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-amber-500/20 border border-amber-500/40">
                <Zap className="h-2.5 w-2.5 text-amber-400" />
              </span>
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-400">
              {pendingMatch.length} request{pendingMatch.length > 1 ? "s" : ""} in auto-matching queue
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Our system is routing to verified, licensed contractors in your area. This typically takes under 24 hours.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, sub, icon: Icon, accent, bg, border }) => (
          <div key={label} className={`rounded-xl border ${border} ${bg} p-4 hover-glow transition-all duration-200`}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium">{label}</p>
              <div className={`p-1.5 rounded-lg bg-background/40`}>
                <Icon className={`h-3.5 w-3.5 ${accent}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${accent}`}>{loading ? "—" : value}</p>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active request spotlight */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Active Requests</h2>
            <Link href="/dashboard/homeowner/requests" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : activeRequests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/50 bg-secondary/20 py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                <Home className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-semibold mb-1">No active requests</p>
              <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
                Submit a service request to get matched with a verified, licensed contractor in your area.
              </p>
              <Link
                href="/dashboard/homeowner/new"
                className="btn-shimmer inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
              >
                <PlusCircle className="h-4 w-4" />
                Submit Your First Request
              </Link>
            </div>
          ) : (
            activeRequests.map((req) => (
              <Card key={req.id} className="hover-glow transition-all duration-200 hover:translate-y-[-1px]">
                <CardContent className="pt-5 pb-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      {statusIcon(req.status)}
                      <h3 className="font-semibold text-sm">{req.service}</h3>
                    </div>
                    {statusBadge(req.status)}
                  </div>

                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{req.description}</p>

                  {/* Pipeline tracker */}
                  <div className="mb-4 p-3 rounded-lg bg-secondary/30 border border-border/30">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Request Progress</p>
                    {req.status !== "cancelled" && <RequestPipeline status={req.status} />}
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30">
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

        {/* Sidebar: quick actions + recent + how it works */}
        <div className="flex flex-col gap-4">
          {/* Quick actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 pt-0">
              <Link
                href="/dashboard/homeowner/new"
                className="btn-shimmer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 shadow-sm shadow-primary/20"
              >
                <PlusCircle className="h-4 w-4" />
                Submit New Request
              </Link>
              <Link
                href="/dashboard/homeowner/requests"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-border/40"
              >
                <FileText className="h-4 w-4" />
                Track All Requests
              </Link>
              {pendingReviews.length > 0 && (
                <Link
                  href="/dashboard/homeowner/requests"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-400 hover:bg-amber-500/10 transition-colors border border-amber-500/25 bg-amber-500/8"
                >
                  <ClipboardList className="h-4 w-4" />
                  {pendingReviews.length} Review{pendingReviews.length > 1 ? "s" : ""} Pending
                </Link>
              )}
            </CardContent>
          </Card>

          {/* PIR insights */}
          {reviews.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                  Project Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 pt-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground text-xs">Reviews submitted</span>
                  <span className="font-bold">{reviews.length}</span>
                </div>
                {avgOverall && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground text-xs">Avg. satisfaction</span>
                    <span className="font-bold text-amber-400">{avgOverall} / 5</span>
                  </div>
                )}
                {latestMaintenanceNeeds && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/15">
                    <p className="text-[10px] font-semibold text-primary mb-1 uppercase tracking-wide">
                      Upcoming need on file
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {latestMaintenanceNeeds.nextMaintenanceNeeds}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recent requests */}
          <Card>
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
                <div className="divide-y divide-border/30">
                  {recentRequests.map((req) => (
                    <div key={req.id} className="px-5 py-3 hover:bg-secondary/30 transition-colors group">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {statusIcon(req.status)}
                          <p className="text-sm font-medium truncate">{req.service}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">{timeAgo(req.createdAt)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 ml-6 truncate">{req.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Auto-matching info */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-primary">Smart Auto-Matching</p>
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
