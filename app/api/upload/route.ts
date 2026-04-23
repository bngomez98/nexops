import { createClient } from '@/lib/supabase/server'


const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const ALLOWED_JOB_PHOTO_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif',
  'video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo',
]
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024 // 50MB

const ALLOWED_BUCKETS = ['profile-photos', 'compliance-docs', 'contracts', 'job-photos']

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file     = formData.get('file') as File | null
    const bucket   = formData.get('bucket') as string | null
    const userId   = formData.get('user_id') as string | null

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
      return Response.json({ error: 'Invalid bucket target' }, { status: 400 })
    }

    // Verify the requesting user matches the user_id (unless admin)
    const role = user.user_metadata?.role
    if (userId && userId !== user.id && role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Validate file type
    const allowedTypes = bucket === 'job-photos' ? ALLOWED_JOB_PHOTO_TYPES : ALLOWED_TYPES
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: `Invalid file type for ${bucket}.` }, { status: 400 })
    }

    // Validate file size
    const isVideo = file.type.startsWith('video/')
    const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_SIZE_BYTES
    if (file.size > maxSize) {
      return Response.json({ error: `File size exceeds ${isVideo ? '50MB' : '10MB'} limit.` }, { status: 400 })
    }

    // Build storage path
    const ext       = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
    const uid       = userId ?? user.id
    const timestamp = Date.now()
    const path      = `${uid}/${timestamp}.${ext}`

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return Response.json({ error: 'Failed to upload file.' }, { status: 500 })
    }

    // Get public URL (for profile-photos) or signed URL (for private buckets)
    let url: string
    if (bucket === 'profile-photos') {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(uploadData.path)
      url = urlData.publicUrl
    } else {
      const { data: signedData, error: signedError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(uploadData.path, 60 * 60 * 24 * 7) // 7 days
      if (signedError || !signedData) {
        return Response.json({ error: 'Failed to generate file URL.' }, { status: 500 })
      }
      url = signedData.signedUrl
    }

    // Write record to documents table (skip for profile-photos)
    if (bucket !== 'profile-photos') {
      const docType = formData.get('doc_type') as string | null
      const expiresAt = formData.get('expires_at') as string | null

      await supabase.from('documents').insert({
        user_id: uid,
        type: docType ?? bucket,
        file_url: uploadData.path,
        expires_at: expiresAt || null,
        verified: false,
        status: 'pending',
      })
    }

    return Response.json({
      url,
      path: uploadData.path,
      bucket,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
