'use client'

import { useAuth } from '@/app/lib/auth-context'
import { useRequests } from '@/app/lib/requests-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react'
import Link from 'next/link'

const statusConfig = {
  pending: { icon: AlertCircle, label: 'Pending', color: 'text-amber-700 bg-amber-50' },
  assigned: { icon: Clock, label: 'Assigned', color: 'text-blue-700 bg-blue-50' },
  'in-progress': { icon: Clock, label: 'In Progress', color: 'text-blue-700 bg-blue-50' },
  completed: { icon: CheckCircle2, label: 'Completed', color: 'text-green-700 bg-green-50' },
  invoiced: { icon: FileText, label: 'Invoiced', color: 'text-slate-700 bg-slate-50' },
}

export default function RequestsPage() {
  const { user, isLoggedIn } = useAuth()
  const { clientRequests } = useRequests()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'client') {
      router.push('/login')
    }
  }, [isLoggedIn, user, router])

  if (!isLoggedIn || user?.role !== 'client') {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Requests</h1>
            <p className="text-muted-foreground text-sm mt-1">View and manage all your maintenance requests</p>
          </div>
          <Link
            href="/dashboard/requests/new"
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            New request
          </Link>
        </div>

        <div className="space-y-2">
          {clientRequests.map((request) => {
            const StatusIcon = statusConfig[request.status].icon
            return (
              <Link
                key={request.id}
                href={`/dashboard/requests/${request.id}`}
                className="block bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                    <StatusIcon className={`h-5 w-5 ${statusConfig[request.status].color.split(' ')[0]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-medium text-foreground">{request.type}</p>
                        <p className="text-sm text-muted-foreground">{request.propertyName}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${statusConfig[request.status].color}`}>
                        {statusConfig[request.status].label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{request.description}</p>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-muted-foreground">
                        {request.assignedContractor?.name || 'Awaiting assignment'}
                      </span>
                      <span className="font-semibold text-foreground">${request.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
