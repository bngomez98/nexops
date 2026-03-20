import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HomeownerDashboard from '@/components/dashboards/homeowner-dashboard'
import PropertyManagerDashboard from '@/components/dashboards/property-manager-dashboard'
import ContractorDashboard from '@/components/dashboards/contractor-dashboard'
import type { Profile, Job } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch jobs based on role
  let jobs: Job[] = []
  if (profile?.role === 'homeowner') {
    const { data } = await supabase.from('jobs').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }).limit(5)
    jobs = data ?? []
  } else if (profile?.role === 'property_manager') {
    const { data } = await supabase.from('jobs').select('*').eq('property_manager_id', user.id).order('created_at', { ascending: false }).limit(5)
    jobs = data ?? []
  } else if (profile?.role === 'contractor') {
    const { data } = await supabase.from('jobs').select('*').eq('contractor_id', user.id).order('created_at', { ascending: false }).limit(5)
    jobs = data ?? []
  }

  const role = profile?.role ?? 'homeowner'

  if (role === 'property_manager') {
    return <PropertyManagerDashboard profile={profile as Profile} jobs={jobs} />
  }
  if (role === 'contractor') {
    return <ContractorDashboard profile={profile as Profile} jobs={jobs} />
  }
  return <HomeownerDashboard profile={profile as Profile} jobs={jobs} />
}
