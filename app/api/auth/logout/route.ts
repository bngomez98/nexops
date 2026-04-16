
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient(request)
    await supabase.auth.signOut()
    return Response.json({ success: true })
  } catch (err) {
    console.error('[POST /api/auth/logout]', err)
    return Response.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
