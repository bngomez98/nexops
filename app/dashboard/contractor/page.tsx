"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStoredUser, type AuthUser } from "@/lib/auth"
import {
  TrendingUp,
  DollarSign,
  Target,
  Clock,
  MapPin,
  ArrowUpRight,
  Briefcase,
  TrendingDown,
  AlertCircle,
  Star,
  Crown,
  Shield,
  Phone,
  ChevronDown,
  CheckCircle2,
  CalendarCheck,
  XCircle,
  Loader2,
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
}

const weeklyData = [
  { week: "Nov W1", projects: 2, revenue: 2800 },
  { week: "Nov W2", projects: 3, revenue: 4200 },
  { week: "Nov W3", projects: 1, revenue: 950 },
  { week: "Nov W4", projects: 4, revenue: 7100 },
  { week: "Dec W1", projects: 3, revenue: 5600 },
  { week: "Dec W2", projects: 4, revenue: 6900 },
]

const tierConfig = {
  standard: {
    label: "Standard",
    icon: Shield,
    colors: "text-muted-foreground border-border/50 bg-secondary/60",
    accent: "text-muted-foreground",
    headerBg: "from-secondary/40 to-background",
    advance: "Real-time",
  },
  premium: {
    label: "Premium",
    icon: Star,
    colors: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    accent: "text-amber-400",
    headerBg: "from-amber-500/8 to-background",
    advance: "60 sec early",
  },
  elite: {
    label: "Elite",
    icon: Crown,
    colors: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    accent: "text-violet-400",
    headerBg: "from-violet-500/8 to-background",
    advance: "5 min exclusive",
  },
}

// Status transitions available for each status
const nextStatuses: Record<Lead["status"], { value: Lead["status"]; label: string; icon: typeof Phone }[]> = {
  new: [
    { value: "contacted", label: "Mark contacted", icon: Phone },
    { value: "lost", label: "Mark lost", icon: XCircle },
  ],
  contacted: [
    { value: "scheduled", label: "Mark scheduled", icon: CalendarCheck },
    { value: "lost", label: "Mark lost", icon: XCircle },
  ],
  scheduled: [
    { value: "won", label: "Mark won", icon: CheckCircle2 },
    { value: "lost", label: "Mark lost", icon: XCircle },
  ],
  won: [],
  lost: [],
}

function statusBadge(status: Lead["status"]) {
  const map: Record<Lead["status"], { label: string; variant: "success" | "info" | "warning" | "muted" | "destructive" }> = {
    new: { label: "New", variant: "info" },
    contacted: { label: "Contacted", variant: "warning" },
    scheduled: { label: "Scheduled", variant: "success" },
    won: { label: "Won", variant: "success" },
    lost: { label: "Lost", variant: "destructive" },
  }
  const { label, variant } = map[status]
  return (
    <div className="flex items-center gap-1.5">
      {status === "new" && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
        </span>
      )}
      <Badge variant={variant as Parameters<typeof Badge>[0]["variant"]}>{label}</Badge>
    </div>
  )
}

