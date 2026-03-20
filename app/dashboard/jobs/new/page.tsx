import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'

async function createJob(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const role = profile?.role ?? 'homeowner'

  const payload: Record<string, unknown> = {
    title: formData.get('title'),
    description: formData.get('description') || null,
    priority: formData.get('priority'),
    address: formData.get('address') || null,
    scheduled_date: formData.get('scheduled_date') || null,
    estimated_cost: formData.get('estimated_cost') ? Number(formData.get('estimated_cost')) : null,
  }

  if (role === 'homeowner') payload.owner_id = user.id
  if (role === 'property_manager') payload.property_manager_id = user.id

  await supabase.from('jobs').insert(payload)
  redirect('/dashboard/jobs')
}

export default async function NewJobPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const role = profile?.role ?? 'homeowner'

  if (role === 'contractor') redirect('/dashboard')

  const label = role === 'property_manager' ? 'Work Order' : 'Service Request'

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/jobs" className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f1623] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to jobs
        </Link>
        <h1 className="text-2xl font-bold text-[#0f1623]">New {label}</h1>
        <p className="text-sm text-[#64748b] mt-1">Fill in the details below to submit a new job.</p>
      </div>

      <form action={createJob} className="bg-white border border-[#e2e8f0] rounded-xl p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-[#0f1623]">Job Title <span className="text-red-500">*</span></label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Fix leaking kitchen faucet"
            className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-[#0f1623]">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Describe the issue or scope of work..."
            className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="priority" className="text-sm font-medium text-[#0f1623]">Priority</label>
            <select
              id="priority"
              name="priority"
              className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition bg-white"
            >
              <option value="low">Low</option>
              <option value="normal" selected>Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="scheduled_date" className="text-sm font-medium text-[#0f1623]">Scheduled Date</label>
            <input
              id="scheduled_date"
              name="scheduled_date"
              type="date"
              className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-sm font-medium text-[#0f1623]">Property Address</label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="123 Main St, Topeka, KS"
            className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="estimated_cost" className="text-sm font-medium text-[#0f1623]">Estimated Cost ($)</label>
          <input
            id="estimated_cost"
            name="estimated_cost"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#0f1623] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Submit {label}
          </button>
          <Link
            href="/dashboard/jobs"
            className="px-5 py-2.5 border border-[#e2e8f0] rounded-lg text-sm font-medium text-[#64748b] hover:bg-[#f8f9fb] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
