import { describe, expect, it } from 'vitest'

describe('next config', () => {
  it('exports image remote patterns', async () => {
    const { default: nextConfig } = await import('../next.config.mjs')
    const remotePatterns = nextConfig.images?.remotePatterns ?? []

    expect(remotePatterns.length).toBeGreaterThan(0)
    expect(remotePatterns).toContainEqual(
      expect.objectContaining({
        protocol: 'https',
      }),
    )
  })
})
