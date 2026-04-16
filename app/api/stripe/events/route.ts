
import { getStripeClient } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const supabase = createClient(req)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const stripe = getStripeClient()
    const { searchParams } = new URL(req.url)

    const params: Record<string, string | number> = {}
    const limit = searchParams.get('limit')
    const startingAfter = searchParams.get('starting_after')
    const endingBefore = searchParams.get('ending_before')
    const type = searchParams.get('type')
    const created = searchParams.get('created')

    if (limit) {
      const parsedLimit = parseInt(limit, 10)
      if (!Number.isNaN(parsedLimit) && parsedLimit >= 1 && parsedLimit <= 100) {
        params.limit = parsedLimit
      }
    }
    if (startingAfter) params.starting_after = startingAfter
    if (endingBefore) params.ending_before = endingBefore
    if (type) params.type = type
    if (created) {
      const parsedCreated = parseInt(created, 10)
      if (!Number.isNaN(parsedCreated) && parsedCreated > 0) {
        params.created = parsedCreated
      }
    }

    const events = await stripe.events.list(params as Parameters<typeof stripe.events.list>[0])

    return Response.json(events)
  } catch (err) {
    console.error('[GET /api/stripe/events]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
