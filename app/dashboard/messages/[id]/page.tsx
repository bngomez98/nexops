"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Send,
  User,
  Info,
  Loader2,
  CheckCircle,
} from "lucide-react"

/* ── Types ─────────────────────────────────────────────── */
interface Message {
  id: string
  sender_id: string
  body: string
  created_at: string
  profiles?: { full_name?: string; avatar_url?: string } | null
}

interface ServiceRequest {
  id: string
  category: string
  description: string
  address: string
  city: string
  state: string
  zip_code: string
  status: string
  budget_min?: number | null
  budget_max?: number | null
  preferred_dates?: string | null
  owner_id: string
  assigned_contractor_id?: string | null
}

/* ── Constants ──────────────────────────────────────────── */
const CATEGORY_LABELS: Record<string, string> = {
  "tree-removal":   "Tree Removal",
  hvac:             "HVAC",
  electrical:       "Electrical",
  roofing:          "Roofing",
  concrete:         "Concrete",
  fencing:          "Fencing",
  plumbing:         "Plumbing",
  "general-repair": "General Repair",
}

const STATUS_LABELS: Record<string, string> = {
  pending_review:         "Pending Review",
  in_queue:               "Open",
  assigned:               "Assigned",
  consultation_scheduled: "Consultation Scheduled",
  in_progress:            "In Progress",
  completed:              "Completed",
  declined:               "Declined",
  cancelled:              "Cancelled",
}

const POLL_INTERVAL = 6_000

function fmtTime(iso: string) {
  const d     = new Date(iso)
  const today = new Date()
  const isToday =
    d.getDate()     === today.getDate()  &&
    d.getMonth()    === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  return isToday
    ? time
    : d.toLocaleDateString([], { month: "short", day: "numeric" }) + " · " + time
}

