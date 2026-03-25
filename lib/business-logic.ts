/** Nexus fee rates by urgency tier */
export const FEE_RATES: Record<string, number> = {
  routine:   0.25,
  urgent:    0.30,
  emergency: 0.35,
}

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

/** Valid status transitions for the project state machine */
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

/** Check if a status transition is valid */
export function isValidTransition(from: string, to: string): boolean {
  const allowed = STATUS_TRANSITIONS[from]
  if (!allowed) return false
  return allowed.includes(to)
}
