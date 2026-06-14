import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { faqs } from '../data/products'

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section className="faq-section" id="faq">
      <div className="home-container" style={{ maxWidth: '800px' }}>
        <motion.div
          className="section-head-center"
          initial={{ y: 28, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
        >
          <div className="section-label">❓ FAQ</div>
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <p className="section-sub" style={{ margin: '14px auto 0' }}>
            Got questions about freshness, shelf life, delivery, or subscriptions? We've got answers.
          </p>
        </motion.div>

        <div className="faq-list" style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id
            return (
              <motion.div
                key={faq.id}
                className="faq-item"
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--white)',
                  overflow: 'hidden',
                  boxShadow: isOpen ? 'var(--shadow-sm)' : 'none',
                  transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
                }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    color: 'var(--ink)',
                  }}
                >
                  <span>{faq.question}</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isOpen ? 'var(--green-50)' : 'var(--cream-2)',
                      color: isOpen ? 'var(--green-800)' : 'var(--muted)',
                      fontSize: '1.25rem',
                      lineHeight: 1,
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    ＋
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div
                        style={{
                          padding: '0 24px 20px 24px',
                          color: 'var(--muted)',
                          lineHeight: 1.6,
                          fontSize: '0.975rem',
                        }}
                      >
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
