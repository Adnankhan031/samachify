import type { Metadata } from 'next'
import { products } from '@/data/products'
import ProductDetail from '@/views/ProductDetail'

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = products.find((p) => p.id === id)
  if (!product) return { title: 'Product not found' }
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} — Samachify`,
      description: product.description,
      images: [product.image],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = products.find((p) => p.id === id)

  // Product structured data for rich results in Google.
  const jsonLd = product && {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: `https://samachify.in${product.image}`,
    brand: { '@type': 'Brand', name: 'Samachify' },
    category: 'Ready-to-cook meal kit',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      url: `https://samachify.in/products/${product.id}`,
    },
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetail />
    </>
  )
}
