'use client'

export {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
  redirect,
  notFound,
  permanentRedirect,
} from 'next/navigation'

export type { ReadonlyURLSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const LOCATION_CHANGE_EVENT = 'app:locationchange'

function getPathname() {
  return typeof window !== 'undefined' ? window.location.pathname : '/'
}

function getSearch() {
  return typeof window !== 'undefined' ? window.location.search : ''
}

function notifyLocationChange() {
  window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT))
}

function subscribeToLocation(callback: () => void) {
  window.addEventListener('popstate', callback)
  window.addEventListener('hashchange', callback)
  window.addEventListener(LOCATION_CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener('popstate', callback)
    window.removeEventListener('hashchange', callback)
    window.removeEventListener(LOCATION_CHANGE_EVENT, callback)
  }
}

// ---------------------------------------------------------------------------
// useRouter
// ---------------------------------------------------------------------------

export interface AppRouter {
  push(url: string): void
  replace(url: string): void
  back(): void
  forward(): void
  refresh(): void
  prefetch?(url: string): void
}

export function useRouter(): AppRouter {
  // Attempt to use Next.js router when available (avoids full-page reloads).
  if (typeof window !== 'undefined' && typeof window.__NEXT_DATA__ !== 'undefined') {
    // We are inside Next.js — delegate dynamically to avoid a hard import that
    // would prevent tree-shaking when the file is bundled outside Next.js.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useRouter: useNextRouter } = require('next/navigation') as typeof import('next/navigation')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useNextRouter()
  }

  // Fallback: plain browser History API
  return {
    push: (url: string) => {
      window.history.pushState(null, '', url)
      notifyLocationChange()
    },
    replace: (url: string) => {
      window.history.replaceState(null, '', url)
      notifyLocationChange()
    },
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => window.location.reload(),
  }
}

// ---------------------------------------------------------------------------
// usePathname
// ---------------------------------------------------------------------------

export function usePathname(): string {
  if (typeof window !== 'undefined' && typeof window.__NEXT_DATA__ !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { usePathname: useNextPathname } = require('next/navigation') as typeof import('next/navigation')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useNextPathname()
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSyncExternalStore(subscribeToLocation, getPathname, () => '/')
}

// ---------------------------------------------------------------------------
// useSearchParams
// ---------------------------------------------------------------------------

export function useSearchParams(): URLSearchParams {
  if (typeof window !== 'undefined' && typeof window.__NEXT_DATA__ !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useSearchParams: useNextSearchParams } = require('next/navigation') as typeof import('next/navigation')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const nextParams = useNextSearchParams()
    // next/navigation returns a ReadonlyURLSearchParams — wrap it
    return new URLSearchParams(nextParams.toString())
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const search = useSyncExternalStore(subscribeToLocation, getSearch, () => '')
  return new URLSearchParams(search)
}

// ---------------------------------------------------------------------------
// useParams
// ---------------------------------------------------------------------------

/**
 * Returns the dynamic route segment params from the current URL.
 *
 * When running inside Next.js this delegates to `next/navigation`'s
 * `useParams` so the strongly-typed params object is available.  Outside of
 * Next.js a best-effort extraction from `window.location.pathname` is
 * returned (requires the caller to know the pattern).
 */
export function useParams<T extends Record<string, string | string[]> = Record<string, string>>(): T {
  if (typeof window !== 'undefined' && typeof window.__NEXT_DATA__ !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useParams: useNextParams } = require('next/navigation') as typeof import('next/navigation')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useNextParams() as T
  }
  // Outside Next.js — return an empty object; callers should use useSearchParams for non-dynamic segments
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [params] = useState<T>({} as T)
  return params
}

// ---------------------------------------------------------------------------
// useEffect-based convenience: run a callback on every navigation
// ---------------------------------------------------------------------------

export function useNavigationEffect(callback: (pathname: string) => void) {
  const pathname = usePathname()
  const stableCallback = useCallback(callback, [callback])
  useEffect(() => {
    stableCallback(pathname)
  }, [pathname, stableCallback])
}
