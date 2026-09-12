'use client'

import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { testimonials } from '@/data/products'

export default function ReviewMarquee() {
  const [paused, setPaused] = useState(false)
  return (
    <section aria-label="Customer reviews" className="reviews-marquee" data-paused={paused}>
      <button
        type="button"
        className="reviews-control"
        aria-label={paused ? 'Play customer reviews' : 'Pause customer reviews'}
        aria-pressed={paused}
        title={paused ? 'Play reviews' : 'Pause reviews'}
        onClick={() => setPaused(!paused)}
      >
        {paused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
        <span>{paused ? 'Resume' : 'Pause motion'}</span>
      </button>
      <div className="reviews-window">
        <div className="reviews-track">
          {[0, 1].map(copy => (
            <div className="reviews-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {testimonials.map(t => (
                <article className="review-card" key={t.id}>
                  <span className="text-amber-600" aria-label={`${t.rating} out of 5 stars`}>{'★'.repeat(t.rating)}</span>
                  <blockquote className="my-5 text-gray-700 leading-relaxed">“{t.text}”</blockquote>
                  <p className="font-bold text-green-950">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role} · {t.location}</p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
