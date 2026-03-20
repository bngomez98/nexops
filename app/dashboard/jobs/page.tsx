import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getStatusColor, getPriorityColor } from '@/lib/utils'
import { Plus, Briefcase, MapPin, Calendar } from 'lucide-react'
import type { Job, Profile } from '@/lib/types'

export default async function JobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const role = (profile as Pick<Profile, 'role'> | null)?.role ?? 'homeowner'

  let jobs: Job[] = []
  if (role === 'homeowner') {
    const { data } = await supabase.from('jobs').select('*').eq('owner_id', user.id).order('created_at', { ascending: false })
    jobs = data ?? []
  } else if (role === 'property_manager') {
    const { data } = await supabase.from('jobs').select('*').eq('property_manager_id', user.id).order('created_at', { ascending: false })
    jobs = data ?? []
  } else {
    const { data } = await supabase.from('jobs').select('*').eq('contractor_id', user.id).order('created_at', { ascending: false })
    jobs = data ?? []
  }

  const pageTitle = role === 'contractor' ? 'Assigned Jobs' : role === 'property_manager' ? 'Work Orders' : 'My Requests'
  const canCreate = role !== 'contractor'

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1623]">{pageTitle}</h1>
          <p className="text-sm text-[#64748b] mt-1">{jobs.length} total {jobs.length === 1 ? 'job' : 'jobs'}</p>
        </div>
        {canCreate && (
          <Link
            href="/dashboard/jobs/new"
            className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            {role === 'property_manager' ? 'New Work Order' : 'New Request'}
          </Link>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl py-20 text-center">
          <Briefcase className="w-12 h-12 text-[#e2e8f0] mx-auto mb-4" />
          <p className="text-[#64748b] font-medium">No jobs found</p>
          {canCreate && (
            <Link href="/dashboard/jobs/new" className="text-sm text-[#3b82f6] hover:underline mt-2 inline-block">
              Create your first job
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex items-start gap-4 hover:border-[#3b82f6]/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-[#0f1623]">{job.title}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityColor(job.priority)}`}>{job.priority}</span>
                </div>
                {job.description && (
                  <p className="text-sm text-[#64748b] line-clamp-2 leading-relaxed mb-3">{job.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                  {job.address && (
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.address}</span>
                  )}
                  {job.scheduled_date && (
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{job.scheduled_date}</span>
                  )}
                  {job.estimated_cost && (
                    <span className="font-medium text-[#64748b]">${Number(job.estimated_cost).toLocaleString()}</span>
                  )}
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusColor(job.status)}`}>
                {job.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
