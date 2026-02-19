"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStoredUser, type AuthUser } from "@/lib/auth"
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  Wrench,
  Calendar,
  ArrowRight,
  AlertCircle,
  FileText,
  TrendingUp,
  MapPin,
  Sparkles,
  Building2,
  CalendarClock,
  Home,
  DollarSign,
  Users,
  RotateCcw,
  Flame,
  Settings2,
  ChevronRight,
  Star,
  Shield,
  BarChart3,
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

// Demo property data
const DEMO_PROPERTIES = [
  { id: "p1", label: "123 Oak St", type: "Single family", status: "active", lastService: "3 days ago", openTasks: 2 },
  { id: "p2", label: "Unit 4B — Maple Apts", type: "Rental unit", status: "active", lastService: "1 week ago", openTasks: 1 },
  { id: "p3", label: "Airbnb — River Rd", type: "STR", status: "active", lastService: "Yesterday", openTasks: 3 },
  { id: "p4", label: "14 Pine Ave", type: "Rental unit", status: "maintenance", lastService: "2 weeks ago", openTasks: 0 },
]

const DEMO_UPCOMING_TASKS = [
  { id: "t1", title: "HVAC Filter Replacement", property: "Unit 4B — Maple Apts", due: "Feb 21", category: "HVAC", urgent: true, recurring: true },
  { id: "t2", title: "Turnover Clean", property: "Airbnb — River Rd", due: "Tonight", category: "Cleaning", urgent: true, recurring: false },
  { id: "t3", title: "Roof Inspection", property: "123 Oak St", due: "Feb 27", category: "Roofing", urgent: false, recurring: false },
  { id: "t4", title: "Gutter Cleaning", property: "14 Pine Ave", due: "Mar 3", category: "Exterior", urgent: false, recurring: true },
  { id: "t5", title: "HVAC Seasonal Tune-up", property: "Airbnb — River Rd", due: "Mar 8", category: "HVAC", urgent: false, recurring: true },
]

const DEMO_VENDORS = [
  { id: "v1", name: "Rivera Plumbing Co.", category: "Plumbing", rating: 4.9, jobs: 8, verified: true },
  { id: "v2", name: "Summit HVAC", category: "HVAC", rating: 4.8, jobs: 6, verified: true },
  { id: "v3", name: "Pro Clean Crew", category: "Cleaning", rating: 5.0, jobs: 14, verified: true },
  { id: "v4", name: "Apex Roofing", category: "Roofing", rating: 4.7, jobs: 3, verified: true },
]

const DEMO_SPENDING = [
  { category: "HVAC", amount: 2840, count: 4, color: "bg-primary" },
  { category: "Roofing", amount: 6200, count: 2, color: "bg-amber-400" },
  { category: "Plumbing", amount: 1480, count: 3, color: "bg-blue-400" },
  { category: "Cleaning", amount: 960, count: 8, color: "bg-emerald-400" },
  { category: "Electrical", amount: 720, count: 2, color: "bg-violet-400" },
]

const DEMO_SUGGESTIONS = [
  { title: "Spring HVAC tune-up", reason: "2 of your properties are due in March", category: "HVAC", priority: "medium" },
  { title: "Gutter inspection", reason: "After winter season", category: "Exterior", priority: "low" },
  { title: "Turnover deep clean", reason: "River Rd has a gap week Feb 24–28", category: "Cleaning", priority: "high" },
]

