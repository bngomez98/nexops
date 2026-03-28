import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { appendRequestMetadata } from '@/lib/utils'

async function createJob(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const role = profile?.role ?? 'homeowner'

  const title = String(formData.get('title') ?? '').trim()
  const scheduledDate = String(formData.get('scheduled_date') ?? '').trim()

  if (!title) redirect('/dashboard/jobs/new?error=title_required')
  if (!scheduledDate) redirect('/dashboard/jobs/new?error=scheduled_date_required')

  const description = String(formData.get('description') ?? '').trim() || null
  const trackingId = `REQ-${Date.now().toString().slice(-8)}`

  const payload: Record<string, unknown> = {
    title,
    description: appendRequestMetadata(description, {
      pipeline_stage: String(formData.get('pipeline_stage') ?? 'triage'),
      focus_areas: String(formData.get('focus_areas') ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      tracking_id: trackingId,
      service_window: String(formData.get('service_window') ?? 'standard'),
      billing_notes: String(formData.get('billing_notes') ?? '').trim(),
      community_notes: String(formData.get('community_notes') ?? '').trim(),
    }),
    priority: formData.get('priority'),
    address: formData.get('address') || null,
    scheduled_date: scheduledDate,
    estimated_cost: formData.get('estimated_cost') ? Number(formData.get('estimated_cost')) : null,
  }

  if (role === 'homeowner') payload.owner_id = user.id
  if (role === 'property_manager') payload.property_manager_id = user.id

  const { error } = await supabase.from('jobs').insert(payload)

  if (error) {
    redirect(`/dashboard/jobs/new?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/dashboard/jobs')
}

export default async function NewJobPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const role = profile?.role ?? 'homeowner'

  if (role === 'contractor') redirect('/dashboard')

  const label = role === 'property_manager' ? 'Work Order' : 'Service Request'
  const params = await searchParams

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link href="/dashboard/jobs" className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f1623] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to jobs
        </Link>
        <h1 className="text-2xl font-bold text-[#0f1623]">New {label}</h1>
        <p className="text-sm text-[#64748b] mt-1">Automate service workflows, matching, tracking, documentation, and billing from one request.</p>
      </div>

      <form action={createJob} className="bg-white border border-[#e2e8f0] rounded-xl p-6 flex flex-col gap-5">
        {params.error && (
          <div className="flex items-start gap-2 text-sm text-red-700 border border-red-200 bg-red-50 px-4 py-3 rounded-lg">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <span>{decodeURIComponent(params.error).replaceAll('_', ' ')}</span>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-[#0f1623]">Request Title <span className="text-red-500">*</span></label>
          <input id="title" name="title" type="text" required placeholder="e.g. Community roof leak coordination" className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-[#0f1623]">Description</label>
          <textarea id="description" name="description" rows={4} placeholder="Describe scope, service context, and any requested outcomes..." className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="priority" className="text-sm font-medium text-[#0f1623]">Priority</label>
            <select id="priority" name="priority" defaultValue="normal" className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition bg-white">
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="scheduled_date" className="text-sm font-medium text-[#0f1623]">Required Service Date <span className="text-red-500">*</span></label>
            <input id="scheduled_date" name="scheduled_date" type="date" required className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pipeline_stage" className="text-sm font-medium text-[#0f1623]">Pipeline Stage</label>
            <select id="pipeline_stage" name="pipeline_stage" defaultValue="triage" className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition bg-white">
              <option value="triage">Triage</option>
              <option value="matching">Contractor Matching</option>
              <option value="dispatch">Dispatch & Handling</option>
              <option value="documenting">Documentation & Verification</option>
              <option value="billing">Billing & Settlement</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="service_window" className="text-sm font-medium text-[#0f1623]">Service Window</label>
            <select id="service_window" name="service_window" defaultValue="standard" className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition bg-white">
              <option value="standard">Standard</option>
              <option value="rush">Rush</option>
              <option value="after_hours">After Hours</option>
              <option value="community_priority">Community Priority</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="focus_areas" className="text-sm font-medium text-[#0f1623]">Focus Areas (Unlimited)</label>
          <input id="focus_areas" name="focus_areas" type="text" placeholder="tracking, handling, matching, documenting, billing, data-collection, etc." className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition" />
          <p className="text-xs text-[#94a3b8]">Use comma-separated tags. There is no category cap.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="address" className="text-sm font-medium text-[#0f1623]">Property / Service Address</label>
            <input id="address" name="address" type="text" placeholder="123 Main St, Topeka, KS" className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="estimated_cost" className="text-sm font-medium text-[#0f1623]">Estimated Cost ($)</label>
            <input id="estimated_cost" name="estimated_cost" type="number" min="0" step="0.01" placeholder="0.00" className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="community_notes" className="text-sm font-medium text-[#0f1623]">Community Handling Notes</label>
            <textarea id="community_notes" name="community_notes" rows={3} placeholder="Resident communication, approvals, and service-community coordination notes..." className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition resize-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="billing_notes" className="text-sm font-medium text-[#0f1623]">Billing & Documentation Notes</label>
            <textarea id="billing_notes" name="billing_notes" rows={3} placeholder="PO references, invoice routing, expected billing logic..." className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition resize-none" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold py-2.5 rounded-lg transition-colors">
            Submit {label}
          </button>
          <Link href="/dashboard/jobs" className="px-5 py-2.5 border border-[#e2e8f0] rounded-lg text-sm font-medium text-[#64748b] hover:bg-[#f8f9fb] transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
