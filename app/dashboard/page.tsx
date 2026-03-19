'use client'

import { useAuth } from '@/app/lib/auth-context'
import { useRequests } from '@/app/lib/requests-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FileText, CheckCircle2, Clock, AlertCircle, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isLoggedIn } = useAuth()
  const { clientRequests, contractorJobs } = useRequests()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-1">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Here's what's happening with your account.</p>
        </div>

        {user?.role === 'client' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                      Active
                    </p>
                    <p className="text-2xl font-semibold text-foreground mt-1">
                      {clientRequests.filter((r) => r.status !== 'completed' && r.status !== 'invoiced').length}
                    </p>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                      Completed
                    </p>
                    <p className="text-2xl font-semibold text-foreground mt-1">
                      {clientRequests.filter((r) => r.status === 'completed' || r.status === 'invoiced').length}
                    </p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                      Total Spend
                    </p>
                    <p className="text-2xl font-semibold text-foreground mt-1">
                      $
                      {clientRequests
                        .filter((r) => r.invoiceAmount)
                        .reduce((sum, r) => sum + (r.invoiceAmount || 0), 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <Link
                  href="/dashboard/requests/new"
                  className="flex items-start justify-between h-full group cursor-pointer hover:bg-secondary transition-colors rounded -m-4 p-4"
                >
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide group-hover:text-foreground transition-colors">
                      New Request
                    </p>
                    <p className="text-lg font-semibold text-foreground mt-2 group-hover:text-primary transition-colors">
                      Submit →
                    </p>
                  </div>
                  <Briefcase className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </div>
            </div>

            {/* Active Requests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Active requests</h2>
                <Link href="/dashboard/requests" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>

              <div className="space-y-3">
                {clientRequests
                  .filter((r) => r.status !== 'completed' && r.status !== 'invoiced')
                  .slice(0, 3)
                  .map((request) => (
                    <Link
                      key={request.id}
                      href={`/dashboard/requests/${request.id}`}
                      className="block bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{request.type}</p>
                          <p className="text-sm text-muted-foreground">{request.propertyName}</p>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            request.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {request.status === 'in-progress' ? 'In progress' : 'Assigned'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {request.assignedContractor?.name || 'Awaiting assignment'}
                        </span>
                        <span className="font-semibold text-foreground">${request.budget.toLocaleString()}</span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </>
        )}

        {user?.role === 'contractor' && (
          <>
            {/* Contractor Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                      Available
                    </p>
                    <p className="text-2xl font-semibold text-foreground mt-1">
                      {contractorJobs.filter((j) => j.status === 'available').length}
                    </p>
                  </div>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                      Active
                    </p>
                    <p className="text-2xl font-semibold text-foreground mt-1">
                      {contractorJobs.filter((j) => j.status === 'claimed').length}
                    </p>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                      Pending Payout
                    </p>
                    <p className="text-2xl font-semibold text-foreground mt-1">
                      $
                      {contractorJobs
                        .filter((j) => j.status !== 'invoiced')
                        .reduce((sum, j) => sum + (j.payout || 0), 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                      This Month
                    </p>
                    <p className="text-2xl font-semibold text-foreground mt-1">$245</p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Available Jobs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Available jobs</h2>
                <Link href="/dashboard/jobs" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>

              <div className="space-y-3">
                {contractorJobs
                  .filter((j) => j.status === 'available')
                  .map((job) => (
                    <div
                      key={job.id}
                      className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{job.type}</p>
                          <p className="text-sm text-muted-foreground">{job.propertyName}</p>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700">
                          Available
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{job.description}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground">${job.budget.toLocaleString()}</span>
                          <button className="text-sm font-medium px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity">
                            Claim
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {user?.role === 'admin' && (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Admin panel dashboard - configure reports and team management</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
