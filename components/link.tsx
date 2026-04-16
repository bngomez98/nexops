/**
 * Framework-agnostic Link component.
 *
 * Replaces `next/link` with a plain `<a>` element that uses the History API
 * for client-side navigation when the destination is a same-origin relative
 * URL.  This removes the hard dependency on Next.js's `<Link>` while keeping
 * SPA-style navigation behaviour.
 */

'use client'

import React, { forwardRef, MouseEvent } from 'react'
import { useRouter } from '@/lib/router'

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string
  /** When true, uses history.replaceState instead of pushState */
  replace?: boolean
  /** Forwarded to <a> element as the `href` attribute */
  prefetch?: boolean
}

/**
 * A lightweight `<a>` wrapper that intercepts same-origin, non-hash,
 * non-external clicks and delegates them to the router's push/replace so that
 * page transitions happen without a full reload.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, replace, children, onClick, prefetch: _prefetch, ...props },
  ref,
) {
  const router = useRouter()

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (props.target && props.target !== '_self') return

    // Only intercept same-origin relative or absolute same-origin links
    try {
      const url = new URL(href, typeof window !== 'undefined' ? window.location.href : 'http://localhost')
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.hash) return
    } catch {
      return
    }

    e.preventDefault()
    if (replace) {
      router.replace(href)
    } else {
      router.push(href)
    }
  }

  return (
    <a ref={ref} href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
})

export default Link
