import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    let category = '', title = '', description = '', location = '', budget = ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      category    = String(formData.get('category') ?? '')
      title       = String(formData.get('title') ?? '')
      description = String(formData.get('description') ?? '')
      location    = String(formData.get('location') ?? '')
      budget      = String(formData.get('budget') ?? '')
    } else {
      const body = await request.json()
      ;({ category, title, description, location, budget } = body)
    }

    if (!category || !description || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: sr, error: insertError } = await supabase
      .from('service_requests')
      .insert({
        owner_id:         user.id,
        category,
        description,
        additional_notes: title || null,
        address:          location,
        city:             'Topeka',
        state:            'KS',
        zip_code:         '66603',
        budget_max:       budget ? parseFloat(budget) : null,
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
      { project: { id: sr.id, title: title || category, category: sr.category, status: sr.status } },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/projects/create]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
