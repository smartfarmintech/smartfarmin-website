import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import { SWRProvider } from '@/components/swr-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rythu360 — AI-Powered Agricultural Technology Platform | SmartFarmin',
  description:
    'Rythu360 is an AI-powered agriculture platform uniting crop advisory, drone services, machinery booking, organic marketplace, and weather intelligence. Trusted by 10,000+ farmers across 500+ Indian villages for digital transformation in agriculture.',
  keywords: [
    'agricultural technology',
    'AI crop doctor',
    'farm management platform',
    'drone services',
    'farm machinery rental',
    'agri-marketplace',
    'sustainable farming',
    'precision agriculture',
    'Indian agriculture',
    'smart farming',
    'FPO management',
    'farm inventory',
    'crop disease detection',
    'agricultural IoT',
  ],
  authors: [{ name: 'SmartFarmin Technologies' }],
  creator: 'SmartFarmin Technologies Pvt. Ltd.',
  publisher: 'SmartFarmin Technologies Pvt. Ltd.',
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://rythu360.com',
    siteName: 'Rythu360 - Smart Farming Platform',
    title: 'Rythu360 — AI-Powered Agricultural Technology Platform',
    description:
      'Transform your agricultural operations with AI-powered advisory, real-time monitoring, and enterprise management tools.',
    images: [
      {
        url: 'https://rythu360.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rythu360 - AI Agricultural Platform',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SmartFarmin360',
    creator: '@SmartFarmin360',
    title: 'Rythu360 — Transform Your Farm with AI',
    description:
      'AI-powered agriculture platform for farmers, enterprises, and government organizations across India.',
    images: ['https://rythu360.com/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://rythu360.com',
    languages: {
      'en-IN': 'https://rythu360.com',
      'te-IN': 'https://rythu360.com/te',
      'hi-IN': 'https://rythu360.com/hi',
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
  category: 'agriculture',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0B0F14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <SWRProvider>
          {children}
        </SWRProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
