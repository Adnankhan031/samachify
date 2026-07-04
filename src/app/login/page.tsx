import type { Metadata } from 'next'
import AuthView from '@/views/AuthView'

export const metadata: Metadata = {
  title: 'Login',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AuthView mode="login" />
}
