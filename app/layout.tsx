import type React from "react"
import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "sonner"
import { AuthProvider } from "@/app/lib/auth-context"
import { ZendeskWidget } from "@/components/zendesk-widget"
import "./globals.css"

const GTM_ID = "GTM-PL3NBCWD"
const GA_ID = "G-LDGVHFCMKT"
const ZENDESK_KEY = "d8a1128c-008a-443c-894e-4a0fd463bb57"

const THEME_INIT_SCRIPT = `(function(){var t=localStorage.getItem('nexus-theme');document.documentElement.classList.add(t==='dark'?'dark':'light');})()`

const GTM_INIT_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`

const GA_INIT_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`

export const metadata: Metadata = {
  metadataBase: new URL('https://nexusoperations.org'),
  title: {
    default: 'Nexus Operations | Property Service Management Platform',
    template: '%s | Nexus Operations',
  },
  description:
    'Nexus Operations is the all-in-one property service management platform for homeowners, contractors, and property managers in Topeka, Kansas. Submit requests, track projects, and manage billing in one place.',
  keywords: [
    'property maintenance',
    'service requests',
    'contractor management',
    'property management Topeka',
    'maintenance coordination',
    'Kansas property services',
    'verified contractors',
    'Nexus Operations',
  ],
  authors: [{ name: 'Nexus Operations' }],
  creator: 'Nexus Operations',
  publisher: 'Nexus Operations',
  icons: { icon: '/favicon.ico', apple: '/favicon.ico' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexusoperations.org',
    title: 'Nexus Operations | Property Service Management Platform',
    description:
      'Submit one request. Get one verified contractor. Track every project from start to finish.',
    siteName: 'Nexus Operations',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexus Operations | Property Services',
    description:
      'One request. One verified contractor. Complete project history.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#3d7a4f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Theme flash prevention */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif&display=swap"
          rel="stylesheet"
        />
        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {GTM_INIT_SCRIPT}
        </Script>
        {/* Google Analytics */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {GA_INIT_SCRIPT}
        </Script>
        {/* Zendesk Widget */}
        <Script
          id="ze-snippet"
          src={`https://static.zdassets.com/ekr/snippet.js?key=${ZENDESK_KEY}`}
          strategy="lazyOnload"
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="bottom-right" richColors closeButton />
        <Analytics />
        <SpeedInsights />
        <ZendeskWidget />
      </body>
    </html>
  )
}
