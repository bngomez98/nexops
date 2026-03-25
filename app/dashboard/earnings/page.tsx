'use client'

import { useAuth } from '@/app/lib/auth-context'
import { useRequests } from '@/app/lib/requests-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { mockInvoices } from '@/app/lib/mock-data'
import { TrendingUp, DollarSign, Check, Clock } from 'lucide-react'

export default function EarningsPage() {
  const { user, isLoggedIn } = useAuth()
  const { contractorJobs } = useRequests()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'contractor') {
      router.push('/auth/login')
    }
  }, [isLoggedIn, user, router])

  if (!isLoggedIn || user?.role !== 'contractor') {
    return null
  }

  const totalEarnings = contractorJobs
    .filter((j) => j.payout)
    .reduce((sum, j) => sum + (j.payout || 0), 0)

  const thisMonthEarnings = 245 // From mock data

  const contractorInvoices = mockInvoices.filter((i) => i.type === 'contractor')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Earnings</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your payouts and invoices</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">Total earnings</p>
                <p className="text-2xl font-semibold text-foreground mt-2">${totalEarnings.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">This month</p>
                <p className="text-2xl font-semibold text-foreground mt-2">${thisMonthEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">Completed jobs</p>
                <p className="text-2xl font-semibold text-foreground mt-2">
                  {contractorJobs.filter((j) => j.status === 'completed').length}
                </p>
              </div>
              <Check className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent invoices</h2>

          {contractorInvoices.length > 0 ? (
            <div className="space-y-2">
              {contractorInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{invoice.relatedName}</p>
                    <p className="text-xs text-muted-foreground">Issued {invoice.issuedAt}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        invoice.status === 'paid'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                    <span className="font-semibold text-foreground">${invoice.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No invoices yet</p>
          )}
        </div>

        {/* Payment info */}
        <div className="bg-secondary border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Payment schedule:</strong> Payouts are processed weekly. Next payout expected on Feb 14.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
