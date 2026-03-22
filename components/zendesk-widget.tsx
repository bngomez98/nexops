'use client'

import Script from 'next/script'

const ZENDESK_KEY = process.env.NEXT_PUBLIC_ZENDESK_KEY

export function ZendeskWidget() {
  if (!ZENDESK_KEY) return null

  return (
    <Script
      id="ze-snippet"
      src={`https://static.zdassets.com/ekr/snippet.js?key=${ZENDESK_KEY}`}
      strategy="lazyOnload"
    />
  )
}
