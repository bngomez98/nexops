'use client'

import Script from 'next/script'

const ZENDESK_KEY = process.env.NEXT_PUBLIC_ZENDESK_KEY || 'd8a1128c-008a-443c-894e-4a0fd463bb57'

export function ZendeskWidget() {
  return (
    <Script
      id="ze-snippet"
      src={`https://static.zdassets.com/ekr/snippet.js?key=${ZENDESK_KEY}`}
      strategy="lazyOnload"
    />
  )
}
