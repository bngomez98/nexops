'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
} from 'lucide-react'
import {
  STATUS_LABEL,
  formatMoney,
  formatRelative,
  type PortalJob,
  type PortalJobStatus,
} from '../lib/portal-utils'
import { usePortal } from '../lib/portal-context'

interface DashboardViewProps {
  onSubmitRequest: () => void
  onOpenJob: (jobId: string) => void
  onSeeAllJobs: () => void
}

const PIPELINE_STATUSES: PortalJobStatus[] = ['open', 'claimed', 'in-progress', 'completed', 'cancelled']

export function DashboardView({
  onSubmitRequest,
  onOpenJob,
  onSeeAllJobs,
}: DashboardViewProps) {
  const { currentUser, jobs, loading, error } = usePortal()
  if (!currentUser) return null

  const visible = jobs.filter((j: PortalJob) => {
    if (currentUser.role === 'admin' || currentUser.role === 'property-manager' || currentUser.role === 'manager') return true
    if (currentUser.role === 'contractor') return j.contractorId === currentUser.id || j.status === 'open'
    return j.ownerId === currentUser.id
  })

  const stats = buildStats(visible)
  const pipeline = buildPipeline(visible)
  const recent = [...visible].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 6)
  const urgentQueue = [...visible]
    .filter((j) => j.status !== 'completed' && j.status !== 'cancelled' && (j.priority === 'urgent' || j.priority === 'high'))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 5)

  const activity = buildActivity(visible).slice(0, 8)

  return (
    <div className="space-y-5">
      {loading && <div className="glass p-4 text-xs text-indigo-200/70">Refreshing Nexus Operations data…</div>}
      {error && <div className="glass p-4 text-xs text-rose-300">Unable to load portal operations: {error}</div>}

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="glass-tinted p-6"
      >
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-indigo-200/65">Nexus operations</div>
        <h1 className="mt-2 text-3xl font-semibold text-white tracking-tight">Portal command center</h1>
        <p className="mt-2 text-sm text-indigo-100/75 max-w-3xl">
          Track dispatch throughput, monitor urgent work, and move requests from intake to payment without leaving the portal.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="Active dispatch" value={stats.open} Icon={Briefcase} />
          <MetricTile label="Completed" value={stats.completed} Icon={CheckCircle2} />
          <MetricTile label="Awaiting payment" value={stats.pendingPayment} Icon={Clock} />
          <MetricTile label="Open invoice value" value={formatMoney(stats.pendingInvoiceTotal)} Icon={DollarSign} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" className="btn-primary" onClick={onSubmitRequest}>
            <Plus size={15} />
            Submit request
          </button>
          <button type="button" className="btn-ghost" onClick={onSeeAllJobs}>
            Review full job board <ArrowRight size={13} />
          </button>
        </div>
      </motion.section>

      <section className="glass p-5">
        <SectionTitle
          title="Dispatch pipeline"
          subtitle="Live request counts by workflow stage"
        />
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {pipeline.map((item) => (
            <button
              key={item.status}
              type="button"
              onClick={onSeeAllJobs}
              className="glass-soft p-3 text-left hover:bg-white/10 transition"
            >
              <div className="text-[10px] uppercase tracking-[0.14em] text-indigo-200/55">{item.label}</div>
              <div className="mt-1.5 text-2xl font-semibold text-white">{item.count}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="glass p-5">
        <SectionTitle
          title="Immediate attention queue"
          subtitle="High and urgent jobs requiring action"
        />
        {urgentQueue.length === 0 ? (
          <div className="mt-3 glass-soft p-4 text-xs text-indigo-200/70">
            No high-priority dispatches are open right now.
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {urgentQueue.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => onOpenJob(job.id)}
                className="w-full glass-soft p-3.5 text-left hover:bg-white/10 transition flex items-start gap-3"
              >
                <AlertTriangle size={15} className="mt-0.5 text-amber-300" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{job.title}</div>
                  <div className="text-[11px] text-indigo-200/65 mt-0.5 truncate">
                    #{job.shortId} · {job.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-amber-200">{job.priority}</div>
                  <div className="text-[11px] text-indigo-200/70 mt-0.5">{STATUS_LABEL[job.status]}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="glass p-5">
          <SectionTitle
            title="Recent dispatches"
            subtitle="Latest requests submitted in the portal"
            action={
              <button
                type="button"
                onClick={onSeeAllJobs}
                className="text-xs font-medium text-indigo-300 hover:text-white transition inline-flex items-center gap-1"
              >
                See all <ArrowRight size={12} />
              </button>
            }
          />
          {recent.length === 0 ? (
            <div className="mt-3 glass-soft p-4 text-xs text-indigo-200/70">
              No dispatch records are available yet. Use “Submit request” to create the first operation.
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {recent.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => onOpenJob(job.id)}
                  className="w-full glass-soft p-3 text-left hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{job.title}</div>
                      <div className="text-[11px] text-indigo-200/65 truncate">#{job.shortId} · {job.location}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] uppercase tracking-[0.12em] text-indigo-200/70">{STATUS_LABEL[job.status]}</div>
                      <div className="text-[11px] text-indigo-200/55 mt-0.5">{formatRelative(job.createdAt)}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="glass p-5">
          <SectionTitle
            title="Operational activity"
            subtitle="Most recent timeline events"
          />
          {activity.length === 0 ? (
            <div className="mt-3 glass-soft p-4 text-xs text-indigo-200/70">
              Activity will appear here once dispatches are created.
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {activity.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenJob(item.jobId)}
                  className="w-full glass-soft p-3 text-left hover:bg-white/10 transition"
                >
                  <div className="text-xs text-white leading-snug">{item.text}</div>
                  <div className="text-[10px] text-indigo-200/55 mt-1">{item.when}</div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function MetricTile({
  label,
  value,
  Icon,
}: {
  label: string
  value: number | string
  Icon: React.ComponentType<{ size?: number }>
}) {
  return (
    <div className="glass-soft p-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] uppercase tracking-[0.14em] text-indigo-200/55">{label}</div>
        <Icon size={14} />
      </div>
      <div className="mt-2 text-2xl font-semibold text-white tracking-tight">{value}</div>
    </div>
  )
}

function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
        {subtitle && <div className="text-xs text-indigo-200/60 mt-0.5">{subtitle}</div>}
      </div>
      {action}
    </div>
  )
}

interface ActivityItem {
  id: string
  jobId: string
  text: string
  when: string
}

function buildActivity(jobs: PortalJob[]): ActivityItem[] {
  const items: ActivityItem[] = []
  for (const j of jobs) {
    items.push({
      id: `created-${j.id}`,
      jobId: j.id,
      text: `Request “${j.title}” is ${STATUS_LABEL[j.status].toLowerCase()}`,
      when: formatRelative(j.createdAt),
    })
  }
  return items.sort((a, b) => (a.when > b.when ? 1 : -1))
}

function buildPipeline(jobs: PortalJob[]) {
  return PIPELINE_STATUSES.map((status) => ({
    status,
    label: STATUS_LABEL[status],
    count: jobs.filter((job) => job.status === status).length,
  }))
}

function buildStats(jobs: PortalJob[]) {
  const openJobs = jobs.filter((j) => j.status !== 'completed' && j.status !== 'cancelled')
  const completed = jobs.filter((j) => j.status === 'completed')
  const pendingInvoices = jobs.filter((j) => (j.invoiceAmount ?? 0) > 0 && !j.invoicePaid)
  const pendingInvoiceTotal = pendingInvoices.reduce((sum, job) => sum + (job.invoiceAmount ?? 0), 0)

  return {
    open: openJobs.length,
    completed: completed.length,
    pendingPayment: pendingInvoices.length,
    pendingInvoiceTotal,
  }
}
