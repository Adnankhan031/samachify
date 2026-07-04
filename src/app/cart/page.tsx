import type { Metadata } from 'next'
import CartView from '@/views/CartView'

export const metadata: Metadata = {
  title: 'Your Cart',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <CartView />
}
