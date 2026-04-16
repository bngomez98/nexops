import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const envMock = vi.hoisted(() => ({
  hasSupabaseServerConfig: vi.fn(),
}))

const updateSessionMock = vi.hoisted(() => vi.fn())

vi.mock('@/lib/env', () => ({
  hasSupabaseServerConfig: envMock.hasSupabaseServerConfig,
}))

vi.mock('@/lib/supabase/proxy', () => ({
  updateSession: updateSessionMock,
}))

describe('middleware robustness', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('falls back to NextResponse.next when updateSession throws and keeps security headers', async () => {
    envMock.hasSupabaseServerConfig.mockReturnValue(true)
    updateSessionMock.mockRejectedValue(new Error('supabase down'))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { middleware } = await import('@/middleware')
    const request = { nextUrl: { pathname: '/' } } as unknown as import('next/server').NextRequest
    const response = await middleware(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(response.headers.get('X-Frame-Options')).toBe('DENY')
    expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block')
    expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
    expect(response.headers.get('Permissions-Policy')).toContain('geolocation=()')
    expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'")
    expect(errorSpy).toHaveBeenCalledWith(
      'Middleware session update failed',
      expect.any(Error),
    )
  })

  it('uses updateSession response when Supabase config exists and update succeeds', async () => {
    envMock.hasSupabaseServerConfig.mockReturnValue(true)
    const { NextResponse } = await import('next/server')
    const sessionResponse = NextResponse.next()
    sessionResponse.headers.set('X-Test', 'session')
    updateSessionMock.mockResolvedValue(sessionResponse)

    const { middleware } = await import('@/middleware')
    const request = { nextUrl: { pathname: '/' } } as unknown as import('next/server').NextRequest
    const response = await middleware(request)

    expect(updateSessionMock).toHaveBeenCalled()
    expect(response.headers.get('X-Test')).toBe('session')
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
  })

  it('skips updateSession when Supabase config is missing', async () => {
    envMock.hasSupabaseServerConfig.mockReturnValue(false)

    const { middleware } = await import('@/middleware')
    const request = { nextUrl: { pathname: '/' } } as unknown as import('next/server').NextRequest
    const response = await middleware(request)

    expect(updateSessionMock).not.toHaveBeenCalled()
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
  })
})
