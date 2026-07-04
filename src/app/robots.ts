import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep private/transactional pages out of search results
      disallow: ['/checkout', '/cart', '/account', '/login', '/signup', '/api/'],
    },
    sitemap: 'https://samachify.in/sitemap.xml',
  }
}
