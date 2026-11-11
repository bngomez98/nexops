'use client'

export {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
  redirect,
  notFound,
  permanentRedirect,
} from 'next/navigation'

export type { ReadonlyURLSearchParams } from 'next/navigation'
import {
  useRouter as useNextRouter,
  usePathname as useNextPathname,
  useSearchParams as useNextSearchParams,
  useParams as useNextParams,
} from 'next/navigation'
import { useCallback, useEffect } from 'react'

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
  // App Router pages do not expose __NEXT_DATA__; History API changes alone do not load a route.
  return useNextRouter()
}

// ---------------------------------------------------------------------------
// usePathname
// ---------------------------------------------------------------------------

export function usePathname(): string {
  return useNextPathname()
}

// ---------------------------------------------------------------------------
// useSearchParams
// ---------------------------------------------------------------------------

export function useSearchParams(): URLSearchParams {
  const params = useNextSearchParams()
  return new URLSearchParams(params.toString())
}

// ---------------------------------------------------------------------------
// useParams
// ---------------------------------------------------------------------------

export function useParams<T extends Record<string, string | string[]> = Record<string, string>>(): T {
  return useNextParams<T>()
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
