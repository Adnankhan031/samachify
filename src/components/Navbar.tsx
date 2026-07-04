'use client'

import { useEffect, useState } from 'react'
import { Link, useLocation } from '@/lib/nav'
import { Menu, X, ShoppingBag, User, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About Us', href: '/about' },
  { label: 'Technology', href: '/technology' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const location = useLocation()
  const { totalItems, openCart } = useCart()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname])

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        transparent
          ? 'py-3.5 bg-transparent border-b border-transparent'
          : `bg-white border-b border-transparent ${scrolled ? 'py-2 shadow-lg shadow-black/[0.06] backdrop-blur-xl' : 'py-3'}`
      }`}
    >
      <nav className="relative flex items-center justify-between" style={{ paddingLeft: 'max(1.25rem, 5vw)', paddingRight: 'max(1.25rem, 5vw)' }}>

        {/* Logo — flex-1 so it anchors left */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 flex-1">
          <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-green-600/80">
            <img
              src="/assets/logo.png"
              alt="Samachify"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="font-display font-800 text-gray-900 tracking-tight leading-none" style={{ fontSize: '1.05rem' }}>
              SAMACHIFY
            </div>
            <div className="font-600 tracking-widest text-green-600/75 leading-none mt-[3px]" style={{ fontSize: '0.58rem' }}>
              FROM FARM TO PAN
            </div>
          </div>
        </Link>

        {/* Desktop nav links — absolutely centered */}
        <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative px-4 py-2.5 text-sm font-600 transition-colors duration-200 whitespace-nowrap group ${
                isActive(link.href)
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {link.label}
              <span
                className="absolute bottom-1.5 left-1/2 h-[3px] w-7 rounded-full bg-green-600 transition-opacity duration-200"
                style={{ transform: 'translateX(-50%)', opacity: isActive(link.href) ? 1 : 0 }}
              />
            </Link>
          ))}
        </div>

        {/* Actions — flex-1 justify-end */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end">
          {/* Account */}
          <div className="relative hidden sm:block">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-800 flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm font-700 max-w-[110px] truncate">{user.name.split(' ')[0]}</span>
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-1.5 z-50"
                      >
                        <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                          <p className="text-sm font-800 text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link to="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-600 text-gray-700 hover:bg-gray-50 transition-colors">
                          <User size={15} /> My Account
                        </Link>
                        <button
                          onClick={() => { signOut(); setAccountOpen(false) }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-600 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={15} /> Sign out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-700 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <User size={16} /> Login
              </Link>
            )}
          </div>

          {/* Cart */}
          <button
            type="button"
            aria-label="Open cart"
            onClick={openCart}
            className="relative p-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag size={21} />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 400 }}
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-green-600 text-white text-[10px] font-800 flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          {/* Hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-600 transition-colors ${
                    isActive(link.href)
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/account" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-600 text-gray-700 hover:bg-gray-50">
                    <User size={16} /> {user.name}
                  </Link>
                  <button onClick={() => signOut()} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-600 text-red-500 hover:bg-red-50">
                    <LogOut size={16} /> Sign out
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-600 text-gray-700 hover:bg-gray-50">
                  <User size={16} /> Login / Sign up
                </Link>
              )}
              <Link
                to="/products"
                className="flex items-center justify-center px-4 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-700 mt-2 transition-colors"
              >
                Explore Products
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
