import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Enable React strict mode for better development-time warnings
  reactStrictMode: true,

  // Optimize images from external sources if needed
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Experimental features
  experimental: {
    // Optimize CSS output
    optimizeCss: false,
  },

  // Compiler options
  compiler: {
    // Remove console statements in production (except errors)
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error"] }
      : false,
  },

  // Headers are handled in middleware.js, but we can add additional static ones here
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Powered-By",
            value: "",
          },
        ],
      },
    ]
  },
}

export default nextConfig
