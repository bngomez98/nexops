'use client'

import {
  Bell,
  Camera,
  CreditCard,
  Mail,
  Phone,
  Shield,
  Star,
} from 'lucide-react'
import { useState } from 'react'
import { formatMoney, formatRelative } from '../lib/portal-types'
import { usePortal } from '../lib/portal-context'
import { Avatar } from '../components/Avatar'

export function ProfileView() {
  const { currentUser, jobs, loading, error } = usePortal()
  const [notifyMessages, setNotifyMessages] = useState(true)
  const [notifyStatus, setNotifyStatus] = useState(true)
  const [notifyPayments, setNotifyPayments] = useState(false)

  const myInvoices = jobs
    .filter((j) =>
      currentUser.role === 'contractor'
        ? j.contractorId === currentUser.id && j.invoice
        : j.homeownerId === currentUser.id && j.invoice,
    )
    .map((j) => ({ job: j, invoice: j.invoice! }))

  const reviewsReceived =
    currentUser.role === 'contractor'
      ? jobs.filter((j) => j.contractorId === currentUser.id && j.review)
      : []

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
                key={invoice.id}
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
                    {formatMoney(invoice.amountCents)}
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
            <Bell size={15} className="text-indigo-200" />
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
          </div>
          <div className="space-y-2">
            <ToggleRow
              label="Status changes"
              description="When a job moves to assigned, in progress, or complete"
              checked={notifyStatus}
              onChange={setNotifyStatus}
            />
            <ToggleRow
              label="New messages"
              description="Per-job chat replies and mentions"
              checked={notifyMessages}
              onChange={setNotifyMessages}
            />
            <ToggleRow
              label="Payment confirmations"
              description="Stripe receipts and approvals"
              checked={notifyPayments}
              onChange={setNotifyPayments}
            />
          </div>
        </section>
      </div>

      {reviewsReceived.length > 0 && (
        <section className="glass p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star size={15} className="text-amber-300 fill-amber-300" />
            <h3 className="text-sm font-semibold text-white">Reviews received</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {reviewsReceived.map((j) => (
              <div key={j.id} className="glass-soft p-3.5">
                <div className="flex items-center gap-1 text-amber-300 mb-1">
                  {Array.from({ length: j.review!.rating }).map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-300" />
                  ))}
                </div>
                <div className="text-sm text-white leading-snug">“{j.review!.body}”</div>
                <div className="text-[11px] text-indigo-200/55 mt-1">
                  for #{j.shortId} · {j.title}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-3 glass-soft p-3 text-left hover:bg-white/10 transition"
    >
      <div className="min-w-0">
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-[11px] text-indigo-200/60">{description}</div>
      </div>
      <span
        className={`relative h-6 w-10 rounded-full border transition ${
          checked
            ? 'bg-gradient-to-br from-indigo-500 to-sky-400 border-white/30'
            : 'bg-white/5 border-white/15'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}
