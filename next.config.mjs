/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint is run separately (opt-in via CI workflow_dispatch or `pnpm lint`).
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
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
    ],
  },
  async redirects() {
    return [
      // Dashboard legacy route redirects
      {
        source: '/dashboard/requests/new',
        destination: '/dashboard/homeowner/new-request',
        permanent: true,
      },
      {
        source: '/dashboard/requests',
        destination: '/dashboard/homeowner/requests',
        permanent: true,
      },
      {
        source: '/dashboard/earnings',
        destination: '/dashboard/contractor/payments',
        permanent: true,
      },
      {
        source: '/dashboard/team',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
