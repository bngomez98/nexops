import { describe, expect, it } from 'vitest'

import nextConfig from '@/next.config.mjs'

describe('next.config', () => {
  it('keeps Next image optimization enabled for local assets', () => {
    expect(nextConfig.images?.unoptimized).not.toBe(true)
  })

  it('allows the configured remote image hosts', () => {
    expect(nextConfig.images?.remotePatterns).toEqual([
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/user-attachments/assets/**',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
        pathname: '/user-attachments/**',
      },
    ])
  })
})
