'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { CartProvider } from '@/context/CartContext'

/**
 * Client-side providers + global behaviours.
 * - Lenis smooth scroll (was in the old App.tsx)
 * - Scroll-to-top on route change (replaces the old <ScrollToTop /> component,
 *   coordinated with Lenis so it doesn't fight the smooth-scroll engine)
 * - CartProvider (was defined but never mounted in the Vite app)
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true })
    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return <CartProvider>{children}</CartProvider>
}
