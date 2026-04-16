import { createClient } from '@/lib/supabase/server'


export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient(request)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return Response.redirect(`${origin}${next}`)
    }
  }

  return Response.redirect(`${origin}/auth/login?error=auth_callback_failed`)
}
