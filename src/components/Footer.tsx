import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, MessageCircle, ShieldCheck, Sprout, Leaf } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Technology', href: '/technology' },
  { label: 'Contact', href: '/contact' },
]

const productLinks = [
  { label: 'Sambar Pack', href: '/products/sambar-pack' },
  { label: 'Kara Kuzhambu Pack', href: '/products/kara-kuzhambu-pack' },
  { label: 'Coconut Chutney Pack', href: '/products/coconut-chutney-pack' },
  { label: 'Tomato Chutney Pack', href: '/products/tomato-chutney-pack' },
  { label: 'Mint Chutney Pack', href: '/products/mint-chutney-pack' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0b1712] text-gray-300 border-t border-[#1a3328]">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-green-600">
                <img src="/assets/logo.png" alt="Samachify" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-display font-800 text-white text-xl tracking-wide">SAMACHIFY</div>
                <div className="text-xs text-green-400 font-600 tracking-widest uppercase">From Farm to Pan</div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Fresh, pre-cut, dish-specific ingredient packs for authentic South Indian cooking.
              No prep. No waste. Just real food, cooked by you in minutes.
            </p>
            <div className="space-y-2.5 text-sm mb-6">
              <a href="mailto:samachifydotin@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                <Mail size={14} className="text-green-600" /> samachifydotin@gmail.com
              </a>
              <a href="tel:+917305264055" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                <Phone size={14} className="text-green-600" /> +91 73052 64055
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={14} className="text-green-600" /> Kanchipuram, Tamil Nadu
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-700 text-white text-sm mb-5 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-400 hover:text-green-400 text-sm transition-colors flex items-center">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-700 text-white text-sm mb-5 uppercase tracking-wider">Our Products</h4>
            <ul className="space-y-3">
              {productLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-400 hover:text-green-400 text-sm transition-colors flex items-center">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-700 text-white text-sm mb-5 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Terms & Conditions</Link></li>
              <li>
                <div className="flex items-center gap-2 text-gray-400 text-sm mt-4">
                  <ShieldCheck size={14} className="text-green-500" />
                  <span>FSSAI: 22426421000333</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Band */}
        <div className="border-t border-[#162d22] py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-3 bg-[#11231a] p-4 rounded-2xl border border-[#1e3a2e]">
            <ShieldCheck className="text-green-500 flex-shrink-0" size={24} />
            <div>
              <div className="text-white font-600 text-xs uppercase tracking-wider">FSSAI Certified</div>
              <div className="text-[11px] text-gray-400 mt-0.5">License: 22426421000333</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#11231a] p-4 rounded-2xl border border-[#1e3a2e]">
            <Sprout className="text-green-500 flex-shrink-0" size={24} />
            <div>
              <div className="text-white font-600 text-xs uppercase tracking-wider">100% Farm Fresh</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Sourced local, prepped same-day</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#11231a] p-4 rounded-2xl border border-[#1e3a2e]">
            <Leaf className="text-green-500 flex-shrink-0" size={24} />
            <div>
              <div className="text-white font-600 text-xs uppercase tracking-wider">Zero Waste Kitchen</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Only what you need, pre-measured</div>
            </div>
          </div>
        </div>

        {/* Social and copyright */}
        <div className="border-t border-[#162d22] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-600 uppercase tracking-wider">Follow us:</span>
            {[
              { icon: Instagram, href: '#', label: 'Instagram' },
              { icon: Facebook, href: '#', label: 'Facebook' },
              { icon: Youtube, href: '#', label: 'YouTube' },
              { icon: MessageCircle, href: 'https://wa.me/917305264055', label: 'WhatsApp' },
            ].map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-2xl bg-[#11231a] hover:bg-green-700 border border-[#1e3a2e] hover:border-green-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon size={16} />
                </a>
              )
            })}
          </div>
          <div className="text-center sm:text-right">
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} Samachify Foods Private Limited. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-[#060c09] py-3 text-center border-t border-[#11231a]">
        <p className="text-green-500/70 text-[10px] sm:text-xs font-600 tracking-[0.2em] uppercase">
          Fresh · Pre-Cut · Hygienic · Zero Waste · Local Farmers · Authentic South Indian Taste
        </p>
      </div>
    </footer>
  )
}
