'use client'

import { useAuth } from '@/app/lib/auth-context'
import { useRequests } from '@/app/lib/requests-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { MapPin, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function JobsPage() {
  const { user, isLoggedIn } = useAuth()
  const { contractorJobs, claimJob } = useRequests()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'contractor') {
      router.push('/auth/login')
    }
  }, [isLoggedIn, user, router])

  if (!isLoggedIn || user?.role !== 'contractor') {
    return null
  }

  const availableJobs = contractorJobs.filter((j) => j.status === 'available')
  const claimedJobs = contractorJobs.filter((j) => j.status === 'claimed')
  
  const handleClaimJob = (jobId: string) => {
    if (user?.id) {
      claimJob(jobId, user.id)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Available jobs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {availableJobs.length} job{availableJobs.length !== 1 ? 's' : ''} available to claim
          </p>
        </div>

        <div className="space-y-3">
          {availableJobs.length > 0 ? (
            availableJobs.map((job) => (
              <div key={job.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{job.type}</h3>
                    <p className="text-sm text-muted-foreground">{job.propertyName}</p>
                  </div>
                  <button 
                    onClick={() => handleClaimJob(job.id)}
                    className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
                  >
                    Claim job
                  </button>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{job.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-foreground">${job.budget.toLocaleString()}</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-50 text-green-700">New</span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    Est. payout: ${Math.floor(job.budget * 0.7).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <AlertCircle className="h-6 w-6 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No available jobs at the moment</p>
              <p className="text-xs text-muted-foreground mt-1">Check back soon</p>
            </div>
          )}
        </div>

        {claimedJobs.length > 0 && (
          <div className="pt-6 border-t border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Your active jobs</h2>
            <div className="space-y-3">
              {claimedJobs.map((job) => (
                <div key={job.id} className="bg-card border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{job.type}</h3>
                      <p className="text-sm text-muted-foreground">{job.propertyName}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-blue-50 text-blue-700">Claimed</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Claimed on {job.claimedAt}</span>
                    <span className="font-semibold text-foreground">${job.payout?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
