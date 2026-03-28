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
    theme_color: '#3d7a4f',
    lang: 'en-US',
    categories: ['business', 'productivity', 'utilities'],
    icons: [
      { src: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
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
