import Link from 'next/link'
import { Briefcase, Clock, CheckCircle, HardHat, ArrowRight, MapPin, Calendar } from 'lucide-react'
import { getStatusColor, getPriorityColor } from '@/lib/utils'
import type { Profile, Job } from '@/lib/types'

export default function ContractorDashboard({ profile, jobs }: { profile: Profile | null; jobs: Job[] }) {
  const pending = jobs.filter(j => j.status === 'pending').length
  const inProgress = jobs.filter(j => j.status === 'in_progress').length
  const completed = jobs.filter(j => j.status === 'completed').length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HardHat className="w-5 h-5 text-[#3b82f6]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#64748b]">Contractor</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f1623]">
            {profile?.full_name ? `${profile.full_name.split(' ')[0]}'s Jobs` : 'My Jobs'}
          </h1>
          <p className="text-[#64748b] text-sm mt-1">
            {profile?.trade_specialty ? `${profile.trade_specialty} · ` : ''}
            {profile?.license_number ? `License #${profile.license_number}` : 'Your assigned work orders'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Awaiting Start', value: pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'In Progress', value: inProgress, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 ${bg} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0f1623]">{value}</p>
              <p className="text-sm text-[#64748b]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Assigned jobs as cards */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="font-semibold text-[#0f1623]">Assigned Jobs</h2>
          <Link href="/dashboard/jobs" className="text-sm text-[#3b82f6] hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {jobs.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <HardHat className="w-10 h-10 text-[#e2e8f0] mx-auto mb-3" />
            <p className="text-[#64748b] text-sm">No jobs assigned yet.</p>
            <p className="text-xs text-[#94a3b8] mt-1">Your assigned work orders will appear here.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 p-6">
            {jobs.map(job => (
              <div key={job.id} className="border border-[#e2e8f0] rounded-lg p-4 hover:border-[#3b82f6]/40 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="font-semibold text-[#0f1623] text-sm leading-tight">{job.title}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${getPriorityColor(job.priority)}`}>{job.priority}</span>
                </div>
                {job.description && (
                  <p className="text-xs text-[#64748b] mb-3 line-clamp-2 leading-relaxed">{job.description}</p>
                )}
                <div className="flex flex-col gap-1.5 text-xs text-[#64748b]">
                  {job.address && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      <span>{job.address}</span>
                    </div>
                  )}
                  {job.scheduled_date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{job.scheduled_date}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-[#e2e8f0]">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(job.status)}`}>
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
