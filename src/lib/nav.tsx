'use client'

/**
 * React Router → Next.js compatibility shim.
 *
 * The site was migrated from a Vite + react-router-dom SPA to Next.js.
 * Rather than rewrite every <Link to=...>, useLocation(), and useParams()
 * call across ~7k lines, this module re-exports Next's primitives in the
 * shape the old code expects. New code should prefer next/link + next/navigation
 * directly, but everything here is a thin, zero-cost wrapper.
 */

import NextLink from 'next/link'
import { usePathname, useParams as useNextParams, useRouter } from 'next/navigation'
import type { ComponentProps, ReactNode } from 'react'

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  to: string
  children?: ReactNode
}

/** Drop-in replacement for react-router's <Link to="...">. */
export function Link({ to, children, ...rest }: LinkProps) {
  return (
    <NextLink href={to} {...rest}>
      {children}
    </NextLink>
  )
}

/** Mimics react-router's useLocation() — only .pathname is used in this app. */
export function useLocation() {
  const pathname = usePathname() ?? '/'
  return { pathname }
}

/** Mimics react-router's useParams(). */
export function useParams<T extends Record<string, string> = Record<string, string>>() {
  return useNextParams() as unknown as T
}

/** Mimics react-router's useNavigate(). */
export function useNavigate() {
  const router = useRouter()
  return (to: string) => router.push(to)
}
