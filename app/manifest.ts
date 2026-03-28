import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nexus Operations',
    short_name: 'NexusOps',
    description: 'Cross-platform operations app for community-driven service requests, automation, tracking, and billing.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f9fb',
    theme_color: '#0f1e36',
    orientation: 'portrait',
    categories: ['business', 'productivity', 'utilities'],
    lang: 'en-US',
    icons: [
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  }
}
