import type { SupabaseClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'

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
