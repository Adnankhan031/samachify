import type { Metadata } from 'next'
import About from '@/views/About'

export const metadata: Metadata = {
  title: 'About Us — Our Story',
  description:
    "Learn the story behind Samachify — South India's first fresh ingredient meal kit, bringing farm-fresh, pre-cut ingredients from farm to pan.",
}

export default function Page() {
  return <About />
}
