import Link from 'next/link'
import { Briefcase, Clock, CheckCircle, AlertCircle, Plus, ArrowRight } from 'lucide-react'
import { getStatusColor, getPriorityColor } from '@/lib/utils'
import type { Profile, Job } from '@/lib/types'

export default function HomeownerDashboard({ profile, jobs }: { profile: Profile | null; jobs: Job[] }) {
  const pending = jobs.filter(j => j.status === 'pending').length
  const inProgress = jobs.filter(j => j.status === 'in_progress').length
  const completed = jobs.filter(j => j.status === 'completed').length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1623]">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-[#64748b] text-sm mt-1">Here&apos;s the status of your home service requests.</p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Request
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'In Progress', value: inProgress, icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
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

      {/* Recent jobs */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="font-semibold text-[#0f1623]">Recent Requests</h2>
          <Link href="/dashboard/jobs" className="text-sm text-[#3b82f6] hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {jobs.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Briefcase className="w-10 h-10 text-[#e2e8f0] mx-auto mb-3" />
            <p className="text-[#64748b] text-sm">No service requests yet.</p>
            <Link href="/dashboard/jobs/new" className="text-[#3b82f6] text-sm hover:underline mt-1 inline-block">Submit your first request</Link>
          </div>
        ) : (
          <ul className="divide-y divide-[#e2e8f0]">
            {jobs.map(job => (
              <li key={job.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#f8f9fb] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#0f1623] text-sm truncate">{job.title}</p>
                  {job.address && <p className="text-xs text-[#64748b] truncate mt-0.5">{job.address}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityColor(job.priority)}`}>{job.priority}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(job.status)}`}>{job.status.replace('_', ' ')}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