function statusBadge(status: ServiceRequest["status"]) {
  const map = {
    pending: { label: "Pending match", variant: "warning" as const },
    matched: { label: "Matched", variant: "success" as const },
    in_progress: { label: "In progress", variant: "info" as const },
    completed: { label: "Completed", variant: "success" as const },
    cancelled: { label: "Cancelled", variant: "muted" as const },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

function statusIcon(status: ServiceRequest["status"]) {
  switch (status) {
    case "pending": return <Clock className="h-4 w-4 text-amber-400" />
    case "matched": return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    case "in_progress": return <Wrench className="h-4 w-4 text-blue-400" />
    case "completed": return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />
  }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 24) return h === 0 ? "Just now" : `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function getPropertyTypeConfig(propertyType?: string) {
  switch (propertyType) {
    case "property_manager":
      return {
        label: "Property Manager Portal",
        icon: Building2,
        accent: "text-primary",
        greeting: "Your portfolio, at a glance.",
        tagline: "Work orders, vendors, and cost history — across every unit.",
      }
    case "airbnb_host":
      return {
        label: "STR Host Portal",
        icon: CalendarClock,
        accent: "text-amber-400",
        greeting: "Keep every stay ready.",
        tagline: "Turnover workflows, trusted cleaners, and maintenance on autopilot.",
      }
    default:
      return {
        label: "Homeowner Portal",
        icon: Home,
        accent: "text-primary",
        greeting: "Your home, coordinated.",
        tagline: "One place for every project, vendor, and maintenance record.",
      }
  }
}

export default function HomeownerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<"overview" | "schedule" | "vendors" | "spend">("overview")

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

  const ptConfig = getPropertyTypeConfig(user.propertyType)
  const PtIcon = ptConfig.icon

  const activeRequests = requests.filter((r) => ["pending", "matched", "in_progress"].includes(r.status))
  const completedRequests = requests.filter((r) => r.status === "completed")
  const propertyCount = user.propertyCount ?? (user.propertyType === "property_manager" ? 12 : user.propertyType === "airbnb_host" ? 3 : 1)
  const totalSpend = DEMO_SPENDING.reduce((s, c) => s + c.amount, 0)
  const maxSpend = Math.max(...DEMO_SPENDING.map((c) => c.amount))

  const stats = [
    {
      label: user.propertyType === "property_manager" || user.propertyType === "airbnb_host" ? "Properties" : "Work Orders",
      value: user.propertyType === "property_manager" || user.propertyType === "airbnb_host"
        ? propertyCount
        : requests.length,
      sub: user.propertyType === "property_manager" ? "In portfolio" : user.propertyType === "airbnb_host" ? "Active listings" : "All time",
      icon: user.propertyType === "property_manager" || user.propertyType === "airbnb_host" ? Building2 : FileText,
      accent: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      label: "Open Tasks",
      value: DEMO_UPCOMING_TASKS.length,
      sub: `${DEMO_UPCOMING_TASKS.filter(t => t.urgent).length} urgent`,
      icon: AlertCircle,
      accent: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Vendor Network",
      value: DEMO_VENDORS.length,
      sub: "Trusted & verified",
      icon: Users,
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "YTD Spend",
      value: `$${(totalSpend / 1000).toFixed(1)}k`,
      sub: "Across all properties",
      icon: DollarSign,
      accent: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
  ]

  const navItems = [
    { id: "overview" as const, label: "Overview" },
    { id: "schedule" as const, label: "Maintenance Schedule" },
    { id: "vendors" as const, label: "Vendor Network" },
    { id: "spend" as const, label: "Spend Analytics" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Personalized welcome banner */}
      <div className="relative rounded-2xl overflow-hidden border border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-background pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/4 blur-3xl pointer-events-none" />

        <div className="relative px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PtIcon className={`h-3.5 w-3.5 ${ptConfig.accent}`} />
                <p className={`text-xs font-semibold uppercase tracking-wider ${ptConfig.accent}`}>{ptConfig.label}</p>
              </div>
              <h1 className="text-xl font-bold mb-1">
                Welcome back, <span className="gradient-text">{user.name.split(" ")[0]}</span>
                {" "}— {ptConfig.greeting}
              </h1>
              <p className="text-sm text-muted-foreground">{ptConfig.tagline}</p>
              {(user.address || user.propertyType === "property_manager" || user.propertyType === "airbnb_host") && (
                <div className="flex items-center gap-4 mt-2">
                  {user.address && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary/60" />
                      {user.address}
                    </p>
                  )}
                  {(user.propertyType === "property_manager" || user.propertyType === "airbnb_host") && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-primary/60" />
                      {propertyCount} properties managed
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {DEMO_UPCOMING_TASKS.some(t => t.urgent) && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25">
                  <Flame className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-400">
                      {DEMO_UPCOMING_TASKS.filter(t => t.urgent).length} urgent tasks
                    </p>
                    <p className="text-[10px] text-amber-400/60">Need attention today</p>
                  </div>
                </div>
              )}
              <Link
                href="/dashboard/homeowner/new"
                className="btn-shimmer inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-primary/20"
              >
                <PlusCircle className="h-4 w-4" />
                New Work Order
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, sub, icon: Icon, accent, bg, border }) => (
          <div key={label} className={`rounded-xl border ${border} ${bg} p-4 hover-glow transition-all duration-200`}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium">{label}</p>
              <div className="p-1.5 rounded-lg bg-background/40">
                <Icon className={`h-3.5 w-3.5 ${accent}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${accent}`}>{loading && label === "Work Orders" ? "—" : value}</p>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">{sub}</p>
          </div>
        ))}
      </div>

      {/* Section nav */}
      <div className="flex gap-1 p-1 rounded-xl bg-secondary/40 border border-border/30 w-fit">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveSection(item.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeSection === item.id
                ? "bg-card border border-border/40 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW section */}
      {activeSection === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main col: property cards + active work orders */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property portfolio */}
            {(user.propertyType === "property_manager" || user.propertyType === "airbnb_host") && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold">Properties</h2>
                  <button type="button" className="text-xs text-primary hover:underline flex items-center gap-1">
                    Manage all <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {DEMO_PROPERTIES.map((p) => (
                    <div
                      key={p.id}
                      className={`p-4 rounded-xl border transition-all duration-200 hover:translate-y-[-1px] hover-glow cursor-default ${
                        p.status === "maintenance" ? "border-amber-500/25 bg-amber-500/5" : "border-border/40 bg-card"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{p.label}</p>
                          <p className="text-xs text-muted-foreground">{p.type}</p>
                        </div>
                        {p.openTasks > 0 ? (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                            p.openTasks >= 2 ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "bg-primary/10 text-primary border border-primary/20"
                          }`}>
                            {p.openTasks} task{p.openTasks > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Clear
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Last service: {p.lastService}
                        </span>
                        <span className={`flex items-center gap-1 ${p.status === "maintenance" ? "text-amber-400" : "text-emerald-400"}`}>
                          <span className="relative flex h-1.5 w-1.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${p.status === "maintenance" ? "bg-amber-400" : "bg-emerald-400"}`} />
                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${p.status === "maintenance" ? "bg-amber-400" : "bg-emerald-400"}`} />
                          </span>
                          {p.status === "maintenance" ? "Needs attention" : "Active"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active work orders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold">Active Work Orders</h2>
                <Link href="/dashboard/homeowner/requests" className="text-xs text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              ) : activeRequests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/50 bg-secondary/20 py-10 text-center">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-4 w-4 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm font-semibold mb-1">No active work orders</p>
                  <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
                    Create a work order to dispatch a verified contractor to any of your properties.
                  </p>
                  <Link
                    href="/dashboard/homeowner/new"
                    className="btn-shimmer inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create Work Order
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeRequests.map((req) => (
                    <Card key={req.id} className="hover-glow transition-all duration-200 hover:translate-y-[-1px]">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            {statusIcon(req.status)}
                            <h3 className="font-semibold text-sm">{req.service}</h3>
                          </div>
                          {statusBadge(req.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{req.description}</p>
                        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/30">
                          <div>
                            <p className="text-[10px] text-muted-foreground font-medium mb-0.5 uppercase tracking-wide">Budget</p>
                            <p className="text-sm font-semibold">{req.budget}</p>
                          </div>
                          {req.contractorName && (
                            <div>
                              <p className="text-[10px] text-muted-foreground font-medium mb-0.5 uppercase tracking-wide">Vendor</p>
                              <p className="text-sm font-semibold truncate">{req.contractorName}</p>
                            </div>
                          )}
                          {req.consultationWindow && (
                            <div>
                              <p className="text-[10px] text-muted-foreground font-medium mb-0.5 uppercase tracking-wide">Window</p>
                              <p className="text-sm font-semibold">{req.consultationWindow}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Urgent upcoming */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Coming Up</CardTitle>
                  <button type="button" onClick={() => setActiveSection("schedule")} className="text-xs text-primary hover:underline">Full schedule</button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/30">
                  {DEMO_UPCOMING_TASKS.slice(0, 4).map((task) => (
                    <div key={task.id} className="px-5 py-3 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${task.urgent ? "bg-amber-400" : "bg-primary"}`} />
                          <p className="text-xs font-medium truncate">{task.title}</p>
                        </div>
                        <span className={`text-[10px] font-semibold flex-shrink-0 ${task.urgent ? "text-amber-400" : "text-muted-foreground"}`}>{task.due}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 ml-3.5 truncate">{task.property}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Automation suggestions */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-sm font-semibold text-primary">Suggested this month</p>
              </div>
              <div className="space-y-2.5">
                {DEMO_SUGGESTIONS.map((s) => (
                  <div key={s.title} className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-xs font-semibold">{s.title}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        s.priority === "high" ? "bg-amber-500/15 text-amber-400" :
                        s.priority === "medium" ? "bg-blue-500/15 text-blue-400" : "bg-secondary text-muted-foreground"
                      }`}>{s.priority}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{s.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick dispatch */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pt-0">
                <Link
                  href="/dashboard/homeowner/new"
                  className="btn-shimmer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm shadow-primary/20"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Work Order
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveSection("schedule")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-border/40"
                >
                  <Calendar className="h-4 w-4" />
                  View Maintenance Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("vendors")}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-border/40"
                >
                  <Users className="h-4 w-4" />
                  Manage Vendor Network
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* MAINTENANCE SCHEDULE section */}
      {activeSection === "schedule" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Maintenance Schedule</CardTitle>
                    <CardDescription>Upcoming tasks across all properties</CardDescription>
                  </div>
                  <Link
                    href="/dashboard/homeowner/new"
                    className="btn-shimmer inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-sm shadow-primary/20"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Task
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/30">
                  {DEMO_UPCOMING_TASKS.map((task) => (
                    <div
                      key={task.id}
                      className={`px-6 py-4 hover:bg-secondary/30 transition-colors ${task.urgent ? "border-l-2 border-amber-500/60" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${task.urgent ? "bg-amber-400" : "bg-primary"}`} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold">{task.title}</p>
                              {task.recurring && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary border border-border/30 text-[10px] font-medium text-muted-foreground">
                                  <RotateCcw className="h-2.5 w-2.5" /> Recurring
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {task.property}
                              </p>
                              <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-muted-foreground border border-border/30">
                                {task.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <p className={`text-xs font-bold ${task.urgent ? "text-amber-400" : "text-muted-foreground"}`}>{task.due}</p>
                            {task.urgent && <p className="text-[10px] text-amber-400/70">Urgent</p>}
                          </div>
                          <Link
                            href="/dashboard/homeowner/new"
                            className="px-3 py-1.5 rounded-lg border border-border/40 text-xs font-medium hover:bg-secondary hover:border-primary/30 hover:text-primary transition-all"
                          >
                            Dispatch
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {/* By property summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Tasks by Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {DEMO_PROPERTIES.filter(p => p.openTasks > 0).map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{p.label}</p>
                      <p className="text-[10px] text-muted-foreground">{p.type}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                      p.openTasks >= 2 ? "bg-amber-500/15 text-amber-400" : "bg-primary/10 text-primary"
                    }`}>
                      {p.openTasks}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <p className="text-sm font-semibold text-emerald-400">All caught up on {DEMO_PROPERTIES.filter(p => p.openTasks === 0).length} properties</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Recurring maintenance automation keeps your properties ahead of issues — not reacting to them.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VENDORS section */}
      {activeSection === "vendors" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Vendor Network</CardTitle>
                    <CardDescription>Trusted, verified contractors you&apos;ve worked with</CardDescription>
                  </div>
                  <Link
                    href="/dashboard/homeowner/new"
                    className="btn-shimmer inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-sm shadow-primary/20"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Find Vendor
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/30">
                  {DEMO_VENDORS.map((v) => (
                    <div key={v.id} className="px-6 py-5 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <Wrench className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold">{v.name}</p>
                              {v.verified && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400">
                                  <Shield className="h-2.5 w-2.5" /> Verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-muted-foreground border border-border/30">
                                {v.category}
                              </span>
                              <p className="text-xs text-muted-foreground">{v.jobs} jobs completed</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                              <p className="text-sm font-bold">{v.rating}</p>
                            </div>
                            <p className="text-[10px] text-muted-foreground">Rating</p>
                          </div>
                          <Link
                            href="/dashboard/homeowner/new"
                            className="px-3 py-1.5 rounded-lg border border-border/40 text-xs font-medium hover:bg-secondary hover:border-primary/30 hover:text-primary transition-all"
                          >
                            Dispatch
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Network Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Total vendors</p>
                  <p className="text-sm font-bold text-primary">{DEMO_VENDORS.length}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">All verified</p>
                  <p className="text-sm font-bold text-emerald-400">100%</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Avg rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <p className="text-sm font-bold">4.85</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Total jobs done</p>
                  <p className="text-sm font-bold">{DEMO_VENDORS.reduce((s, v) => s + v.jobs, 0)}</p>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings2 className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-primary">How vendors are added</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every contractor in your network is verified, licensed, and insured by Nexus Operations before appearing on your property.
                You build trust over time — not from scratch every job.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SPEND ANALYTICS section */}
      {activeSection === "spend" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Spend by Category</CardTitle>
                    <CardDescription>Year to date across all properties</CardDescription>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-xs text-emerald-400 font-semibold">
                    <TrendingUp className="h-3.5 w-3.5" />
                    ${(totalSpend / 1000).toFixed(1)}k total
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DEMO_SPENDING.map((cat) => (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                          <span className="font-medium">{cat.category}</span>
                          <span className="text-xs text-muted-foreground">{cat.count} jobs</span>
                        </div>
                        <span className="font-bold">${cat.amount.toLocaleString()}</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full ${cat.color} transition-all duration-700`}
                          style={{ width: `${(cat.amount / maxSpend) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work order history */}
            <Card>
              <CardHeader>
                <CardTitle>Work Order History</CardTitle>
                <CardDescription>Recent completed work</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="py-8 flex justify-center">
                    <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                ) : completedRequests.length === 0 ? (
                  <div className="py-10 text-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Completed work orders will appear here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/30">
                    {completedRequests.map((req) => (
                      <div key={req.id} className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold">{req.service}</p>
                            <p className="text-xs text-muted-foreground truncate">{req.description}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-emerald-400">{req.budget}</p>
                            <p className="text-[10px] text-muted-foreground">{timeAgo(req.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">By Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {[
                  { label: "123 Oak St", amount: 6920, pct: 56 },
                  { label: "Unit 4B", amount: 2840, pct: 23 },
                  { label: "Airbnb — River Rd", amount: 1960, pct: 16 },
                  { label: "14 Pine Ave", amount: 480, pct: 4 },
                ].map((p) => (
                  <div key={p.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground truncate max-w-[140px]">{p.label}</span>
                      <span className="font-bold text-foreground">${p.amount.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-primary/60 transition-all duration-700" style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Cost Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {[
                  { label: "Avg job cost", value: `$${Math.round(totalSpend / DEMO_SPENDING.reduce((s, c) => s + c.count, 0)).toLocaleString()}` },
                  { label: "Most active category", value: "Cleaning" },
                  { label: "Highest single spend", value: "Roofing" },
                  { label: "YoY change", value: "+12%" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-xs font-bold">{item.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
