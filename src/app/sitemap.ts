import type { MetadataRoute } from 'next'
import { products } from '@/data/products'
import { legalDocs } from '@/data/legal'

const BASE = 'https://samachify.in'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/products', '/about', '/technology', '/contact'].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const productRoutes = products.map((p) => ({
    url: `${BASE}/products/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const legalRoutes = Object.keys(legalDocs).map((slug) => ({
    url: `${BASE}/legal/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }))

  return [...staticRoutes, ...productRoutes, ...legalRoutes]
}
