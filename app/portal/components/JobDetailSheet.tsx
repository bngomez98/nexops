'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  MapPin,
  MessageCircle,
  PenLine,
  Send,
  Star,
} from 'lucide-react'
import {
  CATEGORY_LABEL,
  PRIORITY_LABEL,
  STATUS_FLOW,
  STATUS_LABEL,
  formatMoney,
  formatRelative,
  type Job,
} from '../lib/portal-types'
import { usePortal } from '../lib/portal-context'
import { Avatar } from './Avatar'
import { Sheet } from './Sheet'
import { StatusPill } from './StatusPill'

interface JobDetailSheetProps {
  jobId: string | null
  onClose: () => void
}

export function JobDetailSheet({ jobId, onClose }: JobDetailSheetProps) {
  const { jobs, users, currentUser, advanceStatus, postMessage, assignContractor, refreshJob } =
    usePortal()
  const job = useMemo<Job | null>(() => jobs.find((j) => j.id === jobId) ?? null, [jobs, jobId])

  const [draft, setDraft] = useState('')
  const [signed, setSigned] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    if (!jobId) return
    void refreshJob(jobId)
  }, [jobId, refreshJob])

  if (!job) {
    return (
      <Sheet open={false} onClose={onClose}>
        <span />
      </Sheet>
    )
  }

  const homeowner = users.find((u) => u.id === job.homeownerId)
  const contractor = users.find((u) => u.id === job.contractorId)
  const before = job.photos.filter((p) => p.kind === 'before')
  const after = job.photos.filter((p) => p.kind === 'after')
  const otherPhotos = job.photos.filter((p) => p.kind === 'attachment')
  const canAdvance = job.status !== 'complete'
  const canAssign = currentUser.role === 'admin' && !job.contractorId
  const availableContractors = users.filter((u) => u.role === 'contractor')

  const handleSend = async () => {
    if (!draft.trim()) return
    setActionError('')
    try {
      await postMessage(job.id, draft)
      setDraft('')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to send message')
    }
    void postMessage(job.id, draft)
    setDraft('')
  }

  return (
    <Sheet open={!!jobId} onClose={onClose} title={`Job #${job.shortId}`}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`priority-dot priority-${job.priority}`} aria-hidden />
            <span className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/70">
              {CATEGORY_LABEL[job.category]} · {PRIORITY_LABEL[job.priority]} priority
            </span>
            <span className="ml-auto">
              <StatusPill status={job.status} />
            </span>
          </div>
          <h3 className="text-xl font-semibold text-white tracking-tight mb-2">{job.title}</h3>
          <p className="text-sm text-indigo-100/70 leading-relaxed">{job.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-indigo-200/70">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} />
              Submitted {formatRelative(job.createdAt)}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-soft p-4">
          <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60 mb-3">
            Status timeline
          </div>
          <div className="flex items-center justify-between gap-2">
            {STATUS_FLOW.map((s, idx) => {
              const reached = STATUS_FLOW.indexOf(job.status) >= idx
              const current = job.status === s
              return (
                <div key={s} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.06 }}
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-semibold border ${
                      reached
                        ? 'bg-gradient-to-br from-indigo-500 to-sky-500 border-white/30 text-white shadow-lg shadow-indigo-500/40'
                        : 'bg-white/5 border-white/10 text-indigo-200/40'
                    } ${current ? 'ring-4 ring-indigo-400/30' : ''}`}
                  >
                    {idx + 1}
                  </motion.div>
                  <span
                    className={`mt-2 text-[10px] uppercase tracking-wider ${
                      reached ? 'text-indigo-100' : 'text-indigo-200/40'
                    }`}
                  >
                    {STATUS_LABEL[s]}
                  </span>
                </div>
              )
            })}
          </div>
          {canAdvance && (currentUser.role === 'admin' || currentUser.role === 'contractor') && (
            <button
              type="button"
              className="btn-ghost mt-4 w-full"
              onClick={() => {
                setActionError('')
                void advanceStatus(job.id).catch((err) => {
                  setActionError(err instanceof Error ? err.message : 'Failed to update status')
                })
              }}
            >
            <button type="button" className="btn-ghost mt-4 w-full" onClick={() => void advanceStatus(job.id)}>
              Advance to {STATUS_LABEL[STATUS_FLOW[STATUS_FLOW.indexOf(job.status) + 1]]}
            </button>
          )}
        </div>

        {/* People */}
        <div className="grid grid-cols-2 gap-3">
          {homeowner && (
            <div className="glass-soft p-4 flex items-center gap-3">
              <Avatar user={homeowner} size={42} />
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-indigo-200/50">Homeowner</div>
                <div className="text-sm font-semibold text-white truncate">{homeowner.name}</div>
                <div className="text-[11px] text-indigo-200/60 truncate">{homeowner.phone}</div>
              </div>
            </div>
          )}
          {contractor ? (
            <div className="glass-soft p-4 flex items-center gap-3">
              <Avatar user={contractor} size={42} />
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-indigo-200/50">Contractor</div>
                <div className="text-sm font-semibold text-white truncate">{contractor.name}</div>
                <div className="text-[11px] text-indigo-200/60 inline-flex items-center gap-1">
                  <Star size={11} className="fill-amber-300 text-amber-300" />
                  {contractor.rating?.toFixed(1)} · {contractor.jobsCompleted} jobs
                </div>
              </div>
            </div>
          ) : canAssign ? (
            <div className="glass-soft p-4">
              <div className="text-[10px] uppercase tracking-wider text-indigo-200/50 mb-2">Assign contractor</div>
              <div className="flex flex-wrap gap-1.5">
                {availableContractors.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => {
                        setActionError('')
                        void assignContractor(job.id, c.id).catch((err) => {
                          setActionError(err instanceof Error ? err.message : 'Failed to assign contractor')
                        })
                      }}
                      className="text-[11px] rounded-full px-2.5 py-1 bg-white/5 border border-white/10 text-indigo-100 hover:bg-indigo-500/30"
                    >
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => void assignContractor(job.id, c.id)}
                    className="text-[11px] rounded-full px-2.5 py-1 bg-white/5 border border-white/10 text-indigo-100 hover:bg-indigo-500/30"
                  >
                    {c.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-soft p-4 text-xs text-indigo-200/60 flex items-center">
              Awaiting contractor assignment.
            </div>
          )}
        </div>

        {/* Photos */}
        {(before.length > 0 || after.length > 0 || otherPhotos.length > 0) && (
          <div>
            <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60 mb-3">
              {before.length > 0 && after.length > 0 ? 'Before / After' : 'Photos'}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {before.length > 0 && (
                <PhotoStack label="Before" photos={before} />
              )}
              {after.length > 0 && <PhotoStack label="After" photos={after} />}
              {after.length === 0 && before.length === 0 && otherPhotos.length > 0 && (
                <PhotoStack label="Attachments" photos={otherPhotos} span />
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="glass-soft p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={14} className="text-indigo-200" />
            <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
              Conversation
            </div>
          </div>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {job.messages.length === 0 && (
              <div className="text-xs text-indigo-200/50 italic">No messages yet.</div>
            )}
            {job.messages.map((m) => {
              const mine = m.authorId === currentUser.id
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-sm leading-snug ${
                      mine
                        ? 'bg-gradient-to-br from-indigo-500/90 to-sky-500/80 text-white border border-white/15'
                        : 'bg-white/5 border border-white/10 text-indigo-50'
                    }`}
                  >
                    {!mine && (
                      <div className="text-[10px] uppercase tracking-wider text-indigo-200/70 mb-0.5">
                        {m.authorName}
                      </div>
                    )}
                    {m.body}
                  </div>
                  <div className="text-[10px] text-indigo-200/40 mt-0.5">
                    {formatRelative(m.timestamp)}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              className="glass-input flex-1"
              placeholder="Send a message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleSend()
              }}
            />
            <button type="button" className="btn-primary !px-4" onClick={() => void handleSend()}>
              <Send size={15} />
            </button>
          </div>
          {actionError && (
            <div className="text-xs text-rose-300 mt-2">{actionError}</div>
          )}
        </div>

        {/* Invoice */}
        {job.invoice ? (
          <div className="glass-soft p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={14} className="text-indigo-200" />
              <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
                Invoice
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-white">
                  {formatMoney(job.invoice.amountCents)}
                </div>
                <div className="text-[11px] text-indigo-200/60 capitalize">
                  Status: {job.invoice.status}
                </div>
              </div>
              {job.invoice.status !== 'paid' && currentUser.role === 'homeowner' && (
                <button type="button" className="btn-primary">Pay with Stripe</button>
              )}
              {job.invoice.status === 'paid' && (
                <span className="status-pill status-complete">
                  <CheckCircle2 size={12} /> Paid
                </span>
              )}
            </div>
          </div>
        ) : (
          job.status === 'complete' && currentUser.role === 'contractor' && (
            <div className="glass-soft p-4 text-xs text-indigo-100/70 flex items-center justify-between">
              No invoice yet.
              <button type="button" className="btn-ghost">Submit invoice</button>
            </div>
          )
        )}

        {/* Signature & rating (when complete) */}
        {job.status === 'complete' && (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSigned((s) => !s)}
              className="glass-soft p-4 text-left hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-2 mb-1">
                <PenLine size={14} className="text-indigo-200" />
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
                  Signature
                </span>
              </div>
              <div className="text-sm text-white">
                {signed ? 'Signed ✓' : 'Tap to sign off'}
              </div>
            </button>
            <div className="glass-soft p-4">
              <div className="flex items-center gap-2 mb-1">
                <Star size={14} className="text-amber-300 fill-amber-300" />
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
                  Rating
                </span>
              </div>
              <div className="text-sm text-white">
                {job.review ? `${job.review.rating}.0 / 5.0` : 'Awaiting review'}
              </div>
              {job.review && (
                <div className="text-[11px] text-indigo-200/70 mt-1 line-clamp-2">
                  “{job.review.body}”
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Sheet>
  )
}

function PhotoStack({
  label,
  photos,
  span,
}: {
  label: string
  photos: { id: string; caption: string; hue: number }[]
  span?: boolean
}) {
  return (
    <div className={span ? 'col-span-2' : ''}>
      <div className="text-[10px] uppercase tracking-wider text-indigo-200/50 mb-1.5">{label}</div>
      <div className={`grid ${span ? 'grid-cols-3' : 'grid-cols-1'} gap-2`}>
        {photos.map((p) => (
          <div
            key={p.id}
            className="aspect-[4/3] rounded-xl border border-white/10 overflow-hidden relative"
            style={{
              background: `linear-gradient(135deg, hsl(${p.hue} 70% 35% / 0.55), hsl(${
                p.hue + 30
              } 80% 25% / 0.6))`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-1.5 left-2 text-[10px] text-white/90 font-medium">
              {p.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