function tierBadge(tier: Lead["tier"]) {
  const config = tierConfig[tier] ?? tierConfig.standard
  const TierIcon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${config.colors}`}>
      <TierIcon className="h-2.5 w-2.5" />
      {config.label}
    </span>
  )
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 24) return h === 0 ? "Just now" : `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function Trend({ value, positive }: { value: string; positive: boolean }) {
  return (
    <div className={`flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-md ${positive ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {value}
    </div>
  )
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium text-foreground">
            {p.name === "Revenue" ? `$${p.value.toLocaleString()}` : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function ContractorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedLead, setExpandedLead] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored || stored.role !== "contractor") {
      router.replace("/login")
      return
    }
    setUser(stored)

    fetch("/api/leads")
      .then((r) => {
        if (r.status === 401) { router.replace("/login"); return null }
        return r.json()
      })
      .then((d) => { if (d) setLeads(d.leads ?? []) })
      .finally(() => setLoading(false))
  }, [router])

  const updateStatus = useCallback(
    async (leadId: string, status: Lead["status"]) => {
      setUpdating(leadId)
      try {
        const res = await fetch("/api/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId, status }),
        })
        if (!res.ok) return
        const { lead } = await res.json() as { lead: Lead }
        setLeads((prev) => prev.map((l) => (l.id === lead.id ? lead : l)))
        // Collapse the row if it's now in a terminal state
        if (status === "won" || status === "lost") {
          setExpandedLead(null)
        }
      } finally {
        setUpdating(null)
      }
    },
    [],
  )

  if (!user) return null

  const totalValue = leads.filter((l) => l.status === "won").reduce((s, l) => s + l.value, 0)
  const wonLeads = leads.filter((l) => l.status === "won").length
  const closeRate = leads.length > 0 ? Math.round((wonLeads / leads.length) * 100) : 0
  const newLeads = leads.filter((l) => l.status === "new").length

  const sub = (user.subscription ?? "standard") as keyof typeof tierConfig
  const tier = tierConfig[sub] ?? tierConfig.standard
  const TierIcon = tier.icon

  const stats = [
    {
      title: "Total Projects",
      value: leads.length.toString(),
      sub: `${newLeads} new`,
      icon: TrendingUp,
      accent: "text-primary",
      accentBg: "bg-primary/10",
      border: "border-primary/20",
      trend: { value: "+12%", positive: true },
    },
    {
      title: "Revenue Won",
      value: `$${totalValue.toLocaleString()}`,
      sub: `${wonLeads} jobs closed`,
      icon: DollarSign,
      accent: "text-emerald-400",
      accentBg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      trend: { value: "+8%", positive: true },
    },
    {
      title: "Close Rate",
      value: `${closeRate}%`,
      sub: "Last 30 days",
      icon: Target,
      accent: "text-amber-400",
      accentBg: "bg-amber-400/10",
      border: "border-amber-400/20",
      trend: { value: "-3%", positive: false },
    },
    {
      title: "Plan",
      value: user.subscription ? user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1) : "—",
      sub: "Active subscription",
      icon: TierIcon,
      accent: tier.accent,
      accentBg: tierConfig[sub]?.colors ?? "",
      border: "border-border/30",
      trend: null,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome banner */}
      <div className="relative rounded-2xl overflow-hidden border border-border/40">
        <div className={`absolute inset-0 bg-gradient-to-br ${tier.headerBg} pointer-events-none`} />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/4 blur-3xl pointer-events-none" />

        <div className="relative px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TierIcon className={`h-3.5 w-3.5 ${tier.accent}`} />
              <p className={`text-xs font-semibold uppercase tracking-wider ${tier.accent}`}>Contractor Portal</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold capitalize ${tier.colors}`}>
                {tier.label}
              </span>
            </div>
            <h1 className="text-xl font-bold">
              Welcome back, <span className="gradient-text">{user.name.split(" ")[0]}</span>
            </h1>
            {user.businessName && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-primary/60" />
                {user.businessName}
              </p>
            )}
          </div>
          {newLeads > 0 && (
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-400" />
              </span>
              <div>
                <p className="text-sm font-bold text-blue-400">{newLeads} new project{newLeads > 1 ? "s" : ""}</p>
                <p className="text-[10px] text-blue-300/60">Awaiting your response</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ title, value, sub: subLabel, icon: Icon, accent, accentBg, border, trend }) => (
          <div key={title} className={`rounded-xl border ${border} bg-card p-4 hover-glow transition-all duration-200 hover:translate-y-[-1px]`}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium">{title}</p>
              <div className={`${accentBg} p-1.5 rounded-lg`}>
                <Icon className={`h-4 w-4 ${accent}`} />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-[10px] text-muted-foreground">{subLabel}</p>
              {trend && <Trend value={trend.value} positive={trend.positive} />}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Project Activity</CardTitle>
                <CardDescription>Weekly project volume and revenue over the last 6 weeks</CardDescription>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-2 py-1 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                <TrendingUp className="h-3.5 w-3.5" />
                +23% MoM
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={weeklyData} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.20 0.015 240)" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "oklch(0.60 0.01 240)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "oklch(0.60 0.01 240)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={25}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "oklch(0.60 0.01 240)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                  formatter={(value) => <span style={{ color: "oklch(0.70 0.01 240)" }}>{value}</span>}
                />
                <Bar
                  yAxisId="left"
                  dataKey="projects"
                  name="Projects"
                  fill="oklch(0.75 0.18 155)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="oklch(0.70 0.15 85)"
                  strokeWidth={2}
                  dot={{ fill: "oklch(0.70 0.15 85)", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription card */}
        <Card className={`lg:col-span-2 border-2 ${sub === "elite" ? "border-violet-500/30" : sub === "premium" ? "border-amber-500/30" : "border-border/40"}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Plan</CardTitle>
                <CardDescription>Subscription & service categories</CardDescription>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold capitalize ${tier.colors}`}>
                <TierIcon className="h-4 w-4" />
                {tier.label}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="space-y-2 p-3 rounded-xl bg-secondary/40 border border-border/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground text-xs">Project advance notice</span>
                <span className={`text-xs font-bold ${tier.accent}`}>{tier.advance}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground text-xs">Service categories</span>
                <span className="text-xs font-semibold">{(user.serviceCategories ?? []).length} active</span>
              </div>
            </div>

            {/* Close rate bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground font-medium">Close rate</span>
                <span className="font-bold text-foreground">{closeRate}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-1000"
                  style={{ width: `${closeRate}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {closeRate >= 50 ? "Strong performance" : closeRate >= 25 ? "Room to improve" : "Focus on follow-ups"}
              </p>
            </div>

            {(user.serviceCategories ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/30">
                {(user.serviceCategories ?? []).map((cat) => (
                  <span key={cat} className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground border border-border/30">{cat}</span>
                ))}
              </div>
            )}

            <a
              href="/pricing"
              className={`inline-flex items-center justify-center gap-1.5 text-sm font-semibold py-2 px-3 rounded-xl border transition-colors mt-1 ${tier.colors} hover:opacity-80`}
            >
              {sub === "elite" ? "Manage plan" : "Upgrade plan"}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Leads table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>All projects assigned to your account — click a row to expand and update status</CardDescription>
            </div>
            {newLeads > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-xs text-blue-400 font-semibold">
                <AlertCircle className="h-3.5 w-3.5" />
                {newLeads} need attention
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-14 gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-sm text-muted-foreground">Loading projects…</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-14">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                <Briefcase className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-semibold mb-1">No projects yet</p>
              <p className="text-xs text-muted-foreground">Projects will appear here when homeowners in your service area submit requests.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-secondary/20">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Homeowner</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Service</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Budget</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tier</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Window</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Age</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <>
                      <tr
                        key={lead.id}
                        className={`${i < leads.length - 1 ? "border-b border-border/20" : ""} hover:bg-secondary/30 transition-colors cursor-pointer ${
                          lead.status === "new" ? "bg-blue-500/[0.03]" : ""
                        }`}
                        onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold">{lead.homeownerName}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" /> {lead.address.split(",")[0]}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold">{lead.service}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-[160px]">{lead.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-bold text-foreground">{lead.budget}</td>
                        <td className="px-4 py-4">{tierBadge(lead.tier)}</td>
                        <td className="px-4 py-4">{statusBadge(lead.status)}</td>
                        <td className="px-4 py-4">
                          {lead.consultationWindow ? (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              {lead.consultationWindow}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{timeAgo(lead.createdAt)}</span>
                            <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${expandedLead === lead.id ? "rotate-180" : ""}`} />
                          </div>
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {expandedLead === lead.id && (
                        <tr key={`${lead.id}-expanded`} className="border-b border-border/20 bg-secondary/10">
                          <td colSpan={7} className="px-6 py-5">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-1">Description</p>
                                <p className="text-foreground text-xs leading-relaxed">{lead.description}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-1">Full Address</p>
                                <p className="text-foreground text-xs">{lead.address}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-1">Photos</p>
                                <p className="text-foreground text-xs">{lead.photos} uploaded</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-1">Project Value</p>
                                <p className="text-emerald-400 font-bold text-base">${lead.value.toLocaleString()}</p>
                              </div>
                            </div>

                            {/* Status actions */}
                            {nextStatuses[lead.status].length > 0 && (
                              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border/30">
                                {nextStatuses[lead.status].map(({ value: nextStatus, label, icon: Icon }) => {
                                  const isWon = nextStatus === "won"
                                  const isLost = nextStatus === "lost"
                                  const isLoading = updating === lead.id
                                  return (
                                    <button
                                      key={nextStatus}
                                      type="button"
                                      disabled={isLoading}
                                      onClick={(e) => { e.stopPropagation(); updateStatus(lead.id, nextStatus) }}
                                      className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                                        isWon
                                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                                          : isLost
                                          ? "bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20"
                                          : "btn-shimmer bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:opacity-90"
                                      }`}
                                    >
                                      {isLoading ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                      ) : (
                                        <Icon className="h-3.5 w-3.5" />
                                      )}
                                      {label}
                                    </button>
                                  )
                                })}
                                {lead.status === "new" && (
                                  <span className="text-xs text-muted-foreground ml-1">Respond quickly to improve close rate</span>
                                )}
                              </div>
                            )}

                            {(lead.status === "won" || lead.status === "lost") && (
                              <div className={`flex items-center gap-2 pt-4 border-t border-border/30 text-xs font-medium ${lead.status === "won" ? "text-emerald-400" : "text-muted-foreground"}`}>
                                {lead.status === "won" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                {lead.status === "won" ? "Job closed — counted in your revenue" : "Marked as lost"}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
