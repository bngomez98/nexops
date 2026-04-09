'use client'

import { ExternalLink, Shield } from 'lucide-react'
import { STATUS_LABEL, formatMoney, formatCategoryLabel } from '../lib/portal-utils'
import { usePortal } from '../lib/portal-context'
import { StatusPill } from '../components/StatusPill'

interface AdminViewProps {
  onOpenJob: (jobId: string) => void
}

export function AdminView({ onOpenJob }: AdminViewProps) {
  const { jobs, currentUser } = usePortal()
  const openJobs = jobs.filter((j) => j.status !== 'completed' && j.status !== 'cancelled')
  const completedJobs = jobs.filter((j) => j.status === 'completed')
  const pendingInvoices = jobs.filter((j) => j.invoiceAmount && !j.invoicePaid)
  const activeContractors = new Set(
    openJobs.filter((j) => j.contractorId).map((j) => j.contractorId),
  ).size
  const grossMoney = jobs.reduce((sum, j) => sum + (j.invoiceAmount ?? 0), 0)
  const latest = [...jobs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 6)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/70 inline-flex items-center gap-1.5">
            <Shield size={11} /> Admin
          </div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Operations panel</h2>
          <p className="text-xs text-indigo-200/60">
            Full oversight across users, contractors, jobs, and payments.
          </p>
        </div>
        <a
          href="https://dashboard.stripe.com"
          target="_blank"
          rel="noreferrer"
          className="btn-ghost"
        >
          Open Stripe <ExternalLink size={13} />
        </a>
      </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <AdminStat label="Total jobs" value={jobs.length} />
          <AdminStat label="Open" value={openJobs.length} accent="text-sky-300" />
          <AdminStat label="Completed" value={completedJobs.length} accent="text-emerald-300" />
          <AdminStat label="Active contractors" value={activeContractors} accent="text-violet-300" />
          <AdminStat label="Pending invoices" value={pendingInvoices.length} accent="text-amber-300" />
          <AdminStat label="Gross billed" value={formatMoney(grossMoney)} accent="text-emerald-300" />
        </div>

        <section className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Latest activity</h3>
              <p className="text-[11px] text-indigo-200/55">
                Most recent service requests across the portfolio.
              </p>
            </div>
          </div>
          <div className="space-y-2.5">
            {latest.length === 0 && (
              <div className="text-xs text-indigo-200/50 py-4 text-center">
                No jobs yet.
              </div>
            )}
            {latest.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => onOpenJob(job.id)}
                className="w-full glass-soft p-3.5 flex items-center gap-3 text-left hover:bg-white/10 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{job.title}</div>
                  <div className="text-[11px] text-indigo-200/60 truncate">
                    #{job.shortId} · {formatCategoryLabel(job.category)} · {job.location.split(',')[0]}
                  </div>
                </div>
                <StatusPill status={job.status} />
              </button>
            ))}
          </div>
        </section>
    </div>
  )
}

function AdminStat({
  label,
  value,
  accent = 'text-white',
}: {
  label: string
  value: number | string
  accent?: string
}) {
  return (
    <div className="glass p-4">
      <div className="text-[10px] uppercase tracking-wider text-indigo-200/55">{label}</div>
      <div className={`mt-1 text-2xl font-semibold tracking-tight ${accent}`}>{value}</div>
    </div>
  )
}
