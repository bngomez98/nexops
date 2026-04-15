import nextConfig from '@/next.config.mjs'

describe('next config', () => {
  it('defines image remote patterns', () => {
    expect(nextConfig.images?.remotePatterns).toBeDefined()
    expect(Array.isArray(nextConfig.images?.remotePatterns)).toBe(true)
    expect(nextConfig.images?.remotePatterns.length).toBeGreaterThan(0)
  })
})
