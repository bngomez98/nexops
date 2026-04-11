'use client'

import { Briefcase, FileText, Search, Tag } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatCategoryLabel } from '../lib/portal-utils'
import { usePortal } from '../lib/portal-context'
import { StatusPill } from '../components/StatusPill'

interface SearchViewProps {
  onOpenJob: (jobId: string) => void
}

const DOCS = [
  { id: 'doc-1', title: 'Homeowner FAQ', tag: 'FAQ', href: '/faq' },
  { id: 'doc-2', title: 'Services overview', tag: 'Services', href: '/services' },
  { id: 'doc-3', title: 'Pricing & billing', tag: 'Billing', href: '/pricing' },
  { id: 'doc-4', title: 'Contact support', tag: 'Support', href: '/contact' },
  { id: 'doc-5', title: 'How it works', tag: 'Guide', href: '/services#how-it-works' },
]

export function SearchView({ onOpenJob }: SearchViewProps) {
  const { jobs } = usePortal()
  const [q, setQ] = useState('')

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    const categoryList = Array.from(new Set(jobs.map((job) => job.category)))
    if (!query) {
      return {
        jobs: jobs.slice(0, 4),
        docs: DOCS.slice(0, 4),
        categories: categoryList,
      }
    }
    return {
      jobs: jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(query) ||
          j.description.toLowerCase().includes(query) ||
          j.location.toLowerCase().includes(query) ||
          j.shortId.includes(query),
      ),
      docs: DOCS.filter((d) => d.title.toLowerCase().includes(query)),
      categories: categoryList.filter((label) => label.toLowerCase().includes(query)),
    }
  }, [q, jobs])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Universal search</h2>
        <p className="text-xs text-indigo-200/60">
          Find jobs, contractors, customers, categories, and documentation in one place.
        </p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-300" />
        <input
          autoFocus
          className="glass-input !pl-12 !py-4 !text-base !rounded-2xl"
          placeholder="Try “leak”, “Diego”, “HVAC”, or a job number…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <ResultGroup
        title="Jobs"
        icon={Briefcase}
        count={results.jobs.length}
        empty="No jobs match."
      >
        <div className="grid sm:grid-cols-2 gap-2.5">
          {results.jobs.map((j) => (
            <button
              type="button"
              key={j.id}
              onClick={() => onOpenJob(j.id)}
              className="glass-soft p-3.5 text-left flex items-start gap-3 hover:bg-white/10 transition"
            >
              <span className={`priority-dot priority-${j.priority} mt-1.5`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{j.title}</div>
                <div className="text-[11px] text-indigo-200/60 truncate">
                  #{j.shortId} · {j.location.split(',')[0]}
                </div>
              </div>
              <StatusPill status={j.status} />
            </button>
          ))}
        </div>
      </ResultGroup>

      <ResultGroup
        title="Categories"
        icon={Tag}
        count={results.categories.length}
        empty="No categories match."
      >
        <div className="flex flex-wrap gap-1.5">
          {results.categories.map((label) => (
            <span
              key={label}
              className="text-[11px] rounded-full px-3 py-1.5 bg-white/5 border border-white/10 text-indigo-100"
            >
              {formatCategoryLabel(label)}
            </span>
          ))}
        </div>
      </ResultGroup>

      <ResultGroup
        title="Documentation"
        icon={FileText}
        count={results.docs.length}
        empty="No docs match."
      >
        <div className="grid sm:grid-cols-2 gap-2.5">
          {results.docs.map((d) => (
            <a
              key={d.id}
              href={d.href}
              className="glass-soft p-3 flex items-center gap-3 hover:bg-white/10 transition"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500/40 to-sky-500/30 border border-white/10 flex items-center justify-center">
                <FileText size={15} className="text-indigo-100" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-white truncate">{d.title}</div>
                <div className="text-[10px] uppercase tracking-wider text-indigo-200/55">{d.tag}</div>
              </div>
            </a>
          ))}
        </div>
      </ResultGroup>
    </div>
  )
}

function ResultGroup({
  title,
  icon: Icon,
  count,
  empty,
  children,
}: {
  title: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  count: number
  empty: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 text-indigo-200/80">
          <Icon size={14} />
          <span className="text-[10.5px] font-mono uppercase tracking-wider">
            {title}
          </span>
          <span className="text-[10.5px] text-indigo-200/40">{count}</span>
        </div>
      </div>
      {count === 0 ? (
        <div className="glass-soft p-4 text-xs text-indigo-200/50">{empty}</div>
      ) : (
        children
      )}
    </section>
  )
}
