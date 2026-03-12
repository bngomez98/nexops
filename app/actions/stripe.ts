"use server"

import { stripe } from "@/lib/stripe"
import { SUBSCRIPTION_PLANS, SERVICE_FEES } from "@/lib/products"

export async function startCheckoutSession(productId: string) {
  const allProducts = [...SUBSCRIPTION_PLANS, ...SERVICE_FEES]
  const product = allProducts.find((p) => p.id === productId)
  
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  const isSubscription = product.interval !== undefined

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          ...(isSubscription && {
            recurring: {
              interval: product.interval,
            },
          }),
        },
        quantity: 1,
      },
    ],
    mode: isSubscription ? "subscription" : "payment",
  })

  return session.client_secret
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings`,
  })

  return session.url
}
