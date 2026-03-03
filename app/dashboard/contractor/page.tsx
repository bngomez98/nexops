"use client"

import { Fragment, useCallback, useEffect, useState } from "react"
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
    advance: "Real-time",
  },
  premium: {
    label: "Premium",
    icon: Star,
    advance: "90 sec early",
  },
  elite: {
    label: "Elite",
    icon: Crown,
    advance: "5 min exclusive",
  },
}

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
  return <Badge variant={variant as Parameters<typeof Badge>[0]["variant"]}>{label}</Badge>
}

function tierBadge(tier: Lead["tier"]) {
  const config = tierConfig[tier] ?? tierConfig.standard
  const TierIcon = config.icon
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-secondary text-xs font-medium text-foreground">
      <TierIcon className="h-2.5 w-2.5 text-muted-foreground" />
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

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card rounded-md px-3 py-2.5 shadow-lg text-xs">
      <p className="font-semibold text-foreground mb-1.5">{label}</p>
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

function useIsDark() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])
  return isDark
}

export default function ContractorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedLead, setExpandedLead] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const isDark = useIsDark()

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored || stored.role !== "contractor") {
      router.replace("/login")
      return
    }
    setUser(stored)

    const controller = new AbortController()
    fetch("/api/leads", { signal: controller.signal })
      .then((r) => {
        if (r.status === 401) { router.replace("/login"); return null }
        if (!r.ok) return null
        return r.json()
      })
      .then((d) => { if (d) setLeads(d.leads ?? []) })
      .catch((err) => { if (err.name !== "AbortError") console.error("Failed to fetch leads:", err) })
      .finally(() => setLoading(false))

    return () => controller.abort()
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
        if (status === "won" || status === "lost") setExpandedLead(null)
      } finally {
        setUpdating(null)
      }
    },
    [],
  )

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-24 gap-3">
        <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-sm text-muted-foreground">Loading dashboard…</span>
      </div>
    )
  }

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
    },
    {
      title: "Revenue Won",
      value: `$${totalValue.toLocaleString()}`,
      sub: `${wonLeads} jobs closed`,
      icon: DollarSign,
    },
    {
      title: "Close Rate",
      value: `${closeRate}%`,
      sub: "Last 30 days",
      icon: Target,
    },
    {
      title: "Plan",
      value: user.subscription ? user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1) : "—",
      sub: "Active subscription",
      icon: TierIcon,
    },
  ]

  const axisColor = isDark ? "oklch(0.58 0.008 240)" : "oklch(0.50 0.008 240)"
  const gridColor = isDark ? "oklch(0.22 0.012 240)" : "oklch(0.90 0.006 240)"

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-xl font-semibold">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-secondary text-xs font-medium text-muted-foreground">
              <TierIcon className="h-3 w-3" />
              {tier.label}
            </span>
          </div>
          {user.businessName && (
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              {user.businessName}
            </p>
          )}
        </div>
        {newLeads > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-secondary">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <div>
              <p className="text-sm font-semibold">{newLeads} new project{newLeads > 1 ? "s" : ""}</p>
              <p className="text-[10px] text-muted-foreground">Awaiting your response</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ title, value, sub: subLabel, icon: Icon }) => (
          <div key={title} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium">{title}</p>
              <Icon className="h-3.5 w-3.5 text-muted-foreground/60" />
            </div>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{subLabel}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-3 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Project Activity</CardTitle>
                <CardDescription>Weekly project volume and revenue over the last 6 weeks</CardDescription>
              </div>
              <span className="text-xs text-muted-foreground font-medium px-2 py-1 rounded border border-border bg-secondary">
                +23% MoM
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={weeklyData} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fill: axisColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: axisColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={25}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: axisColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                  formatter={(value) => <span style={{ color: axisColor }}>{value}</span>}
                />
                <Bar
                  yAxisId="left"
                  dataKey="projects"
                  name="Projects"
                  fill={isDark ? "oklch(0.68 0.14 185)" : "oklch(0.50 0.16 185)"}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={36}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke={isDark ? "oklch(0.62 0.12 230)" : "oklch(0.52 0.12 230)"}
                  strokeWidth={1.5}
                  dot={{ fill: isDark ? "oklch(0.62 0.12 230)" : "oklch(0.52 0.12 230)", r: 2.5 }}
                  activeDot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription card */}
        <Card className="lg:col-span-2 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Plan</CardTitle>
                <CardDescription>Subscription & service categories</CardDescription>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-secondary text-sm font-medium text-foreground">
                <TierIcon className="h-3.5 w-3.5 text-muted-foreground" />
                {tier.label}
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="space-y-2 p-3 rounded-md bg-secondary border border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Project advance notice</span>
                <span className="text-xs font-semibold">{tier.advance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Service categories</span>
                <span className="text-xs font-semibold">{(user.serviceCategories ?? []).length} active</span>
              </div>
            </div>

            {/* Close rate bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground font-medium">Close rate</span>
                <span className="font-semibold">{closeRate}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${closeRate}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {closeRate >= 50 ? "Strong performance" : closeRate >= 25 ? "Room to improve" : "Focus on follow-ups"}
              </p>
            </div>

            {(user.serviceCategories ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border">
                {(user.serviceCategories ?? []).map((cat) => (
                  <span key={cat} className="px-2 py-0.5 rounded border border-border bg-secondary text-xs text-muted-foreground">{cat}</span>
                ))}
              </div>
            )}

            <a
              href="/pricing"
              className="inline-flex items-center justify-center gap-1.5 text-sm font-medium py-2 px-3 rounded-md border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground mt-1"
            >
              {sub === "elite" ? "Manage plan" : "Upgrade plan"}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Leads table */}
      <Card className="shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>All projects assigned to your account — click a row to expand and update status</CardDescription>
            </div>
            {newLeads > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-secondary text-xs text-muted-foreground font-medium">
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
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                <Briefcase className="h-4 w-4 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium mb-1">No projects yet</p>
              <p className="text-xs text-muted-foreground">Projects will appear here when homeowners in your service area submit requests.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Homeowner</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Service</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Budget</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Tier</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Window</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Age</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <Fragment key={lead.id}>
                      <tr
                        className={`${i < leads.length - 1 ? "border-b border-border" : ""} hover:bg-secondary/30 transition-colors cursor-pointer`}
                        onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{lead.homeownerName}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" /> {lead.address.split(",")[0]}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{lead.service}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-[160px]">{lead.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold">{lead.budget}</td>
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

                      {/* Expanded row */}
                      {expandedLead === lead.id && (
                        <tr key={`${lead.id}-expanded`} className="border-b border-border bg-secondary/20">
                          <td colSpan={7} className="px-6 py-5">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-1">Description</p>
                                <p className="text-foreground text-xs leading-relaxed">{lead.description}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-1">Full Address</p>
                                <p className="text-foreground text-xs">{lead.address}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-1">Photos</p>
                                <p className="text-foreground text-xs">{lead.photos} uploaded</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-1">Project Value</p>
                                <p className="font-semibold text-base">${lead.value.toLocaleString()}</p>
                              </div>
                            </div>

                            {nextStatuses[lead.status].length > 0 && (
                              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
                                {nextStatuses[lead.status].map(({ value: nextStatus, label, icon: Icon }) => {
                                  const isLost = nextStatus === "lost"
                                  const isLoading = updating === lead.id
                                  return (
                                    <button
                                      key={nextStatus}
                                      type="button"
                                      disabled={isLoading}
                                      onClick={(e) => { e.stopPropagation(); updateStatus(lead.id, nextStatus) }}
                                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                        isLost
                                          ? "border-border bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                                          : "btn-shimmer bg-primary text-primary-foreground border-primary hover:opacity-90"
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
                              <div className={`flex items-center gap-2 pt-4 border-t border-border text-xs font-medium ${lead.status === "won" ? "text-primary" : "text-muted-foreground"}`}>
                                {lead.status === "won" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                {lead.status === "won" ? "Job closed — counted in your revenue" : "Marked as lost"}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
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
