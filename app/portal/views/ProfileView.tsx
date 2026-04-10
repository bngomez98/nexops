'use client'

import {
  Camera,
  CreditCard,
  Mail,
  Phone,
  Shield,
} from 'lucide-react'
import { formatMoney, formatRelative } from '../lib/portal-utils'
import { useState } from 'react'
import { formatMoney, formatRelative } from '../lib/portal-types'
import { usePortal } from '../lib/portal-context'
import { Avatar } from '../components/Avatar'

export function ProfileView() {
  const { currentUser, jobs } = usePortal()
  const { currentUser, jobs, loading, error } = usePortal()
  const [notifyMessages, setNotifyMessages] = useState(true)
  const [notifyStatus, setNotifyStatus] = useState(true)
  const [notifyPayments, setNotifyPayments] = useState(false)

  const myInvoices = jobs
    .filter((j) =>
      currentUser.role === 'contractor'
        ? j.contractorId === currentUser.id && j.invoiceAmount
        : j.ownerId === currentUser.id && j.invoiceAmount,
    )
    .map((j) => ({
      job: j,
      invoice: {
        amount: j.invoiceAmount ?? 0,
        status: j.invoicePaid ? 'paid' : 'pending',
        submittedAt: j.createdAt,
        paidAt: j.invoicePaid ? j.createdAt : null,
      },
    }))
  const isContractor = currentUser.role === 'contractor'
  const activeCount = isContractor
    ? jobs.filter((j) => j.contractorId === currentUser.id && j.status !== 'completed').length
    : jobs.filter((j) => j.ownerId === currentUser.id && j.status !== 'completed').length
  const completedCount = isContractor
    ? jobs.filter((j) => j.contractorId === currentUser.id && j.status === 'completed').length
    : jobs.filter((j) => j.ownerId === currentUser.id && j.status === 'completed').length

  const roleLabel: Record<string, string> = {
    admin: 'Operations admin',
    homeowner: 'Homeowner',
    contractor: 'Contractor',
    manager: 'Property manager',
  }

  return (
    <div className="space-y-5">
      {loading && (
        <div className="glass p-4 text-xs text-indigo-200/70">Loading profile…</div>
      )}
      {error && (
        <div className="glass p-4 text-xs text-rose-300">Profile data unavailable: {error}</div>
      )}
      <section className="glass-tinted p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-5">
          <div className="relative">
            <Avatar user={currentUser} size={84} />
            <button
              type="button"
              aria-label="Change photo"
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white/15 border border-white/25 backdrop-blur flex items-center justify-center text-white hover:bg-white/25 transition"
            >
              <Camera size={14} />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/70 inline-flex items-center gap-1.5">
              <Shield size={11} />
              {roleLabel[currentUser.role]}
            </div>
            <h2 className="text-2xl font-semibold text-white tracking-tight mt-1">
              {currentUser.name}
            </h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-indigo-200/70">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={12} /> {currentUser.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone size={12} /> {currentUser.phone}
              </span>
            </div>
            {currentUser.role === 'contractor' && currentUser.rating && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs text-amber-200">
                <Star size={12} className="fill-amber-300 text-amber-300" />
                {currentUser.rating.toFixed(1)} rating · {currentUser.jobsCompleted} jobs
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-5">
        <section className="glass p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={15} className="text-indigo-200" />
            <h3 className="text-sm font-semibold text-white">Payment history</h3>
          </div>
          {myInvoices.length === 0 && (
            <div className="text-xs text-indigo-200/50 py-4 text-center">
              No invoices yet.
            </div>
          )}
          <div className="space-y-2.5">
            {myInvoices.map(({ job, invoice }) => (
              <div
                key={job.id}
                className="glass-soft p-3 flex items-center justify-between"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{job.title}</div>
                  <div className="text-[11px] text-indigo-200/60">
                    {invoice.paidAt
                      ? `Paid ${formatRelative(invoice.paidAt)}`
                      : `Submitted ${formatRelative(invoice.submittedAt ?? job.createdAt)}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">
                    {formatMoney(invoice.amount)}
                  </div>
                  <div
                    className={`text-[10.5px] uppercase tracking-wider ${
                      invoice.status === 'paid' ? 'text-emerald-300' : 'text-amber-300'
                    }`}
                  >
                    {invoice.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={15} className="text-indigo-200" />
            <h3 className="text-sm font-semibold text-white">Account overview</h3>
          </div>
          <div className="space-y-2 text-[12px] text-indigo-200/70">
            <p>
              {isContractor ? 'Active assignments' : 'Open requests'}:{' '}
              <span className="text-white font-semibold">{activeCount}</span>
            </p>
            <p>
              {isContractor ? 'Completed work' : 'Completed requests'}:{' '}
              <span className="text-white font-semibold">{completedCount}</span>
            </p>
            <p className="text-indigo-200/50">
              Manage your profile and notification settings in the main dashboard.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
