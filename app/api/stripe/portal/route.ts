import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, role')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 400 })
    }

    const returnPath = profile.role === 'contractor'
      ? '/dashboard/contractor/settings'
      : '/dashboard/homeowner/settings'

    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexusoperations.org'}${returnPath}`

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[POST /api/stripe/portal]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
