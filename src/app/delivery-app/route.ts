import { apkRedirect } from '@/lib/appDownloads'

/** samachify.in/delivery-app → the current delivery partner APK. */
export const dynamic = 'force-dynamic'

export function GET() {
  return apkRedirect('delivery')
}
