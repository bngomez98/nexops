"use client"

import { useEffect, useState } from "react"
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
  Zap,
  Target,
  Clock,
  MapPin,
  ArrowUpRight,
  Briefcase,
  TrendingDown,
  AlertCircle,
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
  { week: "Nov W1", leads: 2, revenue: 2800 },
  { week: "Nov W2", leads: 3, revenue: 4200 },
  { week: "Nov W3", leads: 1, revenue: 950 },
  { week: "Nov W4", leads: 4, revenue: 7100 },
  { week: "Dec W1", leads: 3, revenue: 5600 },
  { week: "Dec W2", leads: 4, revenue: 6900 },
]

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
  const colors: Record<Lead["tier"], string> = {
    basic: "text-muted-foreground border-border/40",
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
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

// Sparkline-style trend indicator
function Trend({ value, positive }: { value: string; positive: boolean }) {
  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}>
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {value}
    </div>
  )
}

// Custom tooltip for the chart
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

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored || stored.role !== "contractor") {
      router.replace("/login")
      return
    }
    setUser(stored)

    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads ?? []))
      .finally(() => setLoading(false))
  }, [router])

  if (!user) return null

  const totalValue = leads.filter((l) => l.status === "won").reduce((s, l) => s + l.value, 0)
  const wonLeads = leads.filter((l) => l.status === "won").length
  const closeRate = leads.length > 0 ? Math.round((wonLeads / leads.length) * 100) : 0
  const newLeads = leads.filter((l) => l.status === "new").length

  const stats = [
    {
      title: "Total Leads",
      value: leads.length.toString(),
      sub: `${newLeads} new`,
      icon: TrendingUp,
      accent: "text-primary",
      accentBg: "bg-primary/10",
      trend: { value: "+12%", positive: true },
    },
    {
      title: "Revenue Won",
      value: `$${totalValue.toLocaleString()}`,
      sub: `${wonLeads} jobs closed`,
      icon: DollarSign,
      accent: "text-emerald-400",
      accentBg: "bg-emerald-400/10",
      trend: { value: "+8%", positive: true },
    },
    {
      title: "Close Rate",
      value: `${closeRate}%`,
      sub: "Last 30 days",
      icon: Target,
      accent: "text-amber-400",
      accentBg: "bg-amber-400/10",
      trend: { value: "-3%", positive: false },
    },
    {
      title: "Subscription",
      value: user.subscription ? user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1) : "—",
      sub: "Active plan",
      icon: Zap,
      accent: "text-violet-400",
      accentBg: "bg-violet-400/10",
      trend: null,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-primary text-sm font-medium mb-1">Contractor Portal</p>
          <h1 className="text-2xl font-semibold">Welcome back, {user.name.split(" ")[0]}</h1>
          {user.businessName && (
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              {user.businessName}
            </p>
          )}
        </div>
        {newLeads > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-500/30 bg-blue-500/10 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
            </span>
            <span className="text-blue-400 font-medium">{newLeads} new lead{newLeads > 1 ? "s" : ""} waiting</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ title, value, sub, icon: Icon, accent, accentBg, trend }) => (
          <Card key={title} className="hover-glow transition-all duration-200 hover:translate-y-[-1px]">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-muted-foreground">{title}</p>
                <div className={`${accent} ${accentBg} p-1.5 rounded-lg`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{sub}</p>
                {trend && <Trend value={trend.value} positive={trend.positive} />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6 mb-6">
        {/* Chart — dual axis (bars for leads, line for revenue) */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lead Activity</CardTitle>
                <CardDescription>Weekly lead volume and revenue over the last 6 weeks</CardDescription>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
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
                  dataKey="leads"
                  name="Leads"
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Plan</CardTitle>
            <CardDescription>Current subscription details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/30">
              <span className="text-sm text-muted-foreground">Tier</span>
              <span className="font-bold capitalize text-primary">{user.subscription ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Advance notice</span>
              <span className="text-sm font-medium">
                {user.subscription === "elite" ? "5 min exclusive" : user.subscription === "premium" ? "60 sec" : "Real-time"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Categories</span>
              <span className="text-sm font-medium">{(user.serviceCategories ?? []).length} active</span>
            </div>

            {/* Close rate progress */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Close rate</span>
                <span className="font-medium text-foreground">{closeRate}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-1000"
                  style={{ width: `${closeRate}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
              {(user.serviceCategories ?? []).map((cat) => (
                <span key={cat} className="px-2 py-1 rounded-md bg-secondary text-xs text-muted-foreground">{cat}</span>
              ))}
            </div>
            <a
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-auto"
            >
              Upgrade plan <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Leads table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>All leads assigned to your account</CardDescription>
            </div>
            {newLeads > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-blue-400">
                <AlertCircle className="h-3.5 w-3.5" />
                {newLeads} require attention
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-sm text-muted-foreground">Loading leads…</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No leads yet.</div>
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
                            <svg
                              className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${expandedLead === lead.id ? "rotate-180" : ""}`}
                              viewBox="0 0 12 12" fill="none"
                            >
                              <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </td>
                      </tr>
                      {/* Expanded row */}
                      {expandedLead === lead.id && (
                        <tr key={`${lead.id}-expanded`} className="border-b border-border/20 bg-secondary/10">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Description</p>
                                <p className="text-foreground">{lead.description}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Full Address</p>
                                <p className="text-foreground">{lead.address}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Photos</p>
                                <p className="text-foreground">{lead.photos} uploaded</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Lead Value</p>
                                <p className="text-emerald-400 font-semibold">${lead.value.toLocaleString()}</p>
                              </div>
                            </div>
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
