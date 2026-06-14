import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const location = useLocation()

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
          : `bg-white border-b border-green-100 ${scrolled ? 'py-2 shadow-lg shadow-black/[0.06] backdrop-blur-xl' : 'py-3'}`
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
                className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-green-600 transition-all duration-200"
                style={{ opacity: isActive(link.href) ? 1 : 0, transform: isActive(link.href) ? 'scaleX(1)' : 'scaleX(0)' }}
              />
            </Link>
          ))}
        </div>

        {/* CTA + hamburger — flex-1 justify-end */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <Link
            to="/products"
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-700 rounded-xl text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/25"
          >
            Explore Products
          </Link>
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
