import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { projectRequestSchema } from '@/lib/validators'
import { buildPipelineSnapshot, serializePipelineSnapshot } from '@/lib/request-pipeline'

// Custom categories are stored as URL-safe slugs so they can flow through the
// same matching, filtering, and analytics paths as predefined categories.
function normalizeCategory(category: string, customCategory?: string) {
  if (category !== 'other') return category

  const normalized = (customCategory ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || 'other'
}

function toConsultationDate(value: string) {
  return value.includes('T') ? value : `${value}T00:00:00Z`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? user.user_metadata?.role ?? 'homeowner'
    if (role !== 'homeowner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Accept both JSON and FormData
    const contentType = request.headers.get('content-type') ?? ''
    let category = 'open-request', customCategory = '', title = '', description = '', location = '', budget = '', preferredDate = ''
let pipelineMode: 'standard' | 'automated' | 'community' = 'automated'
let communityVisible = true
let accessRequirements = ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      category    = String(formData.get('category') ?? '')
      customCategory = String(formData.get('customCategory') ?? '')
      title       = String(formData.get('title') ?? '')
      description = String(formData.get('description') ?? '')
      location    = String(formData.get('location') ?? '')
      budget      = String(formData.get('budget') ?? '')
      preferredDate = String(formData.get('preferredDate') ?? '')
pipelineMode = (String(formData.get('pipelineMode') ?? 'automated') as 'standard' | 'automated' | 'community')
communityVisible = String(formData.get('communityVisible') ?? 'true') !== 'false'
accessRequirements = String(formData.get('accessRequirements') ?? '')
    } else {
      const body = await request.json()
      ;({ category, customCategory, title, description, location, budget, preferredDate, pipelineMode, communityVisible, accessRequirements } = body)
    }

    const parsed = projectRequestSchema.safeParse({
      category,
      customCategory,
      title,
      description,
      location,
      budget,
      preferredDate,
      pipelineMode,
      communityVisible,
      accessRequirements,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const validated = parsed.data
    const normalizedCategory = normalizeCategory(validated.category || 'open-request', validated.customCategory)
    const pipeline = buildPipelineSnapshot({
      mode: validated.pipelineMode,
      communityVisible: validated.communityVisible,
      accessRequirements: validated.accessRequirements,
    })

    const { data: sr, error: insertError } = await supabase
      .from('service_requests')
      .insert({
        owner_id:         user.id,
        category:         normalizedCategory,
        description:      validated.description,
        additional_notes: [validated.title, serializePipelineSnapshot(pipeline)].filter(Boolean).join('\n\n') || null,
        address:          validated.location,
        city:             'Topeka',
        state:            'KS',
        zip_code:         '66603',
        budget_max:       validated.budget ? parseFloat(validated.budget) : null,
        consultation_date: toConsultationDate(validated.preferredDate),
        status:           'pending_review',
      })
      .select('id, category, status')
      .single()

    if (insertError) throw insertError

    // Attempt auto-match in background (non-blocking)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`
      void fetch(`${baseUrl}/api/automation/match-contractor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: request.headers.get('cookie') ?? '' },
        body: JSON.stringify({ projectId: sr.id }),
      })
    } catch {
      // Match failure is non-fatal — job will appear on public board
    }

    return NextResponse.json(
      { project: { id: sr.id, title: validated.title || normalizedCategory, category: sr.category, status: sr.status } },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/projects/create]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
