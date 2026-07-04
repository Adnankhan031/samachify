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

export default function Page() {
  return <ProductDetail />
}
