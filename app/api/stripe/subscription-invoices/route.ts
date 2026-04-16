
import { createClient } from '@/lib/supabase/server'
import { getStripeClient } from '@/lib/stripe/server'
import { ensureStripeCustomer } from '@/lib/stripe/customer'

export async function GET(request: Request) {
  try {
    const supabase = createClient(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, full_name')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error('[GET /api/stripe/subscription-invoices] profile lookup failed', profileError)
      return Response.json({ error: 'Unable to load profile' }, { status: 500 })
    }

    const customerId = await ensureStripeCustomer({
      supabase,
      userId: user.id,
      email: user.email,
      fullName: profile?.full_name,
      stripeCustomerId: profile?.stripe_customer_id,
    })

    const stripe = getStripeClient()
    const stripeInvoices = await stripe.invoices.list({
      customer: customerId,
      limit: 24,
    })

    const invoices = stripeInvoices.data.map((inv) => ({
      id: inv.id,
      number: inv.number,
      status: inv.status,
      amountDue: inv.amount_due,
      amountPaid: inv.amount_paid,
      currency: inv.currency,
      created: inv.created,
      periodStart: inv.period_start,
      periodEnd: inv.period_end,
      hostedInvoiceUrl: inv.hosted_invoice_url ?? null,
      invoicePdf: inv.invoice_pdf ?? null,
    }))

    return Response.json({ invoices })
  } catch (err) {
    console.error('[GET /api/stripe/subscription-invoices]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
