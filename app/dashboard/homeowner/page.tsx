"use client"

import { useEffect, useState } from "react"
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
    {
      label: "Total Requests",
      value: requests.length,
      sub: "All time",
      icon: FileText,
      accent: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Active",
      value: activeRequests.length,
      sub: "In flight",
      icon: TrendingUp,
      accent: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Awaiting Match",
      value: pendingMatch.length,
      sub: "Auto-routing",
      icon: Zap,
      accent: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Completed",
      value: completedRequests.length,
      sub: "Jobs done",
      icon: CheckCircle2,
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-medium mb-1">Homeowner Portal</p>
          <h1 className="text-2xl font-semibold">Welcome, {user.name.split(" ")[0]}</h1>
          {user.address && (
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5" />
              {user.address}
            </p>
          )}
        </div>
        <Link
          href="/dashboard/homeowner/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          New Request
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, accent, bg }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                <div className={`${bg} p-1.5 rounded-lg`}>
                  <Icon className={`h-3.5 w-3.5 ${accent}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{loading ? "—" : value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Automation panel */}
      {!loading && pendingMatch.length > 0 && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Zap className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-400">
              {pendingMatch.length} request{pendingMatch.length > 1 ? "s" : ""} in auto-matching queue
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Our system is routing your request to verified, licensed contractors in your area.
            </p>
          </div>
        </div>
      )}

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
            <div className="flex justify-center py-8">
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : activeRequests.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <Wrench className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">No active requests</p>
                <p className="text-xs text-muted-foreground mb-4">Submit a request to get matched with a verified contractor.</p>
                <Link
                  href="/dashboard/homeowner/new"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <PlusCircle className="h-4 w-4" />
                  New Request
                </Link>
              </CardContent>
            </Card>
          ) : (
            activeRequests.map((req) => (
              <Card key={req.id} className="border-border/60">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      {statusIcon(req.status)}
                      <h3 className="font-semibold text-sm">{req.service}</h3>
                    </div>
                    {statusBadge(req.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{req.description}</p>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Budget cap</p>
                      <p className="text-sm font-medium">{req.budget}</p>
                    </div>
                    {req.contractorName && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                          <User className="h-3 w-3" /> Contractor
                        </p>
                        <p className="text-sm font-medium truncate">{req.contractorName}</p>
                      </div>
                    )}
                    {req.consultationWindow && (
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Consultation
                        </p>
                        <p className="text-sm font-medium">{req.consultationWindow}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Sidebar: recent all requests + quick actions */}
        <div className="flex flex-col gap-4">
          {/* Quick actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 pt-0">
              <Link
                href="/dashboard/homeowner/new"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Submit New Request
              </Link>
              <Link
                href="/dashboard/homeowner/requests"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <FileText className="h-4 w-4" />
                Track All Requests
              </Link>
            </CardContent>
          </Card>

          {/* Recent requests */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Recent Requests</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="py-6 flex justify-center">
                  <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              ) : recentRequests.length === 0 ? (
                <p className="text-xs text-muted-foreground px-6 pb-4">No requests yet.</p>
              ) : (
                <div className="divide-y divide-border/40">
                  {recentRequests.map((req) => (
                    <div key={req.id} className="px-6 py-3 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {statusIcon(req.status)}
                          <p className="text-sm font-medium truncate">{req.service}</p>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(req.createdAt)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 ml-6 truncate">{req.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Automation info */}
          <Card className="bg-secondary/30">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Auto-Matching</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Requests are automatically routed to a single verified, licensed, and insured contractor based on service type and location.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
