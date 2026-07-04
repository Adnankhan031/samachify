import type { Metadata, Viewport } from 'next'
import '@/index.css'
import Providers from './Providers'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  metadataBase: new URL('https://samachify.com'),
  title: {
    default: 'Samachify — From Farm To Pan | Fresh South Indian Meal Kits',
    template: '%s | Samachify',
  },
  description:
    "South India's first fresh ingredient meal kit. Farm-fresh, pre-cut vegetables and ready-to-cook packs for authentic Sambar, Kara Kuzhambu, and chutneys in 10–15 minutes.",
  keywords: [
    'South Indian meal kit',
    'ready to cook',
    'sambar pack',
    'kara kuzhambu',
    'coconut chutney',
    'tomato chutney',
    'fresh ingredients',
    'Chennai food delivery',
  ],
  authors: [{ name: 'Samachify' }],
  openGraph: {
    type: 'website',
    siteName: 'Samachify',
    title: 'Samachify — From Farm To Pan',
    description:
      "South India's first fresh ingredient meal kit. Authentic South Indian meals in 10–15 minutes.",
    images: ['/assets/hero_1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samachify — From Farm To Pan',
    description: "South India's first fresh ingredient meal kit.",
  },
  icons: {
    icon: '/assets/logo.png',
    apple: '/assets/logo.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4d8b14',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
