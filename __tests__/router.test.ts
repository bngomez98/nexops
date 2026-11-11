import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

const navigation = vi.hoisted(() => ({
  router: {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  },
  params: { id: 'request-123' },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
  usePathname: () => '/dashboard/requests/request-123',
  useSearchParams: () => new URLSearchParams('status=pending'),
  useParams: () => navigation.params,
  useSelectedLayoutSegment: vi.fn(),
  useSelectedLayoutSegments: vi.fn(),
  redirect: vi.fn(),
  notFound: vi.fn(),
  permanentRedirect: vi.fn(),
}))

import { useParams, usePathname, useRouter, useSearchParams } from '@/lib/router'

describe('App Router adapters', () => {
  it('delegates navigation without relying on the Pages Router window marker', () => {
    function Probe() {
      expect(useRouter()).toBe(navigation.router)
      return null
    }

    renderToStaticMarkup(createElement(Probe))
  })

  it('reads the active pathname, query, and dynamic route parameters from Next.js', () => {
    function Probe() {
      expect(usePathname()).toBe('/dashboard/requests/request-123')
      expect(useSearchParams().get('status')).toBe('pending')
      expect(useParams<{ id: string }>().id).toBe('request-123')
      return null
    }

    renderToStaticMarkup(createElement(Probe))
  })
})
