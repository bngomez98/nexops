import { afterEach, describe, expect, it, vi } from 'vitest'

const ORIGINAL_ENV = { ...process.env }

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
  vi.resetModules()
})

describe('isAutomationEnabled', () => {
  it('defaults to false when no flags are set', async () => {
    delete process.env.AUTOMATION_ENABLED
    delete process.env.NEXT_PUBLIC_AUTOMATION_ENABLED
    const { isAutomationEnabled } = await import('@/lib/env')
    expect(isAutomationEnabled()).toBe(false)
  })

  it('uses server flag when present', async () => {
    process.env.AUTOMATION_ENABLED = 'true'
    process.env.NEXT_PUBLIC_AUTOMATION_ENABLED = 'false'
    const { isAutomationEnabled } = await import('@/lib/env')
    expect(isAutomationEnabled()).toBe(true)
  })

  it('falls back to public flag when server flag is unset', async () => {
    delete process.env.AUTOMATION_ENABLED
    process.env.NEXT_PUBLIC_AUTOMATION_ENABLED = 'yes'
    const { isAutomationEnabled } = await import('@/lib/env')
    expect(isAutomationEnabled()).toBe(true)
  })

  it('treats unrecognized values as false', async () => {
    process.env.AUTOMATION_ENABLED = 'definitely'
    const { isAutomationEnabled } = await import('@/lib/env')
    expect(isAutomationEnabled()).toBe(false)
  })
})
