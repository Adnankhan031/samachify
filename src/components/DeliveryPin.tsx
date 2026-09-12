'use client'

import { useEffect, useRef, useState } from 'react'
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet'
import { CheckCircle2, Loader2, LocateFixed, MapPin } from 'lucide-react'
import { OPERATING_OFFICE } from '@/lib/office'

export type DeliveryPoint = { latitude: number; longitude: number }

export default function DeliveryPin({ value, onChange }: { value: DeliveryPoint | null; onChange: (point: DeliveryPoint) => void }) {
  const node = useRef<HTMLDivElement>(null)
  const map = useRef<LeafletMap | null>(null)
  const marker = useRef<LeafletMarker | null>(null)
  const callback = useRef(onChange)
  callback.current = onChange

  const [ready, setReady] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    let resizeTimer: ReturnType<typeof setTimeout> | undefined

    async function initialiseMap() {
      if (!node.current || map.current) return
      try {
        const L = await import('leaflet')
        if (cancelled || !node.current) return

        const initial = value
          ? { lat: value.latitude, lng: value.longitude }
          : { lat: OPERATING_OFFICE.latitude, lng: OPERATING_OFFICE.longitude }

        const instance = L.map(node.current, {
          center: initial,
          zoom: value ? 17 : 13,
          zoomControl: true,
          attributionControl: true,
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(instance)

        const pinIcon = L.divIcon({
          className: '',
          html: '<div class="samachify-map-pin"><span></span></div>',
          iconSize: [40, 48],
          iconAnchor: [20, 45],
        })

        const selectedPin = L.marker(initial, {
          draggable: true,
          icon: pinIcon,
          opacity: value ? 1 : 0,
          keyboard: true,
          title: 'Selected delivery location',
        }).addTo(instance)

        const select = (latitude: number, longitude: number) => {
          selectedPin.setLatLng([latitude, longitude]).setOpacity(1)
          callback.current({ latitude, longitude })
          setError('')
        }

        instance.on('click', (event) => select(event.latlng.lat, event.latlng.lng))
        selectedPin.on('dragend', () => {
          const point = selectedPin.getLatLng()
          select(point.lat, point.lng)
        })

        map.current = instance
        marker.current = selectedPin
        setReady(true)
        resizeTimer = setTimeout(() => instance.invalidateSize(), 100)
      } catch {
        setError('The map could not load. Please refresh the page and try again.')
      }
    }

    initialiseMap()
    return () => {
      cancelled = true
      if (resizeTimer) clearTimeout(resizeTimer)
      map.current?.remove()
      map.current = null
      marker.current = null
    }
    // The map is created once. Later value updates are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!value || !marker.current || !map.current) return
    const point: [number, number] = [value.latitude, value.longitude]
    marker.current.setLatLng(point).setOpacity(1)
    map.current.flyTo(point, Math.max(map.current.getZoom(), 16), { duration: 0.7 })
  }, [value, ready])

  const useCurrentLocation = () => {
    setError('')
    if (!navigator.geolocation) {
      setError('Current location is not supported by this browser. Tap the map to place your pin.')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        callback.current({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        setLocating(false)
      },
      () => {
        setLocating(false)
        setError('Location access is blocked. Allow it in your browser, or tap the map to place your pin.')
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 15000 },
    )
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-green-200 bg-white shadow-[0_12px_35px_rgba(42,79,7,0.08)]">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-green-50 text-green-700">
            <MapPin size={19} />
          </span>
          <div>
            <h3 className="font-display text-base font-800 text-gray-900">Choose your delivery location</h3>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-gray-500 sm:text-sm">
              Use your current location or tap the exact entrance on the map. You can drag the pin to fine-tune it.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-800 text-white shadow-[0_8px_20px_rgba(73,138,12,0.24)] transition hover:-translate-y-0.5 hover:bg-green-700 disabled:cursor-wait disabled:opacity-70"
        >
          {locating ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
          {locating ? 'Finding you…' : 'Use my location'}
        </button>
      </div>

      <div className="relative border-y border-green-100 bg-[#e9eee5]">
        {!ready && !error && (
          <div className="absolute inset-0 z-[500] grid place-items-center bg-[#f3f6f0]">
            <div className="flex items-center gap-2 text-sm font-700 text-green-800"><Loader2 size={17} className="animate-spin" /> Loading map…</div>
          </div>
        )}
        <div ref={node} className="h-72 w-full sm:h-80" aria-label="Interactive delivery location map" />
      </div>

      <div className="p-4 sm:px-6">
        {value ? (
          <p className="flex flex-wrap items-center gap-2 text-sm font-700 text-green-800" aria-live="polite">
            <CheckCircle2 size={17} className="text-green-600" /> Delivery point selected
            <span className="font-500 text-gray-500">· Drag the pin anytime to adjust it</span>
          </p>
        ) : (
          <p className="text-sm text-gray-500" aria-live="polite">No location selected yet. Tap the map or use your current location.</p>
        )}
        {error && <p role="alert" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</p>}
      </div>
    </section>
  )
}
