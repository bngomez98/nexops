export const DEFAULT_CONTRACTOR_SUBSCRIPTION_PRICE_CENTS = parseIntegerEnv(
  process.env.NEXT_PUBLIC_CONTRACTOR_SUBSCRIPTION_PRICE_CENTS,
  9900,
)

export const OWNER_SUBSCRIPTION_MULTIPLIER = 2
export const DEFAULT_OWNER_SUBSCRIPTION_PRICE_CENTS =
  DEFAULT_CONTRACTOR_SUBSCRIPTION_PRICE_CENTS * OWNER_SUBSCRIPTION_MULTIPLIER

export const SERVICE_REQUEST_FEE_CENTS = 9900

export type BillingRole = "contractor" | "owner"
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | null

function parseIntegerEnv(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

export function getBillingRole(appRole: string | undefined | null): BillingRole {
  return appRole === "contractor" ? "contractor" : "owner"
}

export function getSubscriptionPriceCents({
  billingRole,
  configuredPriceCents,
}: {
  billingRole: BillingRole
  configuredPriceCents?: number | null
}) {
  if (billingRole === "contractor") {
    return configuredPriceCents && configuredPriceCents > 0
      ? configuredPriceCents
      : DEFAULT_CONTRACTOR_SUBSCRIPTION_PRICE_CENTS
  }

  return DEFAULT_OWNER_SUBSCRIPTION_PRICE_CENTS
}

export function hasActiveSubscription(status: SubscriptionStatus) {
  return status === "active" || status === "trialing"
}
