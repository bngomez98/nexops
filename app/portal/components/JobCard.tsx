'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin } from 'lucide-react'
import {
  CATEGORY_LABEL,
  PRIORITY_LABEL,
  formatRelative,
  type Job,
} from '../lib/portal-types'
import { usePortal } from '../lib/portal-context'
import { StatusPill } from './StatusPill'
import { Avatar } from './Avatar'

interface JobCardProps {
  job: Job
  index?: number
  onOpen?: (jobId: string) => void
}

export function JobCard({ job, index = 0, onOpen }: JobCardProps) {
  const { users } = usePortal()
  const contractor = users.find((u) => u.id === job.contractorId)

  return (
    <motion.button
      type="button"
      onClick={() => onOpen?.(job.id)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      className="glass w-full text-left p-5 cursor-pointer block"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className={`priority-dot priority-${job.priority}`} aria-hidden />
          <span className="text-[10.5px] font-mono uppercase tracking-wider text-indigo-200/70">
            #{job.shortId} · {CATEGORY_LABEL[job.category]}
          </span>
        </div>
        <StatusPill status={job.status} />
      </div>

      <h3 className="text-base font-semibold text-white leading-tight mb-1.5">
        {job.title}
      </h3>
      <p className="text-xs text-indigo-100/60 line-clamp-2 mb-4">
        {job.description}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-indigo-200/70">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={12} />
          {job.location.split(',')[0]}
        </span>
        {(contractor || job.contractorName) && (
          <span className="inline-flex items-center gap-1.5">
            {contractor && <Avatar user={contractor} size={18} />}
            {(contractor?.name ?? job.contractorName ?? '').split(' ')[0]}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={12} />
          {formatRelative(job.createdAt)}
        </span>
        <span className="ml-auto text-indigo-200/50">
          {PRIORITY_LABEL[job.priority]}
        </span>
      </div>
    </motion.button>
  )
}
