import { describe, expect, it, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { isAutomationEnabled } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'
import { generateText } from 'ai'

vi.mock('@/lib/env', () => ({
  isAutomationEnabled: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('ai', () => ({
  generateText: vi.fn(),
  Output: {
    object: vi.fn(),
  },
}))

const isAutomationEnabledMock = vi.mocked(isAutomationEnabled)
const createClientMock = vi.mocked(createClient)
const generateTextMock = vi.mocked(generateText)

afterEach(() => {
  vi.clearAllMocks()
})

describe('automation routes feature flags', () => {
  it('categorize-request returns 403 when automation is disabled', async () => {
    isAutomationEnabledMock.mockReturnValue(false)
    const { POST } = await import('@/app/api/automation/categorize-request/route')
    const request = new NextRequest('http://localhost/api/automation/categorize-request', {
      method: 'POST',
      body: JSON.stringify({ title: 'Fix sink', description: 'Need plumbing support' }),
      headers: { 'content-type': 'application/json' },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(403)
    expect(body.code).toBe('FEATURE_DISABLED')
    expect(generateTextMock).not.toHaveBeenCalled()
  })

  it('match-contractor returns 403 when automation is disabled before supabase calls', async () => {
    isAutomationEnabledMock.mockReturnValue(false)
    const { POST } = await import('@/app/api/automation/match-contractor/route')
    const request = new NextRequest('http://localhost/api/automation/match-contractor', {
      method: 'POST',
      body: JSON.stringify({ projectId: 'abc' }),
      headers: { 'content-type': 'application/json' },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(403)
    expect(body.code).toBe('FEATURE_DISABLED')
    expect(createClientMock).not.toHaveBeenCalled()
  })

  it('update-status returns 403 when automation is disabled before supabase calls', async () => {
    isAutomationEnabledMock.mockReturnValue(false)
    const { POST } = await import('@/app/api/automation/update-status/route')
    const request = new NextRequest('http://localhost/api/automation/update-status', {
      method: 'POST',
      body: JSON.stringify({ projectId: 'abc', newStatus: 'assigned' }),
      headers: { 'content-type': 'application/json' },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(403)
    expect(body.code).toBe('FEATURE_DISABLED')
    expect(createClientMock).not.toHaveBeenCalled()
  })
})
