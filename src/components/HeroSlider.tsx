'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'

/**
 * Full-bleed hero background: crossfades through the lifestyle shots with a
 * slow Ken Burns zoom on the active slide. Sits behind the cream overlay + text.
 */
const HERO_IMAGES = [
  { src: '/assets/hero-all-products.webp', pos: '55% center' },
  { src: '/assets/hero-sambar-meal.webp', pos: '60% center' },
  { src: '/assets/hero-kara-meal.webp', pos: '60% center' },
  { src: '/assets/hero-chutney-breakfast.webp', pos: '55% center' },
  { src: '/assets/hero-all-products-2.webp', pos: '55% center' },
]

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      speed={1400}
      loop
      allowTouchMove={false}
      autoplay={{ delay: 4200, disableOnInteraction: false }}
      className="hero-swiper absolute inset-0 w-full h-full"
      style={{ width: '100%', height: '100%' }}
    >
      {HERO_IMAGES.map((img, i) => (
        <SwiperSlide key={img.src}>
          <img
            src={img.src}
            alt=""
            aria-hidden="true"
            fetchPriority={i === 0 ? 'high' : 'low'}
            className="hero-kenburns w-full h-full"
            style={{ objectFit: 'cover', objectPosition: img.pos }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
