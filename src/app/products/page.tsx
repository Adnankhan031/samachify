import type { Metadata } from 'next'
import Products from '@/views/Products'

export const metadata: Metadata = {
  title: 'Our Products — Fresh Ready-to-Cook Packs',
  description:
    'Explore Samachify ready-to-cook packs: Sambar, Kara Kuzhambu, Coconut Chutney and Tomato Chutney. Farm-fresh, pre-cut ingredients delivered to your door.',
}

export default function Page() {
  return <Products />
}
