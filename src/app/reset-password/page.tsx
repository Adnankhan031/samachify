import type { Metadata } from 'next'
import ResetPasswordView from '@/views/ResetPasswordView'

export const metadata: Metadata = {
  title: 'Reset password',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <ResetPasswordView />
}
