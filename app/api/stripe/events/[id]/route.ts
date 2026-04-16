
import { getStripeClient } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await params

    const stripe = getStripeClient()
    const event = await stripe.events.retrieve(id)

    return Response.json(event)
  } catch (err: unknown) {
    const stripeError = err as { statusCode?: number; message?: string }
    if (stripeError?.statusCode === 404) {
      return Response.json({ error: 'Event not found' }, { status: 404 })
    }
    console.error('[GET /api/stripe/events/:id]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
