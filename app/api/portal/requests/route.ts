import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { dbStatusToPortal, normalizeCategory, normalizePriority, parseTitle, shortIdFromRequestId } from '../shared'

function toUrgency(priority: unknown) {
  const normalized = normalizePriority(priority)
  if (normalized === 'urgent') return 'urgent'
  if (normalized === 'high') return 'high'
  if (normalized === 'low') return 'low'
  return 'routine'
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const description = typeof body.description === 'string' ? body.description.trim() : ''
    const location = typeof body.location === 'string' ? body.location.trim() : ''

    if (!title || !description || !location) {
      return NextResponse.json(
        { error: 'title, description, and location are required' },
        { status: 400 },
      )
    }

    const { data: created, error: insertError } = await supabase
      .from('service_requests')
      .insert({
        owner_id: user.id,
        category: normalizeCategory(body.category),
        title,
        description,
        additional_notes: title,
        address: location,
        city: 'Topeka',
        state: 'KS',
        zip_code: '66603',
        urgency: toUrgency(body.priority),
        status: 'pending_review',
      })
      .select('id, owner_id, assigned_contractor_id, category, title, description, additional_notes, address, status, urgency, created_at')
      .single()

    if (insertError) throw insertError

    const requestId = String(created.id)

    return NextResponse.json(
      {
        job: {
          id: requestId,
          shortId: shortIdFromRequestId(requestId),
          title: parseTitle(created.title ?? created.additional_notes, created.category),
          description: String(created.description ?? ''),
          category: normalizeCategory(created.category),
          priority: normalizePriority(created.urgency),
          status: dbStatusToPortal(created.status),
          location: String(created.address ?? ''),
          createdAt: String(created.created_at),
          homeownerId: String(created.owner_id),
          contractorId:
            typeof created.assigned_contractor_id === 'string'
              ? created.assigned_contractor_id
              : undefined,
          photos: [],
          messages: [],
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('[POST /api/portal/requests]', error)
    return NextResponse.json({ error: 'Unable to create request' }, { status: 500 })
  }
}
