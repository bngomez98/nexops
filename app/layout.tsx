import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Instrument_Serif } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "sonner"
import { AuthProvider } from "@/app/lib/auth-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://nexusoperations.org"),
  title: {
    default: "Nexus Operations | Property Service Management Platform",
    template: "%s | Nexus Operations",
  },
  description:
    "Nexus Operations is the all-in-one property service management platform for homeowners, contractors, and property managers in Topeka, Kansas. Submit requests, track projects, and manage billing in one place.",
  keywords: [
    "property maintenance",
    "service requests",
    "contractor management",
    "property management Topeka",
    "maintenance coordination",
    "Kansas property services",
    "verified contractors",
    "Nexus Operations",
  ],
  authors: [{ name: "Nexus Operations" }],
  creator: "Nexus Operations",
  publisher: "Nexus Operations",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexusoperations.org",
    title: "Nexus Operations | Property Service Management Platform",
    description:
      "Submit one request. Get one verified contractor. Track every project from start to finish.",
    siteName: "Nexus Operations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Operations | Property Services",
    description:
      "One request. One verified contractor. Complete project history.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/icon-light-32x32.png',
  },
}

export const viewport: Viewport = {
  themeColor: "#3d7a4f",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="bottom-right" richColors closeButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
