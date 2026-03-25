import type { SupabaseClient } from '@supabase/supabase-js'
import { getStripeClient } from '@/lib/stripe/server'

interface EnsureStripeCustomerParams {
  supabase: SupabaseClient<any, 'public', any>
  userId: string
  email?: string | null
  fullName?: string | null
  stripeCustomerId?: string | null
}

export async function ensureStripeCustomer({
  supabase,
  userId,
  email,
  fullName,
  stripeCustomerId,
}: EnsureStripeCustomerParams): Promise<string> {
  if (stripeCustomerId) {
    return stripeCustomerId
  }

  const stripe = getStripeClient()
  const customer = await stripe.customers.create({
    email: email ?? undefined,
    name: fullName ?? email ?? undefined,
    metadata: { userId },
  })

  await supabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId)

  return customer.id
}