function Avatar({ name, avatarUrl, size = 7 }: { name: string; avatarUrl?: string | null; size?: number }) {
  const initials = name.trim().split(/\s+/).map((n) => n[0] ?? "").join("").toUpperCase().slice(0, 2)
  const dim = `h-${size} w-${size}`
  if (avatarUrl)
    return (
      <div className={`relative ${dim} flex-shrink-0 overflow-hidden rounded-full border border-border`}>
        <Image src={avatarUrl} alt={name} fill sizes="32px" className="object-cover" unoptimized />
      </div>
    )
  return (
    <div className={`${dim} flex flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary`}>
      {initials || "?"}
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export default function MessageThreadPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()

  const [userId,        setUserId]        = useState("")
  const [userRole,      setUserRole]      = useState("homeowner")
  const [userName,      setUserName]      = useState("")
  const [userAvatar,    setUserAvatar]    = useState<string | null>(null)
  const [req,           setReq]           = useState<ServiceRequest | null>(null)
  const [counterpart,   setCounterpart]   = useState<{ full_name?: string; email?: string; phone?: string; avatar_url?: string } | null>(null)
  const [messages,      setMessages]      = useState<Message[]>([])
  const [loading,       setLoading]       = useState(true)
  const [msgUnavailable, setMsgUnavailable] = useState(false)
  const [draft,         setDraft]         = useState("")
  const [sending,       setSending]       = useState(false)
  const [sendError,     setSendError]     = useState<string | null>(null)
  const [sent,          setSent]          = useState(false)

  const bottomRef   = useRef<HTMLDivElement>(null)
  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── Bootstrap ── */
  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }

      const role = (user.user_metadata?.role as string) || "homeowner"
      const name = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "You"
      setUserId(user.id)
      setUserRole(role)
      setUserName(name)

      const { data: prof } = await supabase.from("profiles").select("avatar_url").eq("id", user.id).single()
      if (prof?.avatar_url) setUserAvatar(prof.avatar_url)

      const { data: reqData } = await supabase.from("service_requests").select("*").eq("id", id).single()
      if (!reqData) { router.push("/dashboard/messages"); return }

      const isOwner      = reqData.owner_id === user.id
      const isContractor = role === "contractor" && reqData.assigned_contractor_id === user.id
      if (!isOwner && !isContractor) { router.push("/dashboard/messages"); return }

      setReq(reqData)

      if (isOwner && reqData.assigned_contractor_id) {
        const { data } = await supabase.from("profiles").select("full_name, email, phone, avatar_url").eq("id", reqData.assigned_contractor_id).single()
        setCounterpart(data)
      }
      if (isContractor) {
        const { data } = await supabase.from("profiles").select("full_name, email, phone").eq("id", reqData.owner_id).single()
        setCounterpart(data)
      }

      setLoading(false)
    }
    init()
  }, [id, router])

  /* ── Fetch messages ── */
  const fetchMessages = useCallback(async () => {
    const res  = await fetch(`/api/messages?requestId=${id}`)
    const json = await res.json() as { messages?: Message[]; unavailable?: boolean }
    if (json.unavailable) { setMsgUnavailable(true); return }
    if (json.messages)    setMessages(json.messages)
  }, [id])

  useEffect(() => {
    if (loading) return
    fetchMessages()
    pollRef.current = setInterval(fetchMessages, POLL_INTERVAL)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [loading, fetchMessages])

  /* ── Auto-scroll ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* ── Send message ── */
  async function handleSend() {
    const body = draft.trim()
    if (!body || sending) return
    setSending(true)
    setSendError(null)
    try {
      const res  = await fetch("/api/messages", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ requestId: id, body }),
      })
      const json = await res.json() as { error?: string }
      if (!res.ok) throw new Error(json.error ?? "Failed to send")
      setDraft("")
      setSent(true)
      setTimeout(() => setSent(false), 2000)
      await fetchMessages()
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : "Failed to send")
    } finally {
      setSending(false)
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  /* ── Derived ── */
  const isOwner             = !!req && req.owner_id === userId
  const consultationVisible = req ? ["consultation_scheduled", "in_progress", "completed"].includes(req.status) : false
  const counterName         = counterpart?.full_name ?? (isOwner ? "Assigned Contractor" : "Property Owner")

  if (loading || !req) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-4 py-6 sm:px-6">

        {/* Back link */}
        <Link href="/dashboard/messages" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          All messages
        </Link>

        {/* Request card */}
        <div className="mb-4 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
              {CATEGORY_LABELS[req.category] ?? req.category.replace(/-/g, " ")}
            </span>
            <span className="text-[10px] text-muted-foreground capitalize">
              {STATUS_LABELS[req.status] ?? req.status.replace(/_/g, " ")}
            </span>
          </div>
          <div className="space-y-2 px-5 py-4 text-[12px] text-muted-foreground">
            <p className="text-sm font-semibold text-foreground">{req.description}</p>
            <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />{req.address}, {req.city}, {req.state} {req.zip_code}</span>
            {(req.budget_min || req.budget_max) && (
              <span className="flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                {req.budget_min && req.budget_max ? `$${Number(req.budget_min).toLocaleString()} – $${Number(req.budget_max).toLocaleString()}` : req.budget_max ? `Up to $${Number(req.budget_max).toLocaleString()}` : `From $${Number(req.budget_min).toLocaleString()}`}
              </span>
            )}
            {req.preferred_dates && (
              <span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-primary" />{req.preferred_dates}</span>
            )}
          </div>
        </div>

        {/* Contact card */}
        <div className="mb-4 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <User className="h-3.5 w-3.5 text-primary" />
            <p className="text-sm font-semibold">{isOwner ? "Assigned Contractor" : "Property Owner"}</p>
          </div>
          <div className="px-5 py-4">
            <div className="mb-3 flex items-center gap-3">
              <Avatar name={counterName} avatarUrl={counterpart?.avatar_url} size={8} />
              <p className="text-sm font-medium">{counterName}</p>
            </div>
            {consultationVisible ? (
              <div className="space-y-2">
                {counterpart?.phone && (
                  <a href={`tel:${counterpart.phone.replace(/\D/g, "")}`} className="flex items-center gap-2.5 text-[13px] text-muted-foreground transition hover:text-foreground">
                    <Phone className="h-3.5 w-3.5 text-primary" />{counterpart.phone}
                  </a>
                )}
                {counterpart?.email && (
                  <a href={`mailto:${counterpart.email}`} className="flex items-center gap-2.5 text-[13px] text-muted-foreground transition hover:text-foreground">
                    <Mail className="h-3.5 w-3.5 text-primary" />{counterpart.email}
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  Direct contact details become available once a consultation is confirmed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Chat panel ── */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <p className="text-sm font-semibold">Messages</p>
            <span className="text-[11px] text-muted-foreground">{messages.length} message{messages.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Scrollable messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {msgUnavailable ? (
              <div className="flex flex-col items-center py-10 text-center">
                <p className="text-sm font-medium text-muted-foreground">Messaging setup required</p>
                <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                  Contact{" "}
                  <a href="mailto:admin@nexusoperations.org" className="text-primary hover:underline">admin@nexusoperations.org</a>
                  {" "}to send a message via Nexus.
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Send className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No messages yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Start the conversation with {counterName}.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const mine        = msg.sender_id === userId
                const senderName  = mine ? userName : (msg.profiles?.full_name ?? counterName)
                const senderAvatar = mine ? userAvatar : (msg.profiles?.avatar_url ?? null)
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${mine ? "flex-row-reverse" : ""}`}>
                    <Avatar name={senderName} avatarUrl={senderAvatar} />
                    <div className={`flex max-w-[72%] flex-col gap-1 ${mine ? "items-end" : "items-start"}`}>
                      <div className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${mine ? "rounded-tr-sm bg-primary text-primary-foreground" : "rounded-tl-sm bg-muted text-foreground"}`}>
                        {msg.body}
                      </div>
                      <span className="px-1 text-[10px] text-muted-foreground">{fmtTime(msg.created_at)}</span>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Compose bar */}
          {!msgUnavailable && (
            <div className="border-t border-border p-4">
              {sendError && <p className="mb-2 text-[11px] text-destructive">{sendError}</p>}
              <div className="flex items-end gap-2.5">
                <Avatar name={userName} avatarUrl={userAvatar} />
                <div className="relative flex-1">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={`Message ${counterName}…`}
                    rows={1}
                    disabled={sending}
                    className="w-full resize-none rounded-xl border border-border bg-muted/40 px-4 py-2.5 pr-12 text-[13px] placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
                    style={{ minHeight: "42px", maxHeight: "120px" }}
                    onInput={(e) => {
                      const t = e.currentTarget
                      t.style.height = "auto"
                      t.style.height = `${Math.min(t.scrollHeight, 120)}px`
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!draft.trim() || sending}
                    className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
                  >
                    {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : sent ? <CheckCircle className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <p className="mt-1.5 pl-9 text-[10px] text-muted-foreground">Enter to send · Shift+Enter for new line</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
