import type { Metadata } from 'next'
import Contact from '@/views/Contact'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Samachify. Questions about our fresh ready-to-cook meal kits, delivery areas, or partnerships — we would love to hear from you.',
}

export default function Page() {
  return <Contact />
}
