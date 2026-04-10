'use client'

import { ExternalLink, Shield, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'
import { dashboardStats, formatMoney, STATUS_LABEL } from '../lib/mock-data'
import { usePortal } from '../lib/portal-context'
import { Avatar } from '../components/Avatar'
import { StatusPill } from '../components/StatusPill'

interface AdminViewProps {
  onOpenJob: (jobId: string) => void
}

export function AdminView({ onOpenJob }: AdminViewProps) {
  const { jobs, users, currentUser, assignContractor } = usePortal()
  const [assignError, setAssignError] = useState('')
  const stats = dashboardStats(jobs, currentUser.id, 'admin')
  const contractors = users.filter((u) => u.role === 'contractor')
  const customers = users.filter((u) => u.role === 'homeowner' || u.role === 'manager')

  const grossMoney = jobs
    .filter((j) => j.invoice)
    .reduce((sum, j) => sum + (j.invoice?.amountCents ?? 0), 0)

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
        <AdminStat label="Open" value={stats.open} accent="text-sky-300" />
        <AdminStat label="Active contractors" value={stats.activeContractors} accent="text-violet-300" />
        <AdminStat label="Gross billed" value={formatMoney(grossMoney)} accent="text-emerald-300" />
      </div>

      <section className="glass p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Unassigned jobs</h3>
            <p className="text-[11px] text-indigo-200/55">
              Tap a contractor to assign them instantly.
            </p>
          </div>
        </div>
        <div className="space-y-2.5">
          {jobs.filter((j) => !j.contractorId).length === 0 && (
            <div className="text-xs text-indigo-200/50 py-4 text-center">
              Every job has a contractor. Nice work.
            </div>
          )}
          {jobs
            .filter((j) => !j.contractorId)
            .map((j) => (
              <div
                key={j.id}
                className="glass-soft p-3.5 flex items-center gap-3 flex-wrap"
              >
                <button
                  type="button"
                  onClick={() => onOpenJob(j.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="text-sm font-semibold text-white truncate">{j.title}</div>
                  <div className="text-[11px] text-indigo-200/60 truncate">
                    #{j.shortId} · {j.location.split(',')[0]} · {STATUS_LABEL[j.status]}
                  </div>
                </button>
                <StatusPill status={j.status} />
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {contractors.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => assignContractor(j.id, c.id)}
                      className="text-[11px] rounded-full px-2.5 py-1 bg-white/5 border border-white/10 text-indigo-100 hover:bg-indigo-500/30 inline-flex items-center gap-1.5"
                    >
                      <Avatar user={c} size={16} />
                      {c.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
        {assignError && <div className="mt-3 text-xs text-rose-300">{assignError}</div>}
      </section>

      <div className="grid lg:grid-cols-2 gap-5">
        <section className="glass p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users size={15} className="text-indigo-200" />
            <h3 className="text-sm font-semibold text-white">Contractors</h3>
          </div>
          <div className="space-y-2">
            {contractors.map((c) => (
              <div key={c.id} className="glass-soft p-3 flex items-center gap-3">
                <Avatar user={c} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{c.name}</div>
                  <div className="text-[11px] text-indigo-200/60 truncate">{c.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-amber-200">
                    ★ {c.rating?.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-indigo-200/50">{c.jobsCompleted} jobs</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <UserPlus size={15} className="text-indigo-200" />
              <h3 className="text-sm font-semibold text-white">Customers</h3>
            </div>
          </div>
          <div className="space-y-2">
            {customers.map((u) => (
              <div key={u.id} className="glass-soft p-3 flex items-center gap-3">
                <Avatar user={u} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{u.name}</div>
                  <div className="text-[11px] text-indigo-200/60 truncate">{u.email}</div>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-indigo-200/55">
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
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
