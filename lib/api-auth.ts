import type { SupabaseClient, User } from '@supabase/supabase-js'
import { unauthorized, forbidden } from './api-error'

export type AuthenticatedContext = {
  user: User
  supabase: SupabaseClient
  profile: {
    role: string
    id: string
  } | null
}

export type AuthOptions = {
  requireRole?: string | string[]
  allowAnonymous?: boolean
}

/**
 * Authenticates a request and returns the user and supabase client.
 * Returns an error Response if authentication fails or role is not allowed.
 *
 * @example
 * ```ts
 * const auth = await authenticateRequest(supabase)
 * if (auth instanceof Response) return auth
 * const { user, profile } = auth
 * ```
 */
export async function authenticateRequest(
  supabase: SupabaseClient,
  options: AuthOptions = {}
): Promise<AuthenticatedContext | Response> {
  const { requireRole, allowAnonymous = false } = options

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    if (allowAnonymous) {
      return {
        user: null as unknown as User,
        supabase,
        profile: null,
      }
    }
    return unauthorized()
  }

  // Fetch profile for role information
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single()

  // Normalize role (handle property_manager → property-manager mapping)
  const rawRole = profile?.role ?? user.user_metadata?.role ?? 'homeowner'
  const normalizedRole = rawRole === 'property_manager'
    ? 'property-manager'
    : rawRole === 'property_owner'
      ? 'property-owner'
      : rawRole

  // Check role requirements
  if (requireRole) {
    const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole]
    if (!allowedRoles.includes(normalizedRole)) {
      return forbidden(`This endpoint requires one of the following roles: ${allowedRoles.join(', ')}`)
    }
  }

  return {
    user,
    supabase,
    profile: profile ? { ...profile, role: normalizedRole } : null,
  }
}

/**
 * Check if a user has admin role.
 */
export function isAdmin(role: string): boolean {
  return role === 'admin'
}

/**
 * Check if a user is an owner type (homeowner, property-manager, etc.)
 */
export function isOwner(role: string): boolean {
  const ownerRoles = new Set([
    'homeowner',
    'client',
    'property-manager',
    'property-owner',
    'manager',
  ])
  return ownerRoles.has(role)
}

/**
 * Check if a user is a contractor
 */
export function isContractor(role: string): boolean {
  return role === 'contractor'
}
