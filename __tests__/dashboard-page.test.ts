import { describe, it, expect } from 'vitest'
import { isHomeownerDashboardRole } from '@/lib/dashboard-role'

describe('isHomeownerDashboardRole', () => {
  it('returns true for legacy client role', () => {
    expect(isHomeownerDashboardRole('client')).toBe(true)
  })

  it('returns true for homeowner role', () => {
    expect(isHomeownerDashboardRole('homeowner')).toBe(true)
  })

  it('returns false for non-homeowner roles', () => {
    expect(isHomeownerDashboardRole('contractor')).toBe(false)
    expect(isHomeownerDashboardRole('admin')).toBe(false)
    expect(isHomeownerDashboardRole(undefined)).toBe(false)
  })
})
