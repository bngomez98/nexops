'use client'

import {
  Bell,
  Camera,
  Check,
  CreditCard,
  ExternalLink,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Shield,
  Star,
  X,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { formatMoney, formatRelative } from '../lib/portal-utils'
import { usePortal } from '../lib/portal-context'
import { Avatar } from '../components/Avatar'

const TRADES = [
  'plumbing', 'electrical', 'hvac', 'landscaping', 'cleaning',
  'handyman', 'carpentry', 'painting', 'roofing', 'general',
] as const

const TRADE_LABEL: Record<string, string> = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  hvac: 'HVAC',
  landscaping: 'Landscaping',
  cleaning: 'Cleaning',
  handyman: 'Handyman',
  carpentry: 'Carpentry',
  painting: 'Painting',
  roofing: 'Roofing',
  general: 'General',
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
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/5 transition cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 accent-indigo-400"
      />
      <div>
        <div className="text-sm text-white">{label}</div>
        <div className="text-[11px] text-indigo-200/55">{description}</div>
      </div>
    </label>
  )
}

export function ProfileView() {
  const { currentUser, jobs, preferences, updateProfile, updateAvatar, updatePreferences } = usePortal()

  /* ── Avatar upload ─────────────────────────────────────────────────────── */
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarError, setAvatarError] = useState('')

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarLoading(true)
    setAvatarError('')
    try {
      await updateAvatar(file)
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setAvatarLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  /* ── Profile edit ──────────────────────────────────────────────────────── */
  const [editMode, setEditMode] = useState(false)
  const [editName, setEditName] = useState(currentUser?.name ?? '')
  const [editPhone, setEditPhone] = useState(currentUser?.phone ?? '')
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')
  const [editSuccess, setEditSuccess] = useState(false)

  const startEdit = () => {
    setEditName(currentUser?.name ?? '')
    setEditPhone(currentUser?.phone ?? '')
    setEditError('')
    setEditSuccess(false)
    setEditMode(true)
  }

  const cancelEdit = () => {
    setEditMode(false)
    setEditError('')
  }

  const saveEdit = async () => {
    if (!editName.trim()) {
      setEditError('Name is required.')
      return
    }
    setEditSaving(true)
    setEditError('')
    try {
      await updateProfile({ name: editName.trim(), phone: editPhone.trim() })
      setEditMode(false)
      setEditSuccess(true)
      setTimeout(() => setEditSuccess(false), 3000)
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setEditSaving(false)
    }
  }

  /* ── Service categories (contractor) ──────────────────────────────────── */
  const [catSaving, setCatSaving] = useState(false)

  const toggleCategory = async (trade: string) => {
    if (!currentUser) return
    const current = currentUser.serviceCategories ?? []
    const updated = current.includes(trade)
      ? current.filter((c) => c !== trade)
      : [...current, trade]
    setCatSaving(true)
    try {
      await updateProfile({ serviceCategories: updated })
    } finally {
      setCatSaving(false)
    }
  }

  /* ── Notification prefs ────────────────────────────────────────────────── */
  const handlePrefChange = (key: 'notifyMessages' | 'notifyStatus' | 'notifyPayments', val: boolean) => {
    void updatePreferences({ [key]: val })
  }

  /* ── Billing link ──────────────────────────────────────────────────────── */
  const billingPath =
    currentUser?.role === 'contractor'
      ? '/dashboard/contractor/billing'
      : '/dashboard/homeowner/billing'

  /* ── Invoice summary ───────────────────────────────────────────────────── */
  const myInvoices = jobs
    .filter((j) =>
      currentUser?.role === 'contractor'
        ? j.contractorId === currentUser.id && j.invoiceAmount
        : j.ownerId === currentUser?.id && j.invoiceAmount,
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

  if (!currentUser) return null

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
    'property-manager': 'Property manager',
  }

  return (
    <div className="space-y-5">
      {/* ── Profile header ─────────────────────────────────────────────── */}
      <section className="glass-tinted p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none" />
        <div className="relative flex items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar user={currentUser} size={84} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { void handleAvatarChange(e) }}
            />
            <button
              type="button"
              aria-label="Change photo"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarLoading}
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white/15 border border-white/25 backdrop-blur flex items-center justify-center text-white hover:bg-white/25 transition disabled:opacity-50"
            >
              {avatarLoading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
            </button>
          </div>

          {/* Info / edit */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/70 inline-flex items-center gap-1.5">
                <Shield size={11} />
                {roleLabel[currentUser.role] ?? currentUser.role}
              </div>
              {!editMode && (
                <button
                  type="button"
                  onClick={startEdit}
                  className="ml-auto p-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-indigo-200/70 hover:text-white transition"
                  aria-label="Edit profile"
                >
                  <Pencil size={13} />
                </button>
              )}
            </div>

            {editMode ? (
              <div className="mt-2 space-y-2">
                <input
                  className="glass-input text-sm"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Full name"
                />
                <input
                  className="glass-input text-sm"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="Phone number"
                />
                {editError && (
                  <p className="text-xs text-rose-300">{editError}</p>
                )}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { void saveEdit() }}
                    disabled={editSaving}
                    className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
                  >
                    {editSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    Save
                  </button>
                  <button type="button" onClick={cancelEdit} className="btn-ghost text-xs py-1.5 px-4">
                    <X size={12} className="mr-1" />Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-white tracking-tight mt-1">
                  {currentUser.name}
                  {editSuccess && (
                    <span className="ml-2 text-xs text-emerald-300 font-normal inline-flex items-center gap-1">
                      <Check size={12} /> Saved
                    </span>
                  )}
                </h2>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-indigo-200/70">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={12} /> {currentUser.email}
                  </span>
                  {currentUser.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={12} /> {currentUser.phone}
                    </span>
                  )}
                </div>
              </>
            )}

            {!editMode && isContractor && currentUser.rating != null && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs text-amber-200">
                <Star size={12} className="fill-amber-300 text-amber-300" />
                {currentUser.rating.toFixed(1)} rating · {currentUser.jobsCompleted ?? 0} jobs
              </div>
            )}
          </div>
        </div>
        {avatarError && (
          <p className="mt-2 text-xs text-rose-300 text-center">{avatarError}</p>
        )}
      </section>

      {/* ── Service trade selection (contractors only) ─────────────────── */}
      {isContractor && (
        <section className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Service trades</h3>
            {catSaving && <Loader2 size={13} className="animate-spin text-indigo-300" />}
          </div>
          <p className="text-[11px] text-indigo-200/55 mb-3">Select the trades you offer to receive matching job requests.</p>
          <div className="flex flex-wrap gap-2">
            {TRADES.map((trade) => {
              const active = (currentUser.serviceCategories ?? []).includes(trade)
              return (
                <button
                  key={trade}
                  type="button"
                  onClick={() => { void toggleCategory(trade) }}
                  disabled={catSaving}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    active
                      ? 'bg-indigo-500/30 border-indigo-400/50 text-indigo-100'
                      : 'bg-white/5 border-white/10 text-indigo-200/60 hover:bg-white/10'
                  }`}
                >
                  {active && <Check size={11} className="inline mr-1" />}
                  {TRADE_LABEL[trade]}
                </button>
              )
            })}
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        {/* ── Payment history ─────────────────────────────────────────── */}
        <section className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CreditCard size={15} className="text-indigo-200" />
              <h3 className="text-sm font-semibold text-white">Payment history</h3>
            </div>
            <button
              type="button"
              onClick={() => { window.location.href = billingPath }}
              className="text-[11px] text-indigo-300 hover:text-indigo-100 transition inline-flex items-center gap-1"
            >
              Manage billing <ExternalLink size={11} />
            </button>
          </div>
          {myInvoices.length === 0 && (
            <div className="text-xs text-indigo-200/50 py-4 text-center">No invoices yet.</div>
          )}
          <div className="space-y-2.5">
            {myInvoices.map(({ job, invoice }) => (
              <div key={job.id} className="glass-soft p-3 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{job.title}</div>
                  <div className="text-[11px] text-indigo-200/60">
                    {invoice.paidAt
                      ? `Paid ${formatRelative(invoice.paidAt)}`
                      : `Submitted ${formatRelative(invoice.submittedAt ?? job.createdAt)}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{formatMoney(invoice.amount)}</div>
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

        {/* ── Notifications + Account ──────────────────────────────────── */}
        <section className="glass p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={15} className="text-indigo-200" />
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
          </div>
          <div className="space-y-2">
            <ToggleRow
              label="Status changes"
              description="When a job moves to assigned, in progress, or complete"
              checked={preferences.notifyStatus}
              onChange={(v) => handlePrefChange('notifyStatus', v)}
            />
            <ToggleRow
              label="New messages"
              description="Per-job chat replies and mentions"
              checked={preferences.notifyMessages}
              onChange={(v) => handlePrefChange('notifyMessages', v)}
            />
            <ToggleRow
              label="Payment confirmations"
              description="Stripe receipts and approvals"
              checked={preferences.notifyPayments}
              onChange={(v) => handlePrefChange('notifyPayments', v)}
            />
          </div>
          <div className="flex items-center gap-2 mt-5 mb-3">
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
          </div>
        </section>
      </div>
    </div>
  )
}
