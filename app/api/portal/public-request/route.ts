
import { createClient } from '@supabase/supabase-js'

/* ── Lazy Supabase admin client ─────────────────────────────────────────── */
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

/* ── In-memory rate limiter: max 5 submissions per IP per hour ──────────── */
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const WINDOW_MS = 60 * 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count += 1
  return true
}

interface PublicRequestBody {
  name?: unknown
  email?: unknown
  phone?: unknown
  address?: unknown
  category?: unknown
  description?: unknown
  preferredDate?: unknown
  budget?: unknown
  mediaUrls?: unknown
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    /* ── Rate limiting ──────────────────────────────────────────────────── */
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'

    if (!checkRateLimit(ip)) {
      return Response.json(
        { error: 'Too many submissions. Please try again in an hour.' },
        { status: 429 },
      )
    }

    const body = (await request.json()) as PublicRequestBody

    /* ── Validation ─────────────────────────────────────────────────────── */
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const address = typeof body.address === 'string' ? body.address.trim() : ''
    const category = typeof body.category === 'string' ? body.category.trim() : 'other'
    const description = typeof body.description === 'string' ? body.description.trim() : ''
    const preferredDate = typeof body.preferredDate === 'string' ? body.preferredDate : null
    const budget = typeof body.budget === 'string' ? body.budget : null
    const mediaUrls = Array.isArray(body.mediaUrls)
      ? (body.mediaUrls as unknown[]).filter((u): u is string => typeof u === 'string')
      : []

    const errors: string[] = []
    if (!name) errors.push('name')
    if (!email || !isValidEmail(email)) errors.push('valid email')
    if (!address) errors.push('address')
    if (!description) errors.push('description')

    if (errors.length > 0) {
      return Response.json(
        { error: `Missing or invalid required fields: ${errors.join(', ')}` },
        { status: 400 },
      )
    }

    /* ── Generate submission token ──────────────────────────────────────── */
    const submissionToken = crypto.randomUUID()

    /* ── Derive title from category + description ───────────────────────── */
    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1)
    const shortDesc = description.length > 60 ? description.slice(0, 57) + '…' : description
    const title = `${categoryLabel}: ${shortDesc}`

    /* ── Insert into service_requests ──────────────────────────────────── */
    const supabaseAdmin = getSupabaseAdmin()
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('service_requests')
      .insert({
        owner_id: null,
        guest_name: name,
        guest_email: email,
        guest_phone: phone || null,
        category,
        title,
        description,
        address,
        status: 'pending_review',
        submission_token: submissionToken,
        photo_urls: mediaUrls.length > 0 ? mediaUrls : null,
        preferred_date: preferredDate,
        budget_range: budget,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('[public-request] insert error:', insertError)
      return Response.json({ error: 'Failed to submit request. Please try again.' }, { status: 500 })
    }

    return Response.json({
      success: true,
      token: submissionToken,
      id: inserted?.id ?? null,
    })
  } catch (error) {
    console.error('[POST /api/portal/public-request]', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
