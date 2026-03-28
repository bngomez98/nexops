import { describe, it, expect } from 'vitest'
import { calculateInvoiceTotals, isValidTransition, FEE_RATES, STATUS_TRANSITIONS } from '@/lib/business-logic'

// ─── calculateInvoiceTotals ──────────────────────────────────────────────────

describe('calculateInvoiceTotals', () => {
  it('calculates routine fee at 25%', () => {
    const result = calculateInvoiceTotals([{ amount: 1000 }], 'routine')
    expect(result.subtotal).toBe(1000)
    expect(result.feeRate).toBe(0.25)
    expect(result.nexusFee).toBe(250)
    expect(result.total).toBe(1250)
  })

  it('calculates urgent fee at 30%', () => {
    const result = calculateInvoiceTotals([{ amount: 500 }], 'urgent')
    expect(result.feeRate).toBe(0.30)
    expect(result.nexusFee).toBe(150)
    expect(result.total).toBe(650)
  })

  it('calculates emergency fee at 35%', () => {
    const result = calculateInvoiceTotals([{ amount: 200 }], 'emergency')
    expect(result.feeRate).toBe(0.35)
    expect(result.nexusFee).toBe(70)
    expect(result.total).toBe(270)
  })

  it('defaults to routine fee for unknown urgency', () => {
    const result = calculateInvoiceTotals([{ amount: 400 }], 'unknown')
    expect(result.feeRate).toBe(0.25)
    expect(result.nexusFee).toBe(100)
  })

  it('sums multiple line items', () => {
    const items = [{ amount: 200 }, { amount: 300 }, { amount: 150 }]
    const result = calculateInvoiceTotals(items, 'routine')
    expect(result.subtotal).toBe(650)
    expect(result.nexusFee).toBe(162.5)
    expect(result.total).toBe(812.5)
  })

  it('handles zero amounts', () => {
    const result = calculateInvoiceTotals([{ amount: 0 }], 'routine')
    expect(result.subtotal).toBe(0)
    expect(result.nexusFee).toBe(0)
    expect(result.total).toBe(0)
  })

  it('rounds fee to two decimal places', () => {
    // 333 * 0.25 = 83.25 (clean) but test with 33.33 * 0.25 = 8.3325
    const result = calculateInvoiceTotals([{ amount: 33.33 }], 'routine')
    expect(result.nexusFee).toBe(8.33) // Math.round(33.33 * 0.25 * 100) / 100
  })
})

// ─── FEE_RATES ───────────────────────────────────────────────────────────────

describe('FEE_RATES', () => {
  it('has exactly three tiers', () => {
    expect(Object.keys(FEE_RATES)).toHaveLength(3)
  })

  it('emergency > urgent > routine', () => {
    expect(FEE_RATES.emergency).toBeGreaterThan(FEE_RATES.urgent)
    expect(FEE_RATES.urgent).toBeGreaterThan(FEE_RATES.routine)
  })
})

// ─── isValidTransition ───────────────────────────────────────────────────────

describe('isValidTransition', () => {
  it('allows pending_review → in_queue', () => {
    expect(isValidTransition('pending_review', 'in_queue')).toBe(true)
  })

  it('allows pending_review → declined', () => {
    expect(isValidTransition('pending_review', 'declined')).toBe(true)
  })

  it('disallows pending_review → cancelled', () => {
    expect(isValidTransition('pending_review', 'cancelled')).toBe(false)
  })

  it('disallows pending_review → completed', () => {
    expect(isValidTransition('pending_review', 'completed')).toBe(false)
  })

  it('allows in_queue → assigned', () => {
    expect(isValidTransition('in_queue', 'assigned')).toBe(true)
  })

  it('allows assigned → consultation_scheduled', () => {
    expect(isValidTransition('assigned', 'consultation_scheduled')).toBe(true)
  })

  it('disallows assigned → in_progress (must go through consultation)', () => {
    expect(isValidTransition('assigned', 'in_progress')).toBe(false)
  })

  it('allows in_progress → completed', () => {
    expect(isValidTransition('in_progress', 'completed')).toBe(true)
  })

  it('disallows backwards transition', () => {
    expect(isValidTransition('in_progress', 'assigned')).toBe(false)
  })

  it('disallows transitions from terminal states', () => {
    expect(isValidTransition('completed', 'in_progress')).toBe(false)
    expect(isValidTransition('declined', 'in_queue')).toBe(false)
    expect(isValidTransition('cancelled', 'pending_review')).toBe(false)
  })

  it('returns false for unknown status', () => {
    expect(isValidTransition('unknown', 'in_queue')).toBe(false)
  })
})

// ─── STATUS_TRANSITIONS ─────────────────────────────────────────────────────

describe('STATUS_TRANSITIONS', () => {
  it('terminal states have no transitions', () => {
    expect(STATUS_TRANSITIONS.completed).toHaveLength(0)
    expect(STATUS_TRANSITIONS.declined).toHaveLength(0)
    expect(STATUS_TRANSITIONS.cancelled).toHaveLength(0)
  })

  it('every target status exists as a source status', () => {
    const allSources = Object.keys(STATUS_TRANSITIONS)
    for (const targets of Object.values(STATUS_TRANSITIONS)) {
      for (const target of targets) {
        expect(allSources).toContain(target)
      }
    }
  })
})
