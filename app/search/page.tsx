import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SearchClient } from './search-client'

export const metadata: Metadata = {
  title: 'Search — Nexus Operations',
  description: 'Search for requests, properties, and contractors across the Nexus Operations platform.',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tab?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { q = '', tab = 'requests' } = await searchParams
  const query = q.trim()

  // Run queries in parallel
  const [requestsResult, propertiesResult, contractorsResult] = await Promise.all([
    query.length >= 2
      ? supabase
          .from('requests')
          .select('id, title, description, status, created_at, property_id')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .order('created_at', { ascending: false })
          .limit(20)
      : Promise.resolve({ data: [], error: null }),

    query.length >= 2
      ? supabase
          .from('properties')
          .select('id, name, address, city, state, property_type')
          .or(`name.ilike.%${query}%,address.ilike.%${query}%`)
          .order('name', { ascending: true })
          .limit(20)
      : Promise.resolve({ data: [], error: null }),

    query.length >= 2
      ? supabase
          .from('profiles')
          .select('id, full_name, email, photo_url, trade_categories, bio')
          .eq('role', 'contractor')
          .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
          .order('full_name', { ascending: true })
          .limit(20)
      : Promise.resolve({ data: [], error: null }),
  ])

  return (
    <SearchClient
      initialQuery={query}
      initialTab={tab}
      requests={requestsResult.data ?? []}
      properties={propertiesResult.data ?? []}
      contractors={contractorsResult.data ?? []}
    />
  )
}
