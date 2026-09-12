import type { Metadata } from 'next'
import SupportView from '@/views/SupportView'

export const metadata: Metadata = { title: 'Order Support', description: 'Chat securely with Samachify support about your order.' }

export default function SupportPage() { return <SupportView /> }
