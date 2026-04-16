
import { createClient } from '@supabase/supabase-js'

/* ── Lazy Supabase admin client (service role, no user auth needed) ─────── */
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

/* ── In-memory rate limiter: max 20 files per IP per hour ───────────────── */
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 20
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

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif',
]
const ALLOWED_VIDEO_TYPES = [
  'video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo',
]
const MAX_IMAGE_BYTES = 10 * 1024 * 1024  // 10 MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024  // 50 MB

function randomId(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
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
        { error: 'Too many uploads. Please try again later.' },
        { status: 429 },
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)

    if (!isImage && !isVideo) {
      return Response.json(
        { error: 'Invalid file type. Only images and videos are allowed.' },
        { status: 400 },
      )
    }

    const maxSize = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
    if (file.size > maxSize) {
      return Response.json(
        { error: `File too large. Max size is ${isVideo ? '50MB' : '10MB'}.` },
        { status: 400 },
      )
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? (isVideo ? 'mp4' : 'jpg')
    const path = `public/${Date.now()}-${randomId()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()

    const supabaseAdmin = getSupabaseAdmin()
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('job-photos')
      .upload(path, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('[public-upload] storage error:', uploadError)
      return Response.json({ error: 'Failed to upload file.' }, { status: 500 })
    }

    const { data: urlData } = getSupabaseAdmin().storage
      .from('job-photos')
      .getPublicUrl(uploadData.path)

    return Response.json({ url: urlData.publicUrl, path: uploadData.path })
  } catch (error) {
    console.error('[POST /api/portal/public-upload]', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
