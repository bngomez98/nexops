
import { createClient } from '@/lib/supabase/server'
import { projectRequestSchema } from '@/lib/validators'
import { buildPipelineSnapshot, serializePipelineSnapshot } from '@/lib/request-pipeline'
import { createRequestId, internalError } from '@/lib/api-error'
import { normalizeCategorySlug } from '@/lib/category'
import { isAutomationEnabled } from '@/lib/env'

// Custom categories are stored as URL-safe slugs so they can flow through the
// same matching, filtering, and analytics paths as predefined categories.
function normalizeCategory(category: string, customCategory?: string) {
  if (category.trim().toLowerCase() === 'other') {
    const normalized = normalizeCategorySlug(customCategory ?? '')
    return normalized || 'other'
  }

  const normalizedCategory = normalizeCategorySlug(category)

  return normalizedCategory || 'other'
}

function toConsultationDate(value: string) {
  return value.includes('T') ? value : `${value}T00:00:00Z`
}

export async function POST(request: Request) {
  try {
    const automationEnabled = isAutomationEnabled()
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? user.user_metadata?.role ?? 'homeowner'
    if (role !== 'homeowner') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Accept both JSON and FormData
    const contentType = request.headers.get('content-type') ?? ''
    let category = 'open-request', customCategory = '', title = '', description = '', location = '', budget = '', preferredDate = ''
    let urgency = ''
    let photoUrls: string[] = []
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
      urgency     = String(formData.get('urgency') ?? '')
      const rawPhotoUrls = formData.getAll('photoUrls').map((value) => String(value))
      photoUrls = rawPhotoUrls.filter(Boolean)
      pipelineMode = (String(formData.get('pipelineMode') ?? 'automated') as 'standard' | 'automated' | 'community')
      communityVisible = String(formData.get('communityVisible') ?? 'true') !== 'false'
      accessRequirements = String(formData.get('accessRequirements') ?? '')
    } else {
      const body = await request.json()
      ;({ category, customCategory, title, description, location, budget, preferredDate, urgency, photoUrls, pipelineMode, communityVisible, accessRequirements } = body)
    }

    const parsed = projectRequestSchema.safeParse({
      category,
      customCategory,
      title,
      description,
      location,
      budget,
      urgency,
      photoUrls,
      preferredDate,
      pipelineMode,
      communityVisible,
      accessRequirements,
    })

    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const validated = parsed.data
    const normalizedCategory = normalizeCategory(validated.category || 'open-request', validated.customCategory)
    const normalizedUrgency = validated.urgency || 'normal'
    const normalizedPhotoUrls = validated.photoUrls?.filter(Boolean) ?? []
    const pipeline = buildPipelineSnapshot({
      mode: automationEnabled ? validated.pipelineMode : 'standard',
      communityVisible: automationEnabled ? validated.communityVisible : false,
      accessRequirements: validated.accessRequirements,
    })

    const { data: sr, error: insertError } = await supabase
      .from('service_requests')
        .insert({
          owner_id:         user.id,
          category:         normalizedCategory,
          title:            validated.title,
          description:      validated.description,
          additional_notes: [validated.title, serializePipelineSnapshot(pipeline)].filter(Boolean).join('\n\n') || null,
          address:          validated.location,
          city:             'Topeka',
          state:            'KS',
          zip_code:         '66603',
          budget_max:       validated.budget ? parseFloat(validated.budget) : null,
          urgency:          normalizedUrgency,
          photo_urls:       normalizedPhotoUrls.length > 0 ? normalizedPhotoUrls : null,
          consultation_date: toConsultationDate(validated.preferredDate),
          status:           'pending_review',
        })
      .select('id, category, status')
      .single()

    if (insertError) throw insertError

    // Attempt auto-match in background (non-blocking)
    if (automationEnabled) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`
        void fetch(`${baseUrl}/api/automation/match-contractor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Cookie: request.headers.get('cookie') ?? '' },
          body: JSON.stringify({ projectId: sr.id }),
        })
      } catch (err) {
        console.error(err)
        // Match failure is non-fatal — job will appear on public board
      }
    }

    return Response.json(
      { project: { id: sr.id, title: validated.title || normalizedCategory, category: sr.category, status: sr.status } },
      { status: 201 }
    )
  } catch (err) {
    const requestId = createRequestId()
    console.error(`[POST /api/projects/create][${requestId}]`, err)
    return internalError('Unable to create service request', { requestId })
  }
}
