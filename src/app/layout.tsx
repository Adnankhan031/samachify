import type { Metadata, Viewport } from 'next'
import '@/index.css'
import 'leaflet/dist/leaflet.css'
import Providers from './Providers'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  metadataBase: new URL('https://samachify.in'),
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
    url: 'https://samachify.in',
    title: 'Samachify — From Farm To Pan',
    description:
      "South India's first fresh ingredient meal kit. Authentic South Indian meals in 10–15 minutes.",
    images: ['/assets/hero-all-products.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samachify — From Farm To Pan',
    description: "South India's first fresh ingredient meal kit.",
  },
  // Icons are provided by app/icon.png + app/apple-icon.png (square badge crop).
}

// Brand structured data — helps Google show the logo & understand the business.
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Samachify',
  legalName: 'Samachify Foods Pvt Ltd',
  url: 'https://samachify.in',
  logo: 'https://samachify.in/assets/logo-square.png',
  image: 'https://samachify.in/assets/logo-square.png',
  description:
    "South India's first fresh ingredient meal kit — farm-fresh, pre-cut vegetables and ready-to-cook packs for authentic South Indian dishes.",
  sameAs: [
    'https://www.instagram.com/samachify.in/',
    'https://www.youtube.com/@samachifydotin',
    'https://www.linkedin.com/company/samachify-foods-pvt-ltd/',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Samachify',
  url: 'https://samachify.in',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
