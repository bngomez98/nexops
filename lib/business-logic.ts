/** Nexus fee rates by urgency tier — applied to contractor invoice subtotals */
export const FEE_RATES: Record<string, number> = {
  routine:   0.25,
  urgent:    0.30,
  emergency: 0.35,
}

/**
 * SLA response windows (minutes) by urgency tier.
 * Measured from request creation to first contractor claim or admin dispatch.
 * Drives the SLA-breach surfacing in the admin dashboard and match-priority
 * boosts in /api/match.
 */
export const SLA_RESPONSE_MINUTES: Record<string, number> = {
  emergency: 30,     // half-hour response for no-heat / water / gas
  urgent:    240,    // 4 hours
  routine:   1440,   // 24 hours
}

/**
 * SLA completion windows (hours from claim → completed).
 * Used by the stale-request cron + contractor performance scoring.
 */
export const SLA_COMPLETION_HOURS: Record<string, number> = {
  emergency: 24,
  urgent:    72,
  routine:   336,    // 14 days
}

/** Invoice auto-mark-overdue grace period (days past due_date). */
export const INVOICE_OVERDUE_GRACE_DAYS = 3

/** Calculate invoice totals from line items and urgency */
export function calculateInvoiceTotals(
  lineItems: { amount: number }[],
  urgency: string
) {
  const subtotal = lineItems.reduce((sum, item) => sum + (item.amount ?? 0), 0)
  const feeRate  = FEE_RATES[urgency] ?? FEE_RATES.routine
  const nexusFee = Math.round(subtotal * feeRate * 100) / 100
  const total    = subtotal + nexusFee

  return { subtotal, feeRate, nexusFee, total }
}

/** Valid status transitions for the service-request state machine */
export const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending_review:          ['in_queue', 'declined'],
  in_queue:                ['assigned', 'declined'],
  assigned:                ['consultation_scheduled', 'declined'],
  consultation_scheduled:  ['in_progress', 'declined'],
  in_progress:             ['completed', 'declined'],
  completed:               [],
  declined:                [],
  cancelled:               [],
}

/**
 * Valid invoice status transitions.
 * - draft → sent | void
 * - sent  → paid | overdue | void
 * - overdue → paid | void
 * - paid / void are terminal
 */
export const INVOICE_STATUS_TRANSITIONS: Record<string, string[]> = {
  draft:   ['sent', 'void'],
  sent:    ['paid', 'overdue', 'void'],
  overdue: ['paid', 'void'],
  paid:    [],
  void:    [],
}

/** Check if a status transition is valid */
export function isValidTransition(from: string, to: string): boolean {
  const allowed = STATUS_TRANSITIONS[from]
  if (!allowed) return false
  return allowed.includes(to)
}

/** Check if an invoice status transition is valid */
export function isValidInvoiceTransition(from: string, to: string): boolean {
  const allowed = INVOICE_STATUS_TRANSITIONS[from]
  if (!allowed) return false
  return allowed.includes(to)
}

/**
 * Haversine great-circle distance between two lat/lng pairs (in miles).
 * Returns null when any coordinate is missing.
 */
export function milesBetween(
  a: { lat: number | null | undefined; lng: number | null | undefined },
  b: { lat: number | null | undefined; lng: number | null | undefined },
): number | null {
  if (a.lat == null || a.lng == null || b.lat == null || b.lng == null) return null
  const R = 3958.7613 // Earth radius in miles
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

/**
 * Score a contractor for a given request.
 *
 *   +40  category match is primary trade
 *   +25  within service radius (linearly decays to 0 at the edge)
 *   +15  rating ≥ 4.5  |  +10 if ≥ 4.0  |  +5 if ≥ 3.5
 *   +10  verified compliance docs current
 *   +10  within SLA headroom (not already at max active projects)
 *
 * Higher is better. Used by /api/match when pgvector is unavailable.
 */
export function scoreContractorMatch(input: {
  isPrimaryCategory: boolean
  distanceMiles: number | null
  serviceRadiusMiles: number
  rating: number | null
  isVerified: boolean
  activeProjects: number
  maxActiveProjects: number
}): number {
  let score = 0
  if (input.isPrimaryCategory) score += 40
  if (input.distanceMiles != null && input.distanceMiles <= input.serviceRadiusMiles) {
    const ratio = 1 - input.distanceMiles / Math.max(1, input.serviceRadiusMiles)
    score += Math.round(25 * ratio)
  }
  const r = input.rating ?? 0
  if (r >= 4.5) score += 15
  else if (r >= 4.0) score += 10
  else if (r >= 3.5) score += 5
  if (input.isVerified) score += 10
  if (input.activeProjects < input.maxActiveProjects) score += 10
  return score
}
