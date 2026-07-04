'use client'

import { motion } from 'framer-motion'
import { Link } from '@/lib/nav'
import { FileText, ArrowLeft } from 'lucide-react'
import { legalList, type LegalDoc } from '@/data/legal'
import Footer from '../components/Footer'

export default function LegalView({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <main className="pt-[68px] min-h-screen" style={{ background: 'var(--cream)' }}>
        {/* Header band */}
        <section className="border-b border-gray-100 bg-white">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-600 text-gray-500 hover:text-gray-800 mb-6 transition-colors">
              <ArrowLeft size={15} /> Back to home
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center">
                <FileText size={20} className="text-green-600" />
              </div>
              <div>
                <h1 className="font-display font-900 text-gray-900 tracking-tight" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}>
                  {doc.title}
                </h1>
                <p className="text-xs text-gray-400 font-600 mt-0.5">Last updated: {doc.updated}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-600 leading-relaxed mb-10 text-[1.02rem]">{doc.intro}</p>

            <div className="space-y-8">
              {doc.sections.map((s) => (
                <section key={s.heading}>
                  <h2 className="font-display font-800 text-gray-900 text-lg mb-3">{s.heading}</h2>
                  <div className="space-y-3">
                    {s.body.map((p, i) => (
                      <p key={i} className="text-gray-600 leading-relaxed text-[0.97rem]">{p}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Cross-links */}
            <div className="mt-14 pt-8 border-t border-gray-100">
              <p className="text-xs font-700 uppercase tracking-wider text-gray-400 mb-4">Related policies</p>
              <div className="flex flex-wrap gap-2.5">
                {legalList
                  .filter((l) => l.slug !== doc.slug)
                  .map((l) => (
                    <Link
                      key={l.slug}
                      to={`/legal/${l.slug}`}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-600 text-gray-600 hover:border-green-300 hover:text-green-700 hover:bg-green-50/50 transition-all"
                    >
                      {l.title}
                    </Link>
                  ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
