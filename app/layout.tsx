import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Nexus Operations',
  description: 'Connect homeowners with licensed, insured contractors in Topeka, KS and surrounding regions.',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  themeColor: '#1a1a1a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        {/* Zendesk AI Agent Widget */}
        <script
          id="ze-snippet"
          src="https://static.zdassets.com/ekr/snippet.js?key=d8a1128c-008a-443c-894e-4a0fd463bb57"
          async
        />
      </body>
    </html>
  )
}
