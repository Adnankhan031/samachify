import type { Metadata } from 'next'
import Technology from '@/views/Technology'

export const metadata: Metadata = {
  title: 'Our Technology — Freshness, Engineered',
  description:
    'How Samachify keeps ingredients farm-fresh: cold-chain handling, hygienic pre-cutting, and preservative-free packing for authentic South Indian meals.',
}

export default function Page() {
  return <Technology />
}
