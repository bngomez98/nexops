
import { createClient } from '@/lib/supabase/server'
import {
  avatarGradient,
  dbStatusToPortal,
  loadCurrentProfile,
  normalizeCategory,
  normalizePriority,
  normalizeRole,
  parseTitle,
  shortIdFromRequestId,
} from '../shared'

const DEFAULT_DOCS = [
  { id: 'doc-1', title: 'How to submit a maintenance request', tag: 'Guide' },
  { id: 'doc-2', title: 'Stripe payments and invoicing FAQ', tag: 'Billing' },
  { id: 'doc-3', title: 'Contractor onboarding checklist', tag: 'Onboarding' },
  { id: 'doc-4', title: 'Service Level Agreement (SLA) overview', tag: 'Policy' },
  { id: 'doc-5', title: 'Photo upload best practices', tag: 'Guide' },
]

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const currentProfile = (await loadCurrentProfile(supabase, user.id)) as Record<string, unknown> | null
    const currentRole = normalizeRole(currentProfile?.role ?? user.user_metadata?.role)

    let requestQuery = supabase
      .from('service_requests')
      .select(
        'id, owner_id, assigned_contractor_id, category, title, description, additional_notes, address, status, urgency, photo_urls, invoice_amount, invoice_paid, created_at, updated_at, consultation_date',
      )
      .order('created_at', { ascending: false })
      .limit(150)

    if (currentRole !== 'admin') {
      if (currentRole === 'contractor') {
        requestQuery = requestQuery.eq('assigned_contractor_id', user.id)
      } else {
        requestQuery = requestQuery.eq('owner_id', user.id)
      }
    }

    const { data: serviceRequests, error: requestsError } = await requestQuery
    if (requestsError) throw requestsError

    const requestRows = serviceRequests ?? []

    const userIds = new Set<string>([user.id])
    for (const row of requestRows) {
      if (typeof row.owner_id === 'string') userIds.add(row.owner_id)
      if (typeof row.assigned_contractor_id === 'string') userIds.add(row.assigned_contractor_id)
    }

    if (currentRole === 'admin') {
      const { data: contractorRows } = await supabase
        .from('profiles')
        .select('id, user_id')
        .eq('role', 'contractor')
        .eq('is_active', true)
        .limit(100)

      for (const contractor of contractorRows ?? []) {
        if (typeof contractor.id === 'string') userIds.add(contractor.id)
        if (typeof contractor.user_id === 'string') userIds.add(contractor.user_id)
      }
    }

    const ids = Array.from(userIds)
    let profiles: Array<Record<string, unknown>> = []
    if (ids.length > 0) {
      const byId = await supabase
        .from('profiles')
        .select('id, user_id, full_name, email, phone, bio, role, avatar_url, average_rating, reviews_count, service_categories')
        .in('id', ids)

      profiles = (byId.data as Array<Record<string, unknown>> | null) ?? []
      const unresolved = ids.filter((id) => !profiles.some((profile) => profile.id === id || profile.user_id === id))

      if (unresolved.length > 0) {
        const byUserId = await supabase
          .from('profiles')
          .select('id, user_id, full_name, email, phone, bio, role, avatar_url, average_rating, reviews_count, service_categories')
          .in('user_id', unresolved)

        profiles = [...profiles, ...((byUserId.data as Array<Record<string, unknown>> | null) ?? [])]
      }
    }

    const profileByAuthId = new Map<string, Record<string, unknown>>()
    for (const profile of profiles) {
      const authId =
        (typeof profile.id === 'string' ? profile.id : null) ??
        (typeof profile.user_id === 'string' ? profile.user_id : null)
      if (authId) profileByAuthId.set(authId, profile)
    }

    const currentName =
      (typeof currentProfile?.full_name === 'string' && currentProfile.full_name) ||
      (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
      user.email?.split('@')[0] ||
      'User'

    const portalUsers = Array.from(userIds).map((id) => {
      const profile = profileByAuthId.get(id)
      const name = (typeof profile?.full_name === 'string' && profile.full_name) || (id === user.id ? currentName : 'User')
      const email =
        (typeof profile?.email === 'string' && profile.email) ||
        (id === user.id ? user.email ?? '' : '')
      const role = normalizeRole(profile?.role ?? (id === user.id ? currentRole : 'homeowner'))

      return {
        id,
        name,
        email,
        phone: typeof profile?.phone === 'string' ? profile.phone : '',
        role,
        avatarColor: avatarGradient(id),
        initials: name
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((part: string) => part[0]?.toUpperCase() ?? '')
          .join('') || 'U',
        rating: typeof profile?.average_rating === 'number' ? profile.average_rating : undefined,
        jobsCompleted: typeof profile?.reviews_count === 'number' ? profile.reviews_count : undefined,
        serviceCategories: Array.isArray(profile?.service_categories) ? profile.service_categories : [],
      }
    })

    const jobs = requestRows.map((row) => {
      const requestId = String(row.id)
      const ownerId = String(row.owner_id)
      const contractorId = typeof row.assigned_contractor_id === 'string' ? row.assigned_contractor_id : null
      const ownerProfile = profileByAuthId.get(ownerId)
      const ownerName = typeof ownerProfile?.full_name === 'string' ? ownerProfile.full_name : null
      const contractorProfile = contractorId ? profileByAuthId.get(contractorId) : null
      const contractorName = contractorProfile
        ? ((typeof contractorProfile.company === 'string' && contractorProfile.company) ||
           (typeof contractorProfile.full_name === 'string' && contractorProfile.full_name) ||
           null)
        : null
      const photoUrls = Array.isArray(row.photo_urls) ? (row.photo_urls as string[]) : []
      const invoiceAmount = typeof row.invoice_amount === 'number' ? row.invoice_amount : null

      return {
        id: requestId,
        shortId: shortIdFromRequestId(requestId),
        title: parseTitle(row.title ?? row.additional_notes, row.category),
        description: String(row.description ?? ''),
        category: normalizeCategory(row.category),
        priority: normalizePriority(row.urgency),
        status: dbStatusToPortal(row.status),
        rawStatus: String(row.status ?? ''),
        location: String(row.address ?? ''),
        createdAt: String(row.created_at),
        preferredDate: typeof row.consultation_date === 'string' ? row.consultation_date : null,
        ownerId,
        ownerName,
        contractorId,
        contractorName,
        photoUrls,
        invoiceAmount,
        invoicePaid: Boolean(row.invoice_paid ?? false),
        finalCost: null,
      }
    })

    const role = normalizeRole(currentRole)
    const currentUser = portalUsers.find((u) => u.id === user.id) ?? {
      id: user.id,
      name: currentName,
      email: user.email ?? '',
      phone: '',
      role,
      avatarColor: avatarGradient(user.id),
      initials: currentName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part: string) => part[0]?.toUpperCase() ?? '')
        .join('') || 'U',
    }

    return Response.json({
      currentUser,
      users: portalUsers,
      jobs,
      docs: DEFAULT_DOCS,
      preferences: {
        notifyMessages: Boolean(currentProfile?.notify_messages ?? true),
        notifyStatus: Boolean(currentProfile?.notify_status_changes ?? true),
        notifyPayments: Boolean(currentProfile?.notify_payments ?? false),
      },
    })
  } catch (error) {
    console.error('[GET /api/portal/bootstrap]', error)
    return Response.json({ error: 'Unable to load portal data' }, { status: 500 })
  }
}
