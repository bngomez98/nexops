"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getStoredUser, type AuthUser } from "@/lib/auth"
import { TrendingUp, DollarSign, Target, Users, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface Lead {
  id: string
  service: string
  status: "new" | "contacted" | "scheduled" | "won" | "lost"
  tier: "basic" | "premium" | "elite"
  value: number
  createdAt: string
}

const weeklyData = [
  { week: "Nov W1", leads: 2, revenue: 2800, closeRate: 50 },
  { week: "Nov W2", leads: 3, revenue: 4200, closeRate: 67 },
  { week: "Nov W3", leads: 1, revenue: 950, closeRate: 100 },
  { week: "Nov W4", leads: 4, revenue: 7100, closeRate: 75 },
  { week: "Dec W1", leads: 3, revenue: 5600, closeRate: 67 },
  { week: "Dec W2", leads: 4, revenue: 6900, closeRate: 50 },
]

const COLORS = {
  won: "oklch(0.65 0.18 155)",
  lost: "oklch(0.55 0.22 20)",
  new: "oklch(0.65 0.18 230)",
  contacted: "oklch(0.72 0.18 80)",
  scheduled: "oklch(0.70 0.18 155)",
}

export default function ContractorAnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

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

  const totalRevenue = leads.filter((l) => l.status === "won").reduce((s, l) => s + l.value, 0)
  const wonLeads = leads.filter((l) => l.status === "won").length
  const closeRate = leads.length > 0 ? Math.round((wonLeads / leads.length) * 100) : 0
  const avgDeal = wonLeads > 0 ? Math.round(totalRevenue / wonLeads) : 0

  const statusBreakdown = (["new", "contacted", "scheduled", "won", "lost"] as Lead["status"][]).map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: leads.filter((l) => l.status === status).length,
    fill: COLORS[status],
  })).filter((d) => d.value > 0)

  const serviceBreakdown = leads.reduce<Record<string, { won: number; lost: number; total: number }>>((acc, l) => {
    if (!acc[l.service]) acc[l.service] = { won: 0, lost: 0, total: 0 }
    acc[l.service].total++
    if (l.status === "won") acc[l.service].won++
    if (l.status === "lost") acc[l.service].lost++
    return acc
  }, {})
  const serviceData = Object.entries(serviceBreakdown).map(([service, d]) => ({
    service,
    won: d.won,
    lost: d.lost,
    total: d.total,
  }))

  const kpis = [
    {
      label: "Revenue Won",
      value: `$${totalRevenue.toLocaleString()}`,
      sub: "Total closed",
      icon: DollarSign,
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10",
      trend: "+12%",
      up: true,
    },
    {
      label: "Total Leads",
      value: leads.length.toString(),
      sub: `${leads.filter((l) => l.status === "new").length} new`,
      icon: Users,
      accent: "text-primary",
      bg: "bg-primary/10",
      trend: "+3",
      up: true,
    },
    {
      label: "Close Rate",
      value: `${closeRate}%`,
      sub: "Last 30 days",
      icon: Target,
      accent: "text-amber-400",
      bg: "bg-amber-500/10",
      trend: "+5%",
      up: true,
    },
    {
      label: "Avg. Deal Size",
      value: avgDeal > 0 ? `$${avgDeal.toLocaleString()}` : "—",
      sub: "Won jobs",
      icon: TrendingUp,
      accent: "text-violet-400",
      bg: "bg-violet-500/10",
      trend: "+$200",
      up: true,
    },
  ]

  const chartStyle = {
    contentStyle: {
      background: "oklch(0.12 0.012 240)",
      border: "1px solid oklch(0.20 0.015 240)",
      borderRadius: "8px",
      fontSize: "12px",
    },
    labelStyle: { color: "oklch(0.95 0.005 90)" },
    tick: { fill: "oklch(0.60 0.01 240)", fontSize: 11 },
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-primary text-sm font-medium mb-1">Contractor Portal</p>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Performance overview — last 30 days.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, sub, icon: Icon, accent, bg, trend, up }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                <div className={`${bg} p-1.5 rounded-lg`}>
                  <Icon className={`h-3.5 w-3.5 ${accent}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{loading ? "—" : value}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <p className="text-xs text-muted-foreground">{sub}</p>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${up ? "text-emerald-400" : "text-destructive"}`}>
                  {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly revenue trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Weekly revenue over the last 6 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.20 0.015 240)" />
                <XAxis dataKey="week" tick={chartStyle.tick} axisLine={false} tickLine={false} />
                <YAxis tick={chartStyle.tick} axisLine={false} tickLine={false} width={45} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={chartStyle.contentStyle}
                  labelStyle={chartStyle.labelStyle}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(0.75 0.18 155)"
                  strokeWidth={2.5}
                  dot={{ fill: "oklch(0.75 0.18 155)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead status pie */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Status</CardTitle>
            <CardDescription>Breakdown by current status</CardDescription>
          </CardHeader>
          <CardContent>
            {loading || statusBreakdown.length === 0 ? (
              <div className="flex items-center justify-center h-[180px]">
                <p className="text-sm text-muted-foreground">No data</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", color: "oklch(0.60 0.01 240)" }}
                  />
                  <Tooltip
                    contentStyle={chartStyle.contentStyle}
                    labelStyle={chartStyle.labelStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Leads per week bar */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Lead Volume</CardTitle>
            <CardDescription>Leads received each week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.20 0.015 240)" />
                <XAxis dataKey="week" tick={chartStyle.tick} axisLine={false} tickLine={false} />
                <YAxis tick={chartStyle.tick} axisLine={false} tickLine={false} width={25} />
                <Tooltip contentStyle={chartStyle.contentStyle} labelStyle={chartStyle.labelStyle} />
                <Bar dataKey="leads" name="Leads" fill="oklch(0.75 0.18 155)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Leads by Service</CardTitle>
            <CardDescription>Won vs. lost per service category</CardDescription>
          </CardHeader>
          <CardContent>
            {loading || serviceData.length === 0 ? (
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-sm text-muted-foreground">No data</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={serviceData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.20 0.015 240)" />
                  <XAxis dataKey="service" tick={chartStyle.tick} axisLine={false} tickLine={false} />
                  <YAxis tick={chartStyle.tick} axisLine={false} tickLine={false} width={25} />
                  <Tooltip contentStyle={chartStyle.contentStyle} labelStyle={chartStyle.labelStyle} />
                  <Bar dataKey="won" name="Won" fill="oklch(0.65 0.18 155)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="lost" name="Lost" fill="oklch(0.55 0.22 20)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
