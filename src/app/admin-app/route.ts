import { apkRedirect } from '@/lib/appDownloads'

/** samachify.in/admin-app → the current admin app build. */
export const dynamic = 'force-dynamic'

export function GET() {
  return apkRedirect('admin')
}
