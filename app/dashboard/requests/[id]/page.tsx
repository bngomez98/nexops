'use client'

import { useAuth } from '@/app/lib/auth-context'
import { useRequests } from '@/app/lib/requests-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect, use } from 'react'
import { ChevronLeft, Phone, Mail, Calendar, MapPin, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
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

  const request = clientRequests.find((r) => r.id === id)

  if (!request) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Request not found</p>
        </div>
      </DashboardLayout>
    )
  }

  const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    assigned: 'bg-blue-50 text-blue-700 border-blue-200',
    'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    invoiced: 'bg-slate-50 text-slate-700 border-slate-200',
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link
          href="/dashboard/requests"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to requests
        </Link>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{request.type}</h1>
              <p className="text-muted-foreground mt-1">{request.propertyName}</p>
            </div>
            <span className={`text-sm font-medium px-3 py-1 rounded border ${statusColors[request.status]}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('-', ' ')}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Request details</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm text-foreground">{request.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Due date</p>
                    <p className="text-sm text-foreground">{request.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Property</p>
                    <p className="text-sm text-foreground">{request.propertyName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-sm font-semibold text-foreground">${request.budget.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {request.assignedContractor && (
              <div>
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Assigned contractor</h2>
                <div className="bg-secondary rounded-lg p-4">
                  <p className="font-medium text-foreground">{request.assignedContractor.name}</p>
                  <div className="space-y-2 mt-3 text-sm">
                    <a
                      href={`tel:${request.assignedContractor.phone}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {request.assignedContractor.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border pt-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{request.description}</p>
          </div>
        </div>

        {request.status === 'invoiced' && request.invoiceAmount && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Invoice</h2>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total amount</span>
              <span className="text-lg font-semibold text-foreground">${request.invoiceAmount.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
