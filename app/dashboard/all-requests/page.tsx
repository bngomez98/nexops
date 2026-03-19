'use client'

import { useAuth } from '@/app/lib/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { redirect } from 'next/navigation'
import { mockClientRequests } from '@/app/lib/mock-data'
import { CheckCircle2, Clock, AlertCircle, FileText, TrendingUp } from 'lucide-react'

export default function AllRequestsPage() {
  const { user, isLoggedIn } = useAuth()

  if (!isLoggedIn || user?.role !== 'admin') {
    redirect('/login')
  }

  const totalRequests = mockClientRequests.length
  const active = mockClientRequests.filter((r) => r.status !== 'completed' && r.status !== 'invoiced').length
  const completed = mockClientRequests.filter((r) => r.status === 'completed' || r.status === 'invoiced').length
  const revenue = mockClientRequests
    .filter((r) => r.invoiceAmount)
    .reduce((sum, r) => sum + (r.invoiceAmount || 0), 0)

  const avgCompletionTime = '3.2 days'

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Network Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor all requests and system health</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">Total requests</p>
                <p className="text-2xl font-semibold text-foreground mt-2">{totalRequests}</p>
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">Active</p>
                <p className="text-2xl font-semibold text-foreground mt-2">{active}</p>
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">Completed</p>
                <p className="text-2xl font-semibold text-foreground mt-2">{completed}</p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">Revenue</p>
                <p className="text-2xl font-semibold text-foreground mt-2">${revenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Performance metrics</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. completion time</span>
              <span className="text-sm font-semibold text-foreground">{avgCompletionTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Assignment rate</span>
              <span className="text-sm font-semibold text-foreground">
                {((completed / totalRequests) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active contractors</span>
              <span className="text-sm font-semibold text-foreground">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. margin per job</span>
              <span className="text-sm font-semibold text-foreground">$580</span>
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent requests</h2>
          <div className="space-y-2">
            {mockClientRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{request.type}</p>
                  <p className="text-xs text-muted-foreground">{request.propertyName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      request.status === 'completed' || request.status === 'invoiced'
                        ? 'bg-green-50 text-green-700'
                        : request.status === 'in-progress'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('-', ' ')}
                  </span>
                  <span className="text-sm font-semibold text-foreground w-16 text-right">
                    ${request.budget.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
