'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
  Users,
} from 'lucide-react'
import {
  STATUS_LABEL,
  formatRelative,
  type PortalJob,
} from '../lib/portal-utils'
  dashboardStatsForJobs,
  formatRelative,
  STATUS_LABEL,
  type Job,
} from '../lib/portal-types'
import { usePortal } from '../lib/portal-context'
import { JobCard } from '../components/JobCard'
import { StatsArc } from '../components/StatsArc'

interface DashboardViewProps {
  onSubmitRequest: () => void
  onOpenJob: (jobId: string) => void
  onSeeAllJobs: () => void
}

export function DashboardView({
  onSubmitRequest,
  onOpenJob,
  onSeeAllJobs,
}: DashboardViewProps) {
  const { currentUser, jobs, loading, error } = usePortal()
  const visible = jobs.filter((j) => {
    if (currentUser.role === 'admin' || currentUser.role === 'property-manager' || currentUser.role === 'manager') return true
    if (currentUser.role === 'contractor') return j.contractorId === currentUser.id || j.status === 'open'
    return j.ownerId === currentUser.id
  })
  const stats = buildStats(visible)
  const stats = dashboardStats(jobs, currentUser.id, currentUser.role)
  const stats = dashboardStatsForJobs(visible)
  const recent = [...visible]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4)
  const activity = buildActivity(visible).slice(0, 5)

  return (
    <div className="space-y-6">
      {loading && (
        <div className="glass p-4 text-xs text-indigo-200/70">Loading live operations data…</div>
      )}
      {error && (
        <div className="glass p-4 text-xs text-rose-300">Failed to load portal data: {error}</div>
      )}
      {/* Hero stats card */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass-tinted p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />

        <div className="relative grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center">
          <div className="flex justify-center">
            <StatsArc
              completionRate={stats.completionRate}
              open={stats.open}
              completed={stats.completed}
            />
          </div>

          <div>
            <div className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/70 mb-2">
              Live operations
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-[1.05]">
              Every property,
              <br />
              <span className="text-glow">handled in one place.</span>
            </h1>
            <p className="text-sm text-indigo-100/70 mt-3 max-w-md leading-relaxed">
              Submit a request, watch it move from pending to complete, and pay invoices
              without ever leaving the app.
            </p>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2">
              <StatBlock label="Open" value={stats.open} Icon={Briefcase} accent="from-indigo-400 to-sky-400" />
              <StatBlock label="Completed" value={stats.completed} Icon={CheckCircle2} accent="from-emerald-400 to-teal-400" />
              <StatBlock label="Awaiting pay" value={stats.pendingPayment} Icon={Clock} accent="from-amber-400 to-orange-400" />
              <StatBlock label="Active pros" value={stats.activeContractors} Icon={Users} accent="from-violet-400 to-fuchsia-400" />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" className="btn-primary" onClick={onSubmitRequest}>
                <Plus size={16} />
                Submit a request
              </button>
              <button type="button" className="btn-ghost" onClick={onSeeAllJobs}>
                View all jobs <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Recent jobs + activity */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <section>
          <SectionHeader
            title="Recent jobs"
            subtitle="The latest activity across your properties"
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
          <div className="grid sm:grid-cols-2 gap-3">
            {recent.length === 0 && (
              <div className="glass p-6 text-sm text-indigo-200/60 col-span-2 text-center">
                No jobs yet — submit one to get started.
              </div>
            )}
            {recent.map((j, idx) => (
              <JobCard key={j.id} job={j} index={idx} onOpen={onOpenJob} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            title="Activity"
            subtitle="Real-time updates"
            action={
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            }
          />
          <div className="glass p-2">
            {activity.length === 0 && (
              <div className="px-3 py-8 text-xs text-indigo-200/50 text-center">
                Nothing new yet.
              </div>
            )}
            {activity.map((a, idx) => (
              <motion.button
                type="button"
                key={a.id}
                onClick={() => onOpenJob(a.jobId)}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.06 }}
                className="w-full text-left flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition"
              >
                <div className="mt-0.5">
                  <Sparkles size={16} className="text-indigo-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white leading-snug">{a.text}</div>
                  <div className="text-[10px] text-indigo-200/50 mt-0.5">{a.when}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function StatBlock({
  label,
  value,
  Icon,
  accent,
}: {
  label: string
  value: number
  Icon: React.ComponentType<{ size?: number }>
  accent: string
}) {
  return (
    <div className="glass-soft p-3">
      <div className={`h-7 w-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${accent} text-white shadow-md`}>
        <Icon size={14} />
      </div>
      <div className="mt-2 text-xl font-semibold text-white tracking-tight">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-indigo-200/60">{label}</div>
    </div>
  )
}

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-end justify-between mb-3 px-1">
      <div>
        <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
        {subtitle && <div className="text-xs text-indigo-200/60">{subtitle}</div>}
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
      text: `New request “${j.title}” — ${STATUS_LABEL[j.status]}`,
      when: formatRelative(j.createdAt),
    })
  }
  return items.sort((a, b) => (a.when > b.when ? 1 : -1))
}

function buildStats(jobs: PortalJob[]) {
  const openJobs = jobs.filter((j) => j.status !== 'completed' && j.status !== 'cancelled')
  const completed = jobs.filter((j) => j.status === 'completed')
  const pendingPayment = jobs.filter((j) => j.invoiceAmount && !j.invoicePaid).length
  const total = jobs.length || 1
  const completionRate = Math.round((completed.length / total) * 100)
  const activeContractors = new Set(
    openJobs.filter((j) => j.contractorId).map((j) => j.contractorId),
  ).size
  return {
    open: openJobs.length,
    completed: completed.length,
    pendingPayment,
    completionRate,
    activeContractors,
  }
}
