import { apkRedirect } from '@/lib/appDownloads'

/** samachify.in/app → the current customer APK. */
export const dynamic = 'force-dynamic'

export function GET() {
  return apkRedirect('customer')
}
