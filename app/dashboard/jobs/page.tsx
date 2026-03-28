import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getStatusColor, getPriorityColor, parseRequestMetadata } from '@/lib/utils'
import { Plus, Briefcase, MapPin, Calendar, AlertCircle, Workflow } from 'lucide-react'
import type { Job, Profile } from '@/lib/types'

export default async function JobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const role = (profile as Pick<Profile, 'role'> | null)?.role ?? 'homeowner'

  let jobs: Job[] = []
  let loadError = ''

  if (role === 'homeowner') {
    const { data, error } = await supabase.from('jobs').select('*').eq('owner_id', user.id).order('created_at', { ascending: false })
    jobs = data ?? []
    loadError = error?.message ?? ''
  } else if (role === 'property_manager') {
    const { data, error } = await supabase.from('jobs').select('*').eq('property_manager_id', user.id).order('created_at', { ascending: false })
    jobs = data ?? []
    loadError = error?.message ?? ''
  } else {
    const { data, error } = await supabase.from('jobs').select('*').eq('contractor_id', user.id).order('created_at', { ascending: false })
    jobs = data ?? []
    loadError = error?.message ?? ''
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
          <Link href="/dashboard/jobs/new" className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            {role === 'property_manager' ? 'New Work Order' : 'New Request'}
          </Link>
        )}
      </div>

      {loadError && (
        <div className="mb-5 flex items-start gap-2 text-sm text-red-700 border border-red-200 bg-red-50 px-4 py-3 rounded-lg">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <span>Unable to load all requests: {loadError}</span>
        </div>
      )}

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
          {jobs.map(job => {
            const { plainDescription, metadata } = parseRequestMetadata(job.description)

            return (
              <div key={job.id} className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex items-start gap-4 hover:border-[#3b82f6]/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-[#0f1623]">{job.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityColor(job.priority)}`}>{job.priority}</span>
                    {metadata?.pipeline_stage && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 inline-flex items-center gap-1">
                        <Workflow className="w-3 h-3" />
                        {metadata.pipeline_stage.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  {plainDescription && <p className="text-sm text-[#64748b] line-clamp-2 leading-relaxed mb-2">{plainDescription}</p>}
                  <div className="flex items-center gap-4 text-xs text-[#94a3b8] flex-wrap">
                    {job.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.address}</span>}
                    {job.scheduled_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{job.scheduled_date}</span>}
                    {job.estimated_cost && <span className="font-medium text-[#64748b]">${Number(job.estimated_cost).toLocaleString()}</span>}
                    {metadata?.tracking_id && <span className="font-medium text-[#334155]">{metadata.tracking_id}</span>}
                  </div>
                  {metadata?.focus_areas && metadata.focus_areas.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {metadata.focus_areas.map((area) => (
                        <span key={area} className="text-[11px] rounded-full px-2 py-0.5 bg-slate-100 text-slate-700">#{area}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusColor(job.status)}`}>
                  {job.status.replace('_', ' ')}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
