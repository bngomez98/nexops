'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  MapPin,
  MessageCircle,
  Send,
} from 'lucide-react'
import {
  PRIORITY_LABEL,
  STATUS_FLOW,
  STATUS_LABEL,
  avatarGradient,
  buildInitials,
  formatCategoryLabel,
  formatMoney,
  formatRelative,
  type PortalJob,
} from '../lib/portal-utils'
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
  const { jobs, currentUser, advanceStatus, postMessage } = usePortal()
  const job = useMemo<PortalJob | null>(() => jobs.find((j) => j.id === jobId) ?? null, [jobs, jobId])
  const { jobs, users, currentUser, advanceStatus, postMessage, assignContractor, refreshJob } =
    usePortal()
  const job = useMemo<Job | null>(() => jobs.find((j) => j.id === jobId) ?? null, [jobs, jobId])

  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<
    { id: string; authorId: string; authorName: string; body: string; timestamp: string }[]
  >([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
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

  const canAdvance = job.status !== 'completed'
  const isOwner = currentUser.role === 'homeowner' || currentUser.role === 'manager' || currentUser.role === 'property-manager'
  const homeownerAvatar = job.ownerName
    ? {
        initials: buildInitials(job.ownerName),
        avatarColor: avatarGradient(job.ownerName),
        avatarUrl: null,
      }
    : null
  const contractorAvatar = job.contractorName
    ? {
        initials: buildInitials(job.contractorName),
        avatarColor: avatarGradient(job.contractorName),
        avatarUrl: null,
      }
    : null

  useEffect(() => {
    if (!jobId) return
    let active = true
    const load = async () => {
      setMessagesLoading(true)
      const res = await fetch(`/api/messages/${jobId}`)
      if (!res.ok) {
        setMessagesLoading(false)
        return
      }
      const data = await res.json()
      if (!active) return
      const mapped = (data.messages ?? []).map((m: Record<string, any>) => {
        const authorName =
          m.sender_name ||
          (m.sender_id === job?.ownerId ? job?.ownerName : m.sender_id === job?.contractorId ? job?.contractorName : 'Nexus Team')
        return {
          id: m.id,
          authorId: m.sender_id,
          authorName: authorName || 'Nexus Team',
          body: m.content,
          timestamp: m.created_at,
        }
      })
      setMessages(mapped)
      setMessagesLoading(false)
    }
    void load()
    return () => {
      active = false
    }
  }, [jobId, job?.ownerId, job?.ownerName, job?.contractorId, job?.contractorName])

  const handleSend = async () => {
    if (!draft.trim()) return
    void postMessage(job.id, draft).then((message) => {
      if (message) {
        setMessages((prev) => [
          ...prev,
          {
            id: message.id,
            authorId: message.sender_id,
            authorName: currentUser.name,
            body: message.content,
            timestamp: message.created_at,
          },
        ])
      }
      setDraft('')
    })
  }

  const handlePay = async () => {
    if (!job.invoiceAmount || job.invoicePaid) return
    setIsPaying(true)
    try {
      const res = await fetch('/api/stripe/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: job.id }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } finally {
      setIsPaying(false)
    setActionError('')
    try {
      await postMessage(job.id, draft)
      setDraft('')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to send message')
    }
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
              {formatCategoryLabel(job.category)} · {PRIORITY_LABEL[job.priority]} priority
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
            <button type="button" className="btn-ghost mt-4 w-full" onClick={() => {
              setActionError('')
              void advanceStatus(job.id).catch((err) => {
                setActionError(err instanceof Error ? err.message : 'Unable to update status')
              })
            }}>
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
          {job.ownerName && homeownerAvatar && (
            <div className="glass-soft p-4 flex items-center gap-3">
              <Avatar user={homeownerAvatar} size={42} />
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-indigo-200/50">Homeowner</div>
                <div className="text-sm font-semibold text-white truncate">{job.ownerName}</div>
              </div>
            </div>
          )}
          {job.contractorName && contractorAvatar ? (
            <div className="glass-soft p-4 flex items-center gap-3">
              <Avatar user={contractorAvatar} size={42} />
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-indigo-200/50">Contractor</div>
                <div className="text-sm font-semibold text-white truncate">{job.contractorName}</div>
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
                    onClick={() => {
                      setActionError('')
                      void assignContractor(job.id, c.id).catch((err) => {
                        setActionError(err instanceof Error ? err.message : 'Unable to assign contractor')
                      })
                    }}
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
          {job.photoUrls.length > 0 && (
            <div>
              <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60 mb-3">
                Attachments
              </div>
              <div className="grid grid-cols-2 gap-3">
                {job.photoUrls.map((url) => (
                  <div
                    key={url}
                    className="aspect-[4/3] rounded-xl border border-white/10 overflow-hidden relative"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                ))}
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
            {messagesLoading && (
              <div className="text-xs text-indigo-200/50 italic">Loading messages…</div>
            )}
            {!messagesLoading && messages.length === 0 && (
              <div className="text-xs text-indigo-200/50 italic">No messages yet.</div>
            )}
            {messages.map((m) => {
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
                if (e.key === 'Enter') {
                  void handleSend()
                }
              }}
            />
            <button type="button" className="btn-primary !px-4" onClick={() => { void handleSend() }}>
                if (e.key === 'Enter') void handleSend()
              }}
            />
            <button type="button" className="btn-primary !px-4" onClick={() => void handleSend()}>
              <Send size={15} />
            </button>
          </div>
          {actionError && (
            <div className="mt-2 text-xs text-rose-300">{actionError}</div>
            <div className="text-xs text-rose-300 mt-2">{actionError}</div>
          )}
        </div>

        {/* Invoice */}
        {job.invoiceAmount && (
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
                  {formatMoney(job.invoiceAmount)}
                </div>
                <div className="text-[11px] text-indigo-200/60 capitalize">
                  Status: {job.invoicePaid ? 'paid' : 'pending'}
                </div>
              </div>
              {job.invoicePaid ? (
                <span className="status-pill status-completed">
                  <CheckCircle2 size={12} /> Paid
                </span>
              ) : (
                isOwner && (
                  <button type="button" className="btn-primary" onClick={handlePay} disabled={isPaying}>
                    {isPaying ? 'Starting checkout…' : 'Pay with Stripe'}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {job.finalCost && (
          <div className="glass-soft p-4 flex items-center justify-between">
            <div>
              <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/60">
                Final cost
              </div>
              <div className="text-lg font-semibold text-white">{formatMoney(job.finalCost)}</div>
            </div>
            {job.status === 'completed' && (
              <span className="status-pill status-completed">
                <CheckCircle2 size={12} /> Completed
              </span>
            )}
          </div>
        )}
      </div>
    </Sheet>
  )
}
