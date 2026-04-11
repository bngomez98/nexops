import type React from 'react'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/app/lib/auth-context'
import { CookieConsentBanner } from '@/components/cookie-consent'
import { ZendeskWidget } from '@/components/zendesk-widget'
import { CONTACT_INFO } from '@/lib/contact-info'
import './globals.css'

const GTM_ID = 'GTM-PL3NBCWD'
const GA_ID = 'G-LDGVHFCMKT'

const THEME_INIT_SCRIPT = `(function(){var t=localStorage.getItem('nexus-theme');document.documentElement.classList.add(t==='dark'?'dark':'light');})()`

const CONSENT_DEFAULT_SCRIPT = [
  `window.dataLayer=window.dataLayer||[];`,
  `function gtag(){dataLayer.push(arguments);}`,
  `gtag('consent','default',{`,
  `  analytics_storage:'denied',`,
  `  ad_storage:'denied',`,
  `  ad_user_data:'denied',`,
  `  ad_personalization:'denied',`,
  `  wait_for_update:500`,
  `});`,
  `gtag('set','ads_data_redaction',true);`,
].join('\n')

const GTM_INIT_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`

const GA_INIT_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`

const GOOGLE_MERCHANT_ID = /^\d+$/.test(process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_ID ?? '')
  ? process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_ID
  : null

const GCR_BADGE_SCRIPT = GOOGLE_MERCHANT_ID
  ? [
      `window.renderBadge = function() {`,
      `  var c = document.createElement("div");`,
      `  document.body.appendChild(c);`,
      `  window.gapi.load("ratingbadge", function() {`,
      `    window.gapi.ratingbadge.render(c, {`,
      `      "merchant_id": ${GOOGLE_MERCHANT_ID},`,
      `      "position": "BOTTOM_RIGHT"`,
      `    });`,
      `  });`,
      `};`,
    ].join('\n')
  : null

const COMPANY_NAME = 'Nexus Operations, LLC'
const DEFAULT_OG_IMAGE = '/nexus-logo.png'

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: CONTACT_INFO.companyName,
  url: `https://${CONTACT_INFO.website}`,
  email: CONTACT_INFO.email,
  telephone: CONTACT_INFO.phoneDisplay,
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONTACT_INFO.addressLine1,
    addressLocality: 'Topeka',
    addressRegion: 'KS',
    postalCode: '66604',
    addressCountry: 'US',
  },
  areaServed: CONTACT_INFO.serviceArea,
  openingHours: 'Mo-Fr 08:00-17:00',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://nexusoperations.org'),
  title: {
    default: 'Nexus Operations — Property Maintenance Coordination in Topeka, KS',
    template: '%s — Nexus Operations',
  },
  description:
    'Nexus Operations coordinates property maintenance for homeowners, landlords, and property managers in Topeka and Shawnee County, Kansas. We assign verified, licensed contractors, enforce response-time guarantees, and document every job from request to completion.',
  keywords: [
    'property maintenance Topeka',
    'maintenance coordination Kansas',
    'verified contractors Shawnee County',
    'property management Topeka KS',
    'licensed contractor network',
    'home repair coordination',
    'commercial property maintenance',
    'residential maintenance Topeka',
    'contractor assignment service',
    'Nexus Operations',
  ],
  authors: [{ name: COMPANY_NAME }],
  creator: COMPANY_NAME,
  publisher: COMPANY_NAME,
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.webmanifest',
  applicationName: 'Nexus Operations',
  appleWebApp: {
    title: 'Nexus Operations',
    capable: true,
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/nexus-favicon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/nexus-favicon.png',
    shortcut: '/nexus-favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexusoperations.org',
    title: 'Nexus Operations — Property Maintenance Coordination in Topeka, KS',
    description:
      'Nexus Operations coordinates property maintenance for homeowners, landlords, and property managers in Topeka and Shawnee County, Kansas. Verified contractors, documented jobs, guaranteed response times.',
    siteName: 'Nexus Operations',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Nexus Operations property service coordination' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexus Operations — Property Maintenance Coordination',
    description:
      'Licensed contractor coordination for homeowners and property managers in Topeka, KS. Verified network, guaranteed response times, full project documentation.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'GPT-5.3-Codex',
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
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif&display=swap"
          rel="stylesheet"
        />
        <Script id="consent-default" strategy="beforeInteractive">
          {CONSENT_DEFAULT_SCRIPT}
        </Script>
        <Script id="gtm-init" strategy="afterInteractive">
          {GTM_INIT_SCRIPT}
        </Script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {GA_INIT_SCRIPT}
        </Script>
        <Script
          id="local-business-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
        />
        {GCR_BADGE_SCRIPT && (
          <>
            <Script id="gcr-badge-init" strategy="afterInteractive">
              {GCR_BADGE_SCRIPT}
            </Script>
            <Script
              src="https://apis.google.com/js/platform.js?onload=renderBadge"
              strategy="lazyOnload"
            />
          </>
        )}
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <AuthProvider>{children}</AuthProvider>
        <CookieConsentBanner />
        <Toaster position="bottom-right" richColors closeButton />
        <Analytics />
        <SpeedInsights />
        <ZendeskWidget />
      </body>
    </html>
  )
}
