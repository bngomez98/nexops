import type { SupabaseClient } from '@supabase/supabase-js'

type AnyObj = Record<string, unknown>

const PORTAL_ROLES = new Set(['homeowner', 'contractor', 'admin', 'manager'])

export function normalizeRole(value: unknown): 'homeowner' | 'contractor' | 'admin' | 'manager' {
  if (value === 'property_manager') return 'manager'
  if (typeof value === 'string' && PORTAL_ROLES.has(value)) return value as 'homeowner' | 'contractor' | 'admin' | 'manager'
  return 'homeowner'
}

export function normalizeCategory(value: unknown): 'plumbing' | 'electrical' | 'hvac' | 'landscaping' | 'cleaning' | 'handyman' | 'other' {
  const category = typeof value === 'string' ? value.toLowerCase() : ''
  if (category === 'plumbing') return 'plumbing'
  if (category === 'electrical') return 'electrical'
  if (category === 'hvac') return 'hvac'
  if (category === 'landscaping') return 'landscaping'
  if (category === 'cleaning') return 'cleaning'
  if (category === 'handyman') return 'handyman'
  return 'other'
}

export function normalizePriority(value: unknown): 'low' | 'normal' | 'high' | 'urgent' {
  const urgency = typeof value === 'string' ? value.toLowerCase() : ''
  if (urgency === 'urgent' || urgency === 'emergency') return 'urgent'
  if (urgency === 'high') return 'high'
  if (urgency === 'low') return 'low'
  return 'normal'
}

export function dbStatusToPortal(value: unknown): 'pending' | 'assigned' | 'in_progress' | 'complete' {
  const status = typeof value === 'string' ? value.toLowerCase() : ''
  if (status === 'assigned') return 'assigned'
  if (status === 'consultation_scheduled' || status === 'in_progress') return 'in_progress'
  if (status === 'completed') return 'complete'
  return 'pending'
}

export function portalStatusToDb(value: unknown): 'pending_review' | 'assigned' | 'in_progress' | 'completed' {
  const status = typeof value === 'string' ? value.toLowerCase() : ''
  if (status === 'assigned') return 'assigned'
  if (status === 'in_progress') return 'in_progress'
  if (status === 'complete' || status === 'completed') return 'completed'
  return 'pending_review'
}

export function parseTitle(additionalNotes: unknown, fallbackCategory: unknown) {
  const fallback = typeof fallbackCategory === 'string' && fallbackCategory.trim() ? fallbackCategory : 'Service request'
  if (typeof additionalNotes !== 'string' || !additionalNotes.trim()) return fallback
  const [firstLine] = additionalNotes.split('\n')
  return firstLine?.trim() || fallback
}

export function shortIdFromRequestId(id: string) {
  if (!id) return 'n/a'
  const first = id.split('-')[0]
  return (first || id).slice(0, 8)
}

export function avatarGradient(seed: string) {
  const options = [
    'from-indigo-400 to-blue-500',
    'from-sky-400 to-cyan-500',
    'from-fuchsia-400 to-pink-500',
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-violet-400 to-indigo-500',
    'from-rose-400 to-red-500',
  ]
  const hash = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return options[hash % options.length]
}

export async function loadCurrentProfile(supabase: SupabaseClient<AnyObj>, userId: string) {
  const byId = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (byId.data) return byId.data

  const byUserId = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  return byUserId.data
}
