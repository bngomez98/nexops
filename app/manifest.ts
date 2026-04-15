import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nexus Operations',
    short_name: 'Nexus Ops',
    description: 'Automated community workflow for service requests, tracking, documentation, and billing.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#2d6a42',
    lang: 'en-US',
    categories: ['business', 'productivity', 'utilities'],
    icons: [
      { src: '/nexus-favicon.png', sizes: '180x180', type: 'image/png' },
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
    shortcuts: [
      {
        name: 'New service request',
        short_name: 'New request',
        description: 'Create a new homeowner request.',
        url: '/dashboard/homeowner/new-request',
      },
      {
        name: 'Community request board',
        short_name: 'Board',
        description: 'Browse active service requests and statuses.',
        url: '/dashboard/all-requests',
      },
    ],
  }
}
