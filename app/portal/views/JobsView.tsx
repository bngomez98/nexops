'use client'

import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  CATEGORY_LABEL,
  STATUS_LABEL,
  type Category,
  type JobStatus,
} from '../lib/portal-types'
import { usePortal } from '../lib/portal-context'
import { JobCard } from '../components/JobCard'

interface JobsViewProps {
  onSubmitRequest: () => void
  onOpenJob: (jobId: string) => void
}

const STATUS_FILTERS: ('all' | JobStatus)[] = ['all', 'pending', 'assigned', 'in_progress', 'complete']
const CATEGORY_FILTERS: ('all' | Category)[] = [
  'all',
  'plumbing',
  'electrical',
  'hvac',
  'landscaping',
  'cleaning',
  'handyman',
  'other',
]

export function JobsView({ onSubmitRequest, onOpenJob }: JobsViewProps) {
  const { jobs, currentUser } = usePortal()
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>('all')
  const [categoryFilter, setCategoryFilter] =
    useState<(typeof CATEGORY_FILTERS)[number]>('all')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    return jobs.filter((j) => {
      if (currentUser.role === 'contractor' && j.contractorId !== currentUser.id) return false
      if (
        currentUser.role !== 'admin' &&
        currentUser.role !== 'contractor' &&
        j.homeownerId !== currentUser.id
      )
        return false
      if (statusFilter !== 'all' && j.status !== statusFilter) return false
      if (categoryFilter !== 'all' && j.category !== categoryFilter) return false
      if (query.trim()) {
        const q = query.toLowerCase()
        if (
          !j.title.toLowerCase().includes(q) &&
          !j.description.toLowerCase().includes(q) &&
          !j.location.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [jobs, currentUser, statusFilter, categoryFilter, query])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Jobs</h2>
          <p className="text-xs text-indigo-200/60">
            {visible.length} {visible.length === 1 ? 'job' : 'jobs'} matching your filters
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={onSubmitRequest}>
          <Plus size={15} />
          New request
        </button>
      </div>

      <div className="glass-soft p-3">
        <div className="relative mb-3">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/70" />
          <input
            className="glass-input pl-11"
            placeholder="Search by title, description, address…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {STATUS_FILTERS.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-[11px] rounded-full px-3 py-1.5 border transition ${
                statusFilter === s
                  ? 'bg-gradient-to-br from-indigo-500/40 to-sky-500/30 border-indigo-300/50 text-white'
                  : 'bg-white/5 border-white/10 text-indigo-200/70 hover:bg-white/10'
              }`}
            >
              {s === 'all' ? 'All statuses' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_FILTERS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`text-[11px] rounded-full px-3 py-1.5 border transition ${
                categoryFilter === c
                  ? 'bg-white/15 border-white/30 text-white'
                  : 'bg-white/5 border-white/10 text-indigo-200/70 hover:bg-white/10'
              }`}
            >
              {c === 'all' ? 'All categories' : CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.length === 0 && (
          <div className="glass p-8 col-span-full text-center text-sm text-indigo-200/60">
            No jobs match these filters yet.
          </div>
        )}
        {visible.map((j, idx) => (
          <JobCard key={j.id} job={j} index={idx} onOpen={onOpenJob} />
        ))}
      </div>
    </div>
  )
}
