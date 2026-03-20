import Link from 'next/link'
import { Briefcase, Clock, CheckCircle, AlertCircle, Plus, ArrowRight, Building2 } from 'lucide-react'
import { getStatusColor, getPriorityColor } from '@/lib/utils'
import type { Profile, Job } from '@/lib/types'

export default function PropertyManagerDashboard({ profile, jobs }: { profile: Profile | null; jobs: Job[] }) {
  const pending = jobs.filter(j => j.status === 'pending').length
  const inProgress = jobs.filter(j => j.status === 'in_progress').length
  const completed = jobs.filter(j => j.status === 'completed').length
  const urgent = jobs.filter(j => j.priority === 'urgent').length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-[#3b82f6]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#64748b]">Property Manager</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f1623]">
            {profile?.full_name ? `${profile.full_name.split(' ')[0]}'s Portfolio` : 'Portfolio Overview'}
          </h1>
          <p className="text-[#64748b] text-sm mt-1">Manage work orders across all your properties.</p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Work Order
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Orders', value: jobs.length, icon: Briefcase, color: 'text-[#3b82f6]', bg: 'bg-blue-50' },
          { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'In Progress', value: inProgress, icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Urgent', value: urgent, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
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

      {/* Work orders */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="font-semibold text-[#0f1623]">Active Work Orders</h2>
          <Link href="/dashboard/jobs" className="text-sm text-[#3b82f6] hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {jobs.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Briefcase className="w-10 h-10 text-[#e2e8f0] mx-auto mb-3" />
            <p className="text-[#64748b] text-sm">No work orders yet.</p>
            <Link href="/dashboard/jobs/new" className="text-[#3b82f6] text-sm hover:underline mt-1 inline-block">Create your first work order</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#64748b] border-b border-[#e2e8f0]">
                  <th className="px-6 py-3 font-medium">Job</th>
                  <th className="px-6 py-3 font-medium">Property</th>
                  <th className="px-6 py-3 font-medium">Priority</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Scheduled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-[#f8f9fb] transition-colors">
                    <td className="px-6 py-3.5 font-medium text-[#0f1623] max-w-[200px] truncate">{job.title}</td>
                    <td className="px-6 py-3.5 text-[#64748b] max-w-[160px] truncate">{job.address ?? '—'}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityColor(job.priority)}`}>{job.priority}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(job.status)}`}>{job.status.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-3.5 text-[#64748b]">{job.scheduled_date ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
