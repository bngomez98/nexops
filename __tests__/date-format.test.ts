import { describe, expect, it } from 'vitest'

import { todayDateInputValue } from '@/lib/date-format'

describe('todayDateInputValue', () => {
  it('returns an ISO-like local date value', () => {
    const value = todayDateInputValue(new Date('2026-04-05T15:30:00'))
    expect(value).toBe('2026-04-05')
  })

  it('pads single-digit month and day values', () => {
    const value = todayDateInputValue(new Date('2026-01-02T08:00:00'))
    expect(value).toBe('2026-01-02')
  })
})
