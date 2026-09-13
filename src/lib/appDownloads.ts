import { NextResponse } from 'next/server'

/**
 * Where `/app` and `/delivery-app` send people.
 *
 * The Android apps are distributed as APKs rather than through the Play Store,
 * and every host we have puts a clock on the file: EAS deletes build artefacts
 * after 14 days, and Supabase Storage refuses anything over 50 MB on our plan
 * (the builds are over 100 MB). So the URL of the file itself keeps changing,
 * while the link we hand to a person has to not.
 *
 * These routes are that stable link. The target lives in an environment
 * variable so a new build can be pointed at from the Vercel dashboard without
 * a deploy, and the constants below are only the fallback for when it has not
 * been set yet.
 *
 * Deliberately a temporary redirect: a permanent one would be cached by the
 * browser and by every proxy in between, and the whole point of this file is
 * that the destination changes.
 */

/** Set these environment variables in Vercel to override the fallback targets. */
const FALLBACK = {
  customer:
    'https://expo.dev/artifacts/eas/XMJaI8j6dilDafiI4W-Bv75MLnfyci4CZvEJEBDE_A8.apk',
  delivery:
    'https://expo.dev/artifacts/eas/Iy8trWZNp4s17rDDb2WvmTaQ9GGQ4JaXLZL_I-UUhXM.apk',
  admin:
    'https://expo.dev/artifacts/eas/d5DTtGv8OwsSJF9QltkkzkcZDTQnj0ROm8v7QnNM99w.apk',
} as const

export function apkRedirect(which: keyof typeof FALLBACK) {
  const configured = {
    customer: process.env.CUSTOMER_APK_URL,
    delivery: process.env.DELIVERY_APK_URL,
    admin: process.env.ADMIN_APK_URL,
  }[which]

  const target = configured?.trim() || FALLBACK[which]

  return NextResponse.redirect(target, {
    status: 302,
    headers: {
      // A stale link here means someone installs a build we have replaced.
      'Cache-Control': 'no-store',
    },
  })
}
