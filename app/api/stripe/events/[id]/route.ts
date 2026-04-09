import { NextRequest, NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { id } = await params

    const stripe = getStripeClient()
    const event = await stripe.events.retrieve(id)

    return NextResponse.json(event)
  } catch (err: unknown) {
    const stripeError = err as { statusCode?: number; message?: string }
    if (stripeError?.statusCode === 404) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    console.error('[GET /api/stripe/events/:id]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
